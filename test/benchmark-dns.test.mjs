import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(
  new URL("../.github/workflows/benchmarks-dns.yml", import.meta.url),
  "utf8"
);

test("targets the independently published benchmark hostname", () => {
  assert.match(workflow, /DOCS_HOSTNAME: benchmarks\.hara-lang\.org/);
  assert.match(workflow, /DOCS_TARGET: hara-lang\.github\.io/);
  assert.match(workflow, /DOCS_SMOKE_PATH: \//);
  assert.match(workflow, /DOCS_SMOKE_MARKER: Hara Benchmarks/);
  assert.match(workflow, /Provision GitHub Pages CNAME through Netlify DNS/);
  assert.match(workflow, /Verify public DNS and independent benchmark origin/);
});
