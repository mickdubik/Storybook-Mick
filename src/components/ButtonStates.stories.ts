import type { Meta, StoryObj } from "./storybook/types";
import ButtonStates from "@site/components/ButtonStates.astro";
import { buttonStates } from "./storybook/data";

const meta = {
  title: "Components/Button/States demo",
  component: ButtonStates,
  argTypes: {
    title: { control: "text", description: "The frame title." },
    caption: { control: "text", description: "Two-line caption under the frame." },
    note: { control: "text", description: "A longer explanation that does not fit the caption: a paragraph under the frame." },
  },
  tags: ["autodocs"],
  args: buttonStates(),
} satisfies Meta<typeof ButtonStates>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
