#!/usr/bin/env bash
# Fast GitHub Pages Deployment Script for Trojan Horse Preview Engine
set -euo pipefail

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init -b main
fi

git add -A
git commit -m "deploy: update Trojan Horse dynamic luxury preview" || true

if command -v gh >/dev/null 2>&1; then
  gh repo create trojan-horse-preview --public --source=. --push || git push -u origin main
  OWNER=$(gh api user -q .login)
  gh api -X POST "/repos/${OWNER}/trojan-horse-preview/pages" -F "source[branch]=main" -F "source[path]=/" || true
  echo "Live GitHub Pages URL: https://${OWNER}.github.io/trojan-horse-preview/?brand={BRAND}&niche={NICHE}"
else
  echo "Git repository initialized on branch 'main'. Push to GitHub or use the active local/tunnel HTTP server on port 8080."
fi
