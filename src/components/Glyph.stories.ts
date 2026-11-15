import type { Meta, StoryObj } from "@storybook-astro/framework";
import Glyph from "./Glyph.astro";

const meta = {
  title: "Components/Glyph",
  component: Glyph,
  args: { metric: { value: "−68", unit: "%", label: "Duplicated components, 167 to 53", kind: "percent", magnitude: 68, direction: "down" } },
} satisfies Meta<typeof Glyph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Percent: Story = {};
export const Share: Story = { args: { metric: { value: "85", unit: "%", label: "Design system adoption", kind: "share", magnitude: 85 } } };
export const Multiple: Story = { args: { metric: { value: "2", unit: "×", label: "Features shipped per sprint", kind: "multiple", magnitude: 2, direction: "up", qualifier: "up to" } } };
export const Score: Story = { args: { metric: { value: "78.3", unit: "", label: "Score vs benchmark", kind: "score", magnitude: 78, benchmark: { value: 60, label: "Industry" } } } };
export const Plain: Story = { args: { metric: { value: "Top 3", unit: "", label: "Ranking", kind: "plain" } } };
