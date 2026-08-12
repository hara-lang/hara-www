import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { docsManifest, workspace } from "./docs-manifest.mjs";

const docs = resolve(workspace, "website/hara-docs/docs");
const paths = [];

function collect(items) {
  for (const item of items) {
    if (item.path) paths.push(item.path);
    if (item.items) collect(item.items);
  }
}

collect(docsManifest.navigation);
for (const tree of docsManifest.routeTrees ?? []) collect(tree.items);

for (const path of new Set(paths)) await access(resolve(docs, path));

if (docsManifest.navigation.length !== 4) throw new Error("documentation must expose four root sections");
for (const group of docsManifest.navigation) {
  if (group.items.some((item) => item.items)) throw new Error(`three-level root navigation: ${group.label}`);
}
for (const tree of docsManifest.routeTrees ?? []) {
  if (tree.items.some((item) => item.items)) throw new Error(`nested route tree: ${tree.id}`);
}

const fromRoutes = docsManifest.redirects.map(({ from }) => from);
if (new Set(fromRoutes).size !== fromRoutes.length) throw new Error("duplicate documentation redirect route");
for (const { from, to } of docsManifest.redirects) {
  if (from === to) throw new Error(`self redirect: ${from}`);
}

console.log(`documentation manifest valid: ${new Set(paths).size} pages, ${docsManifest.routeTrees?.length ?? 0} route trees, ${fromRoutes.length} redirects`);
