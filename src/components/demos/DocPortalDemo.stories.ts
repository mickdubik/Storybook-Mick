import type { Meta, StoryObj } from "@storybook-astro/framework";
import Demo from "./DocPortalDemo.astro";

const meta = { title: "Demos/DocPortal", component: Demo, args: { bare: false } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Framed: Story = {};
export const Bare: Story = { args: { bare: true } };
