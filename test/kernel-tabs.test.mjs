import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("kernel modes are exposed as accessible tabs rather than a dropdown", async () => {
  const [homepage, runtime, script] = await Promise.all([
    read("src/pages/index.astro"),
    read("src/components/home/HomeRuntime.astro"),
    read("src/scripts/homepage.ts")
  ]);

  assert.match(homepage, /<HomeRuntime \/>/);
  assert.match(runtime, /class="www-runtime-tabs" role="tablist"/);
  assert.equal((runtime.match(/role="tab"[^>]*data-kernel-tab=/g) ?? []).length, 3);
  assert.match(runtime, /data-kernel-tab="java"/);
  assert.match(runtime, /data-kernel-tab="native"/);
  assert.match(runtime, /data-kernel-tab="web"/);
  assert.match(runtime, /role="tabpanel"/);
  assert.match(script, /ArrowUp/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /Home/);
  assert.match(script, /End/);
  assert.doesNotMatch(runtime, /<select id="kernel-mode"/);
});
