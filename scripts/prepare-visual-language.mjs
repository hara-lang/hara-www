import { access, cp, lstat, mkdir, readFile, rm, symlink } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = resolve(process.env.HARA_WORKSPACE_ROOT || join(site, "../.."));
const target = resolve(site, "packages/visual-language");
const source = resolve(workspace, "website/hara-visual-language");
const installed = resolve(site, "node_modules/@hara-lang/visual-language");
const requiredExports = [
  "./astro/ThemeToggle.astro",
  "./astro/HaraMark.astro",
  "./astro/Motif.astro",
  "./astro/v2/Shell.astro",
  "./astro/v2/Header.astro",
  "./astro/v2/PageHeader.astro",
  "./v2.css",
  "./v2-data.css",
  "./theme.js"
];
const requiredFiles = [
  "V2-THEME.md",
  "V2-GUIDE.md",
  "V2-DATA-VISUALISATION.md"
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(target))) {
  if (!(await exists(resolve(source, "package.json")))) {
    throw new Error(
      `missing @hara-lang/visual-language: expected a CI checkout at ${target} ` +
      `or the workspace repository at ${source}`
    );
  }
  await mkdir(dirname(target), { recursive: true });
  try {
    await lstat(target);
  } catch {
    await symlink(relative(dirname(target), source), target, "dir");
  }
}

const manifest = JSON.parse(await readFile(resolve(target, "package.json"), "utf8"));
if (manifest.name !== "@hara-lang/visual-language") {
  throw new Error(`wrong visual-language package at ${target}: ${manifest.name}`);
}
for (const name of requiredExports) {
  const exported = manifest.exports?.[name];
  if (!exported || !(await exists(resolve(target, exported)))) {
    throw new Error(`@hara-lang/visual-language is missing ${name}`);
  }
}
for (const path of requiredFiles) {
  if (!(await exists(resolve(target, path)))) {
    throw new Error(`@hara-lang/visual-language is missing adopted v2 contract ${path}`);
  }
}

// npm represents a file dependency as a symlink back into packages/. Astro's
// strict project scan follows that link and type-checks the visual-language
// catalogue application as if it were WWW source. Materialise the published
// package boundary inside node_modules instead: only package.json and the
// manifest's files entries are copied, while site/, tests and repository
// tooling remain outside the consumer compilation root.
const packageEntries = ["package.json", ...new Set(manifest.files ?? [])];
await rm(installed, { recursive: true, force: true });
await mkdir(installed, { recursive: true });
for (const entry of packageEntries) {
  if (typeof entry !== "string" || entry.includes("*") || entry.includes("\0")) {
    throw new Error(`unsupported visual-language package entry: ${String(entry)}`);
  }
  const from = resolve(target, entry);
  const to = resolve(installed, entry);
  const targetPrefix = `${target}${sep}`;
  if (from !== target && !from.startsWith(targetPrefix)) {
    throw new Error(`visual-language package entry escapes its root: ${entry}`);
  }
  if (!(await exists(from))) {
    throw new Error(`visual-language package entry is missing: ${entry}`);
  }
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, dereference: true });
}

console.log(
  `using materialised @hara-lang/visual-language ${manifest.version} v2 contract ` +
  `from ${target} (${packageEntries.length} package entries)`
);
