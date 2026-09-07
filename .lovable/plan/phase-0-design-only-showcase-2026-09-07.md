# Phase 0 — Design-only showcase

Goal: the whole product *looks* finished for screenshots, ads and an investor deck. Fake data everywhere. No payments taken, no real documents made, no AI.

## Look and feel

- Warm paper #FFFEF7, ink #1A1A1A, LASC blue #003366, warning red #CC0000, soft yellow #FFF3CD used only for sealing wins.
- Inter for the interface, Courier Prime for anything that looks like court paper. Both loaded in the root head.
- The court paper matches the sheet you uploaded: 28 numbered lines down the left, double vertical rule at 0.895in, single rule on the right, boxed caption at the top, speckled off-white paper.

## Pages

### Home (polish + fixes)
- Keep the hero: "Landlord trying to evict you? Stand up and fight." with the kitchen-table papers image.
- Deadline checker front and centre: service date + how you were served (in person, left with someone, taped to the door) gives the exact date, plus a day-by-day list that names every skipped day out loud — "Sat Sep 7 — weekend, skipped", "Mon Sep 1 — Labor Day, court holiday, skipped". That list is the trust builder, so it is always visible, not behind a toggle.
- Rewrite the two calendars: doing nothing — served day 0, deadline passes day 10-14, default day 15, judgment day 20, sheriff notice day 25, locked out day 30. Answering — 70 to 80 days and a judge actually hears you.

### /start — pick your mode
Two big cards: "Guided Mode — box by box (recommended for 90%)" with a wizard illustration and a 5/12 progress bar, and "Edit Doc Mode — I have your template" with a document-editor illustration, plus a toggle top right. Below, social proof: "Maria from Boyle Heights filed at 11:47pm and stopped a default."

### /build — the hero screenshot
Three columns:
- Left 30%: box-by-box wizard, step 5 of 12, "What happened in your own words?", pre-filled with the sample story, Back/Next. Answers remembered in the browser only.
- Centre 50%: the 28-line pleading sheet, live, styled to match the reference image exactly. Caption box with case 24STUD01234, title "ANSWER - UNLAWFUL DETAINER", Courier Prime body, updates verbatim as you type.
- Right 20%: seven defence tick boxes — improper service, wrong amount, AB 1482 missing, habitability, retaliation, discrimination, breach of warranty. Ticking one drops a placeholder paragraph into the sheet, highlighted yellow. A "Enhance into court language" magic-wand switch sits above them (visual only).
- Mode toggle swaps the centre between the finished court version and an editable document-style view with boxes mapped to lines.

### /checkout — five cards, $197 pre-selected
Free deadline check · $97 Get It On Record (answer + POS-030) · $197 Fight Kit, most popular, blue border and ribbon (answer + discovery pack + motion to deem admitted, "60% of landlords ignore it") · $397 Defender, best value (everything above + settlement & seal pack + 30 days of coaching) · $497 Ultimate (everything + 60 days coaching, negotiation script, rent ledger audit, sheriff delay letter). Ultimate carries the "Keeps it off your record — a lawyer quoted $3,000" badge and a 4 x $124.25 instalment line. Every button says "Get Started" and opens a simple email waitlist box.

### Marketing touches
- "Only 4 days left" countdown appears when a deadline is under a week away and turns Ultimate red.
- Live-looking counter: "127 tenants filed this week in LA County".
- Afterpay/Klarna and trust badges near the prices.

## Not in this phase
No Word/PDF/ODT generation, no live payments, no AI writing, no discovery or sealing logic, no usage meter. Those buttons look real but only capture an email.

## Technical notes
- New colour and font tokens in `src/styles.css`; Inter + Courier Prime via `src/routes/__root.tsx` head links.
- New routes `src/routes/start.tsx`, `src/routes/build.tsx`, `src/routes/checkout.tsx`, each with its own title/description meta.
- `src/lib/demo-data.ts` holds the fixture: case 24STUD01234, plaintiff Maple Properties LLC, defendant Maria R., story "I paid $600 on May 1, rent $2000, landlord says $2000 due but should be $1400, mold in bathroom since March, notice taped to door while I was at work."
- New `PleadingSheet` component reuses `pleadingBlocks`/`paginate` from `src/lib/pleading.ts`, restyled to the reference sheet (double rule left at 0.895in, single right rule, speckled #FFFEF7, Courier Prime).
- `DeadlineCalculator` renders the full counted-day list with weekend/holiday reasons from `calculateDeadline` in `src/lib/deadline.ts`, which stays the single source of truth for the 10-court-day maths.
- Timeline numbers corrected in `src/components/site/EvictionTimeline.tsx`.
- `/answer` builder left untouched; `/pricing` links to `/checkout`.
