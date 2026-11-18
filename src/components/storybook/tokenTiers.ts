// The tokens the Tokens page lists, by tier, with their light and dark values. Read from the site's global.css (see tokens.ts).
import { declared, light, dark } from "./tokens";

// Every custom property the system defines, by tier: global (raw scales), semantic (colour roles), component (one component's own).
const semantic = ["color-background-default", "color-background-subtle", "color-background-muted", "color-text-default", "color-text-secondary", "color-text-muted", "color-border-default", "color-border-strong", "color-accent", "color-accent-inverse", "color-accent-subtle", "color-text-on-accent", "hero-glow", "hero-lite-a", "hero-lite-b", "color-background-card"];
const global = ["font-family-sans", "font-family-mono", "font-size-display", "font-size-h1", "font-size-h2", "font-size-h3", "font-size-figure", "font-size-figure-sm", "font-size-lede", "font-size-body", "font-size-small", "font-size-label", "font-size-micro", "space-gutter", "space-column-gap", "space-section", "space-tile", "space-block", "space-group", "size-measure", "size-measure-prose", "size-max", "radius-default", "duration-default", "easing-out", "unit-width", "unit", "layout-edge", "layout-padding-x"];
const component = ["btn-radius", "btn-inset", "btn-tile-size", "btn-duration", "btn-easing", "btn-background", "btn-background-hover", "btn-text", "btn-text-hover", "btn-tile-background", "btn-tile-background-hover", "btn-glyph-color", "btn-glyph-color-hover", "frame-padding", "frame-radius"];

const group = (n: string) =>
  /^font-/.test(n) ? "Type"
  : /^color-|^hero-/.test(n) ? "Colour"
  : /^(duration|easing|btn-duration|btn-easing)/.test(n) ? "Motion"
  : /^btn-/.test(n) ? "Button"
  : /^frame/.test(n) ? "Frame"
  : "Space and layout";

const find = (n: string) => declared("").find((d) => d.name === n);
export const tiers = [
  {
    title: "Global",
    desc: "Raw scales with no role. Components may use these directly.",
    rows: global,
  },
  {
    title: "Semantic",
    desc: "Colour roles that say what a colour is for. Components use these and only these for colour. Dark mode redefines the same names.",
    rows: semantic,
  },
  {
    title: "Component",
    desc: "Tokens that belong to one component. Where they take a colour they point back at a semantic token.",
    rows: component,
  },
].map((t) => ({
  ...t,
  rows: t.rows.map((n) => ({ n, group: group(n), value: light[n] ?? find(n)?.value ?? "", dk: dark[n] })).filter((r) => r.value),
}));
export const total = tiers.reduce((sum, t) => sum + t.rows.length, 0);
