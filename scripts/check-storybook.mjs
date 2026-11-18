// One command for the Storybook organisation checks. Rules: rules/storybook.md.
// Usage:  npm run check:storybook            (static checks, then build, then link check)
//         npm run check:storybook -- --fast  (static checks only, no build)
// Exit code 1 on any ERROR. WARN does not fail.
import { readFileSync, readdirSync, existsSync, statSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { siteSrc } from "../site.config.mjs";

const root = process.cwd();
const cfg = existsSync(join(root, "storybook.config.json")) ? JSON.parse(readFileSync(join(root, "storybook.config.json"), "utf8")) : {};
const storiesDir = join(root, cfg.storiesGlob ?? "src/components");   // stories, mirroring the site's folders
const siteComponents = join(siteSrc, "components");                  // the site's components they render
const noStory = new Set(cfg.noStory ?? []);
const fast = process.argv.includes("--fast");
let errors = 0, warns = 0;
const err = (m) => { errors++; console.log(`ERROR  ${m}`); };
const warn = (m) => { warns++; console.log(`WARN   ${m}`); };
const walk = (d) => readdirSync(d).flatMap((n) => {
  if (n === "node_modules" || n.startsWith(".")) return [];
  const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p];
});

// 1. Every site component has a story at the same path here (site components/X.astro -> src/components/X.stories.ts).
const files = walk(storiesDir);
const rel = (p) => p.slice(root.length + 1);
for (const f of walk(siteComponents).filter((f) => f.endsWith(".astro"))) {
  const name = f.split("/").pop().replace(".astro", "");
  if (noStory.has(name)) continue;
  const story = join(storiesDir, relative(siteComponents, f)).replace(/\.astro$/, ".stories.ts");
  if (!existsSync(story)) warn(`no story for site component components/${relative(siteComponents, f)} (add ${rel(story)}, or list "${name}" in noStory)`);
}

// 2. Titles follow the pattern, stories are tagged for docs, titles are unique.
const titleRe = /^(Getting started|Foundations\/[^/]+|Components\/[^/]+(\/[^/]+)?|Patterns\/[^/]+|Prototypes\/[^/]+|Demos\/[^/]+|Guides\/[^/]+)$/;
const seen = new Map();
for (const f of files.filter((f) => f.endsWith(".stories.ts"))) {
  const src = readFileSync(f, "utf8");
  const title = src.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1];
  if (!title) { err(`${rel(f)}: no title`); continue; }
  if (!titleRe.test(title)) err(`${rel(f)}: title "${title}" breaks the pattern (Components/<Group>/<Component>, Patterns/<Name>, Prototypes/<Name>, Demos/<Name>, Foundations/<Name>, Guides/<Name>; max three levels)`);
  if (seen.has(title)) err(`${rel(f)}: duplicate title "${title}" (also in ${seen.get(title)})`);
  seen.set(title, rel(f));
  const isFoundation = title.startsWith("Foundations/") || title.startsWith("Demos/") || title.startsWith("Prototypes/"); // Foundations pages, demos and prototypes are not component docs
  if (!isFoundation && !/tags:\s*\[[^\]]*["']autodocs["']/.test(src)) warn(`${rel(f)}: missing tags: ["autodocs"]`);
}

// 3. Every top-level group and every title segment is in the storySort order, or it sorts last.
const preview = readFileSync(join(root, ".storybook/preview.ts"), "utf8");
for (const t of seen.keys()) {
  const [top, second] = t.split("/");
  if (!preview.includes(`"${top}"`)) err(`storySort in preview.ts has no "${top}" (needed for "${t}")`);
  else if (second && top !== "Components" && !preview.includes(`"${second}"`)) warn(`"${t}" is not in the storySort order (it will sort last in ${top})`);
}

// 4. Brand placeholder replaced.
if (/__NAME__/.test(readFileSync(join(root, ".storybook/manager.ts"), "utf8"))) err("manager.ts still has the __NAME__ placeholder");

// 5. Contrast.
const c = spawnSync("node", ["scripts/check-contrast.mjs"], { cwd: root, encoding: "utf8" });
if (c.status !== 0) err("colour contrast below AA (run npm run check:contrast)"); else console.log("PASS   contrast");

// 6. Build, "Dropped" stories, and docs links resolve in index.json.
if (!fast) {
  const b = spawnSync("npx", ["storybook", "build", "--quiet"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
  const log = `${b.stdout}\n${b.stderr}`;
  if (b.status !== 0) err("storybook build failed:\n" + log.split("\n").slice(-15).join("\n"));
  for (const l of log.split("\n").filter((l) => /dropped/i.test(l))) err(l.trim());
  const idx = join(root, "storybook-static/index.json");
  if (existsSync(idx)) {
    const ids = new Set(Object.keys(JSON.parse(readFileSync(idx, "utf8")).entries));
    for (const f of walk(join(root, "src")).filter((f) => f.endsWith(".mdx"))) {
      for (const m of readFileSync(f, "utf8").matchAll(/\?path=\/(?:story|docs)\/([a-z0-9-]+)/g)) {
        if (!ids.has(m[1])) err(`${rel(f)}: link to unknown id "${m[1]}"`);
      }
    }
    rmSync(join(root, "storybook-static"), { recursive: true, force: true }); // rule: delete the build afterwards
  }
}

console.log(`\n${errors} error(s), ${warns} warning(s).`);
process.exit(errors ? 1 : 0);
