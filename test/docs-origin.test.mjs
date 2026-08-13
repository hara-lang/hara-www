import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const docsOrigin = "https://hara-docs.netlify.app/";

test("www proxies independently published docs under the canonical path", async () => {
  const redirects = await readFile(new URL("../public/_redirects", import.meta.url), "utf8");
  const rules = new Set(redirects.trim().split("\n"));
  assert.equal(rules.has(`/docs ${docsOrigin} 200!`), true);
  assert.equal(rules.has(`/docs/ ${docsOrigin} 200!`), true);
  assert.equal(rules.has(`/docs/* ${docsOrigin}:splat 200!`), true);
  assert.doesNotMatch(redirects, /^https:\/\/docs\.hara-lang\.org\//m);

  const shell = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  assert.match(shell, /<a href="\/docs\/">Docs<\/a>/);
  assert.doesNotMatch(shell, /<a href="https:\/\/hara-docs\.netlify\.app\/">Docs<\/a>/);
});
