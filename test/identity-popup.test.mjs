import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const layout = await readFile(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
const loader = await readFile(new URL("../public/assets/identity-loader.js", import.meta.url), "utf8");

test("opts every www page into the shared popup GitHub sign-in mode", () => {
  assert.match(layout, /<meta name="hara-identity-mode" content="popup" \/>/);
  assert.match(layout, /data-hara-identity/);
  assert.match(layout, /identity-loader\.js/);
  assert.match(loader, /identity-client\.js/);
});

test("keeps production and testing on their matching Identity issuers", () => {
  assert.match(loader, /https:\/\/id\.hara-lang\.org/);
  assert.match(loader, /https:\/\/id\.testing\.hara-lang\.org/);
  assert.match(loader, /endsWith\("\.testing\.hara-lang\.org"\)/);
  assert.doesNotMatch(loader, /client_secret|HARA_GITHUB_OAUTH_CLIENT_SECRET/);
});
