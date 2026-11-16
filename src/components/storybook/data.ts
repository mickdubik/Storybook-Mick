// Real content for the stories, read from src/data so Storybook shows the site's own copy and figures.
import { caseStudies } from "../../data/work";
import { aiWorkflow, aiImpact } from "../../data/site";
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

/** The first n stages of the AI workflow, in the shape the Accordion takes (the home page maps all of them the same way). */
export const accordionItems = (n = 4) =>
  aiWorkflow.slice(0, n).map((w) => ({
    title: w.stage,
    summary: w.out,
    panels: [
      { label: "Where AI helps", text: w.ai },
      { label: "Where I decide", text: w.me, decision: true },
    ],
  }));

/** The real tiles from the home page's AI section, as HTML for the Card slot (the `card__*` classes are the card's own). */
export const impactCardHtml = (figure: boolean): string => {
  const m = must(aiImpact.find((x) => !!x.figure === figure), "aiImpact tile");
  return figure
    ? `<p class="mono card__kicker">${m.kind}</p><p class="figure-num card__figure">${m.figure}</p><p class="card__label">${m.label}</p><p class="card__note">${m.note}</p>`
    : `<p class="mono card__kicker"><span class="card__marker" aria-hidden="true"></span>${m.kind}</p><p class="card__figure card__figure--text">${m.label}</p><p class="card__note">${m.note}</p>`;
};
export const impactNote = (): string => must(aiImpact.find((x) => !x.figure), "aiImpact tile").note;

/** The rows of the first "results" and "beforeAfter" blocks found in the case studies. */
export const resultsItems = () => must(objects.find((o) => o.t === "results"), "a results block").items.slice(0, 6);
export const beforeAfterRows = () => must(objects.find((o) => o.t === "beforeAfter"), "a beforeAfter block").rows;
