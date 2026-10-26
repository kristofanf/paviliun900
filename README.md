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

Open <http://127.0.0.1:3456> on the computer running `npm run admin`.
A public source repository lets others read or run their own copy of the CMS;
it does not expose your local CMS. GitHub Pages cannot run the Node CMS.
Do not expose this loopback listener with a public tunnel or proxy.

The CMS supports JPEG, PNG, WebP, and GIF images. Uploaded images receive unique
filenames. Settings saves preserve custom facility/rule lists and reject invalid
content. Old browser-stored GitHub tokens and admin sessions are cleared on load;
the old `scripts/.auth.json` file is no longer used.
Images used by a unit, the hero, or the about section cannot be deleted until
those references are removed. Inline unit photo uploads preserve unsaved edits
and select the new photos. Editing or copying a unit preserves its booking links.

## Public frontend

The public Vue site follows the Monochrome Residence design: full-width photo
heroes, generous white space, shared navigation, short stays and long-term
rental comparisons, unit details, and a keyboard-accessible photo viewer.
Content and prices still come from `src/data/settings.json` and
`src/data/units.json`. New photographs remain accessible under All photos;
room filters use only explicitly classified images.

Run `npm run dev` for a local preview. Finite entrance/reveal animations respect
the visitor's reduced-motion preference. Lora Regular and DM Sans are self-hosted
under `public/fonts/`, with their SIL Open Font License files included alongside
them. These freely licensed fonts substitute for the commercial mockup fonts.
Design references and captured previews live in the ignored `design-mockups/`
folder and are not included in GitHub Pages builds.

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
Deployment runs through Node on Windows, macOS, and Linux; it does not require
a Unix shell. Git must be installed and configured with your commit identity
and repository push access.
