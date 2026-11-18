import type { Meta, StoryObj } from "./storybook/types";
import Avail from "@site/components/Avail.astro";

const meta = { title: "Components/Content/Availability", component: Avail, tags: ["autodocs"], parameters: { docs: { description: { component: "The availability line used in the site footer: \"Open to new projects in 2027\". The year ticks over like an odometer the first time it scrolls into view; reduced motion shows it still. Change the wording or year in `availability` in `src/data/site.ts`." } } } } satisfies Meta<typeof Avail>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
