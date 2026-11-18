import type { Meta, StoryObj } from "./storybook/types";
import Logo from "@site/components/Logo.astro";

// The lockup as the site header shows it: the owner's MD mark and the name, with the defaults the component carries.
const meta = {
  title: "Components/Graphics/Logo",
  component: Logo,
  argTypes: {
    href: { control: "text", description: "Where the logo links to." },
    label: { control: "text", description: "Accessible name of the link. Hidden-name phones (345px and below) get only this." },
    name: { control: "text", description: "The visible name next to the mark." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "The lockup in the site header: the MD mark and the name, baseline-aligned, one link home. On very narrow phones (345px and below) the name hides and the link keeps its accessible name." } },
  },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The lockup at rest. */
export const Default: Story = {};
/** Hover: the mark takes the signal colour. */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
/** Focus: the link shows its focus ring for keyboard users. */
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };
