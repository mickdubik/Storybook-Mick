import type { Preview } from "@storybook-astro/framework";
import { addons } from "storybook/preview-api";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@site/styles/global.css";
import "./docs.css";

// Links that leave Storybook open in a new browser tab (owner, 2026-11-21). Storybook's own links (?path=, #anchors,
// iframe.html) and mail/phone links are left alone. A site path such as /work/<slug> would load inside Storybook and
// break, so it opens on the live site instead. Guarded: the static build renders this file in Node.
const SITE = "https://mickdubik.vercel.app";
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    const raw = a?.getAttribute("href") ?? "";
    if (!a || !raw || raw.startsWith("?") || /^(mailto|tel|sms|javascript):/i.test(raw)) return;
    // A #section on this page scrolls as usual; one that only exists on the site (the header's #work) opens there.
    if (raw.startsWith("#") && (raw === "#" || document.getElementById(decodeURIComponent(raw.slice(1))))) return;
    let url = raw.startsWith("#") ? new URL(`/${raw}`, SITE) : new URL(raw, location.href);
    if (url.origin === location.origin) {
      if (url.pathname.endsWith("iframe.html") || url.searchParams.has("path") || url.searchParams.has("id")) return;
      url = new URL(url.pathname + url.search + url.hash, SITE);
    }
    e.preventDefault();
    window.open(url.href, "_blank", "noopener");
  });
}

// Same switch the site uses: data-theme="dark" on <html> (see src/layouts/Base.astro).
// A docs page with no story on it (Getting started, Tokens, Guides) never runs the decorator below, so without this the page
// would follow the system setting and ignore the toolbar. Guarded: the static build loads this file in Node, where there is no window.
const setTheme = (t?: string) => document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
if (typeof window !== "undefined") {
  setTheme("light");
  const channel = addons.getChannel();
  for (const event of ["setGlobals", "globalsUpdated"]) channel.on(event, (e: { globals?: { theme?: string } }) => e?.globals?.theme && setTheme(e.globals.theme));
  // A plain <a href="?path=/..."> in a story page (the Foundations "Read next" lists) would load the bare preview; send it to the manager instead.
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="?path="]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    channel.emit("navigateUrl", a.getAttribute("href"), { target: "_self" });
  });
}
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
      if (typeof document !== "undefined") setTheme(context.globals.theme);
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
          "Foundations", ["Colour", ["Primitives", "Semantic", "Tokens"], "Typography", ["Overview", "Tokens"], "Space and shape", ["Overview", "Tokens"], "Layout", ["Overview", "Tokens"], "Motion", ["Overview", "Tokens"]],
          "Components", ["Button", ["Variants", "States demo", "Tokens"], "Link", "Navigation", "Media", ["Shot", "Portrait"], "Graphics", ["Logo", "Glyph", "Plate", "Blueprint"], "Content", ["Accordion", "Availability", "Tags"], "Data", ["Results table", "Comparison table"], "Layout", ["Card"]],
          "Patterns", ["Site header", "Site footer", "Case card", "Impact band", "Case chapter"],
          "Prototypes", ["Home page", "Case study page"],
          "Demos", ["SmartTraffic", "DocPortal", "DoctorOnline"],
          "Guides", ["Do and don't", "Toolkit", "What's next"],
        ],
      },
    },
  },
};
export default preview;
