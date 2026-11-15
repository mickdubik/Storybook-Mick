import type { Meta, StoryObj } from "@storybook-astro/framework";
import Demo from "./DoctorOnlineDemo.astro";

const meta = { title: "Demos/DoctorOnline", component: Demo, args: { bare: false } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Framed: Story = {};
export const Bare: Story = { args: { bare: true } };
