import { access, lstat, mkdir, readFile, realpath, symlink, unlink } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = resolve(process.env.HARA_WORKSPACE_ROOT || join(site, "../.."));
const target = resolve(site, "packages/visual-language");
const source = resolve(workspace, "website/hara-visual-language");
const installed = resolve(site, "node_modules/@hara-lang/visual-language");
const requiredExports = [
  "./astro/ThemeToggle.astro",
  "./astro/HaraMark.astro",
  "./astro/Motif.astro"
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

if (await exists(dirname(installed))) {
  let installedPath = null;
  try {
    installedPath = await realpath(installed);
  } catch {
    // npm may have left a dangling file-dependency link.
  }
  const targetPath = await realpath(target);
  if (installedPath !== targetPath) {
    let entry = null;
    try {
      entry = await lstat(installed);
    } catch {
      // The dependency has not been linked yet.
    }
    if (entry && !entry.isSymbolicLink()) {
      throw new Error(`refusing to replace non-symlink package at ${installed}`);
    }
    if (entry) await unlink(installed);
    await symlink(relative(dirname(installed), target), installed, "dir");
  }
}

console.log(`using @hara-lang/visual-language ${manifest.version} from ${target}`);
