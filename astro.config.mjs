import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.hara-lang.org",
  output: "static",
  outDir: "./target/www-astro",
  integrations: [sitemap()]
});
