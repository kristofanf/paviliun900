# Monochrome frontend implementation plan

> **For agentic workers:** Execute the approved design with test-first behaviour checks, separate file ownership, and independent final review.

**Goal:** Apply the approved Monochrome Residence mockups to the public Vue frontend.

**Authority:** User approved the homepage hero, consistent detail/gallery concepts, then explicitly requested implementation. Stable targets: ignored `design-mockups/monochrome-residence/01-homepage-hero.png`, `02-homepage-spaces.png`, `03-homepage-neighbourhood-stories.png`, `04-short-stay-detail.png`, `05-long-term-detail.png`, `06-gallery.png`, `07-mobile-homepage-hero.png`.

**Architecture:** Existing Vue 3 Composition API and routes. Semantic native controls replace heavy presentational markup. Shared global tokens, header/footer, image helpers and finite reveal behaviour. CMS JSON remains the only factual source. Existing backend fixes remain untouched.

## Component map and ownership

- Controller: App/main/global CSS, SiteHeader (shared overlay navigation and accessible mobile menu), FooterSection (all official contacts and warning), RevealBlock (finite motion with cleanup), property presentation utilities, router scroll behaviour, self-hosted OFL fonts, browser regressions and integration QA.
- Homepage worker: HomeView composes HomeHero and HomeDetails; HomeHero presents the approved first viewport; HomeDetails composes AirbnbCard (all units and rental period controls), MapsCard (all nearby information and exact map URL), ReviewCard (manual access to all six reviews). AboutView uses real about content. Only these files and homepage-specific supporting files belong to this worker.
- Detail/gallery worker: AirbnbDetail orchestrates route-derived unit content, gallery preview, facilities/rules and actual booking links; optional unit-only children isolate pricing; ImageGallery displays all source photos with an accessible native-dialog lightbox and keyboard stepping. Only these files and detail/gallery-specific supporting files belong to this worker.

## Shared contracts

- `@/utils/property`: imgUrl(name), primaryPhoto(unit), isNightly(unit), tierFor(unit, period), rentalPeriods(units), categoryForPhoto(name), whatsappUrl(message).
- Existing `@/utils/format`: formatRupiah(amount), formatHarga(amount, period), hargaMulaiDari(tiers).
- `@/components/shared/RevealBlock.vue`: optional tag string, default div, default slot; class/style passed through.
- Global classes: page-width, section-space, display-title, section-title, body-copy, button, button-outline, text-link, icon, hero, hero-image, hero-content, hero-subtitle, hero-actions, back-link, eyebrow, sr-only. Tokens: --paper, --ink, --muted, --line, --display-font, --body-font, --ease.
- Shared header lives in App outside router-view and overlays hero. Footer lives in App; views do not duplicate it.

## Tasks

- [x] Add browser checks for homepage period prices/statuses, mobile navigation, all review access, all long-term prices, gallery keyboard/focus, no-image state, reduced motion and mobile overflow. Observe relevant failures before implementation.
- [x] Implement shared tokens/fonts/navigation/helpers and preserve existing route paths and legacy ID behaviour.
- [x] Implement homepage and unit/gallery modules independently, adapting to shared contracts without overwriting others' work.
- [x] Render desktop at 1536px and mobile at 390px, compare with approved targets and correct material differences.
- [x] Run Node suite, browser suite, production build, diff checks and independent review. No push or publication.

## Constraints and review focus

- Preserve all JSON content, every rental tier, actual availability, six reviews, 11 nearby places, existing map URL, email/WhatsApp/Airbnb links and scam warning. Empty image lists must not generate undefined paths.
- Prices stay tied to actual periods; no misleading minimum across incomparable periods, invented ratings, hotel services or fees.
- Original unit names stay readable alongside new marketing headlines. Do not infer new photo categories from random filenames; unknown uploads remain in All photos.
- Stable URLs: /, /about, /detail/:id?, /image/:id?. Cross-route hashes and history restoration must work.
- No custom scroll hijacking or per-frame scroll handlers. Content visible if animation is unavailable; prefer-reduced-motion disables movement. Native dialogs retain focus/keyboard semantics.
- Use the approved light body and photo-overlay opening. Use available OFL fonts with recorded attribution rather than unlicensed mockup fonts. No new package dependency is required.
- Work in place because this checkout contains the earlier authorized bug fixes. Do not revert, commit, or publish those changes.

## Evidence ledger

- Starting tree includes the earlier CMS/deployment fixes and ignored mockups. Previous verification: Node 17/17, browser 11/11 and build pass on installed Node 26.4.0; repository targets Node 24.22.1.
- RED checks captured missing homepage heading, long-term availability/manual review controls and native photo dialog before their implementations. The early dev-server file-lock interruption was rerun separately rather than treated as product evidence.
- Final verification: Node 17/17, browser 21/21, production build passed (61 modules), `git diff --check` passed with line-ending notices. Tests run on Node 26.4.0; repository-supported target remains Node 24.22.1.
- Browser coverage also exercises explicit gallery filters/all source photographs, nightly pricing when annual pricing comes first, empty photo lists, and route-parameter updates without document reload.
- Final desktop/mobile screenshots: ignored `design-mockups/monochrome-residence/implemented/*-final.png` and full homepage captures. All lazy images loaded before full-page capture. External requests blocked during deterministic captures, so the preserved Google Maps iframe is blank in those captures.
- Visual corrections: desktop hero title/copy gap, mobile stacked wordmark, long-term headline sizing and single-line desktop gallery title. Capture run reported no runtime errors or overflow on all eight route/viewport combinations.
- Independent read-only review found no blocking production findings and no horizontal overflow across five route types at 320, 360, 700, 760, 768, 900 and 1101px. Its test-only full-navigation concern was resolved with a mounted-route history navigation check.
- JSON source data unchanged; ignored design assets remain excluded from Git and the static build. Shared fonts are self-hosted Bodoni Moda and DM Sans, each with its upstream SIL OFL notice. No package dependencies added.
- Follow-up release verification: added a prominent detail gallery link, shared Long-term rent menu, and responsive three/two/one-column layout for more than four rentals. Seven-unit simulated dataset passes without changing real CMS data. Final pre-publication checks: browser 23/23, Node 17/17, build and diff checks pass; npm audit reports 0 vulnerabilities. User explicitly authorized source push and static publication.
