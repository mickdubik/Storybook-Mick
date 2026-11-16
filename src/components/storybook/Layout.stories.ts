import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Layout.astro";

const meta = { title: "Foundations/Layout", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
// One story named like its page, so the sidebar shows a single entry instead of a folder with one item. The id stays sheet.
export const Sheet: StoryObj<typeof meta> = { name: "Layout" };
