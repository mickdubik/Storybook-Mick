import type { Meta, StoryObj } from "../storybook/types";
import Demo from "./DocPortalDemo.astro";

const meta = { title: "Demos/DocPortal", component: Demo,
  argTypes: {
    bare: { control: "boolean", description: "The home-card version: no frame padding." },
    backdrop: { control: "boolean", description: "The decorative, frameless hero version that plays once and rests." },
    stack: { control: "boolean", description: "With backdrop: three screens drop in and rest as a stack." },
    sizes: { control: "text", description: "The sizes attribute of the images." },
  }, args: { bare: false } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
/** The framed demo for the Doc portal case: six Figma screens of the DataRobot documentation portal replacing each other in hard cuts, with a replay button. */
export const Framed: Story = {};
/** The home-card version, with no frame padding. */
export const Bare: Story = { args: { bare: true } };
