import type { Meta, StoryObj } from "@storybook-astro/framework";
import Avail from "./Avail.astro";

const meta = { title: "Components/Avail", component: Avail } satisfies Meta<typeof Avail>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
