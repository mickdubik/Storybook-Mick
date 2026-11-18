import type { Meta, StoryObj } from "./storybook/types";
import Plate from "@site/components/Plate.astro";
import { plate } from "./storybook/data";

// Titles, captions and notes are the real ones from the case studies in src/data/work.ts.
const meta = {
  title: "Components/Graphics/Plate",
  component: Plate,
  tags: ["autodocs"],
  args: plate("traffic"),
  argTypes: { variant: { control: "inline-radio", options: ["traffic", "tokens", "portal", "care"] } },
} satisfies Meta<typeof Plate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Traffic: Story = {};
export const Tokens: Story = { args: plate("tokens") };
export const Portal: Story = { args: plate("portal") };
export const Care: Story = { args: plate("care") };
