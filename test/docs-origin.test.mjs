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
  for (const line of required.split("\n")) {
    assert.equal(redirects.split("\n").includes(line), true);
  }
  assert.doesNotMatch(redirects, /^https:\/\/docs\.hara-lang\.org\//m);

  const shell = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  const header = await readFile(new URL("../src/components/WwwHeader.astro", import.meta.url), "utf8");
  assert.match(shell, /\{ label: "Build", href: "https:\/\/build\.hara-lang\.org\/" \}/);
  assert.match(header, /data-site-navigation/);
  assert.doesNotMatch(shell, /https:\/\/hara-docs\.netlify\.app\/.*Docs/);
});
