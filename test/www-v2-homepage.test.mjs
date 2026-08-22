import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage has one short path through Play, Learn, community, and Build", async () => {
  const homepage = await read("src/pages/index.astro");
  const markers = ["<PlaySection", "<LearnSection", "<CommunitySection", "<BuildSection"];
  const positions = markers.map((marker) => homepage.indexOf(marker));
  positions.forEach((position, index) => assert.notEqual(position, -1, `missing ${markers[index]}`));
  assert.ok(positions[0] < positions[1] && positions[1] < positions[2]);
  assert.doesNotMatch(homepage, /benchmark-homepage|<EvidenceSection|<RuntimeSection|<StartSection/);
});

test("the homepage speaks to community and includes an official blog route", async () => {
  const [learn, community] = await Promise.all([
    read("src/components/www-v2/LearnSection.astro"),
    read("src/components/www-v2/CommunitySection.astro")
  ]);
  assert.match(learn, /Official blog/);
  assert.match(learn, /learn\.hara-lang\.org\/articles/);
  assert.match(community, /Hara Learn/);
  assert.match(community, /What are people saying about Clojure\?/);
  assert.match(community, /ask\.clojure\.org/);
  assert.match(community, /data-hara-poll/);
  assert.match(community, /localStorage/);
});

test("the initial live surface is a small editable expression", async () => {
  const [play, runtime] = await Promise.all([
    read("src/components/www-v2/PlaySection.astro"),
    read("src/components/www-v2/HomepageRuntime.astro")
  ]);
  assert.match(play, /data-live-play/);
  assert.match(play, /One expression/);
  assert.doesNotMatch(play, /Backend|Session|Authority|network:none|filesystem:none/);
  assert.match(runtime, /mountLiveCard/);
  assert.match(runtime, /data-live-play/);
  assert.doesNotMatch(runtime, /data-kernel-tab|data-live-canvas|pongSource/);
});

test("the homepage uses gradient composition instead of the old evidence ledger", async () => {
  const [styles, manifest] = await Promise.all([
    read("src/styles/www-v2/core.css"),
    read("src/styles/www-v2.css")
  ]);
  assert.match(styles, /radial-gradient/);
  assert.match(styles, /www-v2-play__gradient/);
  assert.match(manifest, /community\.css/);
  assert.doesNotMatch(manifest, /proposition\.css|language\.css|runtime\.css|evidence\.css|start\.css/);
});
