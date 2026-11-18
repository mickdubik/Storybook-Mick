import type { Meta, StoryObj } from "../storybook/types";
import CaseStudyPage from "./CaseStudyPage.astro";
import { study } from "../storybook/data";

const meta = {
  title: "Prototypes/Case study page",
  component: CaseStudyPage,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "A whole case page, as the site builds it from `src/data/work.ts`, without the header and footer (see Patterns): header with facts, In brief, Impact, the chapters with their table of contents, and the pager to the other cases. Page scripts (table-of-contents highlight, before-and-after slider, counting figures) do not run here." } },
  },
  args: { study: study("unbounce-design-system") },
} satisfies Meta<typeof CaseStudyPage>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The design-system case: blueprint marks and the overview image between chapters. */
export const DesignSystem: Story = {};
/** A case with an animated cover and hero. */
export const SmartTraffic: Story = { args: { study: study("unbounce-smart-traffic") } };
/** A case that places its animation inside a chapter. */
export const DocPortal: Story = { args: { study: study("datarobot-self-service-docs") } };
/** The 0-to-1 case, with its own demo. */
export const DoctorOnline: Story = { args: { study: study("doctor-online-launch") } };
