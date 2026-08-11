#!/usr/bin/env bash

set -euo pipefail

base="${1:?usage: verify-docs-navigation.sh URL}"
base="${base%/}"
page="$(mktemp)"
trap 'rm -f "$page"' EXIT

healthy=false
for attempt in {1..20}; do
  if curl --fail --silent --show-error --location --max-time 20 \
      -H 'Cache-Control: no-cache' "$base/" >"$page" \
    && grep -Fq 'href="learn/#why-hara"' "$page" \
    && grep -Fq 'href="/docs/learn/first-contact/"' "$page" \
    && grep -Fq 'href="/docs/learn/protocols/"' "$page" \
    && grep -Fq 'href="/docs/hal-intro/01-basic-data/"' "$page" \
    && grep -Fq 'href="/docs/getting-started/web/"' "$page" \
    && grep -Fq 'href="/docs/projects/"' "$page" \
    && grep -Fq 'href="/docs/reference/l0-language/"' "$page" \
    && ! grep -Fq 'href="/docs/start/orientation/"' "$page" \
    && ! grep -Fq 'href="/docs/start/web-developers/"' "$page"; then
    healthy=true
    echo "Verified the consolidated Learn / Build / Reference documentation at ${base}/."
    break
  fi
  if [[ "$attempt" -lt 20 ]]; then
    echo "Waiting for consolidated documentation at ${base}/."
    sleep 15
  fi
done

if [[ "$healthy" != true ]]; then
  echo "${base}/ did not expose the consolidated documentation navigation." >&2
  exit 1
fi
