#!/usr/bin/env bash

set -euo pipefail

base="${1:?usage: verify-docs-navigation.sh CANONICAL_DOCS_URL}"
base="${base%/}"
page="$(mktemp)"
trap 'rm -f "$page"' EXIT

paths=(
  ""
  "learn/"
  "learn/first-contact/"
  "learn/protocols/"
  "hal-intro/"
  "getting-started/web/"
  "projects/"
  "api/"
  "books/the-little-book-of-hal/docs/"
)

healthy=false
for attempt in {1..20}; do
  healthy=true
  for path in "${paths[@]}"; do
    source_url="$base/"
    expected_url="$base/"
    if [[ -n "$path" ]]; then
      source_url="$base/$path"
      expected_url="$base/$path"
    fi

    effective_url="$(curl --fail --silent --show-error --location --max-time 20 \
      -H 'Cache-Control: no-cache' \
      --output "$page" \
      --write-out '%{url_effective}' \
      "$source_url")" || {
        healthy=false
        break
      }

    if [[ "$effective_url" != "$expected_url"* ]]; then
      echo "$source_url resolved to $effective_url instead of $expected_url" >&2
      healthy=false
      break
    fi

    if [[ "$path" == "books/the-little-book-of-hal/docs/" ]] \
      && ! grep -Fq 'The Little Book of HAL' "$page"; then
      echo "$effective_url did not expose The Little Book of HAL." >&2
      healthy=false
      break
    fi
  done

  if [[ "$healthy" == true ]]; then
    echo "Verified independently published documentation at canonical path $base."
    break
  fi

  if [[ "$attempt" -lt 20 ]]; then
    echo "Waiting for proxied documentation at $base."
    sleep 15
  fi
done

if [[ "$healthy" != true ]]; then
  echo "$base did not expose independently published documentation at its canonical path." >&2
  exit 1
fi
