import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("adds an accessible copy button to the Homebrew install command", async () => {
  const [layout, hero, script, styles] = await Promise.all([
    read("src/layouts/SiteLayout.astro"),
    read("src/components/home/HomeHero.astro"),
    read("public/assets/install-copy.js"),
    read("public/assets/install-copy.css")
  ]);

  assert.match(layout, /install-copy\.css/);
  assert.match(layout, /install-copy\.js/);
  assert.match(hero, /data-install-command/);
  assert.match(hero, /brew install hara-lang\/tap\/hara/);
  assert.match(script, /\[data-install-command\] > code/);
  assert.match(script, /code\.textContent\?\.trim\(\)/);
  assert.match(script, /navigator\.clipboard\?\.writeText/);
  assert.match(script, /document\.execCommand\("copy"\)/);
  assert.match(script, /Copy Homebrew install command/);
  assert.match(script, /aria-live/);
  assert.match(script, /Copied/);
  assert.match(script, /Copy failed/);
  assert.match(styles, /\.www-install__command/);
  assert.match(styles, /\.www-install__copy/);
  assert.match(styles, /focus-visible/);
  assert.doesNotMatch(`${script}\n${styles}`, /hero-install/);
});
