import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("adds an accessible copy button to the Homebrew install command", async () => {
  const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/assets/install-copy.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../public/assets/install-copy.css", import.meta.url), "utf8");

  assert.match(layout, /install-copy\.css/);
  assert.match(layout, /install-copy\.js/);
  assert.match(script, /\.hero-install code/);
  assert.match(script, /code\.textContent\?\.trim\(\)/);
  assert.match(script, /navigator\.clipboard\?\.writeText/);
  assert.match(script, /document\.execCommand\("copy"\)/);
  assert.match(script, /Copy Homebrew install command/);
  assert.match(script, /aria-live/);
  assert.match(script, /Copied/);
  assert.match(script, /Copy failed/);
  assert.match(styles, /\.hero-install-command/);
  assert.match(styles, /\.hero-install-copy/);
  assert.match(styles, /focus-visible/);
});
