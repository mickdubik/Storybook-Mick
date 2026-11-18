import type { Meta, StoryObj } from "./storybook/types";
import Navigation from "@site/components/Navigation.astro";
import { navItems } from "@site/data/site";

// The links are the site header's own (src/data/site.ts), as the home page renders them: in-page anchors.
const meta = {
  title: "Components/Navigation",
  component: Navigation,
  argTypes: {
    links: { control: "object", description: "The links: href, label and hideSm (drops out on narrow screens)." },
    label: { control: "text", description: "Accessible name of the nav landmark." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "The header's primary navigation: text links in the secondary colour, signal colour on hover, 44px tall targets. Below 720px the links marked `hideSm` drop out; below 760px the whole row hides and the same links sit in the footer." } },
  },
  args: { links: navItems(true) },
} satisfies Meta<typeof Navigation>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The links as the home page shows them, pointing at sections of the page. */
export const Home: Story = {};
/** The links as every other page shows them, pointing at `/#section` on the home page. */
export const OtherPage: Story = { args: { links: navItems(false) } };
