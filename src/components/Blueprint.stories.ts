import type { Meta, StoryObj } from "@storybook-astro/framework";
import Blueprint from "./Blueprint.astro";

const meta = { title: "Components/Blueprint", component: Blueprint, args: { ticks: false, top: true } } satisfies Meta<typeof Blueprint>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithTicks: Story = { args: { ticks: true } };
