import type { Meta, StoryObj } from "../storybook/types";
import CaseChapter from "@site/components/patterns/CaseChapter.astro";
import { chapterWith } from "../storybook/data";

// Chapters are picked by the kind of block they hold, so the story follows the data.
const meta = {
  title: "Patterns/Case chapter",
  component: CaseChapter,
  argTypes: {
    study: { control: false, description: "The case the chapter belongs to, from src/data/work.ts." },
    chapter: { control: false, description: "The chapter to show, from the case. Pick another story to change it." },
    n: { control: "number", description: "Position of the chapter in the case (0 for chapter 01)." },
    showMeasured: { control: "boolean", description: "Shows the \"How measured\" blocks." },
  },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One numbered chapter of a case page: a heading, then its blocks in order. A block is a statement, prose, a list, stats, quotes, images, a results or before-and-after table, a plate or a decision. The content comes from `chapters` in `src/data/work.ts`; the page's table of contents and rail are not part of the chapter.",
      },
    },
  },
  args: chapterWith("results"),
} satisfies Meta<typeof CaseChapter>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A chapter that ends in the reported results: lead figures, then the Results table. */
export const Results: Story = {};
/** A chapter with before-and-after figures, drawn as the Comparison table. */
export const BeforeAfter: Story = { args: chapterWith("beforeAfter") };
/** A chapter that records a design decision. */
export const Decision: Story = { args: chapterWith("decision") };
/** A chapter that shows a gallery of product images. */
export const Gallery: Story = { args: chapterWith("gallery") };
