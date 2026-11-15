import type { Meta, StoryObj } from "@storybook-astro/framework";
import Button from "./Button.astro";
import { contact } from "../data/site";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { href: contact.booking, variant: "primary", size: "md", icon: "arrow", slots: { default: "Book a 15-min call" } },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost", "secondary"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
    icon: { control: "inline-radio", options: ["arrow", "external", "down", "none"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Ghost: Story = { args: { variant: "ghost", icon: "none" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
