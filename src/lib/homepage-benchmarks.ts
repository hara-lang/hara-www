import benchmarkEvidence from "../data/benchmark-homepage.json";

export type BenchmarkHomepage = {
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

export const currentBenchmarks = benchmarkEvidence as BenchmarkHomepage;
export const benchmarkWorkloads = currentBenchmarks.workloads;
export const benchmarkPublished = currentBenchmarks.published;

export const formatRatio = (runtime: string) => {
  const ratio = currentBenchmarks.ratios[runtime];
  return ratio == null ? "Pending" : `${ratio.toFixed(2)}×`;
};

export const hopliteRequests = currentBenchmarks.http.requests_per_second == null
  ? "Pending"
  : Math.round(currentBenchmarks.http.requests_per_second).toLocaleString("en-US");
