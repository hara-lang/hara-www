import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("delegates documentation publication while retaining the canonical proxy", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  const config = await read("../astro.config.mjs");
  const redirects = await read("../public/_redirects");
  const deploy = await read("../.github/workflows/pages-www.yml");
  const ci = await read("../.github/workflows/site-ci.yml");
  const assembly = await read("../scripts/hara-assembly/build-www");
  const paths = await read("../scripts/hara-assembly/workspace-paths");

  assert.equal(packageJson.scripts["prepare:docs"], undefined);
  assert.equal(packageJson.scripts["validate:docs"], undefined);
  assert.equal(packageJson.dependencies["@astrojs/starlight"], undefined);
  assert.doesNotMatch(config, /starlight|docsSidebar|docsRedirects|remarkHaraEval/);
  assert.equal(redirects, [
    "/docs https://hara-docs.netlify.app/ 200!",
    "/docs/ https://hara-docs.netlify.app/ 200!",
    "/docs/* https://hara-docs.netlify.app/:splat 200!",
    ""
  ].join("\n"));
  assert.doesNotMatch(`${deploy}\n${ci}`, /repository: hara-lang\/hara-docs/);
  assert.doesNotMatch(`${assembly}\n${paths}`, /DOCS_ROOT|website\/hara-docs|rsync[^\n]*docs/);
  assert.match(deploy, /verify-docs-navigation\.sh/);
  assert.match(deploy, /verify-docs-kernel\.mjs/);
});

test("keeps homepage live examples on website-owned runtime routes", async () => {
  const page = await read("../src/pages/index.astro");
  const kernel = await read("../public/runtime/browser-kernel.js");

  assert.match(page, /createLiveKernel/);
  assert.match(page, /kernelModuleUrl: "\/runtime\/browser-kernel\.js"/);
  assert.match(page, /"studio\.store": "\/runtime\/studio\/hal\/store\.hal"/);
  assert.match(page, /"studio\.fs": "\/runtime\/studio\/hal\/fs\.hal"/);
  assert.doesNotMatch(page, /\/docs-assets\//);
  assert.match(kernel, /export async function createBrowserKernel/);
  assert.match(kernel, /export const createDocsKernel = createBrowserKernel/);
  assert.match(kernel, /dbName: "hara-www"/);
});
