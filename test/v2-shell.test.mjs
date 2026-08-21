import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
const shell = await readFile(new URL("../src/styles/shell.css", import.meta.url), "utf8");

test("Hara WWW adopts the v2 visual-language shell", () => {
  assert.match(layout, /@hara-lang\/visual-language\/v2\.css/);
  assert.match(layout, /astro\/v2\/Shell\.astro/);
  assert.match(layout, /astro\/v2\/Header\.astro/);
  assert.match(layout, /astro\/v2\/ContextNav\.astro/);
  assert.match(layout, /data-hara-v2-site="www"/);
  assert.match(layout, /section="WWW"/);
  assert.match(layout, /familyNavigation/);
});

test("v2 adoption leaves the homepage content full-width inside the shell", () => {
  assert.match(shell, /\.hara-www-shell \.hara-v2-main \{ padding: 0; \}/);
  assert.match(shell, /\.hara-www-shell \.hara-v2-main > \.hara-v2-content \{ width: 100%; \}/);
});
