import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildExpectedImport,
  gitBlobSha,
  renderImportedMarkdown,
  validateConfig
} from "../scripts/import-docs.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

function response(content, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() { return content; }
  };
}

test("the importer turns a source H1 into deterministic Astro frontmatter", () => {
  assert.equal(
    renderImportedMarkdown("# Example\r\n\r\nBody.\r\n", "Example"),
    "---\ntitle: \"Example\"\n---\nBody.\n"
  );
  assert.equal(gitBlobSha("hello\n"), "ce013625030ba8dba906f756967f9e9ca394464a");
});

test("the pinned import verifies manifest, API, and route blobs", async () => {
  const manifest = "{\"schemaVersion\":1}\n";
  const apiTarget = "{\"repository\":\"hara-lang/hara\",\"commit\":\"2222222222222222222222222222222222222222\"}\n";
  const source = "# Example\n\nBody.\n";
  const config = {
    schemaVersion: 1,
    source: {
      repository: "hara-lang/hara-docs",
      commit: "1111111111111111111111111111111111111111",
      manifest: { path: "docs-manifest.json", gitBlobSha: gitBlobSha(manifest) }
    },
    authority: {
      repository: "hara-lang/hara-specs-registry",
      commit: "3333333333333333333333333333333333333333"
    },
    api: {
      targetPath: "foundation-api-target.json",
      gitBlobSha: gitBlobSha(apiTarget),
      repository: "hara-lang/hara",
      commit: "2222222222222222222222222222222222222222"
    },
    transform: { script: "scripts/import-docs.mjs", version: 1 },
    routes: [{
      source: "docs/example.md",
      sourceGitBlobSha: gitBlobSha(source),
      target: "src/content/docs/docs/example.md",
      title: "Example"
    }]
  };
  const fixtures = new Map([
    ["docs-manifest.json", manifest],
    ["foundation-api-target.json", apiTarget],
    ["docs/example.md", source]
  ]);
  const fetchImpl = async (url) => {
    const path = [...fixtures.keys()].find((candidate) => url.endsWith(`/${candidate}`));
    return path ? response(fixtures.get(path)) : response("", 404);
  };

  assert.deepEqual(await buildExpectedImport(config, fetchImpl), [{
    target: "src/content/docs/docs/example.md",
    content: "---\ntitle: \"Example\"\n---\nBody.\n"
  }]);
});

test("the committed import provenance and high-drift routes remain coherent", async () => {
  const config = validateConfig(JSON.parse(
    await readFile(resolve(repositoryRoot, "docs-import.json"), "utf8")
  ));

  assert.equal(config.source.repository, "hara-lang/hara-docs");
  assert.equal(config.authority.repository, "hara-lang/hara-specs-registry");
  assert.equal(config.api.repository, "hara-lang/hara");

  for (const route of config.routes) {
    const content = await readFile(resolve(repositoryRoot, route.target), "utf8");
    const prefix = `---\ntitle: ${JSON.stringify(route.title)}\n---\n`;
    assert.equal(content.startsWith(prefix), true);
    const reconstructedSource = `# ${route.title}\n\n${content.slice(prefix.length)}`;
    assert.equal(gitBlobSha(reconstructedSource), route.sourceGitBlobSha);
  }

  const projects = await readFile(
    resolve(repositoryRoot, "src/content/docs/docs/projects/index.md"),
    "utf8"
  );
  assert.doesNotMatch(projects, /Every current project has a required `project\.edn`\s+and `workspace\.edn`/);
  assert.doesNotMatch(projects, /Current portable libraries use `std\.foundation\.\*`/);
  assert.doesNotMatch(projects, /Greenways Spaces is the intended destination/);
  assert.match(projects, /`project\.edn` is the single contributor-authored manifest/);
  assert.match(projects, /deterministic `\.harp`/);
});
