import type { Meta, StoryObj } from "./types";
import Page from "./Typography.astro";

const meta = { title: "Foundations/Typography", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
// The page, then its tokens (owner, 2026-11-21: tokens sit inside each group). The first id stays scales.
export const Scales: StoryObj<typeof meta> = { name: "Overview" };
export const Tokens: StoryObj<typeof meta> = { args: { view: "tokens" } };
