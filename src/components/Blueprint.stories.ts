import type { Meta, StoryObj } from "./storybook/types";
import Blueprint from "./Blueprint.astro";

const meta = { title: "Components/Graphics/Blueprint", component: Blueprint,
  argTypes: {
    ticks: { control: "boolean", description: "Shows a row of 12 tick marks." },
    top: { control: "boolean", description: "Draws the top edge. Off leaves the top edge open." },
  }, tags: ["autodocs"], args: { ticks: false, top: true } } satisfies Meta<typeof Blueprint>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithTicks: Story = { args: { ticks: true } };
