# Phase 0 — Design-only showcase

Goal: the whole product *looks* finished for screenshots, ads and an investor deck. Fake data everywhere. No payments taken, no real documents made, no AI.

## Look and feel

- Warm paper background, near-black ink, LASC blue, warning red, and a soft yellow highlight used only for "sealing wins".
- Two typefaces: a clean modern one for the interface, a typewriter face for anything that looks like court paper.
- The court paper matches the sheet you uploaded: 28 numbered lines down the left, a double vertical rule, a single rule on the right, a boxed caption at the top, speckled off-white paper.

## Pages

### Home (polish + fixes)
- Keep the hero: "Landlord trying to evict you? Stand up and fight." with the kitchen-table papers image.
- Deadline checker moved front and centre: service date + how you were served (in person, left with someone, taped to the door) gives the exact date, plus the day-by-day list showing which weekends and court holidays were skipped.
- Rewrite the two calendars to the corrected counts: doing nothing — served day 0, deadline passes day 10-14, default day 15, judgment day 20, sheriff notice day 25, locked out day 30. Answering — 70 to 80 days and a judge actually hears you.

### /start — pick your mode
Two big cards: "Guided Mode — box by box" (little wizard illustration with a 5/12 progress bar) and "Edit Doc Mode — I have your template" (document-editor illustration), with a toggle top right. Under them, a short quote-style social proof line.

### /build — the hero screenshot
Three columns:
- Left: the box-by-box wizard on step 5 of 12, "What happened in your own words?", pre-filled with a sample story, Back/Next. Answers remembered in the browser only.
- Centre: the 28-line pleading paper, live. Caption box with a sample case number, title "ANSWER - UNLAWFUL DETAINER", typewriter text that updates as you type.
- Right: seven defence tick boxes. Ticking one drops a placeholder paragraph into the paper, highlighted yellow. A "Enhance into court language" magic-wand switch sits above them (visual only).
- The mode toggle swaps the centre column between the finished court version and an editable document-style view.

### /checkout — five cards, $197 pre-selected
Free deadline check · $97 Get It On Record · $197 Fight Kit (most popular, blue border and ribbon) · $397 Defender (best value, includes the sealing pack and 30 days of coaching) · $497 Ultimate. Ultimate carries the "Keeps it off your record — a lawyer quoted $3,000" badge and shows a 4 x $124.25 instalment line. Every button says "Get Started" and opens a simple email waitlist box.

### Marketing touches
- "Only 4 days left" countdown that appears when a deadline is under a week away and turns the top plan red.
- A live-looking counter: "127 tenants filed this week in LA County".
- Instalment and trust badges near the prices.

## Not in this phase
No Word/PDF generation, no live payments, no AI writing, no discovery or sealing logic, no usage meter. Buttons that would do those things look real but only capture an email or do nothing.

## Technical notes
- New colour and font tokens in `src/styles.css`; Courier Prime + Inter loaded via the root route head.
- New routes `src/routes/start.tsx`, `src/routes/build.tsx`, `src/routes/checkout.tsx`, each with its own page title and description.
- Pleading-paper rendering reuses `paginate`/`pleadingBlocks` from `src/lib/pleading.ts` inside a restyled `PleadingSheet` component matching the reference sheet; existing `/answer` builder stays as-is for now.
- Wizard state in `useState` + `localStorage`; sample story and case number are hard-coded fixtures in a `src/lib/demo-data.ts` file so nothing looks empty in screenshots.
- Timeline numbers corrected in `src/components/site/EvictionTimeline.tsx`; the deadline maths in `src/lib/deadline.ts` already counts 10 court days and stays the source of truth.
- Existing pricing page updated to link to `/checkout`.
