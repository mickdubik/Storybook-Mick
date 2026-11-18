// Runs the site's own contrast check (Portfolio/Core/scripts/check-contrast.mjs, or its copy in site/scripts/),
// so there is one script and it always reads the tokens Storybook is rendering.
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { siteRoot } from "../site.config.mjs";

await import(pathToFileURL(join(siteRoot, "scripts/check-contrast.mjs")).href);
