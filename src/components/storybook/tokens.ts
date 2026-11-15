// Reads the real tokens out of global.css so the Storybook pages cannot drift from the site.
import css from "../../styles/global.css?raw";

const block = (re: RegExp) => css.match(re)?.[1] ?? "";
const rootBlock = block(/:root\s*\{([\s\S]*?)\n\}/);
const darkBlock = block(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);

const hexes = (b: string) => {
  const out: Record<string, string> = {};
  for (const t of b.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[t[1]] = t[2].toLowerCase();
  return out;
};
export const light = hexes(rootBlock);
export const dark = hexes(darkBlock);

// Every `--prefix*: value;` declaration in the stylesheet, first one wins (with its trailing comment, if any).
export const declared = (prefix: string) => {
  const out: { name: string; value: string; note: string }[] = [];
  const seen = new Set<string>();
  for (const m of css.matchAll(new RegExp(`--(${prefix}[a-z0-9-]*):\\s*([^;]+);(?:\\s*/\\*\\s*([\\s\\S]*?)\\s*\\*/)?`, "g"))) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    out.push({ name: m[1], value: m[2].trim(), note: (m[3] ?? "").trim() });
  }
  return out;
};

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
export const grade = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large" : "Decoration only");
