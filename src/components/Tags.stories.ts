import type { Meta, StoryObj } from "./storybook/types";
import Tags from "@site/components/Tags.astro";
import { study } from "./storybook/data";

// Tags are the real ones from the case studies in src/data/work.ts.
const meta = {
  title: "Components/Content/Tags",
  component: Tags,
  argTypes: {
    items: { control: "object", description: "The tag texts, in order." },
    label: { control: "text", description: "Accessible name of the list." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "A row of mono pills that label a case: the field, the product kind, the method. They are labels, not links. The look is `.tags` and `.tag` in `global.css`." } },
  },
  args: { items: study("unbounce-design-system").tags, label: "Tags" },
} satisfies Meta<typeof Tags>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The tags of the design-system case. */
export const Default: Story = {};
/** The tags of another case, to show the row wrapping to its content. */
export const AnotherCase: Story = { args: { items: study("unbounce-smart-traffic").tags } };
