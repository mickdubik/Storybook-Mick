import type { Meta, StoryObj } from "./types";
import Page from "./Colours.astro";

const meta = { title: "Foundations/Colour", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Semantic: StoryObj<typeof meta> = { args: { view: "semantic" } };
export const Primitives: StoryObj<typeof meta> = { args: { view: "primitives" } };
