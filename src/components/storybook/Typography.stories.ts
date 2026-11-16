import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Typography.astro";

const meta = { title: "Foundations/Typography", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
// One story named like its page, so the sidebar shows a single entry instead of a folder with one item. The id stays scales.
export const Scales: StoryObj<typeof meta> = { name: "Typography" };
