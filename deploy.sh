#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist && cp index.html 404.html

# if you are deploying to a custom domain
echo 'paviliun900.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# push to GitHub Pages production branch
# Uses GITHUB_TOKEN env var or falls back to interactive auth
if [ -n "$GITHUB_TOKEN" ]; then
  git push -f https://kristofanf:${GITHUB_TOKEN}@github.com/kristofanf/paviliun900.git master:production
else
  git push -f https://github.com/kristofanf/paviliun900.git master:production
fi

cd -
