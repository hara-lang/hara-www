import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "src/data/benchmark-homepage.json");
const source = process.env.HARA_BENCHMARK_HOMEPAGE_URL
  ?? "https://hara-benchmarks.netlify.app/homepage.json";

function validate(value) {
  if (!value || value.schema !== "hara.benchmarks-homepage/v1") {
    throw new Error("benchmark homepage feed has the wrong schema");
  }
  if (value.canonical_url !== "https://www.hara-lang.org/benchmarks/") {
    throw new Error("benchmark homepage feed has the wrong canonical URL");
  }
  if (!Number.isInteger(value.workloads) || value.workloads < 1) {
    throw new Error("benchmark homepage feed has no workload count");
  }
  for (const runtime of ["python-prepared", "bb-prepared", "sbcl-prepared"]) {
    const ratio = value.ratios?.[runtime];
    if (ratio !== null && !(typeof ratio === "number" && Number.isFinite(ratio) && ratio > 0)) {
      throw new Error(`benchmark homepage feed has an invalid ratio for ${runtime}`);
    }
  }
  const requests = value.http?.requests_per_second;
  if (requests !== null && !(typeof requests === "number" && Number.isFinite(requests) && requests > 0)) {
    throw new Error("benchmark homepage feed has an invalid HTTP result");
  }
  return value;
}

const fallback = validate(JSON.parse(await readFile(output, "utf8")));

try {
  const response = await fetch(source, {
    headers: { "cache-control": "no-cache" },
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) throw new Error(`${source}: ${response.status}`);
  const current = validate(await response.json());
  await writeFile(output, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`using benchmark homepage evidence from ${source}`);
} catch (error) {
  console.warn(
    `benchmark homepage origin unavailable; retaining committed evidence from ${fallback.published}: `
      + `${error instanceof Error ? error.message : error}`
  );
}
