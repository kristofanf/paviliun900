# CMS bug fixes implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task.

**Goal:** Fix the defects reproduced in the architecture review.

**Architecture:** Preserve the live Unit form during uploads. Reject deletion of referenced images. Use a shared concrete process launcher and a Node publication script to remove Windows shell assumptions.

**Tech stack:** Vue, plain browser JavaScript, Express, Node test runner, Playwright.

**Spec:** User-authorized fixes to the reviewed bugs, 2026-10-24.

## Constraints

- No real publication, pushes, or credential changes during verification.
- Keep existing content and booking links intact.
- Work in the existing clean checkout; leave changes uncommitted for review.
- Referenced-image deletion returns 409 and leaves files/content untouched.

## Review focus

- Existing/new/copied Unit forms retain edits during upload and upload failures.
- Late upload completion must not modify a different editor.
- Homepage and Unit image references both prevent deletion.
- Deployment handles paths with spaces, uses no credential-bearing shell strings, and stops on failure.
- Publication tests work on Windows without Unix which, sh, or PATH separators.

## Tasks

1. Add browser regressions for edit/copy/create/upload/save, booking-link preservation, and upload failure; observe failures. Update only photo choices during upload, retain the rest of the form, and initialize copied drafts synchronously.
2. Add real HTTP tests for Unit/hero/about references and deletion after references are removed; observe failures. Protect referenced images in the deletion route.
3. Add real process tests for npm launch and safe arguments, plus publication tests against disposable directories; observe failures. Add scripts/commands.mjs and scripts/deploy.mjs, update admin and package deployment entry points, and retain deploy.sh as a compatibility launcher.
4. Run npm test, browser tests, production build, and diff checks. Request an independent final review, fix substantive findings, and report remaining environment limits.

## Execution record

- Baseline: 14/15 Node tests pass; Unix-only publication test fails on Windows. Build passes with stale dependencies. Browser runner initially unavailable.
- Root causes already reproduced: upload rerenders saved Unit; deletion ignores references; shell:false cannot directly launch Windows npm.
- Complete: browser regressions first failed on existing/new/copied upload flows; all now pass. Copy initializes synchronously, uploads update only the original photo grid, and booking links survive saves.
- Complete: referenced deletion regression first failed (200 instead of 409). Independent review found a case-variant Windows bypass; uppercase regression failed before consistent case-folded protection, then passed.
- Complete: npm execution uses Node for Windows command scripts; publication uses Node filesystem/process operations. Real Git operations run in disposable fixtures; all remote pushes are intercepted. Failure checks cover build and every Git step.
- Final verification: npm test 17/17; browser suite in installed Chrome 11/11; npm run build passes; git diff --check passes; npm ci --ignore-scripts matches the lockfile and reports 0 known vulnerabilities.
- Environment limit: validation used installed Node 26.4.0; the repository pins Node 24.22.1. No remote publication performed.
- Security follow-up: built output has no CMS/config credential filenames or known CMS credential markers; no commits in available history touch .env, .env.local, or scripts/.auth.json. This is a scoped check, not an exhaustive secret-history audit.
- Independent re-review: no further substantive issues.
