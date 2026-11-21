import type { Meta, StoryObj } from "./types";
import Page from "./TokenTable.astro";

// The button's own (component-tier) tokens, beside its variants.
const meta = { title: "Components/Button/Tokens", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
export const Tokens: StoryObj<typeof meta> = { args: { area: "Button" } };
