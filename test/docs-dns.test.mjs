import test from "node:test";
import assert from "node:assert/strict";

import { normalizeDnsName, planDnsChanges } from "../scripts/configure-docs-dns.mjs";

test("DNS names are compared without case or a trailing dot", () => {
  assert.equal(normalizeDnsName(" Hara-Lang.GitHub.IO. "), "hara-lang.github.io");
});

test("an existing GitHub Pages CNAME is idempotent", () => {
  const desired = {
    id: "record-1",
    hostname: "docs.hara-lang.org",
    type: "CNAME",
    value: "hara-lang.github.io.",
    managed: false
  };
  const plan = planDnsChanges([desired], {
    hostname: "docs.hara-lang.org",
    target: "hara-lang.github.io",
    zoneName: "hara-lang.org"
  });
  assert.equal(plan.desired, desired);
  assert.equal(plan.create, false);
  assert.deepEqual(plan.conflicts, []);
});

test("a stale unmanaged record is replaced, while a managed conflict is surfaced", () => {
  const stale = {
    id: "record-stale",
    hostname: "docs",
    type: "CNAME",
    value: "old-docs.netlify.app",
    managed: false
  };
  const managed = {
    id: "record-managed",
    hostname: "docs.hara-lang.org",
    type: "NETLIFY",
    value: "www-hara-lang-org.netlify.app",
    managed: true
  };
  const plan = planDnsChanges([stale, managed], {
    hostname: "docs.hara-lang.org",
    target: "hara-lang.github.io",
    zoneName: "hara-lang.org"
  });
  assert.equal(plan.create, true);
  assert.deepEqual(plan.deletableConflicts, [stale]);
  assert.deepEqual(plan.managedConflicts, [managed]);
});
