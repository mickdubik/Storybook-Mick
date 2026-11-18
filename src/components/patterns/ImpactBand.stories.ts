import type { Meta, StoryObj } from "../storybook/types";
import ImpactBand from "./ImpactBand.astro";
import { study } from "../storybook/data";

const meta = {
  title: "Patterns/Impact band",
  component: ImpactBand,
  argTypes: {
    study: { control: false, description: "One case study from src/data/work.ts. Pick another story to change it." },
    bp: { control: "boolean", description: "Blueprint marks (the design-system case only)." },
    showMeasured: { control: "boolean", description: "Shows the \"How measured\" line under the figures." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Impact section of a case page: a bento grid with the headline result large and the other results around it, each with a Glyph. The figures come from the case's `metrics` and `headline` in `src/data/work.ts`. The counting-up animation is a page script, so figures show their final values here.",
      },
    },
  },
  args: { study: study("unbounce-smart-traffic"), bp: false },
} satisfies Meta<typeof ImpactBand>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The band for a case with several results. */
export const SmartTraffic: Story = {};
/** The band on the design-system case, the only one with blueprint marks. */
export const DesignSystem: Story = { args: { study: study("unbounce-design-system"), bp: true } };
