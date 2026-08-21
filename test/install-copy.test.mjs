import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("adds an accessible copy button to the v2 Homebrew install record", async () => {
  const [layout, homepage, script, styles] = await Promise.all([
    readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8"),
    readFile(new URL("../src/components/www-v2/Proposition.astro", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/install-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/install-copy.css", import.meta.url), "utf8")
  ]);

  assert.match(layout, /install-copy\.css/);
  assert.match(layout, /install-copy\.js/);
  assert.match(homepage, /data-install-command/);
  assert.match(homepage, /brew install hara-lang\/tap\/hara/);
  assert.match(script, /\[data-install-command\] code/);
  assert.match(script, /code\.textContent\?\.trim\(\)/);
  assert.match(script, /navigator\.clipboard\?\.writeText/);
  assert.match(script, /document\.execCommand\("copy"\)/);
  assert.match(script, /Copy Homebrew install command/);
  assert.match(script, /aria-live/);
  assert.match(script, /Copied/);
  assert.match(script, /Copy failed/);
  assert.match(styles, /\.install-command-row/);
  assert.match(styles, /\.install-command-copy/);
  assert.match(styles, /var\(--hara-v2-/);
  assert.match(styles, /focus-visible/);
  assert.doesNotMatch(`${script}\n${styles}`, /hero-install/);
});
