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
git commit --allow-empty -m 'deploy'

# push to GitHub Pages production branch
# Use the configured Git credential helper or cloud HTTPS proxy. Never put a
# credential in a URL, command argument, or browser storage. HEAD works with
# either default branch name in the generated repository.
GIT_TERMINAL_PROMPT=0 git push -f https://github.com/kristofanf/paviliun900.git HEAD:production

cd -
