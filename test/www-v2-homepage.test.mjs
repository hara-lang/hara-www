import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const componentPaths = [
  "src/components/www-v2/Proposition.astro",
  "src/components/www-v2/LanguageSection.astro",
  "src/components/www-v2/RuntimeSection.astro",
  "src/components/www-v2/EvidenceSection.astro",
  "src/components/www-v2/StartSection.astro",
  "src/components/www-v2/HomepageRuntime.astro"
];
const stylePaths = [
  "src/styles/www-v2/core.css",
  "src/styles/www-v2/proposition.css",
  "src/styles/www-v2/language.css",
  "src/styles/www-v2/runtime.css",
  "src/styles/www-v2/evidence.css",
  "src/styles/www-v2/start.css",
  "src/styles/www-v2/live.css",
  "src/styles/www-v2/responsive.css"
];

test("the production homepage follows the v2 WWW technical reading order", async () => {
  const homepage = await read("src/pages/index.astro");
  const markers = [
    "<Proposition",
    "<LanguageSection",
    "<RuntimeSection",
    "<EvidenceSection",
    "<StartSection"
  ];
  const positions = markers.map((marker) => homepage.indexOf(marker));
  positions.forEach((position, index) => assert.notEqual(position, -1, `missing ${markers[index]}`));
  for (let index = 1; index < positions.length; index += 1) {
    assert.ok(positions[index - 1] < positions[index], `${markers[index - 1]} must precede ${markers[index]}`);
  }
  assert.match(homepage, /aria-label="Homepage sections"/);
  assert.match(homepage, /href="#language"[\s\S]*?href="#runtime"[\s\S]*?href="#evidence"[\s\S]*?href="#start"/);
  const proposition = await read(componentPaths[0]);
  assert.match(proposition, /FleetField/);
  assert.match(proposition, /class="www-v2-proposition"/);
  assert.match(proposition, /class="www-v2-proof-ledger"/);
});

test("the v2 homepage keeps production evidence and real browser-kernel surfaces", async () => {
  const [homepage, proposition, language, runtime, script] = await Promise.all([
    read("src/pages/index.astro"),
    read(componentPaths[0]),
    read(componentPaths[1]),
    read(componentPaths[2]),
    read(componentPaths[5])
  ]);
  assert.match(homepage, /benchmark-homepage\.json/);
  assert.match(homepage, /currentBenchmarks\.ratios/);
  assert.match(homepage, /currentBenchmarks\.http\.requests_per_second/);
  assert.match(homepage, /currentBenchmarks=\{currentBenchmarks\}/);
  assert.match(language, /data-live-learn/);
  assert.match(runtime, /data-live-canvas/);
  assert.match(script, /createLiveKernel/);
  assert.match(script, /kind: "canvas", source: pongSource/);
  assert.match(proposition, /brew install hara-lang\/tap\/hara/);
});

test("the homepage replaces the legacy visual grammar rather than overriding it", async () => {
  const [homepage, components, styles] = await Promise.all([
    read("src/pages/index.astro"),
    Promise.all(componentPaths.map(read)).then((parts) => parts.join("\n")),
    Promise.all(stylePaths.map(read)).then((parts) => parts.join("\n"))
  ]);
  const source = `${homepage}\n${components}`;
  assert.doesNotMatch(source, /<Motif\b/);
  assert.doesNotMatch(source, /home-interactions\.css/);
  assert.doesNotMatch(source, /class="hero"/);
  assert.doesNotMatch(source, /class="proof"/);
  assert.doesNotMatch(source, /class="closing"/);
  assert.doesNotMatch(source, /class="content-section/);
  assert.doesNotMatch(source, /class="card-grid/);
  assert.doesNotMatch(source, /class="button(?:\s|")/);
  assert.match(source, /class="hara-v2-button"/);
  assert.match(styles, /var\(--hara-v2-/);
  assert.match(styles, /clip-path:/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /border-radius:\s*999px/);
  assert.doesNotMatch(styles, /--hara-v2-[A-Za-z0-9_-]+\s*:/);
});

test("runtime tabs and degraded states remain explicit and keyboard operable", async () => {
  const [runtime, script, language, start] = await Promise.all([
    read(componentPaths[2]),
    read(componentPaths[5]),
    read(componentPaths[1]),
    read(componentPaths[4])
  ]);
  assert.match(runtime, /class="kernel-mode-tabs" role="tablist"/);
  assert.equal((runtime.match(/role="tab"[\s\S]*?data-kernel-tab=/g) ?? []).length, 3);
  assert.match(script, /ArrowUp/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /Home/);
  assert.match(script, /End/);
  assert.match(start, /Runtime unavailable/);
  assert.match(start, /Low bandwidth/);
  assert.match(start, /Anonymous reader/);
  assert.match(`${language}\n${runtime}`, /<noscript>/);
  assert.match(language, /Static source remains useful without the runtime/);
});

test("the old homepage stylesheet is no longer part of the production composition", async () => {
  const [homepage, manifest, site] = await Promise.all([
    read("src/pages/index.astro"),
    read("src/styles/www-v2.css"),
    read("src/styles/site.css")
  ]);
  assert.match(homepage, /styles\/www-v2\.css/);
  for (const file of stylePaths) {
    assert.match(manifest, new RegExp(file.split("/").at(-1).replace(".", "\\.")));
  }
  assert.doesNotMatch(site, /\.(?:hero|proof|content-section|card-grid|closing)\b/);
});
