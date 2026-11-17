import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

// Brand shown in the sidebar and the browser tab. Follows the viewer's system light / dark setting, as Storybook does by default.
const dark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: create({
    base: dark ? "dark" : "light",
    brandTitle: "MD website Design System",
    brandUrl: "https://mickdubik.vercel.app",
    brandTarget: "_blank",
  }),
});

// Storybook writes "<story> ⋅ Storybook" into the tab title itself; swap the suffix for the brand.
if (typeof document !== "undefined") {
  const BRAND = "MD website Design System";
  const fix = () => {
    const t = document.title;
    if (t.endsWith("⋅ Storybook")) document.title = t.replace(/⋅ Storybook$/, `⋅ ${BRAND}`);
    else if (t === "Storybook") document.title = BRAND;
  };
  new MutationObserver(fix).observe(document.querySelector("title") ?? document.head, { childList: true, subtree: true, characterData: true });
  fix();
}
