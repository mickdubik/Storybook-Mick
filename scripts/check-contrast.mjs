// Contrast check for the colour tokens in src/styles/global.css (WCAG 2 ratios).
// Rules (rules/visual.md): body and label text needs 4.5:1 (AA);
// Run: npm run check:contrast   (exit code 1 if any pair fails, so CI can block a change)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const block = (re) => css.match(re)?.[1] ?? "";
const hexes = (b) => Object.fromEntries([...b.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2].toLowerCase()]));
const light = hexes(block(/:root\s*\{([\s\S]*?)\n\}/));
const dark = { ...light, ...hexes(block(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [text token, background token, minimum ratio]
const pairs = [
  ["ink", "paper", 4.5], ["ink", "paper-2", 4.5],
  ["ink-2", "paper", 4.5], ["ink-2", "paper-2", 4.5],
  ["ink-3", "paper", 4.5], ["ink-3", "paper-2", 4.5],
  ["signal", "paper", 4.5],
];

let failed = 0;
for (const [theme, t] of [["light", light], ["dark", dark]]) {
  for (const [fg, bg, min] of pairs) {
    if (!t[fg] || !t[bg]) { console.log(`SKIP  ${theme}  --${fg} on --${bg}: token not found`); continue; }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${theme.padEnd(5)}  --${fg} on --${bg}  ${r.toFixed(2)}:1  (needs ${min}:1)`);
  }
}
console.log(failed ? `\n${failed} pair(s) below the minimum.` : "\nAll pairs pass.");
process.exit(failed ? 1 : 0);
