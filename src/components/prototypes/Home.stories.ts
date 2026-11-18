import type { Meta, StoryObj } from "../storybook/types";
import Home from "@site/components/prototypes/Home.astro";

const meta = {
  title: "Prototypes/Home page",
  component: Home,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "The whole home page body, as the site builds it, without the header and footer (see Patterns). Use it to check a change against the real page: hero, why me, current role, selected work, approach, AI workflow and clients. Page scripts (counting figures, the canvas name in the hero) do not run here." } },
  },
} satisfies Meta<typeof Home>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Every section of the home page, in order. */
export const Page: Story = {};
