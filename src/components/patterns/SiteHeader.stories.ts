import type { Meta, StoryObj } from "../storybook/types";
import SiteHeader from "@site/components/patterns/SiteHeader.astro";

const meta = {
  title: "Patterns/Site header",
  component: SiteHeader,
  argTypes: {
    heroHeader: { control: "boolean", description: "The header sits transparent at the top of the page and turns into the blurred bar once the page scrolls." },
    home: { control: "boolean", description: "On the home page the nav links are in-page anchors; elsewhere they point to /#section." },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The masthead on every page: the MD mark and name, links to the home sections, the theme toggle and the \"Discuss project\" button. It is sticky. On the home page the links are in-page anchors; on other pages they point to `/#section`. The theme toggle and the scroll behaviour are page scripts, so they run on the site but not in this Storybook; use the Theme switch in the toolbar here.",
      },
    },
  },
  args: { home: true, heroHeader: false },
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The header as it is on the home page, with the solid bar. */
export const Home: Story = {};
/** Any other page: the same header, with links that go back to the home sections. */
export const OtherPage: Story = { args: { home: false } };
/** The transparent header that sits over the top of a page until it scrolls. */
export const OverHero: Story = { args: { heroHeader: true } };
