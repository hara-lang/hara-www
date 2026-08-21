import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");

test("links Hara World from the primary navigation", () => {
  assert.match(layout, /\{ label: "World", href: "https:\/\/world\.hara-lang\.org\/", external: true \}/);
  assert.match(layout, /V2Header/);
  assert.ok(layout.includes("data-hara-identity"));
});
