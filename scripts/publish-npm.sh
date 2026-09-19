#!/usr/bin/env bash
# Publish @capitalflowdesk/mcp-unlockflow to npm (scoped, public).
# Requires: npm login / NPM_TOKEN with publish rights on @capitalflowdesk
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> npm whoami"
if ! npm whoami; then
  echo ""
  echo "BLOCKER: not authenticated to npm."
  echo "  Fix: npm login   OR   export NPM_TOKEN=npm_... and"
  echo "       echo \"//registry.npmjs.org/:_authToken=\${NPM_TOKEN}\" >> ~/.npmrc"
  echo "  Then claim/create org scope @capitalflowdesk if needed:"
  echo "       https://www.npmjs.com/org/create"
  echo "  Re-run: npm run publish:npm"
  exit 1
fi

echo "==> dry-run pack"
npm pack --dry-run

VERSION=$(node -p "require('./package.json').version")
NAME=$(node -p "require('./package.json').name")
echo "==> publishing ${NAME}@${VERSION} --access public"
npm publish --access public

echo "==> verify"
npm view "${NAME}" version
echo "PUBLISH_OK ${NAME}@$(npm view "${NAME}" version)"
