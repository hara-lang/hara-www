#!/usr/bin/env bash

set -euo pipefail

: "${1:?usage: verify-docs-navigation.sh WWW_ORIGIN}"
base="${1%/}"
location_file="$(mktemp)"
trap 'rm -f "$location_file"' EXIT

for path in /docs /docs/ /docs/start/orientation/; do
  status="$(curl --silent --show-error --max-time 20 \
    --dump-header "$location_file" --output /dev/null --write-out '%{http_code}' \
    "${base}${path}")"
  [[ "$status" == "301" ]] || {
    echo "${base}${path} returned ${status}, expected 301." >&2
    exit 1
  }
  location="$(awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/^location:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit}' "$location_file")"
  [[ "$location" == "https://learn.hara-lang.org/" || "$location" == "https://learn.testing.hara-lang.org/" ]] || {
    echo "${base}${path} redirected to ${location}, not Learn." >&2
    exit 1
  }
done

echo "Verified the legacy docs paths redirect permanently to Learn at ${base}."
