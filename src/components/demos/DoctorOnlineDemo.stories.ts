import type { Meta, StoryObj } from "../storybook/types";
import Demo from "./DoctorOnlineDemo.astro";

const meta = { title: "Demos/DoctorOnline", component: Demo,
  argTypes: {
    bare: { control: "boolean", description: "The home-card version: no frame padding." },
    backdrop: { control: "boolean", description: "The decorative, frameless hero version that plays once and rests." },
    sizes: { control: "text", description: "The sizes attribute of the images." },
  }, args: { bare: false } } satisfies Meta<typeof Demo>;
export default meta;
type Story = StoryObj<typeof meta>;
/** The framed demo for the Doctor Online case: ten product screens drifting in five columns, with a replay button. */
export const Framed: Story = {};
/** The home-card version, with no frame padding. */
export const Bare: Story = { args: { bare: true } };
