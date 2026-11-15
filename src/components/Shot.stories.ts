import type { Meta, StoryObj } from "@storybook-astro/framework";
import Shot from "./Shot.astro";
import { image } from "./storybook/data";

// A real case image, self-hosted through assets/work/manifest.json.
const meta = {
  title: "Components/Shot",
  component: Shot,
  tags: ["autodocs"],
  args: { img: image("Doc%20Portal%20_%20Search.webp"), bare: false, eager: true },
} satisfies Meta<typeof Shot>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The one frame for every product image. */
export const Framed: Story = {};
/** Home cards: the image carries the one radius and hairline. */
export const Bare: Story = { args: { bare: true } };
