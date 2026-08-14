import { brotliCompressSync, gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [directoryArgument, version] = process.argv.slice(2);
if (!directoryArgument || !version) {
  throw new Error("usage: write-kernel-manifest.mjs DIRECTORY VERSION");
}
const directory = resolve(directoryArgument);
const variants = {
  core: { file: `hara-wasm-core-${version}.wasm`, features: ["interpreter", "hta", "sessions", "host-bridges"] },
  vm: { file: `hara-wasm-vm-${version}.wasm`, features: ["bytecode-vm", "hta", "sessions", "host-bridges"] },
  trace: { file: `hara-wasm-trace-${version}.wasm`, features: ["dev-trace", "hta", "sessions", "host-bridges"] }
};
for (const value of Object.values(variants)) {
  const bytes = await readFile(resolve(directory, value.file));
  value.url = `/runtime/${value.file}`;
  value.sha256 = createHash("sha256").update(bytes).digest("hex");
  value.bytes = { raw: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length, brotli: brotliCompressSync(bytes).length };
}
const foundationBytes = await readFile(resolve(directory, "foundation.halc"));
const bootstrap = {
  file: "foundation.halc",
  url: "/runtime/foundation.halc",
  sha256: createHash("sha256").update(foundationBytes).digest("hex"),
  bytes: {
    raw: foundationBytes.length,
    gzip: gzipSync(foundationBytes, { level: 9 }).length,
    brotli: brotliCompressSync(foundationBytes).length
  }
};
// Keep the transfer guard strict while allowing the current exact-numeric core
// and Foundation namespace-resource support. Preserve a small margin above the
// measured 819 KB gzip / 606 KB Brotli artifacts so future growth remains visible.
if (variants.core.bytes.gzip > 830_000 || variants.core.bytes.brotli > 615_000) {
  throw new Error(`hara-wasm-core exceeds its transfer budget: ${JSON.stringify(variants.core.bytes)}`);
}
const manifest = { schema: "hara-kernel-manifest/v1", version, htaAbi: 3, bootstrap, variants };
await writeFile(resolve(directory, "kernel-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
