import type { Meta, StoryObj } from "./storybook/types";
import Shot from "./Shot.astro";
import { image } from "./storybook/data";

// A real case image, self-hosted through assets/work/manifest.json.
const meta = {
  title: "Components/Media/Shot",
  component: Shot,
  argTypes: {
    img: { control: false, description: "The image, from src/data/work.ts." },
    sizes: { control: "text", description: "The sizes attribute of the image." },
    eager: { control: "boolean", description: "Loads the image at once instead of lazily." },
    bare: { control: "boolean", description: "No canvas, just the image with one radius and a hairline (home previews)." },
    fitAr: { control: "number", description: "Size the width as if the image had this aspect ratio, so a pair of screens line up." },
  },
  tags: ["autodocs"],
  args: { img: image("Doc%20Portal%20_%20Search.webp"), bare: false, eager: true },
} satisfies Meta<typeof Shot>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The one frame for every product image. */
export const Framed: Story = {};
/** Home cards: the image carries the one radius and hairline. */
export const Bare: Story = { args: { bare: true } };
