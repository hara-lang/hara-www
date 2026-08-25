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
  assert.match(header, /data-hara-identity/);
  assert.match(header, /<ThemeToggle \/>/);
  assert.match(header, /homeHref="https:\/\/hara-lang\.org\//);
  assert.match(layout, /identity-loader\.js/);
  assert.match(layout, /install-copy\.js/);
  assert.match(layout, /live-surface\.css/);
  assert.match(layout, /<meta property="og:title"/);
});

test("the v2 shared shell owns the WWW primary and context navigation", async () => {
  const layout = await read("src/layouts/SiteLayout.astro");
  assert.match(layout, /<V2Shell[\s\S]*sidebar=\{false\}[\s\S]*aside=\{false\}/);
  assert.match(layout, /<WwwHeader slot="header" nav=\{primaryNavigation\} \/>/);
  assert.match(layout, /\{ label: "Play", href: "https:\/\/play\.hara-lang\.org\/" \}[\s\S]*?\{ label: "Learn", href: "https:\/\/learn\.hara-lang\.org\/" \}[\s\S]*?\{ label: "Build", href: "https:\/\/build\.hara-lang\.org\/" \}/);
});

test("the navigation controller switches at the shared compact boundary without moving focus on open", async () => {
  const script = await read("src/scripts/site-navigation.js");
  assert.equal(siteNavigationMode(320), "disclosure");
  assert.equal(siteNavigationMode(760), "disclosure");
  assert.equal(siteNavigationMode(761), "inline");
  assert.equal(siteNavigationMode(1440), "inline");
  assert.match(script, /matchMedia\(MOBILE_QUERY\)/);
  assert.match(script, /event\.key === "Escape"/);
  assert.match(script, /backdrop\.addEventListener\("click"/);
  assert.match(script, /navigation\.querySelectorAll\("a"\)/);
  assert.match(script, /restoreFocus\) trigger\.focus\(\)/);
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
    read("src/styles/site.css"),
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
  assert.match(bridge, /\.site-navigation-trigger/);
  assert.match(bridge, /html\[data-site-navigation-ready="true"\][\s\S]*?data-navigation-open="false"/);
  assert.match(bridge, /nav a\[aria-current="page"\]/);
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
