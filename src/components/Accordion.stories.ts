import type { Meta, StoryObj } from "./storybook/types";
import Accordion from "@site/components/Accordion.astro";
import { accordionItems } from "./storybook/data";

// The rows are the first stages of the real AI workflow in src/data/site.ts.
const meta = {
  title: "Components/Content/Accordion",
  component: Accordion,
  argTypes: {
    items: { control: false, description: "The rows, from the data files. Not editable here." },
    name: { control: "text", description: "Rows that share a name open one at a time. Leave it out to let any number stay open." },
    summaryLabel: { control: "text", description: "Read by screen readers before each summary." },
    openFirst: { control: "boolean", description: "Opens the first row." },
    contained: { control: "boolean", description: "Makes the list its own width container, so panels go two-up when it is at least 560px wide." },
  },
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Disclosure rows on native `details` elements: a title and one-line summary when closed, one or two labelled panels when open. Used for the AI workflow on the home page. The soft close (the panel fades out before the row closes) comes from the page layout, so it does not play here; the rows still open and close.",
      },
    },
  },
  args: { items: accordionItems(4), contained: true },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Every row closed, one open at a time: rows that share a name close each other. This is how the home page uses it. */
export const Default: Story = { args: { name: "story-default" } };
/** The first row starts open. Opening another closes it. */
export const SingleOpen: Story = { args: { name: "story-single", openFirst: true } };
/** No shared name: any number of rows can stay open. */
export const MultipleOpen: Story = { args: { openFirst: true } };
