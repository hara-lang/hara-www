#!/usr/bin/env bash

set -euo pipefail

base="${1:?usage: verify-docs-navigation.sh LEGACY_DOCS_URL [STANDALONE_DOCS_ORIGIN]}"
base="${base%/}"
standalone="${2:-https://hara-docs.netlify.app}"
standalone="${standalone%/}"
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
    expected_url="$standalone/"
    if [[ -n "$path" ]]; then
      source_url="$base/$path"
      expected_url="$standalone/$path"
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
    echo "Verified legacy documentation routes at $base delegate to $standalone."
    break
  fi

  if [[ "$attempt" -lt 20 ]]; then
    echo "Waiting for standalone documentation redirects at $base."
    sleep 15
  fi
done

if [[ "$healthy" != true ]]; then
  echo "$base did not delegate its documentation routes to $standalone." >&2
  exit 1
fi
