// @ts-check
import { defineConfig } from "astro/config";
import { searchForWorkspaceRoot } from "vite";
import { siteRoot, siteSrc } from "./site.config.mjs";

// "@site/..." points at the portfolio's src/ (see site.config.mjs). It is a Vite plugin, not resolve.alias, because
// the Astro Storybook framework loads only the plugins from this file into its story render server.
const site = {
  name: "storybook-site-alias",
  enforce: /** @type {const} */ ("pre"),
  config: () => ({
    resolve: { alias: [{ find: /^@site\//, replacement: `${siteSrc}/` }], dedupe: ["astro"] },
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), siteRoot] } },
  }),
};

// Same settings as the site, so components render as they do there.
export default defineConfig({
  site: "https://mickdubik.vercel.app",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  vite: { plugins: [site] },
});
