#!/usr/bin/env bash
# Publish this Storybook. Run ONLY when the owner has said "Publish it". Approval for one publish does not carry to the next.
#   scripts/publish-storybook.sh           sync site/, check, commit locally, DO NOT push
#   scripts/publish-storybook.sh --push    also push (the GitHub Actions workflow then deploys)
set -euo pipefail
cd "$(dirname "$0")/.."

bash scripts/sync-site.sh
# Check against site/, the copy GitHub Actions builds from, not the live site folder.
export SITE_ROOT=site
npm run check:storybook                                  # contrast, structure, build, "Dropped", links
npm run check:a11y                                       # axe on every story, light and dark (needs Google Chrome)
rm -rf storybook-static .astro

git add -A
if git diff --cached --quiet; then echo "Nothing to publish."; exit 0; fi
git status --short
# Commit identity: the project's no-reply address, never the owner's real email. Set it in this repo's git config.
git commit -m "Update Storybook"
if [ "${1:-}" = "--push" ]; then git push; echo "Pushed. Watch the workflow run, then check the live page."; else echo "Committed locally. Not pushed (use --push after the owner confirms)."; fi
