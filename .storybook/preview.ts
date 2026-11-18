import type { Preview } from "@storybook-astro/framework";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "../src/styles/global.css";
import "./docs.css";

// Same switch the site uses: data-theme="dark" on <html> (see src/layouts/Base.astro).
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (story, context) => {
      if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", context.globals.theme ?? "light");
      return story();
    },
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disabled: true },
    // Docs pages: let each example be as tall as its content, not a fixed 400px box (docs.css centres it).
    docs: { story: { height: "auto" } },
    options: { storySort: {
        order: [
          "Getting started",
          "Foundations", ["Tokens", "Colour", ["Semantic", "Primitives"], "Typography", "Space and shape", "Layout", "Motion"],
          "Components", ["Button", ["Variants", "States demo"], "Link", "Navigation", "Media", ["Shot", "Portrait"], "Graphics", ["Logo", "Glyph", "Plate", "Blueprint"], "Content", ["Accordion", "Availability", "Tags"], "Data", ["Results table", "Comparison table"], "Layout", ["Card"]],
          "Patterns", ["Site header", "Site footer", "Case card", "Impact band", "Case chapter"],
          "Prototypes", ["Home page", "Case study page"],
          "Demos", ["SmartTraffic", "DocPortal", "DoctorOnline"],
          "Guides", ["Toolkit", "What's next"],
        ],
      },
    },
  },
};
export default preview;
