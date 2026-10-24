#!/usr/bin/env sh
# Compatibility entry point; npm run deploy uses the portable Node script.
exec node scripts/deploy.mjs
