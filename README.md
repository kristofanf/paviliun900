# Paviliun 900

Vue 3/Vuetify website with a local content management service.

## Development

Use **Node.js 24.22.1 LTS (Krypton)**, pinned in `.nvmrc` and `.node-version`.
With nvm installed, run `nvm install` and `nvm use`.

```sh
npm ci
npm run dev
```

`npm run build` creates `dist`; `npm run preview` serves that production build.
Unit detail and photo gallery URLs include the unit ID, so they can be shared
and refreshed without relying on browser storage.

## Local CMS

Set `ADMIN_PASS` to a unique password of at least 12 characters in your process
environment or an ignored `.env.local` file, then run:

```sh
npm run admin
```

The CMS listens on loopback port 3456. It refuses to start without a configured
password and never prints it. Authentication uses HttpOnly, SameSite=Strict
cookies with an eight-hour lifetime. Logout, process restart, or a password change
followed by restart invalidates sessions. Failed logins are throttled.
Keep this administrative service private; the public website is the static build.

The CMS supports JPEG, PNG, WebP, and GIF images. Uploaded images receive unique
filenames. Settings saves preserve custom facility/rule lists and reject invalid
content. Old browser-stored GitHub tokens and admin sessions are cleared on load;
the old `scripts/.auth.json` file is no longer used.

## Checks

```sh
npm test
npm run test:browser
npm run build
npm audit
```

The API/security suite uses disposable data directories and stubs deployment.
Browser tests check navigation, stored HTML handling, login/logout, settings saves,
and deployment failure reporting without making remote pushes.

Browser tests use `/usr/bin/chromium` when present. Otherwise install Chromium
with `npx playwright install chromium`, or set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to your existing Chromium executable.

## Deployment

Configure Git authentication through your credential helper or the cloud HTTPS
proxy. The CMS no longer accepts or stores GitHub tokens in the browser or puts
credentials in shell commands/URLs. A read-only Git check does not prove push
permission: configure write access before using deployment.

The CMS commits its content paths, pushes the source to `master`, builds the
website, and publishes `dist` to the `production` branch. Failures stop the
sequence and appear as failures in the UI. No-change retries still build and
publish. `npm run deploy` builds and publishes the static site directly.
