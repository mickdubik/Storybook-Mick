import type { Meta, StoryObj } from "@storybook-astro/framework";
import CaseCard from "./CaseCard.astro";
import { study } from "../storybook/data";

// Real cases from src/data/work.ts, as the home page's "Selected work" list renders them.
const meta = {
  title: "Patterns/Case card",
  component: CaseCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One row of the home page's selected-work list: the case number, company and product, the hook, the summary, the headline result with its Glyph, the tags and a link to the case. The picture on the right is a Shot, or the case's animated demo when it has one (`demo` in `work.ts`).",
      },
    },
  },
  args: { study: study("unbounce-design-system") },
} satisfies Meta<typeof CaseCard>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A case whose cover is a still image. */
export const WithImage: Story = {};
/** A case with an animated cover: the demo plays instead of the image. */
export const WithDemo: Story = { args: { study: study("unbounce-smart-traffic") } };
