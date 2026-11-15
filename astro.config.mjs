// @ts-check
import { defineConfig } from "astro/config";

// `site` makes canonical, og:url and og:image absolute. Change it if the production domain changes.
export default defineConfig({
  site: "https://mickdubik.vercel.app",
  server: { port: 4322 },
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
});
