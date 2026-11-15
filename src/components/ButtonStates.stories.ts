import type { Meta, StoryObj } from "@storybook-astro/framework";
import ButtonStates from "./ButtonStates.astro";

const meta = {
  title: "Components/ButtonStates",
  component: ButtonStates,
  args: { title: "Button states", caption: "Default, hover, focus, pressed, loading, done." },
} satisfies Meta<typeof ButtonStates>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
