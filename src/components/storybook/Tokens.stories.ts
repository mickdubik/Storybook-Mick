import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Tokens.astro";

const meta = { title: "Foundations/Tokens", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Reference: StoryObj<typeof meta> = {};
