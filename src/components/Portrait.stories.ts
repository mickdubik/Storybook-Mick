import type { Meta, StoryObj } from "./storybook/types";
import Portrait from "./Portrait.astro";

const meta = {
  title: "Components/Media/Portrait",
  component: Portrait,
  argTypes: {
    widths: { control: "object", description: "The image widths, in pixels, to generate." },
    sizes: { control: "text", description: "The sizes attribute of the image." },
    eager: { control: "boolean", description: "Loads the image at once instead of lazily." },
    class: { control: "text", description: "An extra class on the image." },
  }, tags: ["autodocs"],
  args: { widths: [320, 640], sizes: "320px", eager: true },
} satisfies Meta<typeof Portrait>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
