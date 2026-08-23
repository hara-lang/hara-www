# Visual Language v2 adoption for `hara-www`

`hara-www` consumes the independently packaged Hara UI shell from:

```text
hara-lang/hara-ui: @hara-lang/ui, @hara-lang/ui-astro, @hara-lang/ui-tool
```

The package source is the same in pull-request CI and production deployment. Only published Hara UI package revisions are accepted. The package-preparation boundary materialises the foundation, Astro, and tool packages before Astro compiles the site.

## Current adoption boundary

The production homepage now follows the Visual Language v2 WWW-family hierarchy directly:

1. a technical proposition and bounded starting actions;
2. a current benchmark proof ledger;
3. a readable first form with an explicit browser-runtime contract;
4. forms, libraries, runtime sessions, and host interop;
5. Java, native, and browser runtime records;
6. maintained implementation, specification, documentation, and evidence sources;
7. benchmark method and publication metadata;
8. browser, local, and documentation entry paths; and
9. visible runtime-unavailable, low-bandwidth, and anonymous-reader states.

The old homepage composition has been removed. `index.astro` no longer depends on the legacy `hero`, `proof`, `content-section`, `card-grid`, pill-button, `closing`, Motif, or homepage-interaction stylesheet vocabulary. `src/styles/www-v2.css` is a scoped product composition layer that consumes protected `--hara-v2-*` tokens without redefining them.

The global header, navigation disclosure, focus boundary, theme control, footer, and product-owned identity entry remain in `SiteLayout.astro`. Shared document geometry and responsive navigation remain separate from homepage composition.

## Preserved production contracts

The migration deliberately preserves:

- the identity popup and anonymous-reader boundary;
- `install-copy` progressive enhancement for the Homebrew command;
- the real `@hara-lang/live` live-card package;
- browser-kernel resource loading and session lifecycle;
- the editable Pong source and canvas surface;
- Java, native, and web runtime tabs, including Arrow, Home, and End keyboard behaviour;
- benchmark values generated from `benchmark-homepage.json`;
- canonical URLs, sitemap, Open Graph, Twitter, favicon, and legal metadata;
- Docs, Playground, Specs, World, and benchmark navigation; and
- the current documentation import and production assembly ownership.

Live execution remains an enhancement. Static explanation, source, runtime contracts, install instructions, and evidence links remain useful when JavaScript is disabled or the browser runtime is unavailable.

## Styling ownership

`@hara-lang/ui` and its adapters own:

- colour, typography, spacing, focus, cut geometry, motion, and responsive tokens;
- common buttons, badges, panels, fields, tables, and theme behaviour;
- the shared Hara mark and fleet-field graphic; and
- the shared shell and package-level downstream adoption contract.

`hara-www` owns:

- the public homepage's production content and route order;
- benchmark projection data and evidence links;
- live-kernel adapters and runtime resource paths;
- Homebrew installation behaviour;
- account and identity integration;
- canonical/public-site metadata; and
- the scoped `www-v2.css` composition needed to combine those production surfaces.

Protected `--hara-v2-*` tokens are consumed only. Product CSS must not redefine them.

## Responsive and degraded behaviour

The public page preserves one primary-navigation disclosure at the shared 760px boundary. The route-local overview navigation remains horizontally inspectable, controls retain a minimum 44px compact target, and all focus states remain visible.

At smaller widths:

- the proposition and fleet field stack;
- the proof ledger moves from four to two to one column;
- the language, source, evidence, start, and state records keep their reading order;
- runtime tabs become a three-column strip;
- live-card controls remain horizontally inspectable; and
- reduced-motion preferences suppress non-essential transitions.

The page names unavailable and deferred states rather than hiding them or presenting a simulated success result.

## Follow-on WWW-family work

This change completes the first production homepage slice of issue #29. The remaining wholesale WWW migration is intentionally split by authoritative product boundary:

- **Docs:** reconcile the assembled `/docs/` shell with the v2 Docs family while retaining the pinned generated documentation import and Starlight/document contracts.
- **Benchmarks:** reconcile `/benchmarks/` with the v2 evidence-first family while retaining production registry values, methods, confidence, and comparability states.
- **Route matrix:** review Home, Docs, Benchmarks, legal/error routes, identity states, and live runtime states in light and dark themes at desktop, tablet, and mobile widths.

Those slices should continue to consume the same shared v2 package rather than copying catalogue-only components or creating a parallel token system.

## Validation

Repository validation is:

```sh
npm run check
npm test
npm run build
```

CI additionally checks the production assembly boundary against the Hara workspace and materialises the exact Hara UI package sources recorded above.
