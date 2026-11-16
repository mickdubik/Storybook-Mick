import type { Meta, StoryObj } from "@storybook-astro/framework";
import Page from "./Space.astro";

const meta = { title: "Foundations/Space and shape", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const SpaceAndShape: StoryObj<typeof meta> = {};
