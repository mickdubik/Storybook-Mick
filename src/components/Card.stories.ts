import type { Meta, StoryObj } from "@storybook-astro/framework";
import Card from "./Card.astro";
import { impactCardHtml, impactNote } from "./storybook/data";

// The copy is the real AI-impact tiles from src/data/site.ts, as on the home page.
const meta = {
  title: "Components/Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A surface: one tone off the page, a hairline, a 12px corner and no shadow. The content is slotted in, using the card's own classes: `card__kicker`, `card__figure`, `card__label`, `card__note`. A card carries no interaction, so put a link or a button inside it if it should be clickable. Use `as=\"li\"` inside a list. The home page uses it for the two AI-impact tiles.",
      },
    },
  },
  argTypes: { as: { control: "inline-radio", options: ["div", "li", "article", "section"] } },
  args: { as: "div", slots: { default: impactCardHtml(true) } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A kicker, a big figure, a label and a note: the shape of a metric tile. */
export const Figure: Story = {};
/** The same card with a statement in place of a figure, and the diamond that marks a human call. */
export const Statement: Story = { args: { slots: { default: impactCardHtml(false) } } };
/** A card is allowed to be nothing more than a surface. */
export const SurfaceOnly: Story = { args: { slots: { default: `<p class="card__label">${impactNote()}</p>` } } };
