import type { Meta, StoryObj } from "@storybook-astro/framework";
import Shot from "./Shot.astro";

const img = { src: "https://cdn.example/661867028444ce38e1184b80_Doc%20Portal%20_%20Search.webp", alt: "Documentation portal search results", w: 2600, h: 1788 };
const meta = {
  title: "Components/Shot",
  component: Shot,
  args: { img, bare: false, eager: true },
} satisfies Meta<typeof Shot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Framed: Story = {};
export const Bare: Story = { args: { bare: true } };
