import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const docsOrigin = "https://docs.hara-lang.org/";

test("www delegates documentation publication to the standalone docs origin", async () => {
  const redirects = await readFile(new URL("../public/_redirects", import.meta.url), "utf8");
  assert.equal(
    redirects,
    [
      `/docs ${docsOrigin} 301!`,
      `/docs/ ${docsOrigin} 301!`,
      `/docs/* ${docsOrigin}:splat 301!`,
      ""
    ].join("\n")
  );
  assert.doesNotMatch(redirects, /^https:\/\/docs\.hara-lang\.org\//m);

  const shell = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
  assert.match(shell, /<a href="https:\/\/docs\.hara-lang\.org\/">Docs<\/a>/);
  assert.doesNotMatch(shell, /<a href="\/docs\/start\/orientation\/">Docs<\/a>/);
});
