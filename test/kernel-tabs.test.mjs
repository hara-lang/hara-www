import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const runtimeUrl = new URL("../src/components/www-v2/HomepageRuntime.astro", import.meta.url);
const playUrl = new URL("../src/components/www-v2/PlaySection.astro", import.meta.url);

test("the homepage runtime mounts the example surface without environment chrome", async () => {
  const [runtime, play] = await Promise.all([
    readFile(runtimeUrl, "utf8"),
    readFile(playUrl, "utf8")
  ]);
  assert.match(runtime, /createLiveKernel/);
  assert.match(runtime, /data-live-play/);
  assert.match(runtime, /activeSnippet: "read"/);
  assert.match(play, /data-live-example-select/);
  assert.match(play, /Choose a starting point/);
  assert.doesNotMatch(runtime, /kernel-mode-tabs|data-kernel-tab|data-live-canvas/);
});
