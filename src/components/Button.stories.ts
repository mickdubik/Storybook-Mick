import type { Meta, StoryObj } from "@storybook-astro/framework";
import Button from "./Button.astro";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { href: "#", variant: "primary", size: "md", icon: "arrow", slots: { default: "Get in touch" } },
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
