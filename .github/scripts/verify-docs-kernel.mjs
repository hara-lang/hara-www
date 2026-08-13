#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = new URL(process.argv[2] ?? "https://www.hara-lang.org/");
const workspace = resolve(process.env.HARA_WORKSPACE_ROOT ?? ".workspace");
const web = resolve(workspace, "technology/hara/core/rust/web");
const { HtaContext } = await import(pathToFileURL(resolve(web, "hta.js")).href);

const kernelModuleResponse = await fetch(new URL("runtime/browser-kernel.js", base), {
  headers: { "cache-control": "no-cache" }
});
assert.equal(kernelModuleResponse.ok, true, `browser kernel module: ${kernelModuleResponse.status}`);
assert.match(await kernelModuleResponse.text(), /createBrowserKernel/);

const manifestResponse = await fetch(new URL("runtime/kernel-manifest.json", base), {
  headers: { "cache-control": "no-cache" }
});
assert.equal(manifestResponse.ok, true, `kernel manifest: ${manifestResponse.status}`);
const manifest = await manifestResponse.json();
const wasmResponse = await fetch(new URL(manifest.variants.core.url, base), {
  headers: { "cache-control": "no-cache" }
});
assert.equal(wasmResponse.ok, true, `core wasm: ${wasmResponse.status}`);
const moduleBytes = new Uint8Array(await wasmResponse.arrayBuffer());
assert.equal(
  createHash("sha256").update(moduleBytes).digest("hex"),
  manifest.variants.core.sha256,
  "core wasm digest"
);

const bridge = { listeners: {}, selfListeners: {} };
bridge.self = {
  addEventListener(type, handler) {
    bridge.selfListeners[type] = handler;
  },
  postMessage(data) {
    bridge.listeners.message?.({ data });
  },
  close() {}
};
globalThis.self = bridge.self;
await import(`${pathToFileURL(resolve(web, "hta-worker.js")).href}?production-smoke`);
const worker = {
  addEventListener(type, handler) {
    bridge.listeners[type] = handler;
  },
  postMessage(message) {
    bridge.selfListeners.message({ data: message });
  },
  terminate() {}
};
const context = new HtaContext({ worker, moduleBytes });
try {
  await context.ready;
  const session = await context.createSession("www-smoke");
  assert.equal(await session.eval('(str/trim "  Hara  ")'), "Hara");
  console.log(`Verified the shared browser runtime for Hara ${manifest.version} at ${base}`);
} finally {
  context.close();
}
