import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const acceptedRevision = "9a88bddd7a539d7aa790e316ee169e8cc81886a4";

test("CI and production deploy pin the accepted merged visual-language revision", async () => {
  const [ci, deploy] = await Promise.all([
    read(".github/workflows/site-ci.yml"),
    read(".github/workflows/pages-www.yml")
  ]);
  for (const workflow of [ci, deploy]) {
    assert.match(workflow, /repository: hara-lang\/visual-language/);
    assert.match(workflow, new RegExp(`ref: ${acceptedRevision}`));
    assert.doesNotMatch(workflow, /ref: c49ad17d5052c8eeca0aff4a6146ff60b89ce88f/);
  }
});

test("the shared layout opts into v2 without replacing identity, navigation, live or SEO contracts", async () => {
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
  assert.match(layout, /<a href="\/benchmarks\/">Benchmarks<\/a>[\s\S]*?<a href="\/docs\/">Docs<\/a>[\s\S]*?specs\.hara-lang\.org[\s\S]*?world\.hara-lang\.org/);
});

test("package preparation verifies the accepted v2 exports and written contracts", async () => {
  const script = await read("scripts/prepare-visual-language.mjs");
  for (const value of ["./v2.css", "./theme.js", "./astro/v2/Shell.astro", "./astro/v2/Header.astro", "./astro/v2/PageHeader.astro", "V2-THEME.md", "V2-GUIDE.md"]) {
    assert.match(script, new RegExp(value.replaceAll(".", "\\.")));
  }
  assert.match(script, /v2 contract/);
});

test("the product bridge consumes shared tokens and preserves focus, touch and reduced motion", async () => {
  const css = await read("src/styles/v2-adoption.css");
  assert.match(css, /\.site-skip-link/);
  assert.match(css, /\.site-skip-link:focus-visible/);
  assert.match(css, /\.site-content-root:focus-visible/);
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
