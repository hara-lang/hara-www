import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import remarkHaraEval from "./scripts/remark-hara-eval.mjs";
import { docsRedirects, docsSidebar } from "./scripts/docs-manifest.mjs";

export default defineConfig({
  site: "https://www.hara-lang.org",
  output: "static",
  outDir: "./target/www-astro",
  redirects: docsRedirects,
  markdown: { remarkPlugins: [remarkHaraEval] },
  integrations: [
    sitemap(),
    starlight({
      title: "Hara",
      logo: {
        light: "./src/assets/hara-mark-light.svg",
        dark: "./src/assets/hara-mark-dark.svg",
        alt: "Hara"
      },
      description: "A small, high-performance Lisp for learning to build software from first principles.",
      favicon: "/assets/hara-favicon.svg",
      head: [
        { tag: "meta", attrs: { name: "hara-identity-auto", content: "starlight" } },
        { tag: "script", attrs: { type: "module", src: "/assets/identity-loader.js" } },
        { tag: "link", attrs: { rel: "stylesheet", href: "/docs-assets/stylesheets/syllabus.css" } },
        { tag: "link", attrs: { rel: "stylesheet", href: "/docs-assets/live/style.css" } },
        { tag: "link", attrs: { rel: "stylesheet", href: "/assets/live-surface.css" } },
        { tag: "script", attrs: { type: "module", src: "/assets/docs-repl.js" } },
        { tag: "script", attrs: { type: "module", src: "/docs-assets/javascripts/syllabus.js" } },
        { tag: "meta", attrs: { property: "og:site_name", content: "Hara / Docs" } },
        { tag: "meta", attrs: { property: "og:image", content: "https://www.hara-lang.org/og-hara-docs.jpg" } },
        { tag: "meta", attrs: { property: "og:image:secure_url", content: "https://www.hara-lang.org/og-hara-docs.jpg" } },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/jpeg" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Hara Docs — build live, across every host" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://www.hara-lang.org/og-hara-docs.jpg" } },
        { tag: "meta", attrs: { name: "twitter:image:alt", content: "Hara Docs — build live, across every host" } }
      ],
      customCss: ["./src/styles/docs.css"],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/hara-lang/hara" }],
      sidebar: docsSidebar
    })
  ]
});
