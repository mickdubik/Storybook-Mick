import type { Meta, StoryObj } from "@storybook-astro/framework";
import SiteFooter from "./SiteFooter.astro";

const meta = {
  title: "Patterns/Site footer",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The back cover of every page: an inverted band with the closing question, the portrait, the availability line, the email and the booking, LinkedIn and resume buttons, then the record of the cases with their headline figures and the full-width sign-off. The figures and links come from `src/data/work.ts` and `src/data/site.ts`. The copy-email button and the sign-off roll are page scripts, so they run on the site but not in this Storybook.",
      },
    },
  },
  args: { home: true },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The footer on the home page, with the default closing question. */
export const Home: Story = {};
/** Any other page: the same footer, with links that go back to the home sections. */
export const OtherPage: Story = { args: { home: false } };
