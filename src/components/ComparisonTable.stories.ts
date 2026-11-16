import type { Meta, StoryObj } from "@storybook-astro/framework";
import ComparisonTable from "./ComparisonTable.astro";
import { beforeAfterRows } from "./storybook/data";

// The rows are the first before-and-after block found in src/data/work.ts.
const meta = {
  title: "Components/Data/Comparison table",
  component: ComparisonTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Before and after: the old figure in muted ink, the new figure in the accent, and two bars drawn to the same scale so the change reads at a glance. The bars are decoration and are hidden on phones; the figures carry the meaning. The column headings can be renamed.",
      },
    },
  },
  args: { caption: "Metrics before and after", rows: beforeAfterRows() },
} satisfies Meta<typeof ComparisonTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
