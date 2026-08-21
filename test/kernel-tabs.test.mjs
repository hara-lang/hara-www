import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const runtimeUrl = new URL("../src/components/www-v2/RuntimeSection.astro", import.meta.url);
const scriptUrl = new URL("../src/components/www-v2/HomepageRuntime.astro", import.meta.url);

test("kernel modes are exposed as accessible tabs rather than a dropdown", async () => {
  const [runtime, script] = await Promise.all([
    readFile(runtimeUrl, "utf8"),
    readFile(scriptUrl, "utf8")
  ]);
  assert.match(runtime, /class="kernel-mode-tabs" role="tablist"/);
  assert.equal((runtime.match(/role="tab"[^>]*data-kernel-tab=/g) ?? []).length, 3);
  assert.match(runtime, /data-kernel-tab="java"/);
  assert.match(runtime, /data-kernel-tab="native"/);
  assert.match(runtime, /data-kernel-tab="web"/);
  assert.match(runtime, /role="tabpanel"/);
  assert.match(script, /ArrowUp/);
  assert.match(script, /ArrowRight/);
  assert.doesNotMatch(runtime, /<select id="kernel-mode"/);
});
