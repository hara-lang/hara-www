#!/usr/bin/env node
import { pathToFileURL } from "node:url";

const API_ORIGIN = "https://api.netlify.com/api/v1";

export function normalizeDnsName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.+$/, "");
}

function hostnameCandidates(hostname, zoneName) {
  const full = normalizeDnsName(hostname);
  const zone = normalizeDnsName(zoneName);
  const relative = full.endsWith(`.${zone}`)
    ? full.slice(0, -(zone.length + 1))
    : full;
  return new Set([full, relative]);
}

export function planDnsChanges(records, { hostname, target, zoneName }) {
  const candidates = hostnameCandidates(hostname, zoneName);
  const expectedTarget = normalizeDnsName(target);
  const matching = records.filter((record) =>
    candidates.has(normalizeDnsName(record.hostname))
  );
  const desired = matching.find((record) =>
    String(record.type ?? "").toUpperCase() === "CNAME"
    && normalizeDnsName(record.value) === expectedTarget
  ) ?? null;
  const conflicts = matching.filter((record) => record.id !== desired?.id);
  return {
    desired,
    conflicts,
    managedConflicts: conflicts.filter((record) => record.managed === true),
    deletableConflicts: conflicts.filter((record) => record.managed !== true),
    create: desired === null
  };
}

async function netlifyRequest(fetchImpl, token, path, options = {}) {
  const response = await fetchImpl(`${API_ORIGIN}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (_) {
      payload = text;
    }
  }
  if (!response.ok) {
    const detail = typeof payload === "string" ? payload : JSON.stringify(payload);
    throw new Error(`Netlify ${response.status} ${path}: ${detail}`);
  }
  return payload;
}

export async function configureDocsDns({
  fetchImpl = globalThis.fetch,
  token = process.env.NETLIFY_AUTH_TOKEN,
  accountSlug = process.env.NETLIFY_ACCOUNT_SLUG ?? "zcaudate",
  zoneName = process.env.NETLIFY_DNS_ZONE ?? "hara-lang.org",
  hostname = process.env.DOCS_HOSTNAME ?? "docs.hara-lang.org",
  target = process.env.DOCS_TARGET ?? "hara-lang.github.io",
  ttl = Number(process.env.DOCS_DNS_TTL ?? 300)
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("A fetch implementation is required.");
  if (!token) throw new Error("NETLIFY_AUTH_TOKEN is required to provision docs DNS.");
  if (!Number.isInteger(ttl) || ttl < 60) throw new Error("DOCS_DNS_TTL must be an integer of at least 60 seconds.");

  const zones = await netlifyRequest(
    fetchImpl,
    token,
    `/dns_zones?account_slug=${encodeURIComponent(accountSlug)}`
  );
  if (!Array.isArray(zones)) throw new Error("Netlify returned an invalid DNS-zone response.");

  const normalizedZone = normalizeDnsName(zoneName);
  const zone = zones.find((candidate) =>
    normalizeDnsName(candidate.name ?? candidate.domain) === normalizedZone
  );
  if (!zone?.id) {
    const available = zones
      .map((candidate) => candidate.name ?? candidate.domain)
      .filter(Boolean)
      .join(", ");
    throw new Error(`Netlify DNS zone ${zoneName} was not found. Available zones: ${available || "none"}.`);
  }

  const records = await netlifyRequest(
    fetchImpl,
    token,
    `/dns_zones/${encodeURIComponent(zone.id)}/dns_records`
  );
  if (!Array.isArray(records)) throw new Error("Netlify returned an invalid DNS-record response.");

  const plan = planDnsChanges(records, { hostname, target, zoneName });
  if (plan.managedConflicts.length > 0) {
    const summary = plan.managedConflicts
      .map((record) => `${record.type} ${record.hostname} ${record.value}`)
      .join("; ");
    throw new Error(`Managed Netlify DNS records conflict with the GitHub Pages CNAME: ${summary}`);
  }

  for (const record of plan.deletableConflicts) {
    if (!record.id) throw new Error(`Conflicting DNS record lacks an id: ${JSON.stringify(record)}`);
    await netlifyRequest(
      fetchImpl,
      token,
      `/dns_zones/${encodeURIComponent(zone.id)}/dns_records/${encodeURIComponent(record.id)}`,
      { method: "DELETE" }
    );
    console.log(`removed ${record.type} ${record.hostname} ${record.value}`);
  }

  let created = null;
  if (plan.create) {
    created = await netlifyRequest(
      fetchImpl,
      token,
      `/dns_zones/${encodeURIComponent(zone.id)}/dns_records`,
      {
        method: "POST",
        body: JSON.stringify({
          type: "CNAME",
          hostname: normalizeDnsName(hostname),
          value: normalizeDnsName(target),
          ttl
        })
      }
    );
    console.log(`created CNAME ${hostname} -> ${target}`);
  } else {
    console.log(`CNAME ${hostname} -> ${target} is already present`);
  }

  return {
    zoneId: zone.id,
    hostname: normalizeDnsName(hostname),
    target: normalizeDnsName(target),
    created,
    removed: plan.deletableConflicts.length
  };
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  configureDocsDns().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
