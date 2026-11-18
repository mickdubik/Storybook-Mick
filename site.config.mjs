// Where the portfolio site's source lives. Stories import the site's own components as "@site/...".
// - On this Mac: the live site ("site" in storybook.config.json, ../Portfolio/Core), so an edit there shows up at once.
// - In GitHub Actions, or with SITE_ROOT=site: the committed copy in ./site, refreshed by scripts/sync-site.sh.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(resolve(here, "storybook.config.json"), "utf8"));
const live = resolve(here, cfg.site);
const copy = resolve(here, cfg.siteCopy);

export const siteRoot = process.env.SITE_ROOT
  ? resolve(here, process.env.SITE_ROOT)
  : existsSync(resolve(live, "src")) ? live : copy;
export const siteSrc = resolve(siteRoot, "src");
