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
    options: { storySort: { order: ["Getting started", "Foundations", "Components", "Demos", "Toolkit", "What's next"] } },
  },
};
export default preview;
