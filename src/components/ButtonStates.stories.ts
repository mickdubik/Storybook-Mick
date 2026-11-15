import type { Meta, StoryObj } from "@storybook-astro/framework";
import ButtonStates from "./ButtonStates.astro";
import { buttonStates } from "./storybook/data";

const meta = {
  title: "Components/ButtonStates",
  component: ButtonStates,
  tags: ["autodocs"],
  args: buttonStates(),
} satisfies Meta<typeof ButtonStates>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
