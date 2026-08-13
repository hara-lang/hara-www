import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/pages-www.yml", import.meta.url), "utf8");
const prepareDocs = await readFile(new URL("../scripts/prepare-docs.mjs", import.meta.url), "utf8");
const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
const packageLock = await readFile(new URL("../package-lock.json", import.meta.url), "utf8");
const assembly = await readFile(new URL("../scripts/hara-assembly/build-www", import.meta.url), "utf8");
const kernelManifest = await readFile(new URL("../scripts/hara-assembly/write-kernel-manifest.mjs", import.meta.url), "utf8");

test("deploys testing and production from their intended branches", () => {
  assert.match(workflow, /branches: \[main, testing\]/);
  assert.match(workflow, /github\.ref_name == 'testing'[\s\S]*NETLIFY_TESTING_SITE_ID/);
  assert.match(workflow, /github\.ref_name == 'main'[\s\S]*NETLIFY_PRODUCTION_SITE_ID/);
  assert.doesNotMatch(workflow, /github\.ref_name == 'prod'/);
  assert.match(workflow, /fetch-depth: 0\s+submodules: recursive/);
  assert.match(prepareDocs, /HARA_WORKSPACE_ROOT/);
  assert.match(prepareDocs, /website\/hara-docs\/docs/);
  assert.match(workflow, /repository: hara-lang\/visual-language[\s\S]*ref: c49ad17d5052c8eeca0aff4a6146ff60b89ce88f[\s\S]*path: packages\/visual-language/);
  assert.match(packageJson, /file:packages\/visual-language/);
  assert.match(packageLock, /packages\/visual-language/);
  assert.doesNotMatch(packageJson, /file:\.\.\/packages\/visual-language/);
  assert.match(assembly, /extensions\/hara-runtime\/scripts\/cargo-wasm-build/);
  assert.match(workflow, /actions\/setup-java@v4[\s\S]*java-version: 21[\s\S]*cache: maven/);
  assert.match(assembly, /mvn -f "\$ROOT\/core\/java\/pom\.xml" -Ptruffle -DskipTests compile/);
  assert.match(assembly, /compile_halc\(\)[\s\S]*hara\.truffle\.Main/);
  assert.doesNotMatch(assembly, /HARA_COMPILER/);
  assert.match(assembly, /compile[\s\S]*core\/java\/target\/classes\/std\/foundation\.halc/);
  assert.match(assembly, /vendor\/hara-ui\/favicon-48\.svg/);
  assert.doesNotMatch(assembly, /assets\/hara-mark\.svg/);
  assert.match(kernelManifest, /gzip > 370_000/);
  assert.match(kernelManifest, /brotli > 295_000/);
});
