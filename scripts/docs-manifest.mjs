import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const workspace = resolve(process.env.HARA_WORKSPACE_ROOT || join(site, "../.."));
export const manifestPath = resolve(workspace, "website/hara-docs/docs-manifest.json");
export const docsManifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function slugFor(path) {
  return `docs/${path.replace(/\.md$/, "").replace(/\/(?:index|README)$/i, "")}`;
}

function sidebarItem(item) {
  if (item.path) return { label: item.label, slug: slugFor(item.path) };
  if (item.url) return { label: item.label, link: item.url };
  return {
    label: item.label,
    collapsed: item.collapsed ?? false,
    items: item.items.map(sidebarItem)
  };
}

export const docsSidebar = docsManifest.navigation.map(sidebarItem);
export const docsRedirects = Object.fromEntries(
  docsManifest.redirects.map(({ from, to }) => [from, to])
);
export const redirectSources = new Set(
  docsManifest.redirects.map(({ source }) => source).filter((source) => source)
);
