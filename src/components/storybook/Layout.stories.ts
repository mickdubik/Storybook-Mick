import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Layout.astro";

const meta = { title: "Foundations/Layout", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Sheet: StoryObj<typeof meta> = {};
