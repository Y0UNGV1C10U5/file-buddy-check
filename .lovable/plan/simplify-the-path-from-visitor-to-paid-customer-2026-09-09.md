# Simplify the path from visitor to paid customer

Right now a visitor can be sent to five different places from the home page: the paper check, the deadline check, "Build my answer", a separate "Start" page, and the pricing page. Every extra choice loses people. This plan cuts it to one road with one price at the end.

## The single road

```text
1. Free paper check  ->  2. Your result + deadline  ->  3. Email + mobile + photo of your papers
                                                              |
                                          4. Fill in your answer, see it build on screen
                                                              |
                                            5. Pay $220 -> finished files within the hour
```

## What changes

**One button, one wording.** Every call to action above the fold becomes "Check my papers — free". The second hero button ("Build my answer") is removed so there is one obvious first move. Later in the page, once the value is explained, the button becomes "Start my answer — $220 when you're ready".

**The free check becomes the front door.** After the check gives its result (served properly or not, and the exact deadline), the result box itself carries the next step: "Start your answer now — you have X court days left". That is the moment people are most motivated, so the hand-off happens there instead of sending them back up the page.

**Remove the extra Start page.** The `/start` page currently only re-explains the twelve questions before sending people onward. Its useful parts (how long it takes, free to look) move into the gate screen, and `/start` redirects to the gate so any old link still works. One less click, one less decision.

**Simplify the gate.** Contact details and the photo of the papers stay, but presented as one short screen: email, mobile, code boxes appearing in place, photo upload, one unlock button. The current version reads like three separate forms stacked up.

**Slim the home page.** Keep, in this order: hero, free paper check, why the answer matters (9-in-10 warning + leverage), what you get for $220, one-night timeline, reasons paperwork can be wrong, FAQ teaser, final call to action. Merge the two overlapping "what we do" sections and drop one of the three repeated red urgency bands so the page stops feeling like a shout on every screen.

**Trim the top menu.** Four menu items plus a button becomes: How it works, Pricing, FAQ, and the red "Free paper check" button. "Build my answer" comes out of the menu because it is already the main button on every screen.

**One price, said once.** The pricing page states $220, what's in the pack, the within-the-hour promise, and the technical-acceptance guarantee — nothing else. No plan comparison, no add-ons, no countdown.

## Honesty clean-up in the same pass

- Remove the invented live counters ("127 tenants filed this week", "Maria from Boyle Heights", "Only 4 days left"). They are made up, they are the sort of claim that undermines trust in a legal service, and the site does not need them.
- Payment methods and installment options are listed but not connected yet; the pricing page will name only card payment until the rest are live.

## Technical notes

- `src/routes/start.tsx` becomes a redirect to the gated build entry; `SiteHeader` NAV loses the `/start` item.
- Home-page section order and CTA copy consolidated in `src/routes/index.tsx`; one `UrgencyBand` instance removed.
- `ServiceCheck` and `DeadlineCalculator` results gain a shared follow-on CTA block.
- `StartGate` layout condensed to a single card; logic unchanged.
- `demo-data.ts` fake social-proof constants removed along with their usages.
- No backend work here: drafts remain on the device, payment stays as the existing placeholder.
