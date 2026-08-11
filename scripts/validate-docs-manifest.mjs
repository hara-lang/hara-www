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
if (new Set(paths).size !== paths.length) throw new Error("duplicate page in documentation navigation");

for (const path of paths) await access(resolve(docs, path));

const fromRoutes = docsManifest.redirects.map(({ from }) => from);
if (new Set(fromRoutes).size !== fromRoutes.length) throw new Error("duplicate documentation redirect route");
for (const { from, to } of docsManifest.redirects) {
  if (from === to) throw new Error(`self redirect: ${from}`);
}

console.log(`documentation manifest valid: ${paths.length} pages, ${fromRoutes.length} redirects`);
