#!/usr/bin/env node

function normalizeDnsName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.+$/, "");
}

const hostname = normalizeDnsName(process.env.DOCS_HOSTNAME ?? "docs.hara-lang.org");
const target = normalizeDnsName(process.env.DOCS_TARGET ?? "hara-lang.github.io");
const path = process.env.DOCS_SMOKE_PATH ?? "/books/the-little-book-of-hal/docs/";
const marker = process.env.DOCS_SMOKE_MARKER ?? "The Little Book of HAL";
const attempts = Number(process.env.DOCS_VERIFY_ATTEMPTS ?? 120);
const intervalMs = Number(process.env.DOCS_VERIFY_INTERVAL_MS ?? 5000);

if (!Number.isInteger(attempts) || attempts < 1) {
  throw new Error("DOCS_VERIFY_ATTEMPTS must be a positive integer.");
}
if (!Number.isInteger(intervalMs) || intervalMs < 1000) {
  throw new Error("DOCS_VERIFY_INTERVAL_MS must be an integer of at least 1000 milliseconds.");
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function cnameVisible() {
  const url = new URL("https://cloudflare-dns.com/dns-query");
  url.searchParams.set("name", hostname);
  url.searchParams.set("type", "CNAME");
  const response = await fetch(url, {
    headers: { Accept: "application/dns-json" }
  });
  if (!response.ok) throw new Error(`Cloudflare DNS returned ${response.status}.`);
  const payload = await response.json();
  return (payload.Answer ?? []).some((answer) =>
    answer.type === 5
    && normalizeDnsName(answer.name) === hostname
    && normalizeDnsName(answer.data) === target
  );
}

async function docsVisible() {
  const url = new URL(path, `https://${hostname}/`);
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "hara-docs-publication-smoke/1" }
  });
  if (!response.ok) return false;
  return (await response.text()).includes(marker);
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const dnsReady = await cnameVisible();
    if (dnsReady && await docsVisible()) {
      console.log(`verified https://${hostname}${path}`);
      process.exit(0);
    }
    console.log(`attempt ${attempt}/${attempts}: DNS or HTTPS publication is not ready yet`);
  } catch (error) {
    console.log(`attempt ${attempt}/${attempts}: ${error instanceof Error ? error.message : error}`);
  }
  if (attempt < attempts) await sleep(intervalMs);
}

console.error(`docs publication did not become visible at https://${hostname}${path}`);
process.exit(1);
