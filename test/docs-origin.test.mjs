import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const docsOrigin = "https://hara-docs.netlify.app/";

test("www proxies independently published docs under the canonical path", async () => {
  const redirects = await readFile(new URL("../public/_redirects", import.meta.url), "utf8");
  const required = [
    `/docs ${docsOrigin} 200!`,
    `/docs/ ${docsOrigin} 200!`,
    `/docs/* ${docsOrigin}:splat 200!`
  ].join("\n");
  assert.equal(redirects.startsWith(`${required}\n`), true);
  assert.doesNotMatch(redirects, /^https:\/\/docs\.hara-lang\.org\//m);

  const shell = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  assert.match(shell, /V2Header/);
  assert.match(shell, /\{ label: "Docs", href: "\/docs\/" \}/);
  assert.doesNotMatch(shell, /https:\/\/hara-docs\.netlify\.app\/.*Docs/);
});
