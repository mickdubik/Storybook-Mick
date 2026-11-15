import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Motion.astro";

const meta = { title: "Foundations/Motion", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Tokens: StoryObj<typeof meta> = {};
