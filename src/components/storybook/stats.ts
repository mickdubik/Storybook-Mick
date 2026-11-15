// Counts for the Getting started page, computed from the code at build time (nothing typed by hand).
import { light, declared } from "./tokens";

const files = import.meta.glob("../**/*.stories.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const entries = Object.entries(files);
const exportsOf = (src: string) => (src.match(/^export const [A-Z]/gm) ?? []).length;

// Keys are relative to this folder: "./X" is a Foundations page, "../demos/X" a demo, "../X" a component.
const foundations = entries.filter(([p]) => p.startsWith("./"));
const demos = entries.filter(([p]) => p.startsWith("../demos/"));
const components = entries.filter(([p]) => p.startsWith("../") && !p.startsWith("../demos/"));

export const stats = [
  { n: components.length, label: "Components" },
  { n: demos.length, label: "Animated demos" },
  { n: entries.reduce((sum, [, src]) => sum + exportsOf(src), 0), label: "Stories" },
  { n: foundations.length, label: "Foundations pages" },
  { n: Object.keys(light).length, label: "Colour tokens" },
  { n: declared("t-").length, label: "Type steps" },
];
