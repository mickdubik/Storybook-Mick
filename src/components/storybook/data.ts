// Real content for the stories, read from src/data so Storybook shows the site's own copy and figures.
import { caseStudies } from "../../data/work";
import type { Metric, Img } from "../../data/work";

const objects: any[] = [];
const walk = (v: unknown) => {
  if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === "object") {
    objects.push(v);
    Object.values(v).forEach(walk);
  }
};
walk(caseStudies);

const must = <T,>(v: T | undefined, what: string): T => {
  if (!v) throw new Error(`Storybook data: ${what} not found in src/data/work.ts`);
  return v;
};

/** A metric, found by its label (first match). */
export const metric = (label: string): Metric =>
  must(objects.find((o) => o.kind && o.value && typeof o.label === "string" && o.label === label && o.magnitude !== undefined), `metric "${label}"`);

/** A metric, found by its label, with or without a drawing magnitude. */
export const metricAny = (label: string): Metric => must(objects.find((o) => o.kind && o.value && o.label === label), `metric "${label}"`);

export const plate = (variant: string) => must(objects.find((o) => o.t === "plate" && o.variant === variant), `plate "${variant}"`) as {
  variant: "traffic" | "tokens" | "portal" | "care";
  title: string;
  caption: string;
  note?: string;
};

export const buttonStates = () => must(objects.find((o) => o.t === "buttonStates"), "buttonStates block") as { title: string; caption: string; note?: string };

export const image = (srcPart: string): Img => must(objects.find((o) => typeof o.src === "string" && o.src.includes(srcPart) && o.alt), `image "${srcPart}"`);
