import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("moves legacy documentation paths to Learn", async () => {
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
  assert.match(redirects, /^\/docs https:\/\/learn\.hara-lang\.org\/ 301!$/m);
  assert.match(redirects, /^\/docs\/\* https:\/\/learn\.hara-lang\.org\/ 301!$/m);
  assert.doesNotMatch(`${deploy}\n${ci}`, /repository: hara-lang\/hara-docs/);
  assert.doesNotMatch(`${assembly}\n${paths}`, /DOCS_ROOT|website\/hara-docs|rsync[^\n]*docs/);
  assert.match(deploy, /verify-docs-navigation\.sh/);
  assert.doesNotMatch(deploy, /verify-docs-kernel\.mjs/);
});

test("delegates benchmark rendering while retaining the canonical path", async () => {
  const packageJson = JSON.parse(await read("../package.json"));
  const redirects = await read("../public/_redirects");
  const deploy = await read("../.github/workflows/pages-www.yml");
  const ci = await read("../.github/workflows/site-ci.yml");
  const sync = await read("../.github/workflows/sync-benchmark-origin.yml");
  const assembly = await read("../scripts/hara-assembly/build-www");
  const paths = await read("../scripts/hara-assembly/workspace-paths");
  const homepage = await read("../src/pages/index.astro");
  const preparation = await read("../scripts/prepare-benchmark-homepage.mjs");

  assert.match(redirects, /^\/benchmarks https:\/\/hara-benchmarks\.netlify\.app\/ 200!$/m);
  assert.match(redirects, /^\/benchmarks\/\* https:\/\/hara-benchmarks\.netlify\.app\/:splat 200!$/m);
  assert.doesNotMatch(`${deploy}\n${ci}`, /repository: hara-lang\/hara-benchmarks/);
  assert.doesNotMatch(`${assembly}\n${paths}`, /BENCHMARK_ROOT|website\/hara-benchmarks|\/benchmarks\/data\/runs\.json/);
  assert.equal(packageJson.scripts["prepare:benchmarks"], "node scripts/prepare-benchmark-homepage.mjs");
  assert.doesNotMatch(homepage, /benchmark-homepage\.json/);
  assert.doesNotMatch(homepage, /<EvidenceSection|<RuntimeSection/);
  assert.doesNotMatch(homepage, /HARA_WORKSPACE_ROOT|language-reference\.json|reference-v2\.json/);
  assert.match(preparation, /hara-benchmarks\.netlify\.app\/homepage\.json/);
  assert.match(sync, /ref: benchmark-site/);
  assert.match(sync, /Deploy verified artifact without rebuilding/);
  assert.match(sync, /NETLIFY_SITE_ID: 7d87b558-d5b4-4d05-b3c9-7a52d3f05dc8/);
  assert.doesNotMatch(sync, /npm (?:ci|install|run build)/);
  assert.match(deploy, /verify-benchmark-observatory\.sh/);
});

test("keeps homepage live examples on website-owned runtime routes", async () => {
  const page = await read("../src/pages/index.astro");
  const runtime = await read("../src/components/www-v2/HomepageRuntime.astro");
  const kernel = await read("../public/runtime/browser-kernel.js");

  assert.match(page, /import HomepageRuntime from "\.\.\/components\/www-v2\/HomepageRuntime\.astro"/);
  assert.match(page, /<HomepageRuntime \/>/);
  assert.match(runtime, /createLiveKernel/);
  assert.match(runtime, /kernelModuleUrl: "\/runtime\/browser-kernel\.js(?:\?v=[^"]+)?"/);
  assert.match(runtime, /"studio\.store": "\/runtime\/studio\/hal\/store\.hal"/);
  assert.match(runtime, /"studio\.fs": "\/runtime\/studio\/hal\/fs\.hal"/);
  assert.doesNotMatch(runtime, /\/docs-assets\//);
  assert.match(kernel, /export async function createBrowserKernel/);
  assert.match(kernel, /export const createDocsKernel = createBrowserKernel/);
  assert.match(kernel, /dbName: "hara-www"/);
});
