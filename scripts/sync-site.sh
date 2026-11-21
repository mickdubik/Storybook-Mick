#!/usr/bin/env bash
# Refresh site/: the copy of the portfolio's source that GitHub Actions builds this Storybook from.
# Locally Storybook reads the live site folder directly, so this only matters for what gets published.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("storybook.config.json","utf8")).site)')
DEST=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("storybook.config.json","utf8")).siteCopy)')
[ -d "$SRC/src" ] || { echo "Site not found at $SRC (set \"site\" in storybook.config.json)"; exit 1; }

mkdir -p "$DEST/scripts"
rsync -a --delete --exclude .DS_Store --exclude _unused "$SRC/src/" "$DEST/src/"
cp "$SRC/scripts/check-contrast.mjs" "$DEST/scripts/"
mkdir -p "$DEST/public/og" && cp "$SRC/public/og/home.png" "$DEST/public/og/"   # the screenshot on Getting started
echo "Synced $SRC/src into $DEST/src."

# Storybook renders the site's components with this project's packages; warn if the versions have drifted.
SRC="$SRC" node -e '
  const fs = require("fs");
  const site = JSON.parse(fs.readFileSync(process.env.SRC + "/package.json", "utf8")).dependencies ?? {};
  const here = JSON.parse(fs.readFileSync("package.json", "utf8")).dependencies ?? {};
  let n = 0;
  for (const [name, v] of Object.entries(site)) if (here[name] !== v) { n++; console.log(`WARN   dependency ${name}: site ${v}, Storybook ${here[name] ?? "missing"} (update package.json here)`); }
  if (!n) console.log("PASS   dependencies match the site");
'
