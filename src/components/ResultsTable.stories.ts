import type { Meta, StoryObj } from "@storybook-astro/framework";
import ResultsTable from "./ResultsTable.astro";
import { resultsItems } from "./storybook/data";

// The rows are the first reported results found in src/data/work.ts.
const meta = {
  title: "Components/Data/Results table",
  component: ResultsTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The reported results of a case: a ruled two-column table, label on the left and the figure on the right. Hovering a row highlights it and brings its figure to full strength. A row is not a link, so nothing else changes. An optional qualifier (such as \"up to\") sits in small mono type before the figure.",
      },
    },
  },
  args: { caption: "Reported results", items: resultsItems() },
} satisfies Meta<typeof ResultsTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
