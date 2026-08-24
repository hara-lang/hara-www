import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Hara WWW uses the shared product hamburger and one context shell", async () => {
  const [layout, header, secondary] = await Promise.all([
    read("src/layouts/SiteLayout.astro"),
    read("src/components/WwwHeader.astro"),
    read("src/components/WwwSecondaryNav.astro")
  ]);

  assert.match(layout, /@hara-lang\/ui\/v2\.css/);
  assert.match(layout, /astro\/v2\/Shell\.astro/);
  assert.match(layout, /<WwwHeader slot="header"/);
  assert.match(layout, /<WwwSecondaryNav slot="context"/);
  assert.match(layout, /data-hara-v2-site="www"/);

  assert.match(header, /astro\/v2\/Header\.astro/);
  assert.match(header, /menuMode="product"/);
  assert.match(header, /menuControls="hara-www-navigation"/);
  assert.match(header, /menuLabel="Open Hara menu"/);
  assert.match(header, /data-site-navigation/);
  assert.match(header, /data-hara-account/);
  assert.doesNotMatch(header, /site-navigation-trigger/);

  assert.match(secondary, /data-www-route-trigger/);
  assert.match(secondary, /data-www-section-trigger/);
  assert.match(secondary, /data-sticky="false"/);
  assert.match(secondary, /data-route-open="false"/);
  assert.match(secondary, /data-section-open="false"/);
  assert.match(secondary, /if \(open\) setSectionOpen\(false\)/);
  assert.match(secondary, /if \(open\) setRouteOpen\(false\)/);
  assert.match(secondary, /event\.key !== "Escape"/);
});

test("the WWW local navigation stays compact, non-floating and left anchored through desktop", async () => {
  const shell = await read("src/styles/shell.css");
  const shellStart = shell.indexOf(".hara-www-secondary {");
  const shellEnd = shell.indexOf("}", shellStart);
  const shellRule = shell.slice(shellStart, shellEnd + 1);

  assert.match(shellRule, /position: relative/);
  assert.match(shellRule, /top: auto/);
  assert.match(shellRule, /isolation: isolate/);
  assert.match(shellRule, /min-height: 48px/);
  assert.match(shellRule, /max-height: 48px/);
  assert.doesNotMatch(shellRule, /position:\s*(?:sticky|fixed)/);
  assert.match(shell, /\.hara-www-secondary__line \{[\s\S]*?display: flex;[\s\S]*?max-height: 48px;/);
  assert.match(shell, /\.hara-www-secondary__panel \{[\s\S]*?position: absolute;[\s\S]*?top: 100%;[\s\S]*?left: clamp\(12px, 2vw, 28px\);[\s\S]*?width: min\(340px, calc\(100vw - 56px\)\);/);
  assert.match(shell, /@media \(max-width: 840px\)[\s\S]*?\.hara-www-secondary__panel \{[\s\S]*?right: 0;[\s\S]*?left: 0;[\s\S]*?width: 100%;/);
  assert.match(shell, /min-height: 44px/);
  assert.match(shell, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(shell, /\.site-navigation-trigger/);
  assert.doesNotMatch(shell, /@media \(max-width: 820px\)/);
});

test("v2 adoption leaves homepage content full-width and clears only the persistent global header", async () => {
  const [shell, bridge] = await Promise.all([
    read("src/styles/shell.css"),
    read("src/styles/v2-adoption.css")
  ]);

  assert.match(shell, /\.hara-www-shell \.hara-v2-main \{ padding: 0; \}/);
  assert.match(shell, /\.hara-www-shell \.hara-v2-main > \.hara-v2-content \{ width: 100%; \}/);
  assert.match(bridge, /scroll-margin-top: calc\(var\(--hara-v2-header-height\) \+ 1rem\)/);
  assert.doesNotMatch(bridge, /scroll-margin-top:[^;]*48px/);
  assert.doesNotMatch(bridge, /site-navigation-trigger/);
});
