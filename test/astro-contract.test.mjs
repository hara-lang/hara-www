import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { docsManifest, workspace } from "../scripts/docs-manifest.mjs";

test("publishes docs below /docs and uses the visual package", async () => {
  const content = await readFile(new URL("../src/content.config.ts", import.meta.url), "utf8");
  const prepare = await readFile(new URL("../scripts/prepare-docs.mjs", import.meta.url), "utf8");
  const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
  assert.match(content, /docsLoader/);
  assert.match(prepare, /src\/content\/docs\/docs/);
  assert.match(layout, /@hara-lang\/visual-language/);
  assert.doesNotMatch(layout, /docs\.hara-lang\.org/);
  assert.match(layout, /og-hara\.jpg/);
  assert.match(layout, /og:image:width" content="1200"/);
  assert.match(layout, /og:image:height" content="630"/);
  assert.match(config, /outDir:\s*"\.\/target\/www-astro"/);
});

test("provisions and verifies the canonical Hara visual-language package", async () => {
  const script = await readFile(new URL("../scripts/prepare-visual-language.mjs", import.meta.url), "utf8");
  const workflow = await readFile(new URL("../.github/workflows/site-ci.yml", import.meta.url), "utf8");
  assert.match(script, /website\/hara-visual-language/);
  assert.match(script, /\.\/astro\/ThemeToggle\.astro/);
  assert.match(script, /\.\/astro\/HaraMark\.astro/);
  assert.match(script, /\.\/astro\/Motif\.astro/);
  assert.match(workflow, /repository: hara-lang\/visual-language[\s\S]*ref: c49ad17d5052c8eeca0aff4a6146ff60b89ce88f[\s\S]*path: packages\/visual-language/);
});

test("publishes the dedicated maximum-resolution documentation card", async () => {
  const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
  assert.match(config, /og-hara-docs\.jpg/);
  assert.match(config, /og:image:width", content: "1200"/);
  assert.match(config, /og:image:height", content: "630"/);
});

test("keeps the live editor selection aligned inside Starlight prose", async () => {
  const styles = await readFile(new URL("../src/styles/docs.css", import.meta.url), "utf8");
  assert.match(styles, /\.sl-markdown-content \.hara-live-card-editor \.code-highlight[\s\S]*margin:0;[\s\S]*padding:0;[\s\S]*border:0;[\s\S]*box-shadow:none;/);
  assert.match(styles, /\.hara-live-card-editor textarea::selection\s*\{\s*color:transparent;/);
});

test("keeps live-card header controls aligned inside Starlight prose", async () => {
  const styles = await readFile(new URL("../src/styles/docs.css", import.meta.url), "utf8");
  assert.match(styles, /\.sl-markdown-content \.hara-live-card-header > button,[\s\S]*\.hara-live-card-status small\s*\{\s*margin:0;/);
});

test("uses the compact ecosystem navigation and shared GitHub identity", async () => {
  const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  const shell = await readFile(new URL("../src/styles/shell.css", import.meta.url), "utf8");
  const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
  const loader = await readFile(new URL("../public/assets/identity-loader.js", import.meta.url), "utf8");
  assert.match(layout, /Benchmarks[\s\S]*Docs[\s\S]*Specs/);
  assert.doesNotMatch(layout, />Source<\/a>/);
  assert.match(layout, /https:\/\/specs\.hara-lang\.org\//);
  assert.match(layout, /data-hara-identity/);
  assert.match(layout, /identity-loader\.js/);
  assert.doesNotMatch(layout, /href="https:\/\/id\.hara-lang\.org\/">Sign in<\/a>/);
  assert.match(config, /hara-identity-auto/);
  assert.match(config, /\/assets\/identity-loader\.js/);
  assert.match(loader, /https:\/\/id\.hara-lang\.org/);
  assert.match(loader, /https:\/\/id\.testing\.hara-lang\.org/);
  assert.match(loader, /identity-client\.js/);
  assert.match(shell, /grid-template-columns: auto minmax\(0, 1fr\) auto/);
  assert.doesNotMatch(shell, /nav\s*\{[^}]*display:\s*none/);
});

test("leads with the language and renders benchmark evidence from committed data", async () => {
  const page = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  assert.match(page, /Start simple\.[\s\S]*Build forever\./);
  assert.match(page, /Hara is Lisp/);
  assert.match(page, /language-reference\.json/);
  assert.match(page, /reference-v2\.json/);
  assert.match(page, /HARA_WORKSPACE_ROOT/);
  assert.match(page, /website\/hara-benchmarks\/runtime\/hara\/results/);
  assert.doesNotMatch(page, /lib\/bench\/results/);
  assert.match(page, /formatRatio\("python-prepared"\)/);
  assert.match(page, /hoplite-request/);
  assert.doesNotMatch(page, /One language\.[\s\S]*Fit to its environment\./);
});

test("keeps the three runtime modes as accessible tabs after the learning path", async () => {
  const page = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  const homeStyles = await readFile(new URL("../src/styles/home-interactions.css", import.meta.url), "utf8");
  const repl = await readFile(new URL("../public/assets/docs-repl.js", import.meta.url), "utf8");
  const liveKernel = await readFile(new URL("../packages/live/src/kernel.js", import.meta.url), "utf8");
  const prepare = await readFile(new URL("../scripts/prepare-docs.mjs", import.meta.url), "utf8");
  assert.match(page, /class="kernel-mode-tabs" role="tablist"/);
  assert.match(page, /data-kernel-tab="java"[\s\S]*data-kernel-tab="native"[\s\S]*data-kernel-tab="web"/);
  assert.match(page, /role="tabpanel"[\s\S]*data-kernel-mode="java"/);
  assert.doesNotMatch(page, /<select id="kernel-mode"/);
  assert.match(page, /Java[\s\S]*Native[\s\S]*Web/);
  assert.match(page, /@hara-lang\/live\/style\.css[\s\S]*home-interactions\.css/);
  assert.match(homeStyles, /\.kernel-mode-tabs/);
  assert.match(homeStyles, /\.kernel-mode-tab\[aria-selected="true"\]/);
  assert.doesNotMatch(page, /compressed browser VM/);
  assert.match(repl, /\/docs-assets\/live\/kernel\.js/);
  assert.match(liveKernel, /manifest\.variants\.core\.url/);
  assert.match(repl, /data-hara-eval/);
  assert.match(prepare, /clojure\$1/);
});

test("puts homepage demo tabs above controls and hides the redundant kernel toast", async () => {
  const styles = await readFile(new URL("../src/styles/home-interactions.css", import.meta.url), "utf8");
  assert.match(styles, /\.hara-live-card-tabs[\s\S]*order:\s*-1/);
  assert.match(styles, /\.hara-live-card-toast[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /\.hara-live-card-tabs button\[aria-selected="true"\]::after/);
});

test("orders the embedded docs around a first learning journey", async () => {
  assert.deepEqual(docsManifest.navigation.map(({ label }) => label), ["Learn Path", "Build", "Reference", "Self Learning"]);
  assert.deepEqual(docsManifest.navigation[0].items.map(({ label }) => label), [
    "Overview", "Try Hara in the browser", "First Contact", "Learn programming", "Hara Foundations"
  ]);
  assert.deepEqual(docsManifest.navigation[3].items.map(({ label }) => label),
    ["Overview", "The Little Book of HAL", "Protocols for Builders", "Hara Koans"]);
  const navigation = JSON.stringify(docsManifest.navigation);
  assert.doesNotMatch(navigation, /Start|Use Hara|autogenerate/);
  assert.ok(docsManifest.navigation.every(({ items }) => items.every((item) => !item.items)));
  assert.ok(docsManifest.routeTrees.every(({ items }) => items.every((item) => !item.items)));
});

test("switches books and courses to isolated flat navigation trees", async () => {
  const middleware = await readFile(new URL("../src/starlight-route-data.mjs", import.meta.url), "utf8");
  assert.match(middleware, /← Back to Docs/);
  assert.match(middleware, /starlightRoute\.sidebar/);
  assert.match(middleware, /starlightRoute\.pagination/);
  assert.deepEqual(docsManifest.routeTrees.map(({ id }) => id),
    ["foundations", "protocols", "tic-tac-toe", "little-book", "language-api"]);
});

test("keeps adjacent documentation landing cards in one HTML block", async () => {
  const page = await readFile(
    resolve(workspace, "website/hara-docs/docs/index.md"),
    "utf8"
  );
  assert.doesNotMatch(page, /<\/a>\n\s*\n\s*<a class="hara-outcome-card"/);
});

test("publishes the interactive syllabus controller and styles with docs", async () => {
  const config = await readFile(new URL("../astro.config.mjs", import.meta.url), "utf8");
  const prepare = await readFile(new URL("../scripts/prepare-docs.mjs", import.meta.url), "utf8");
  assert.match(config, /\/docs-assets\/stylesheets\/syllabus\.css/);
  assert.match(config, /\/docs-assets\/javascripts\/syllabus\.js/);
  assert.match(prepare, /javascripts\/syllabus\.js/);
  assert.match(prepare, /stylesheets\/syllabus\.css/);
  assert.match(prepare, /mkdir\(join\(runtimeDestination, "stylesheets"\)/);
});

test("hydrates Tic Tac Toe stages as REPL-attached canvas outputs", async () => {
  const repl = await readFile(new URL("../public/assets/docs-repl.js", import.meta.url), "utf8");
  const liveKernel = await readFile(new URL("../packages/live/src/kernel.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles/docs.css", import.meta.url), "utf8");
  assert.match(repl, /data-hara-canvas-stage/);
  assert.match(repl, /docsSnippet\(descriptor, source, "canvas"\)/);
  assert.match(repl, /directSessionKernel\(sessions, descriptor\)/);
  assert.match(repl, /card\.run\(\)/);
  assert.match(liveKernel, /"studio\.draw": `\$\{runtimeBase\}\/studio\/hal\/draw\.hal`/);
  assert.match(styles, /\.hara-canvas-stage \.hara-repl/);
  assert.match(styles, /\.hara-live-canvas/);
  assert.match(styles, /aspect-ratio:4 \/ 3/);
});
