// Counts for the Getting started page, computed from the code at build time (nothing typed by hand).
import { light } from "./tokens";

const files = import.meta.glob("../**/*.stories.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const entries = Object.entries(files);

// Keys are relative to this folder: "../demos/X" is a demo, "../X" a component.
const demos = entries.filter(([p]) => p.startsWith("../demos/"));
const components = entries.filter(([p]) => p.startsWith("../") && !p.startsWith("../demos/"));

// The brief: four counts that size the system.
export const stats = [
  { n: components.length, label: "Components" },
  { n: demos.length, label: "Animated demos" },
  { n: Object.keys(light).length, label: "Colour tokens" },
  { n: 2, label: "Themes" }, // light and dark, both defined in global.css
];
