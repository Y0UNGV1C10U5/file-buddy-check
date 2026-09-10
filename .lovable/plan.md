# Align the site with the official California self-help Answer guide

The uploaded court guide confirms most of what we already say (10 court days, UD-105, MC-025 attachment) and flags several things we currently leave out. This plan closes those gaps.

## What the guide confirms

- 10 court days to file the Answer, counted from the day after service.
- UD-105 is the main form; MC-025 is the extra-space attachment.
- Filing fee is $240-$450, with a fee waiver available.
- Miss the deadline and you can still often file, until the landlord files CIV-100.

## What we are missing

1. **Denials.** The guide's step 2 is the heart of the form: item 2 of UD-105 lists the landlord's numbered statements you disagree with. If you don't list a statement, the judge treats it as agreed. Our guided flow never asks the user which paragraphs of the complaint they dispute.
2. **Fee reality.** We mention FW-001 but never say what filing actually costs. Add "$240-$450 court filing fee, waivable" wherever we talk about filing, so the $220 price sits next to an honest number.
3. **Missed-deadline path.** No page currently tells someone who is already late that they may still be able to file until the landlord requests a default. That is a live, high-intent visitor we lose.
4. **Copies and local forms.** Filing checklist should say: at least 2 copies (court original, yours, landlord's), and check the courthouse for local forms.
5. **Serving the Answer.** After filing, the Answer must be served on the landlord. We produce POS-030 but the flow never explains this as a required step.
6. **Multiple tenants.** Each tenant needs their own Answer unless everyone has identical defenses. Worth saying plainly - and it is a second sale.
7. **Motion to Quash / Demurrer.** The guide names these as alternatives when service or the complaint is defective. Our free service check already detects bad service, so we should name the option and say it needs legal help, rather than implying the Answer is the only route.

## Changes

**Guided form (`/build`)**
- New step after case details: "What does the landlord claim?" - list the numbered complaint paragraphs with tick boxes for the ones the user disputes (general denial vs specific paragraphs). Feeds item 2 of the UD-105 preview.
- Signature step gains a plain note that each tenant with different defenses files their own Answer.
- Final review step becomes a filing checklist: 2 copies, local forms check, filing fee $240-$450 or FW-001, serve the landlord afterwards.

**UD-105 preview (`UD105Sheet.tsx`)**
- Render item 2 denials from the new step instead of leaving that area static.

**Homepage (`index.tsx`)**
- Short "already missed your deadline?" card near the paper check: you may still be able to file until the landlord asks for a default - move now.
- Add the filing fee figure to the what-you-get section so the total cost is honest.

**Paper check result (`ServiceCheck.tsx`)**
- When service looks defective, add one line that a motion to quash or demurrer exists as an alternative and usually needs legal help, while filing the Answer on time remains the safe move.

**How it works / FAQ**
- New FAQ entries: what does filing cost, what if I already missed the deadline, do my roommates need their own Answer, do I have to serve the landlord after filing.
- How-it-works gains the after-filing service step.

## Technical notes

- Denials are new fields in the existing `BuildFields`/localStorage draft shape; no backend.
- No change to `deadline.ts` - its 10-court-day maths already matches the guide.
- Still Phase 0: no generation, no payments, nothing leaves the device.
