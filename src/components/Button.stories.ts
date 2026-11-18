import type { Meta, StoryObj } from "./storybook/types";
import Button from "./Button.astro";
import { contact } from "../data/site";

const meta = {
  title: "Components/Button/Variants",
  component: Button,
  tags: ["autodocs"],
  // Centre the button in the story canvas, not the top-left corner. The docs page centres its examples in docs.css.
  parameters: { layout: "centered" },
  args: { href: contact.booking, variant: "primary", size: "md", icon: "arrow", slots: { default: "Book a 15-min call" } },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost", "secondary"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
    icon: { control: "inline-radio", options: ["arrow", "external", "down", "none"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

// The button is a link, so it has four states in global.css: default, hover, focus (:focus-visible) and pressed (:active).
// There is no disabled or loading state. The state stories force the real pseudo-class with storybook-addon-pseudo-states.

export const Primary: Story = {};
export const Ghost: Story = { args: { variant: "ghost", icon: "none" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };

/** Hover: the tile expands to fill the button and the label rolls. */
export const PrimaryHover: Story = { parameters: { pseudo: { hover: true } } };
/** Focus: the same end state as hover, for keyboard users. */
export const PrimaryFocus: Story = { parameters: { pseudo: { focusVisible: true } } };
/** Pressed: the button scales to 97%. */
export const PrimaryPressed: Story = { parameters: { pseudo: { active: true } } };

/** Hover: the surface tints, the label rolls and the arrow takes the signal colour. */
export const GhostHover: Story = { args: { variant: "ghost", icon: "arrow" }, parameters: { pseudo: { hover: true } } };
export const GhostFocus: Story = { args: { variant: "ghost", icon: "arrow" }, parameters: { pseudo: { focusVisible: true } } };
export const GhostPressed: Story = { args: { variant: "ghost", icon: "arrow" }, parameters: { pseudo: { active: true } } };

/** Hover: the face never changes; the arrow takes the other theme's signal colour. */
export const SecondaryHover: Story = { args: { variant: "secondary" }, parameters: { pseudo: { hover: true } } };
export const SecondaryFocus: Story = { args: { variant: "secondary" }, parameters: { pseudo: { focusVisible: true } } };
export const SecondaryPressed: Story = { args: { variant: "secondary" }, parameters: { pseudo: { active: true } } };
