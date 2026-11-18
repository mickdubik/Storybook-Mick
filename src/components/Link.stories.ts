import type { Meta, StoryObj } from "./storybook/types";
import Link from "./Link.astro";
import { allWork } from "../data/site";

// The link text and address are the real "All work" link at the start of a case page's breadcrumb (src/data/site.ts).
const meta = {
  title: "Components/Link",
  component: Link,
  argTypes: {
    href: { control: "text", description: "Where the link goes." },
    class: { control: "text", description: "An extra class." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "An inline text link: a one-pixel underline in the text colour that turns to the signal colour on hover. For an action, use Button." } },
  },
  args: { href: allWork.href, slots: { default: allWork.label } },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The link at rest, in running text or a breadcrumb. */
export const Default: Story = {};
/** Hover: the text takes the signal colour. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
