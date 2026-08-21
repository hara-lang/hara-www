import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");

test("links Hara World from the primary navigation", () => {
  assert.ok(layout.includes("https://world.hara-lang.org/"));
  assert.ok(layout.includes('label: "World"'));
  assert.ok(layout.includes("data-hara-identity"));
});
