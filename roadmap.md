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

## Payment methods (Phase 1, when payments go live)
- [ ] Card (Visa/Mastercard/Amex)
- [ ] Cash App Pay
- [ ] PayPal
- [ ] ACH bank debit
- [ ] Afterpay/Klarna instalments (already shown on /checkout as 4x $124.25)
- [ ] Zelle — likely NOT supported by any checkout provider (bank-to-bank, no merchant API). Fallback: manual "pay by Zelle" instructions with manual order confirmation, or drop it.
- [ ] Show accepted-payment icons on /checkout in Phase 0 design
- [ ] Venmo (usually available via PayPal)

### Filing research findings (Sep 2026)
- LA Superior Court runs Tyler Odyssey eFileCA. E-filing is mandatory for attorneys, OPTIONAL for self-represented tenants — so print-and-file stays valid.
- InfoTrack: only EFSP actively marketing a developer/agent-facing API into eFileCA. Partner program + OAuth. Best fast path.
- One Legal: approved EFSP, integration API exists but partner/sales-led (practice-management oriented).
- Becoming our own Tyler-certified EFSP: 3-6+ months certification. Long-term only.
- Filing fee for defendant's first appearance ~$225-240; FW-001 fee waiver removes court fee but not EFSP transaction fee — auto-attach FW-001 by default.
- Courthouse is assigned by PROPERTY ZIP CODE (Local Rule 2.3 / Appendix 2.D) — build address -> courthouse router, don't let tenants pick.
- UPL: register as Legal Document Assistant in LA County, $25k bond, client disclosures. Complete forms at client's direction; never choose defences for them (People v. Landlords Professional Services).
- Build order: UD-105 assembly -> zip->courthouse router -> FW-001 auto-attach -> EFSP-agnostic filing adapter (swap InfoTrack/One Legal/in-house).
- Ship both: print pack (Option A) at launch, e-file hand-off (Option C) via InfoTrack once partner agreement lands. Manual staff filing through an EFSP portal as the bridge.

## Pricing strategy (revised Sep 8 2026 — LAUNCH DECISION)
- LAUNCH = answer only, single flat price $220, all files delivered within the hour (guarantee assumes answers are complete/on point; clock restarts if we must chase major corrections). No tiers, no add-ons at launch.
- Post-launch ladder (previous plan, kept for later): Discovery Pack, Settlement & Seal, Coach, Full Fight

- Every tier below the top carries a "what you give up" line + one-click step-up button showing only the price DIFFERENCE
- Order bumps: Rush +$39 (ready within the hour, included in Full Fight), Discovery Pack +$149 (upgrade path from $97 tier), Coach 30 days +$79
- Running total + instalment figure recalculates live to normalise the bigger number
- Quiet premium positioning: discovery is framed as an asset you keep regardless of the eviction outcome — landlord must respond on a short clock, lapses can be deemed admitted, the produced record becomes the basis of a later civil claim for damages/habitability/deposit. Never say "revenge" outright.
- Speed as a selling point: standard pack ready ~20 min, rush inside 60 min, any hour. Homepage timeline 11:12pm -> 8:35am at the filing window.
- [ ] Phase 1: A/B the $697 top tier vs $497; test rush bump attach rate; post-purchase upsell email for Discovery Pack to $97 buyers

## Parked marketing copy (removed from launch site Sep 8 2026 — re-add post-launch)
Removed from homepage + checkout to keep launch scope to the $220 answer only.
- "What you get out of them, you keep" discovery-leverage section:
  - Eviction clock runs on the landlord too; discovery answers are under oath on a short window.
  - Lapsed responses can be deemed admitted.
  - The record survives the case: rent ledger in writing, every repair complaint on file, who inspected the unit and when, admissions they can't walk back, a dated record of what they ignored.
  - Ground for later claims on deposits, habitability and damages.
- Checkout "After your answer is in — discovery, motions and settlement coming soon" block.
- Also parked: Settlement & Seal Pack (keeping the case off public/tenant-screening listings), AI coach, token meter.

## New task (Sep 8 2026)
- [x] Add settlement statistics section: filing an answer alone shifts outcomes — most UD cases resolve by settlement/stipulation on far better terms (move-out time, reduced or waived back rent, neutral judgment) once the tenant appears. Framing: the answer is the leverage; help them build a strong one.
