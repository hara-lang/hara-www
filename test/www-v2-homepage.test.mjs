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
  assert.match(learn, /Try the Hara Challenge/);
  assert.match(community, /Hara Learn/);
  assert.match(community, /What are people saying about Lisp\?/);
  assert.match(community, /ask\.clojure\.org/);
  assert.match(community, /data-hara-poll/);
  assert.match(community, /localStorage/);
});

test("the live surface offers examples and reuses an early Hara shader", async () => {
  const [play, runtime] = await Promise.all([
    read("src/components/www-v2/PlaySection.astro"),
    read("src/components/www-v2/HomepageRuntime.astro")
  ]);
  assert.match(play, /data-live-play/);
  assert.match(play, /data-live-example-select/);
  assert.match(play, /Ocean shader/);
  assert.doesNotMatch(play, /One expression|Try it here/);
  assert.doesNotMatch(play, /Backend|Session|Authority|network:none|filesystem:none/);
  assert.match(runtime, /mountLiveCard/);
  assert.match(runtime, /PONG_SOURCE/);
  assert.match(runtime, /examples\/studio-backgrounds\/src\/ocean\.hal/);
  assert.doesNotMatch(runtime, /data-kernel-tab|data-live-canvas/);
});

test("the homepage uses a blue shader composition instead of the old orbit graphic", async () => {
  const [styles, community, manifest] = await Promise.all([
    read("src/styles/www-v2/core.css"),
    read("src/styles/www-v2/community.css"),
    read("src/styles/www-v2.css")
  ]);
  assert.match(styles, /radial-gradient/);
  assert.match(styles, /www-v2-play__shader/);
  assert.doesNotMatch(styles, /www-v2-play__gradient/);
  assert.doesNotMatch(styles, /#d36bff|#b86bff/);
  assert.doesNotMatch(community, /#d36bff|#b86bff/);
  assert.match(manifest, /community\.css/);
  assert.doesNotMatch(manifest, /proposition\.css|language\.css|runtime\.css|evidence\.css|start\.css/);
});
