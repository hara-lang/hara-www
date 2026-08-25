import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { siteNavigationMode } from "../src/scripts/site-navigation.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("CI and production deploy source the shared Hara UI packages", async () => {
  const [ci, deploy] = await Promise.all([
    read(".github/workflows/site-ci.yml"),
    read(".github/workflows/pages-www.yml")
  ]);
  for (const workflow of [ci, deploy]) {
    assert.match(workflow, /repository: hara-lang\/hara-ui/);
    assert.match(workflow, /technology\/hara-ui/);
    assert.doesNotMatch(workflow, /repository: hara-lang\/visual-language/);
  }
});

test("the shared layout directly consumes v2 without replacing identity, live or SEO contracts", async () => {
  const layout = await read("src/layouts/SiteLayout.astro");
  const header = await read("src/components/WwwHeader.astro");
  assert.match(layout, /@hara-lang\/ui\/v2\.css/);
  assert.doesNotMatch(layout, /@hara-lang\/visual-language\/motifs\.css/);
  assert.match(layout, /astro\/v2\/Shell\.astro/);
  assert.match(layout, /class="hara-v2 hara-www-site"/);
  assert.match(layout, /data-hara-v2-site="www"/);
  assert.match(header, /astro\/v2\/Header\.astro/);
  assert.match(header, /homeHref="\/"/);
  assert.match(header, /data-hara-identity/);
  assert.match(header, /<ThemeToggle \/>/);
  assert.match(layout, /identity-loader\.js/);
  assert.match(layout, /install-copy\.js/);
  assert.match(layout, /live-surface\.css/);
  assert.match(layout, /<meta property="og:title"/);
});

test("the v2 shared shell owns the WWW primary product menu and context navigation", async () => {
  const layout = await read("src/layouts/SiteLayout.astro");
  assert.match(layout, /<V2Shell sidebar=\{false\} aside=\{false\}/);
  assert.match(layout, /<WwwHeader slot="header" nav=\{productNavigation\} activePath=\{activePath\} \/>/);
  assert.match(layout, /<WwwSecondaryNav slot="context" activePath=\{activePath\} sections=\{sections\} \/>/);
  for (const label of ["Home", "Play", "Learn", "Build", "Docs", "Benchmarks", "Blog"]) {
    assert.match(layout, new RegExp(`label: "${label}"`));
  }
});

test("the WWW product menu remains a disclosure at every viewport", async () => {
  const script = await read("src/scripts/site-navigation.js");
  assert.equal(siteNavigationMode(320), "disclosure");
  assert.equal(siteNavigationMode(760), "disclosure");
  assert.equal(siteNavigationMode(761), "disclosure");
  assert.equal(siteNavigationMode(1440), "disclosure");
  assert.match(script, /setHaraHeaderMenuState/);
  assert.match(script, /hara:header-menu-request/);
  assert.match(script, /event\.key === "Escape"/);
  assert.match(script, /backdrop\.addEventListener\("click"/);
  assert.match(script, /navigation\.querySelectorAll\("a"\)/);
  assert.doesNotMatch(script, /MOBILE_QUERY/);
  assert.doesNotMatch(script, /addEventListener\?\.\("change"/);
  assert.doesNotMatch(script, /querySelector\([^\n]*textarea[^\n]*\)\.focus|querySelector\([^\n]*editor[^\n]*\)\.focus/i);
});

test("package preparation verifies the WWW contract and shared production illustration", async () => {
  const [script, tsconfig] = await Promise.all([
    read("scripts/prepare-ui.mjs"),
    read("tsconfig.json")
  ]);
  for (const value of [
    "@hara-lang/ui",
    "@hara-lang/ui-astro",
    "@hara-lang/ui-tool",
    "manifest.files",
    "technology/hara-ui"
  ]) {
    assert.match(script, new RegExp(value.replaceAll(".", "\\.")));
  }
  assert.match(script, /manifest\.files/);
  assert.match(script, /await cp\(from, to, \{ recursive: true, dereference: true \}\)/);
  assert.match(script, /materialised/);
  assert.doesNotMatch(script, /symlink\(/, "the installed dependency must be a materialised package, not a source symlink");
  assert.doesNotMatch(tsconfig, /packages\/visual-language/);
});

test("the product bridge consumes shared tokens and preserves focus, touch, disclosure and reduced motion", async () => {
  const [bridge, shell, ...homepageParts] = await Promise.all([
    read("src/styles/v2-adoption.css"),
    read("src/styles/shell.css"),
    read("src/styles/www-v2/core.css"),
    read("src/styles/www-v2/proposition.css"),
    read("src/styles/www-v2/language.css"),
    read("src/styles/www-v2/runtime.css"),
    read("src/styles/www-v2/evidence.css"),
    read("src/styles/www-v2/start.css"),
    read("src/styles/www-v2/live.css"),
    read("src/styles/www-v2/responsive.css")
  ]);
  const homepage = homepageParts.join("\n");
  assert.match(bridge, /\.site-skip-link/);
  assert.match(bridge, /\.site-skip-link:focus-visible/);
  assert.match(bridge, /\.site-content-root:focus-visible/);
  assert.match(shell, /\.hara-www-secondary/);
  assert.match(shell, /\.hara-www-product-menu/);
  assert.match(`${bridge}\n${shell}\n${homepage}`, /min-height:\s*44px/);
  assert.match(`${bridge}\n${shell}\n${homepage}`, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(`${bridge}\n${shell}\n${homepage}`, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "WWW may consume but not redefine protected v2 tokens");
});

test("the adoption note records the exact pin, preserved boundaries and remaining route work", async () => {
  const document = await read("VISUAL-LANGUAGE-V2-ADOPTION.md");
  assert.match(document, /@hara-lang\/ui/);
  for (const phrase of [
    "identity popup",
    "install-copy",
    "live-card",
    "canonical URLs",
    "package-level downstream adoption contract",
    "Docs",
    "Benchmarks",
    "Only published Hara UI package revisions are accepted"
  ]) {
    assert.match(document, new RegExp(phrase, "i"));
  }
});
