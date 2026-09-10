# Keep LA-only, but stop losing out-of-county people

Decision: Los Angeles County stays the only place we prepare filings. Everyone
else gets the free checks and a waitlist spot instead of a dead end.

For reference, if we ever expand, the order by number of eviction filings is
San Diego, then Riverside. Not building for them now.

## The problem

The 3-day notice page already handles an out-of-county visitor well: it shows a
"we're not in your county yet" card, keeps their email, and promises to tell
them when we open.

The form gate in front of the builder does not. A non-LA ZIP just produces a red
error line telling them to go somewhere else. They almost certainly leave, and
we keep nothing — no email, no county, no idea how much demand exists outside LA.

That's the whole change: make the gate behave like the notice page.

## What changes

**1. Out-of-county card on the form gate**

When the ZIP isn't LA, replace the red error with the same friendly card the
notice page uses:

- "We're not in Los Angeles County yet" heading
- Their county is noted, their email and mobile are held
- A line saying the deadline and service checks they already ran still apply
  everywhere in California, so keep their dates
- A "change my ZIP" link, in case they typed it wrong
- No verification codes, no upload step — don't make them do work we can't pay off

**2. One shared waitlist record**

Both the notice page and the form gate save to the same place on the device, so
one person registering twice isn't two entries. Record: email, mobile, ZIP,
where they came from, and the date.

**3. Honest wording about reminders**

Right now the notice page says we'll text and email before the deadline. Nothing
is actually sent — there's no mail or messaging service connected yet. Change
the wording to describe the saved countdown they can come back to, and say
reminders are coming, rather than promising a text that never arrives.

Same for the waitlist: "we're keeping your details" rather than "we'll email you
the day we open".

**4. Small copy pass**

Make the LA-only limit clear earlier — one line near the top of the home page
and the notice page — so nobody fills in fifteen minutes of detail before
finding out. Not a banner, just a plain line.

## Not in this change

- No second county
- No real emails or texts (that needs the backend switched on)
- No change to the $220 offer, the UD-105 flow, or the checks themselves

## Technical notes

- `src/components/site/StartGate.tsx` — add a `waitlisted` state branch mirroring
  the one in `src/routes/3-day-notice.tsx`; `send()` sets it instead of `setError`
  when `checkLaZip(zip) === "outside"`. Keep the `"incomplete"` case as a normal
  inline validation error.
- New `src/lib/waitlist.ts` — `saveWaitlist({ email, phone, zip, source })` and a
  read helper, writing to a single `ud-waitlist-v1` localStorage key with a
  source field of `"notice" | "gate"`. Both call sites use it.
- `src/routes/3-day-notice.tsx` — swap its inline `localStorage.setItem` and the
  waitlist confirmation copy over to the shared helper and the softened wording.
- Copy edits in `src/routes/index.tsx` and `src/routes/3-day-notice.tsx`.
- Verify with `bunx tsgo --noEmit` and a mobile Playwright pass over the gate
  with an LA ZIP (90026) and a non-LA ZIP (92101).
