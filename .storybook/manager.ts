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

// The Foundations pages are reading pages: the Controls, Actions and Accessibility panel only takes a third of the screen from them.
// Close it while one is open and bring it back, as it was, when the viewer moves to any other story.
addons.register("md-website/foundations-panel", (api) => {
  let hid = false;
  const sync = () => setTimeout(() => {
    const onFoundations = api.getCurrentStoryData()?.title?.startsWith("Foundations/") ?? false;
    if (onFoundations && api.getIsPanelShown()) { api.togglePanel(false); hid = true; }
    else if (!onFoundations && hid) { api.togglePanel(true); hid = false; }
  }, 0); // after Storybook has updated the current story, not before
  for (const event of ["storyChanged", "storyPrepared", "storyRendered", "docsRendered"]) api.on(event, sync);
});
