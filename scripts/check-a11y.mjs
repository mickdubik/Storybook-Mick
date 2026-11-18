// Accessibility check on the built Storybook: runs axe-core on every story, in light and dark.
// Serious and critical violations are ERRORs (exit 1); moderate and minor are WARNs.
// Needs Google Chrome (playwright-core drives the installed one, nothing is downloaded).
// Usage: npm run check:a11y           (builds Storybook first, deletes the build afterwards)
//        npm run check:a11y -- --no-build   (use an existing storybook-static/)
import { readFileSync, existsSync, rmSync, createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname, normalize } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

const root = process.cwd();
const out = join(root, "storybook-static");
const build = !process.argv.includes("--no-build");
const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
let errors = 0, warns = 0, known = 0;

// Findings the owner has accepted, each with its source. They are still printed (as KNOWN) and never hidden;
// they do not fail the check. Add one only with a written reason from the owner or the rules.
const accepted = [
  { rule: "color-contrast", closest: ".case__link", reason: "case cards sit back at 40% until one leads or is hovered (owner choice 2026-10-22, noted in CaseCard.astro)" },
  { rule: "color-contrast", closest: ".end__mark", reason: "the footer sign-off is decorative: aria-hidden, large, not read as content (SiteFooter.astro)" },
];

if (build) {
  const b = spawnSync("npx", ["storybook", "build", "--quiet"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
  if (b.status !== 0) { console.log("ERROR  storybook build failed\n" + `${b.stdout}\n${b.stderr}`.split("\n").slice(-15).join("\n")); process.exit(1); }
}

const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".gif": "image/gif", ".ico": "image/x-icon" };
const server = createServer((req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let f = join(out, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": types[extname(f)] ?? "application/octet-stream" });
  createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const entries = Object.values(JSON.parse(readFileSync(join(out, "index.json"), "utf8")).entries).filter((e) => e.type === "story");
let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch (e) {
  console.log("ERROR  could not start Google Chrome: " + e.message.split("\n")[0]);
  process.exit(1);
}
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const seen = new Set();
for (const theme of ["light", "dark"]) {
  for (const e of entries) {
    await page.goto(`${base}/iframe.html?id=${e.id}&viewMode=story&globals=theme:${theme}`, { waitUntil: "load" });
    try { await page.waitForSelector("body.sb-show-main", { timeout: 15000 }); } catch { errors++; console.log(`ERROR  ${e.title} / ${e.name} (${theme}): did not render`); continue; }
    // Let entrance animations finish, so colours are measured at rest and not mid-fade. Infinite and scroll-driven ones are left alone.
    await page.evaluate(() => Promise.race([
      Promise.all(document.getAnimations()
        .filter((a) => a.timeline instanceof DocumentTimeline && a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 5000)),
    ]));
    await page.waitForTimeout(200);
    await page.addScriptTag({ content: axeSource });
    // Storybook's own a11y addon may be running axe in the same page; wait for it, then run ours.
    let res;
    for (let i = 0; i < 20 && !res; i++) {
      try {
        res = await page.evaluate(async (accepted) => {
          const r = await axe.run("#storybook-root", { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
          // Split each violation's nodes into open ones and accepted ones, by rule and nearest ancestor.
          return r.violations.map((v) => {
            const open = [], kept = [];
            for (const n of v.nodes) {
              const el = document.querySelector(n.target[n.target.length - 1]);
              const a = accepted.find((x) => x.rule === v.id && el?.closest(x.closest));
              (a ? kept : open).push(a ? { target: n.target, reason: a.reason } : { target: n.target });
            }
            return { id: v.id, impact: v.impact, help: v.help, open, kept };
          });
        }, accepted);
      } catch (err) {
        if (!/already running/.test(err.message)) throw err;
        await page.waitForTimeout(500);
      }
    }
    if (!res) { errors++; console.log(`ERROR  ${e.title} / ${e.name} (${theme}): axe did not finish`); continue; }
    for (const v of res) {
      if (v.kept.length && !seen.has(`${e.id}|${v.id}|kept`)) {
        seen.add(`${e.id}|${v.id}|kept`); known++;
        console.log(`KNOWN  ${e.title} / ${e.name}: ${v.id} on ${v.kept.length} element(s), accepted: ${v.kept[0].reason}`);
      }
      if (!v.open.length) continue;
      const key = `${e.id}|${v.id}`;
      if (seen.has(key)) continue; // same rule on the same story in both themes: report once
      seen.add(key);
      const hard = v.impact === "serious" || v.impact === "critical";
      hard ? errors++ : warns++;
      const where = v.open[0]?.target?.join(" ") ?? "";
      console.log(`${hard ? "ERROR" : "WARN "}  ${e.title} / ${e.name} (${theme}): ${v.id} [${v.impact}] ${v.help} — ${v.open.length} element(s), e.g. ${where}`);
    }
  }
}
await browser.close();
server.close();
if (build) rmSync(out, { recursive: true, force: true });
console.log(`\n${entries.length} stories x 2 themes. ${errors} error(s), ${warns} warning(s), ${known} accepted.`);
process.exit(errors ? 1 : 0);
