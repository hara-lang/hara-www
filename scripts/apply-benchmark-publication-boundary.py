#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

package_staging = ROOT / "package.benchmark.json"
(ROOT / "package.json").write_text(package_staging.read_text(encoding="utf-8"), encoding="utf-8")
package_staging.unlink()

page_path = ROOT / "src/pages/index.astro"
page = page_path.read_text(encoding="utf-8")
body_start = page.find("\n---\n", 4)
if body_start < 0:
    raise RuntimeError("unable to find Astro frontmatter boundary")
frontmatter = '''---
import SiteLayout from "../layouts/SiteLayout.astro";
import Motif from "@hara-lang/visual-language/astro/Motif.astro";
import benchmarkEvidence from "../data/benchmark-homepage.json";
import "@hara-lang/live/style.css";
import "../styles/home-interactions.css";

type BenchmarkHomepage = {
  schema: "hara.benchmarks-homepage/v1";
  canonical_url: string;
  published: string;
  workloads: number;
  comparison_runtimes: number;
  ratios: Record<string, number | null>;
  http: {
    server: string;
    route: string;
    requests_per_second: number | null;
  };
};

const currentBenchmarks = benchmarkEvidence as BenchmarkHomepage;
const benchmarkWorkloads = currentBenchmarks.workloads;
const formatRatio = (runtime: string) => {
  const ratio = currentBenchmarks.ratios[runtime];
  return ratio == null ? "Pending" : `${ratio.toFixed(2)}×`;
};
const hopliteRequests = currentBenchmarks.http.requests_per_second == null
  ? "Pending"
  : Math.round(currentBenchmarks.http.requests_per_second).toLocaleString("en-US");
---
'''
page = frontmatter + page[body_start + 5 :]
page = page.replace(
    "geometric mean across 8 prepared workloads",
    "geometric mean across {benchmarkWorkloads} prepared workloads",
)
page_path.write_text(page, encoding="utf-8")

assembly_path = ROOT / "scripts/hara-assembly/build-www"
assembly = assembly_path.read_text(encoding="utf-8")
assembly = assembly.replace(
    '  for required_file in \\\n    "$SITE_ROOT/target/www-astro/index.html" \\\n    "$BENCHMARK_ROOT/dist/index.html"; do',
    '  for required_file in "$SITE_ROOT/target/www-astro/index.html"; do',
)
assembly = assembly.replace(
    'npm run build --prefix "$SITE_ROOT"\n'
    'HARA_BENCHMARK_BASE=/benchmarks npm run build --prefix "$BENCHMARK_ROOT/astro"\n'
    'check_site_inputs\n',
    'npm run build --prefix "$SITE_ROOT"\ncheck_site_inputs\n',
)
assembly = assembly.replace(
    'mkdir -p "$OUT/benchmarks"\n'
    'cp -R "$BENCHMARK_ROOT/dist/." "$OUT/benchmarks/"\n',
    '',
)
if "BENCHMARK_ROOT" in assembly:
    raise RuntimeError("build-www still depends on BENCHMARK_ROOT")
assembly_path.write_text(assembly, encoding="utf-8")

paths_path = ROOT / "scripts/hara-assembly/workspace-paths"
paths = paths_path.read_text(encoding="utf-8")
paths = re.sub(r'^BENCHMARK_ROOT=.*\n', '', paths, flags=re.MULTILINE)
paths = paths.replace(" BENCHMARK_ROOT", "")
paths_path.write_text(paths, encoding="utf-8")

for obsolete in (
    ".github/workflows/benchmarks-dns.yml",
    "test/benchmark-dns.test.mjs",
    "scripts/hara-assembly/install-benchmark-site",
):
    (ROOT / obsolete).unlink(missing_ok=True)

(ROOT / "scripts/apply-benchmark-publication-boundary.py").unlink(missing_ok=True)
(ROOT / ".github/workflows/apply-benchmark-publication-boundary.yml").unlink(missing_ok=True)
