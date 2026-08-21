import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the production homepage consumes the v2 WWW hierarchy and removes the legacy landing grammar", async () => {
  const [
    page,
    navigation,
    hero,
    firstForm,
    language,
    runtime,
    evidenceStart,
    benchmarkModel,
    homepageScript,
    css,
    interactions,
    installScript,
    installCss
  ] = await Promise.all([
    read("src/pages/index.astro"),
    read("src/components/home/HomeNavigation.astro"),
    read("src/components/home/HomeHero.astro"),
    read("src/components/home/HomeFirstForm.astro"),
    read("src/components/home/HomeLanguage.astro"),
    read("src/components/home/HomeRuntime.astro"),
    read("src/components/home/HomeEvidenceStart.astro"),
    read("src/lib/homepage-benchmarks.ts"),
    read("src/scripts/homepage.ts"),
    read("src/styles/site.css"),
    read("src/styles/home-interactions.css"),
    read("public/assets/install-copy.js"),
    read("public/assets/install-copy.css")
  ]);
  const composition = [page, navigation, hero, firstForm, language, runtime, evidenceStart, benchmarkModel, homepageScript].join("\n");

  for (const component of [
    "HomeNavigation",
    "HomeHero",
    "HomeFirstForm",
    "HomeLanguage",
    "HomeRuntime",
    "HomeEvidenceStart"
  ]) assert.match(page, new RegExp(`<${component} \\/>`));

  for (const marker of [
    "www-subnav",
    "www-main",
    "www-hero",
    "www-proof-ledger",
    "www-section-head",
    "www-three-part-argument",
    "www-live-example",
    "www-capability-stack",
    "www-runtime-workbench",
    "www-evidence-grid",
    "www-start-grid",
    "www-closing"
  ]) assert.match(composition, new RegExp(marker));

  for (const legacyClass of [
    /class="content-section/,
    /class="card-grid/,
    /class="button(?:\s|")/,
    /class="proof(?:\s|")/,
    /class="closing(?:\s|")/,
    /class="kernel-picker/,
    /class="kernel-mode-/,
    /class="code-stage/
  ]) assert.doesNotMatch(composition, legacyClass);

  assert.match(benchmarkModel, /currentBenchmarks\.ratios/);
  assert.match(evidenceStart, /currentBenchmarks\.canonical_url/);
  assert.match(firstForm, /data-live-learn/);
  assert.match(language, /data-live-canvas/);
  assert.match(composition, /data-live-fallback/);
  assert.match(hero, /data-install-command/);
  assert.match(homepageScript, /learnMount\.replaceChildren\(\)/);
  assert.match(homepageScript, /canvasMount\.replaceChildren\(\)/);
  assert.match(homepageScript, /Unable to mount the homepage learning example/);
  assert.match(homepageScript, /Unable to mount the homepage canvas example/);
  assert.match(homepageScript, /\["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"\]/);

  for (const selector of [
    ".www-subnav",
    ".www-hero",
    ".www-proof-ledger",
    ".www-live-example",
    ".www-capability-stack",
    ".www-runtime-workbench",
    ".www-evidence-grid",
    ".www-start-grid",
    ".www-closing"
  ]) assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));

  assert.match(css, /background-size:\s*32px 32px/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /\.(?:content-section|card-grid|button|proof|closing|kernel-picker|kernel-mode-tab|code-stage)(?:\W|$)/);
  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "WWW may consume but not redefine protected v2 tokens");

  assert.match(interactions, /\.www-live-example__mount \.hara-live-card-tabs/);
  assert.match(interactions, /\.www-canvas-example__mount \.hara-live-card-tabs/);
  assert.doesNotMatch(interactions, /\.(?:code-stage-card|live-stage|kernel-picker|kernel-mode-tab)(?:\W|$)/);

  assert.match(installScript, /\[data-install-command\] > code/);
  assert.match(installScript, /www-install__command/);
  assert.match(installScript, /www-install__copy/);
  assert.doesNotMatch(installScript, /hero-install/);
  assert.match(installCss, /\.www-install__copy/);
  assert.match(installCss, /min-height:\s*44px/);
  assert.match(installCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(installCss, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "install helper may consume but not redefine protected v2 tokens");
});
