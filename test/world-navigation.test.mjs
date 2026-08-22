import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
const header = await readFile(new URL("../src/components/WwwHeader.astro", import.meta.url), "utf8");

test("links Hara Learn from the primary navigation", () => {
  assert.match(layout, /\{ label: "Learn", href: "https:\/\/learn\.hara-lang\.org\/" \}/);
  assert.match(header, /data-site-navigation/);
  assert.ok(header.includes("data-hara-identity"));
});
