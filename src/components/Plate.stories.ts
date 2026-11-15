import type { Meta, StoryObj } from "@storybook-astro/framework";
import Plate from "./Plate.astro";

const meta = {
  title: "Components/Plate",
  component: Plate,
  args: { variant: "traffic", title: "How Smart Traffic works", caption: "Each visitor goes to the variant that fits them best." },
  argTypes: { variant: { control: "inline-radio", options: ["traffic", "tokens", "portal", "care"] } },
} satisfies Meta<typeof Plate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Traffic: Story = {};
export const Tokens: Story = { args: { variant: "tokens", title: "Token layers", caption: "From raw values to components." } };
export const Portal: Story = { args: { variant: "portal", title: "One portal", caption: "Three tools replaced by one." } };
export const Care: Story = { args: { variant: "care", title: "Care at home", caption: "From home to a treatment plan." } };
