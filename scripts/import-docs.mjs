#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const configPath = resolve(repositoryRoot, "docs-import.json");
const shaPattern = /^[0-9a-f]{40}$/;

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, "\n").replace(/\n*$/, "\n");
}

export function gitBlobSha(value) {
  const bytes = Buffer.from(String(value), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${bytes.length}\0`, "utf8"))
    .update(bytes)
    .digest("hex");
}

export function renderImportedMarkdown(source, expectedTitle) {
  const normalized = normalizeText(source);
  const heading = normalized.match(/^# ([^\n]+)\n\n/);
  if (!heading) {
    throw new Error("Imported Markdown must begin with one H1 followed by a blank line.");
  }

  const title = heading[1].trim();
  if (title !== expectedTitle) {
    throw new Error(`Expected imported title ${JSON.stringify(expectedTitle)}, received ${JSON.stringify(title)}.`);
  }

  return `---\ntitle: ${JSON.stringify(title)}\n---\n${normalized.slice(heading[0].length)}`;
}

function assertSha(label, value) {
  if (!shaPattern.test(value)) {
    throw new Error(`${label} must be a lowercase 40-character Git SHA.`);
  }
}

function assertRelativePath(label, value) {
  if (typeof value !== "string" || value.length === 0 || value.startsWith("/") || value.split("/").includes("..")) {
    throw new Error(`${label} must be a safe repository-relative path.`);
  }
}

export function validateConfig(config) {
  if (config?.schemaVersion !== 1) {
    throw new Error("docs-import.json schemaVersion must be 1.");
  }
  if (config.source?.repository !== "hara-lang/hara-docs") {
    throw new Error("The authored documentation source must be hara-lang/hara-docs.");
  }

  assertSha("source.commit", config.source.commit);
  assertRelativePath("source.manifest.path", config.source.manifest?.path);
  assertSha("source.manifest.gitBlobSha", config.source.manifest?.gitBlobSha);
  assertSha("authority.commit", config.authority?.commit);
  assertRelativePath("api.targetPath", config.api?.targetPath);
  assertSha("api.gitBlobSha", config.api?.gitBlobSha);
  assertSha("api.commit", config.api?.commit);

  if (config.transform?.script !== "scripts/import-docs.mjs" || config.transform?.version !== 1) {
    throw new Error("Unsupported docs import transform.");
  }
  if (!Array.isArray(config.routes) || config.routes.length === 0) {
    throw new Error("docs-import.json must declare at least one imported route.");
  }

  const targets = new Set();
  for (const [index, route] of config.routes.entries()) {
    assertRelativePath(`routes[${index}].source`, route.source);
    assertRelativePath(`routes[${index}].target`, route.target);
    assertSha(`routes[${index}].sourceGitBlobSha`, route.sourceGitBlobSha);
    if (typeof route.title !== "string" || route.title.length === 0) {
      throw new Error(`routes[${index}].title must be non-empty.`);
    }
    if (targets.has(route.target)) {
      throw new Error(`Duplicate imported target: ${route.target}`);
    }
    targets.add(route.target);
  }

  return config;
}

function rawUrl(config, path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${config.source.repository}/${config.source.commit}/${encodedPath}`;
}

async function fetchPinnedText(config, path, fetchImpl) {
  const url = rawUrl(config, path);
  const response = await fetchImpl(url, {
    headers: { "User-Agent": "hara-www-docs-import/1" }
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch ${path} from ${config.source.commit}: HTTP ${response.status}.`);
  }
  return response.text();
}

function verifyBlob(label, content, expectedSha) {
  const actualSha = gitBlobSha(content);
  if (actualSha !== expectedSha) {
    throw new Error(`${label} blob mismatch: expected ${expectedSha}, received ${actualSha}.`);
  }
}

export async function buildExpectedImport(config, fetchImpl = fetch) {
  validateConfig(config);

  const manifest = await fetchPinnedText(config, config.source.manifest.path, fetchImpl);
  verifyBlob("Documentation manifest", manifest, config.source.manifest.gitBlobSha);
  const parsedManifest = JSON.parse(manifest);
  if (parsedManifest.schemaVersion !== 1) {
    throw new Error(`Unsupported docs manifest schema: ${parsedManifest.schemaVersion}.`);
  }

  const apiTargetText = await fetchPinnedText(config, config.api.targetPath, fetchImpl);
  verifyBlob("Foundation API target", apiTargetText, config.api.gitBlobSha);
  const apiTarget = JSON.parse(apiTargetText);
  if (apiTarget.repository !== config.api.repository || apiTarget.commit !== config.api.commit) {
    throw new Error("The recorded generated API core pin does not match the source documentation target.");
  }

  const outputs = [];
  for (const route of config.routes) {
    const source = await fetchPinnedText(config, route.source, fetchImpl);
    verifyBlob(route.source, source, route.sourceGitBlobSha);
    outputs.push({
      target: route.target,
      content: renderImportedMarkdown(source, route.title)
    });
  }
  return outputs;
}

async function run() {
  const check = process.argv.includes("--check");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const outputs = await buildExpectedImport(config);
  const drift = [];

  for (const output of outputs) {
    const targetPath = resolve(repositoryRoot, output.target);
    if (!targetPath.startsWith(repositoryRoot)) {
      throw new Error(`Imported target escaped the repository root: ${output.target}`);
    }

    if (check) {
      const current = await readFile(targetPath, "utf8").catch(() => null);
      if (current !== output.content) drift.push(output.target);
    } else {
      await mkdir(dirname(targetPath), { recursive: true });
      await writeFile(targetPath, output.content, "utf8");
      console.log(`imported ${output.target}`);
    }
  }

  if (drift.length > 0) {
    throw new Error(
      `Imported documentation drifted:\n- ${drift.join("\n- ")}\nRun npm run prepare:docs-import and commit the result.`
    );
  }
  if (check) {
    console.log(`verified ${outputs.length} imported documentation routes at ${config.source.commit}`);
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
