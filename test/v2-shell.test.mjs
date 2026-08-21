import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
const header = await readFile(new URL("../src/components/WwwHeader.astro", import.meta.url), "utf8");
const shell = await readFile(new URL("../src/styles/shell.css", import.meta.url), "utf8");

test("Hara WWW adopts the v2 visual-language shell", () => {
  assert.match(layout, /@hara-lang\/visual-language\/v2\.css/);
  assert.match(layout, /astro\/v2\/Shell\.astro/);
  assert.match(layout, /WwwHeader/);
  assert.match(layout, /data-hara-v2-site="www"/);
  assert.match(header, /class="hara-v2-header hara-www-header"/);
  assert.match(header, /class="hara-v2-brand" href="\/"/);
  assert.match(header, /data-site-navigation-trigger/);
  assert.match(header, /data-site-navigation/);
});

test("v2 adoption leaves the homepage content full-width inside the shell", () => {
  assert.match(shell, /\.hara-www-shell \.hara-v2-main \{ padding: 0; \}/);
  assert.match(shell, /\.hara-www-shell \.hara-v2-main > \.hara-v2-content \{ width: 100%; \}/);
  assert.match(shell, /@media \(max-width: 820px\)/);
  assert.match(shell, /data-navigation-open="true"/);
});
