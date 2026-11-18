import type { Meta, StoryObj } from "./types";
import Page from "./Space.astro";

const meta = { title: "Foundations/Space and shape", component: Page, parameters: { layout: "padded" } } satisfies Meta<typeof Page>;
export default meta;
// The sidebar title-cases the export name ("Space And Shape"); name sets the sentence case used everywhere else. The id stays space-and-shape.
export const SpaceAndShape: StoryObj<typeof meta> = { name: "Space and shape" };
