import type { Meta, StoryObj } from "../storybook/types";
import Demo from "@site/components/demos/SmartTrafficDemo.astro";

const meta = { title: "Demos/SmartTraffic", component: Demo,
  argTypes: {
    bare: { control: "boolean", description: "The home-card version: no frame padding and no caption." },
    backdrop: { control: "boolean", description: "The decorative, frameless hero version that plays once and rests." },
    caption: { control: "text", description: "Caption under the frame." },
  }, args: { bare: false } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
/** The framed demo for the Smart Traffic case: the Unbounce All Pages list zooming to the numbers and the Page Performance popover, with a replay button. */
export const Framed: Story = {};
/** The home-card version, with no frame padding. */
export const Bare: Story = { args: { bare: true } };
