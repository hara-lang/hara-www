# Hara WWW — Visual Language v2 adoption

## Accepted source

This adoption pins `hara-lang/visual-language` at merged revision:

```text
b512a12e8d7191c9092d195ca0ddc894b0ba54d2
```

That revision contains the shared v2 foundations and the accepted `V2-WWW.md` Home, Docs, and Benchmarks family. The exact pin is present in pull-request CI and the production deployment checkout. Downstream WWW changes consume merged Visual Language revisions only.

The revision currently contains a stale `./v2-data.css` manifest target; WWW does not import that export. Package preparation verifies the maintained `src/v2/data-visualisation.css` source directly while `hara-lang/visual-language#114` tracks restoring the public export.

## Shared shell

The shared `SiteLayout`:

- imports `@hara-lang/visual-language/v2.css` once at the application root;
- applies the opt-in `hara-v2` root without replacing Astro, identity, live runtime, or SEO ownership;
- preserves the block-H mark, ThemeToggle, canonical URLs, Open Graph/Twitter metadata, and current route destinations;
- provides one keyboard skip link and stable main-content focus target;
- keeps Benchmarks, Docs, Specs, and World in their product-owned locations;
- exposes one responsive `Browse Hara` disclosure at 760 pixels and below;
- leaves navigation available without JavaScript, then applies the compact state after enhancement;
- retains visible focus, 44-pixel compact controls, Escape/backdrop closing, and reduced-motion behaviour.

The local `v2-adoption.css` remains a narrow shell and accessibility bridge. It may consume shared `--hara-v2-*` tokens but must not redefine them.

## Production homepage composition

Issue #29 replaces the earlier compatibility landing page with the production v2 WWW composition. `src/pages/index.astro` now follows the accepted technical reading order:

1. proposition and bounded start actions;
2. current benchmark proof ledger;
3. static first form, runtime contract, and live enhancement;
4. forms, live development, and complete-program boundaries;
5. explicit Java, Native, and Web runtime modes;
6. evidence records with method and source links;
7. browser, local, and guided starting paths.

The homepage directly uses the `www-*` family vocabulary from `V2-WWW.md`: route-local subnavigation, `www-main`, `www-hero`, `www-proof-ledger`, `www-section-head`, `www-live-example`, `www-capability-stack`, `www-runtime-workbench`, `www-evidence-grid`, and `www-start-grid`.

`src/styles/site.css` owns only the production WWW composition and shared public-site geometry. It consumes the v2 token system and primitives rather than recreating a theme. `src/styles/home-interactions.css` scopes live-card presentation to the two homepage runtime mounts; live execution mechanics remain owned by `@hara-lang/live`.

## Static-first and degraded behaviour

The first form and canvas example render a bounded static fallback before the browser kernel attaches. Successful enhancement replaces that fallback with the live card. A synchronous mount failure restores the static source or explanation instead of leaving an empty panel.

The page therefore remains useful when:

- JavaScript is unavailable;
- the browser runtime is deferred for low bandwidth;
- a kernel cannot attach;
- the reader is anonymous;
- motion is reduced.

The static page never presents an inferred runtime result as a successful execution.

## Preserved product behaviour

The wholesale visual change does not replace:

- identity popup loading or account state;
- OAuth, sign-in, logout, or trust mechanics;
- install-copy assets and behaviour;
- live-card, browser-kernel, resource, session, or canvas contracts;
- Java/Native/Web runtime tab semantics or Arrow/Home/End keyboard operation;
- benchmark inputs, methodology, generated evidence, or assembly;
- documentation import and Starlight ownership;
- canonical URLs, sitemap, Open Graph, Twitter, or favicon metadata;
- footer links or Apache-2.0 licensing language.

## Data ownership

Visual Language owns shared tokens, focus, responsive grammar, reusable controls, and the WWW family reference. `hara-www` continues to own production copy, routes, benchmark data, identity mounting, live runtime integration, installation guidance, SEO, and deployment.

Benchmark values remain sourced from `src/data/benchmark-homepage.json`. The homepage does not copy fixture values from the Visual Language laboratory.

## Validation

The repository contract checks assert:

- the exact merged Visual Language revision in CI and deploy workflows;
- presence of `V2-WWW.md` in the prepared package boundary;
- the v2 homepage composition and removal of legacy `content-section`, `card-grid`, `.button`, `.proof`, and `.closing` markup;
- static live fallbacks and preserved runtime mount selectors;
- responsive, focus, touch, and reduced-motion rules;
- no local protected v2 token definitions.

Run:

```sh
npm run check
npm test
npm run build
```

## Remaining issue #29 work

The production homepage is the first complete application slice. Follow-on pull requests should:

1. reconcile the assembled Docs shell with the v2 Docs family while retaining canonical content and Starlight boundaries;
2. reconcile Benchmarks with the v2 evidence-first family while retaining every production sample, baseline, method, and comparability state;
3. run light/dark desktop, tablet, and mobile captures across the public route matrix;
4. remove any remaining legacy-style exceptions only after their owning product route has adopted the v2 composition.
