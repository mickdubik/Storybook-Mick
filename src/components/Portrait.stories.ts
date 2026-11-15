import type { Meta, StoryObj } from "@storybook-astro/framework";
import Portrait from "./Portrait.astro";

const meta = {
  title: "Components/Portrait",
  component: Portrait, tags: ["autodocs"],
  args: { widths: [320, 640], sizes: "320px", eager: true },
} satisfies Meta<typeof Portrait>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
