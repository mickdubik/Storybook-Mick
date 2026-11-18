# Mick Dubik portfolio: design system Storybook

Storybook for the design system behind the portfolio ("The Outcome Ledger"): tokens and components, rendered from the site's own source.

```bash
npm ci
npm run storybook        # dev server on port 6006
npm run build-storybook  # static build into storybook-static/
```

Node 22. Stories use the community Astro framework, `@storybook-astro/framework`. They import the site's components, data and tokens as `@site/...`, which points at `site/`, a copy of the site's `src/` refreshed with `npm run sync:site`.
