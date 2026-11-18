import type { Meta, StoryObj } from "./storybook/types";
import Glyph from "@site/components/Glyph.astro";
import { metric, metricAny } from "./storybook/data";

// Every metric below is a real one from src/data/work.ts.
const meta = {
  title: "Components/Graphics/Glyph",
  component: Glyph,
  argTypes: {
    metric: { control: false, description: "The metric the glyph draws, from src/data/work.ts. Pick another story to change it." },
  },
  tags: ["autodocs"],
  args: { metric: metric("Duplicated components, 167 to 53") },
} satisfies Meta<typeof Glyph>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Reduction: a dashed removed share. */
export const Reduction: Story = {};
/** Gain: past a 100% baseline. */
export const Gain: Story = { args: { metric: metric("Feature adoption among existing customers") } };
/** Share: filled on a track. */
export const Share: Story = { args: { metric: metric("Task success, non-technical persona") } };
/** Multiple: one block per unit. */
export const Multiple: Story = { args: { metric: metric("Features shipped per sprint") } };
/** Score: a bar against a benchmark. */
export const Score: Story = { args: { metric: metric("SUS usability score for the hi-fi prototype") } };
/** Levels get no drawing. */
export const Plain: Story = { args: { metric: metricAny("Unbounce customers using the AI-driven experiences (company-wide, for scale)") } };
