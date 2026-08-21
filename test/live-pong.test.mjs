import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const site = fileURLToPath(new URL("../", import.meta.url));
const workspace = resolve(process.env.HARA_WORKSPACE_ROOT || resolve(site, "../.."));
const pongUrl = new URL("../sources/pong.hal", import.meta.url);
const runtimeUrl = new URL("../src/components/www-v2/HomepageRuntime.astro", import.meta.url);
const nodeHalUrl = resolve(workspace, "technology/hara/core/rust/web/studio/hal/node.hal");

function assertBalanced(source) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  let string = false;
  let escaped = false;
  let comment = false;
  for (const character of source) {
    if (comment) { if (character === "\n") comment = false; continue; }
    if (string) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') string = false;
      continue;
    }
    if (character === ";") comment = true;
    else if (character === '"') string = true;
    else if (["(", "[", "{"].includes(character)) stack.push(character);
    else if (character in pairs) assert.equal(stack.pop(), pairs[character]);
  }
  assert.deepEqual(stack, []);
}

test("homepage keeps the initial live surface simple", async () => {
  const runtime = await readFile(runtimeUrl, "utf8");
  assert.match(runtime, /data-live-play/);
  assert.match(runtime, /activeSnippet: "read"/);
  assert.doesNotMatch(runtime, /pongSource|data-live-canvas/);
});

test("Pong keeps namespace setup locally evaluable and sequences its frame loop", async () => {
  const source = await readFile(pongUrl, "utf8");
  assertBalanced(source);
  assert.match(source, /^\(ns\+\)\n\n\(require \[studio\.draw :as draw\]\)/);
  assert.match(source, /\(node\/start/);
});

test("studio node registries are dereferenced exactly once", async () => {
  const source = await readFile(nodeHalUrl, "utf8");
  assert.match(source, /\(let \[entry \(deref \*active-task\*\)\]/);
  assert.match(source, /find-handler \(deref \*handlers\*\)/);
  assert.doesNotMatch(source, /\(deref \(deref \*active-task\*\)\)/);
});
