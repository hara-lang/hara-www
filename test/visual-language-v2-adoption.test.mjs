import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { siteNavigationMode } from "../src/scripts/site-navigation.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const acceptedRevision = "a2ab66d0fde79edb1cee46b79528098b3fda68cf";

test("CI and production deploy pin the accepted merged visual-language revision", async () => {
  const [ci, deploy] = await Promise.all([
    read(".github/workflows/site-ci.yml"),
    read(".github/workflows/pages-www.yml")
  ]);
  for (const workflow of [ci, deploy]) {
    assert.match(workflow, /repository: hara-lang\/visual-language/);
    assert.match(workflow, new RegExp(`ref: ${acceptedRevision}`));
    assert.doesNotMatch(workflow, /ref: (?:c49ad17d5052c8eeca0aff4a6146ff60b89ce88f|9a88bddd7a539d7aa790e316ee169e8cc81886a4)/);
  }
});

test("the shared layout opts into v2 without replacing identity, live or SEO contracts", async () => {
  const layout = await read("src/layouts/SiteLayout.astro");
  assert.match(layout, /@hara-lang\/visual-language\/v2\.css/);
  assert.match(layout, /class="hara-v2 hara-www-site"/);
  assert.match(layout, /class="site-skip-link" href="#main-content"/);
  assert.match(layout, /id="main-content" class="site-content-root" tabindex="-1"/);
  assert.match(layout, /data-hara-identity/);
  assert.match(layout, /<ThemeToggle \/>/);
  assert.match(layout, /identity-loader\.js/);
  assert.match(layout, /install-copy\.js/);
  assert.match(layout, /live-surface\.css/);
  assert.match(layout, /<meta property="og:title"/);
});

test("the v2 global shell owns one responsive primary-navigation disclosure", async () => {
  const layout = await read("src/layouts/SiteLayout.astro");
  for (const marker of [
    "data-site-header",
    "data-site-navigation",
    "data-site-navigation-trigger",
    "data-site-navigation-backdrop",
    "aria-controls=\"site-primary-navigation\"",
    "aria-expanded=\"false\""
  ]) assert.match(layout, new RegExp(marker));
  assert.match(layout, /\{ label: "Benchmarks", href: "\/benchmarks\/" \}[\s\S]*?\{ label: "Docs", href: "\/docs\/" \}[\s\S]*?specs\.hara-lang\.org[\s\S]*?world\.hara-lang\.org/);
  assert.match(layout, /aria-current=\{isCurrent\(item\.href\) \? "page" : undefined\}/);
  assert.match(layout, /initialiseSiteNavigation/);
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

test("package preparation verifies and materialises the accepted published boundary", async () => {
  const [script, tsconfig] = await Promise.all([
    read("scripts/prepare-visual-language.mjs"),
    read("tsconfig.json")
  ]);
  for (const value of [
    "./v2.css",
    "./v2-data.css",
    "./theme.js",
    "./astro/v2/Shell.astro",
    "./astro/v2/Header.astro",
    "./astro/v2/PageHeader.astro",
    "V2-THEME.md",
    "V2-GUIDE.md",
    "V2-DATA-VISUALISATION.md"
  ]) {
    assert.match(script, new RegExp(value.replaceAll(".", "\\.")));
  }
  assert.match(script, /manifest\.files/);
  assert.match(script, /await cp\(from, to, \{ recursive: true, dereference: true \}\)/);
  assert.match(script, /materialised @hara-lang\/visual-language/);
  assert.doesNotMatch(script, /symlink\(relative\(dirname\(installed\)/, "the installed dependency must be a materialised package, not a source symlink");
  assert.match(tsconfig, /"packages\/visual-language\/\*\*"/);
});

test("the product bridge consumes shared tokens and preserves focus, touch, disclosure and reduced motion", async () => {
  const css = await read("src/styles/v2-adoption.css");
  assert.match(css, /\.site-skip-link/);
  assert.match(css, /\.site-skip-link:focus-visible/);
  assert.match(css, /\.site-content-root:focus-visible/);
  assert.match(css, /\.site-navigation-trigger/);
  assert.match(css, /html\[data-site-navigation-ready="true"\][\s\S]*?data-navigation-open="false"/);
  assert.match(css, /nav a\[aria-current="page"\]/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /--hara-v2-[A-Za-z0-9_-]+\s*:/, "WWW may consume but not redefine protected v2 tokens");
});

test("the adoption note records the exact pin, preserved boundaries and remaining issue work", async () => {
  const document = await read("VISUAL-LANGUAGE-V2-ADOPTION.md");
  assert.match(document, new RegExp(acceptedRevision));
  for (const phrase of ["identity popup", "install-copy", "live-card", "canonical URLs", "does not close", "merged Visual Language revisions only"]) {
    assert.match(document, new RegExp(phrase, "i"));
  }
});
