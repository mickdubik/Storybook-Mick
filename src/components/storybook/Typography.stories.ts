import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Typography.astro";

const meta = { title: "Foundations/Typography", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Scales: StoryObj<typeof meta> = {};
