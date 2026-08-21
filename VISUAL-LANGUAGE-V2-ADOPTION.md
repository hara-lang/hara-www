# Hara WWW — Visual Language v2 adoption

## Accepted source

This adoption pins `hara-lang/visual-language` at merged revision:

```text
9a88bddd7a539d7aa790e316ee169e8cc81886a4
```

That revision includes the shared v2 document language and merged catalogue guide. The pin is present in the repository gitlink, pull-request CI checkout and production deployment checkout.

## This first adoption slice

- imports `@hara-lang/visual-language/v2.css` at the shared `SiteLayout`;
- applies the opt-in `hara-v2` root without replacing the existing Astro layout;
- preserves the block-H mark, ThemeToggle and current primary navigation order;
- adds a keyboard skip link and stable main-content focus target;
- maps shared header/footer seams, focus and compact touch targets to v2 tokens;
- verifies the v2 package exports and written contracts before build.

## Preserved product behavior

This visual adoption does not change:

- identity popup loading or account state;
- OAuth, sign-in, logout or trust mechanics;
- install-copy behavior;
- live-card or runtime behavior;
- benchmark inputs or assembly;
- canonical URLs, Open Graph or Twitter metadata;
- public routes;
- footer links or licensing language.

## Ownership boundary

Visual Language owns shared tokens, document geometry, state presentation, focus, responsive grammar and the acceptance guide. `hara-www` continues to own content, navigation labels, SEO, identity mounting, live runtime integration, benchmark assembly and product-specific behavior.

The local `v2-adoption.css` file is a narrow product mapping layer. It may consume shared `--hara-v2-*` tokens but must not redefine them.

## Remaining issue #19 work

This PR begins, but does not close, the full public-site adoption. Subsequent bounded PRs should:

1. recompose homepage sections against the accepted `/v2/www/` laboratory;
2. adopt the proof strip, executable code surface, ecosystem and release compositions;
3. attach explicit light/dark desktop and mobile screenshots;
4. verify the complete live and benchmark surfaces after each composition change;
5. keep downstream changes pinned to merged Visual Language revisions only.
