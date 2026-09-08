# Roadmap — CA tenant eviction-response app (LA County first)

## Open
- [x] Name chosen: Unlawfully Detained
- [x] Marketing site: Home, Pricing, FAQ, How it works (mobile-first, black/white/red)
- [x] Deadline calculator (deterministic: service date + method, 10 court days per AB 2347, excl. weekends + CA judicial holidays, clock starts day after service)
- [x] Legal footer on every page (not a law firm / LDA disclosure)

## Later
- [ ] Accounts + storage (Lovable Cloud)
- [x] Template download + online fill + upload parsing (.docx/.odt/.txt) — /answer
- [x] 28-line pleading generation (Rule 2.108) → DOCX/ODT/PDF + POS-030, live preview
- [ ] Fight Kit Discovery Pack ($149) + AI coach add-on ($79 / 50k tokens) — priced on /pricing, not yet generated

- [ ] Stripe: $79 single, $97/mo unlimited; AI token metering tiers
- [ ] AI coach with hard token caps and citation-or-abstain rule
- [ ] Admin dashboard
- [ ] 7 ad campaign briefs + logo concepts
- [ ] Statewide support via configurable court address

## Reference
- Input template fields captured from Proper_OS_LASC_Pleading_Input_Template.docx
- AB 2347 / CCP 1167 10-court-day rule confirmed (effective Jan 1, 2025)

## Phase 0 — design-only showcase (done)
- [x] Deadline checker shows every counted/skipped day with reasons
- [x] Timeline: do nothing = day 0/10-14/15/20/25/30; answer = 70-80 days
- [x] /start mode chooser, /build 3-column hero shot, /checkout 5 cards ($197 preselected)
- [x] Pleading sheet restyled to LASC 28-line reference; demo fixture in src/lib/demo-data.ts
- [x] CORRECTION: the Answer is Judicial Council form UD-105 (tick boxes), NOT pleading paper.
      Pleading paper = MC-025 attachment + motions/stipulations/discovery in higher packages.
- [x] Everything filled in on-screen via form fields — no template download, no upload/resubmit
- [ ] Phase 1: real UD-105 + MC-025 generation, Stripe, AI coach, discovery logic


## Phase 2 — app stores (after website launch)
- [ ] Step 1: home-screen install (manifest + icons) — free, works now on Android/iPhone
- [ ] Step 2: Capacitor wrapper for Google Play ($25 one-off) and App Store ($99/yr)
- [ ] Native polish so Apple accepts it (not just a website in a shell): offline draft access, push reminders for the deadline, file picker/share sheet, camera scan of the notice
- [ ] Payments: web checkout for ad traffic; also offer in-app purchase for store sign-ups (accept 15-30% cut for legitimacy) — price in-app tiers ~15-20% higher, no links to web pricing inside the app
- [ ] Store assets: listing copy, screenshots, privacy policy URL, data-safety form


## Filing hand-off (decide before launch)
- [ ] Option A: output print-ready PDFs + list of every LA County location/window that accepts UD filings, with hours and what to bring
- [ ] Option B: step-by-step "set up a One Legal account and e-file it now" walkthrough
- [ ] Option C (best UX): warm hand-off via e-filer API — needs a provider with API access certified for LA County Superior Court
- [ ] Research + compare: One Legal, InfoTrack, Green Filing, File & ServeXpress, Odyssey eFileCA (Tyler) EFSP route
