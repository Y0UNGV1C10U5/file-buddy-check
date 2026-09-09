import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  Gavel,
  ShieldCheck,
  Upload,
} from "lucide-react";
import heroImage from "@/assets/unlawful-detainer-papers.jpg";
import noticeImage from "@/assets/three-day-notice.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DeadlineCalculator } from "@/components/site/DeadlineCalculator";
import { ServiceCheck } from "@/components/site/ServiceCheck";
import { EvictionTimeline } from "@/components/site/EvictionTimeline";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlawfully Detained — Answer Your LA Eviction Papers" },
      {
        name: "description",
        content:
          "Landlord trying to evict you in Los Angeles? We put your side of the story onto the official Answer — form UD-105 — and you can check your filing deadline free.",
      },
      { property: "og:title", content: "Unlawfully Detained — Stand Up and Fight" },
      {
        property: "og:description",
        content:
          "Your side of the story on the official Answer — Judicial Council form UD-105 — ready for the LA Superior Court. Free paper check: valid service and your exact deadline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: Gavel, label: "Check", text: "Service valid? Deadline? Free, in seconds." },
  { icon: FileText, label: "Answer", text: "Short questions, on screen." },
  { icon: Upload, label: "Fills itself", text: "Form UD-105, as you type." },
  { icon: ShieldCheck, label: "File", text: "Get it on the record." },
];


const DEFENSES = [
  {
    label: "The notice was never properly served",
    text: "If it was taped to your door, the law also requires a copy in the mail. No mailing, and the clock may never have started.",
  },
  {
    label: "The notice had the wrong amount or wrong address",
    text: "A three-day notice that demands more than you actually owe, or names the wrong unit, can be bad on its face.",
  },
  {
    label: "Required AB 1482 language was missing",
    text: "AB 1482 is California's statewide rent cap and just-cause law (Civil Code 1946.2). If your home is covered, the landlord has to state the just cause for ending your tenancy in the notice, and many notices carry a required written disclosure about these protections. If that language is missing when it should be there, the paperwork may not support the case.",
  },
  {
    label: "Repairs were ignored and the place was not livable",
    text: "Mold, leaks, no heat, no hot water, pests — if you asked and nothing happened, that belongs in your answer.",
  },
  {
    label: "You were punished for complaining (retaliation)",
    text: "If the eviction landed soon after you reported repairs or contacted an inspector, timing matters.",
  },
  {
    label: "You were treated differently because of who you are",
    text: "Family status, disability, race, source of income and more are protected.",
  },
];


const NOTICE_TIMELINE = [
  {
    title: "The notice arrives",
    text: "Three days to pay or leave, handed to you, left with someone else, or taped to the door.",
  },
  {
    title: "The three days run out",
    text: "Weekends and court holidays are not counted in the three days.",
  },
  {
    title: "The landlord files in court",
    text: "That filing is the unlawful detainer — the actual eviction lawsuit.",
  },
  {
    title: "You get served court papers",
    text: "A summons and complaint. Now the clock is on you: ten court days to answer.",
  },
];

function UrgencyBand({
  kicker,
  headline,
  body,
}: {
  kicker: string;
  headline: string;
  body: string;
}) {
  return (
    <section className="border-b-4 border-ink bg-signal py-10 text-signal-foreground">
      <div className="container-page flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl">
          <p className="eyebrow opacity-80">{kicker}</p>
          <p className="mt-2 font-display text-3xl uppercase leading-tight sm:text-4xl">
            {headline}
          </p>
          <p className="mt-3 text-sm opacity-90">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/build"
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-4 font-display uppercase text-ink-foreground transition-transform hover:-translate-y-1"
          >
            Start my answer <ArrowRight className="size-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}


function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b-4 border-ink bg-ink text-ink-foreground">
          <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div>
              <p className="eyebrow text-signal">Los Angeles County · eviction defense</p>
              <h1 className="mt-4 text-6xl leading-[0.88] sm:text-7xl lg:text-8xl">
                Landlord
                <br />
                trying to
                <br />
                <span className="text-signal">evict you?</span>
                <br />
                Stand up and fight.
              </h1>
              <p className="mt-6 max-w-lg text-lg opacity-85">
                Those papers are called an unlawful detainer. If you say nothing, the
                court hears only your landlord. Tell your side — we take your story and
                put it on the exact paper the court accepts.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#deadline"
                  className="inline-flex items-center gap-2 border-2 border-signal bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
                >
                  Check my papers — free <ArrowRight className="size-5" />
                </a>
              </div>
              <p className="mt-6 eyebrow opacity-60">
                Free to check · No account · No card
              </p>

            </div>

            <div className="relative mx-auto w-full max-w-md pb-16 lg:max-w-none">
              <img
                src={heroImage}
                width={1280}
                height={1120}
                alt="An unlawful detainer summons and complaint from the Superior Court of California lying on a kitchen table next to house keys"
                className="w-full border-2 border-ink-foreground/30 object-cover"
              />
              <figure className="absolute -bottom-6 -right-2 w-[58%] -rotate-6 border-4 border-ink bg-background p-1 shadow-slab sm:-right-6">
                <img
                  src={noticeImage}
                  width={912}
                  height={1200}
                  alt="A three day notice to pay rent or quit served on a tenant by a landlord"
                  className="w-full object-cover"
                />
                <figcaption className="bg-ink px-2 py-1 text-center font-display text-[10px] uppercase leading-tight text-ink-foreground sm:text-sm">
                  3-day notice to pay or quit
                </figcaption>
              </figure>
              <p className="absolute -bottom-4 left-0 max-w-[46%] border-2 border-ink bg-signal px-3 py-2 font-display text-sm uppercase leading-tight text-signal-foreground sm:text-lg">
                Got papers? Answer them.
              </p>
            </div>


          </div>
        </section>

        {/* 3-day notice */}
        <section className="border-b-4 border-ink bg-accent py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow text-signal">Before the court papers</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">
                Got a 3-day notice
                <br />
                to pay rent or quit?
                <br />
                <span className="text-signal">An eviction case may be next.</span>
              </h2>
              <p className="mt-5 max-w-lg text-muted-foreground">
                Almost every eviction starts with a notice taped to your door or handed
                to you — usually three days to pay what the landlord says you owe, or
                move out. It is not a court order and it is not the end. It is the step
                the landlord has to take before filing an unlawful detainer.
              </p>
              <p className="mt-4 max-w-lg text-muted-foreground">
                This is the best moment to get organised. Save the notice, photograph the
                door, keep every text and receipt, and write down what actually happened.
                If the notice has the wrong amount, the wrong address, or was never
                handed over properly, that can matter later in court.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/3-day-notice"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-6 py-4 font-display uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
                >
                  Register my 3-day notice — free
                  <ArrowRight className="size-5" />
                </Link>
                <a
                  href="#deadline"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-background px-6 py-4 font-display uppercase shadow-slab transition-transform hover:-translate-y-1"
                >
                  Already been served? Free paper check
                </a>
              </div>

            </div>

            <div className="slab p-6 sm:p-8">
              <p className="eyebrow text-signal">How it usually goes</p>
              <ol className="mt-4 space-y-4">
                {NOTICE_TIMELINE.map((item, i) => (
                  <li key={item.title} className="flex gap-4 border-b border-border pb-4">
                    <span className="font-display text-2xl text-signal">{i + 1}</span>
                    <span>
                      <span className="block font-display text-lg uppercase leading-tight">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {item.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-muted-foreground">
                A 3-day notice on its own is not something you file an answer to. The
                answer comes once the court papers arrive — and we are ready for that day.
              </p>
            </div>
          </div>
        </section>


        {/* What we actually do */}
        <section className="border-b-4 border-ink bg-background py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-signal">In plain English</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">
                We get your
                <br />
                side of the story
                <br />
                <span className="text-signal">onto form UD-105.</span>
              </h2>
            </div>
            <div className="space-y-6">
              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">
                  What is form UD-105?
                </p>
                <p className="mt-3 text-muted-foreground">
                  It is the official Answer for an eviction case — a Judicial Council
                  form with tick boxes. You say who you are, deny what the landlord
                  claims, and tick the reasons you should not be evicted. That form,
                  not a letter, is what stops a default.
                </p>
              </div>
              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">What we do</p>
                <p className="mt-3 text-muted-foreground">
                  You tell us what happened in your own words. We fill out the UD-105
                  for you — the right boxes ticked — and put your account on the
                  attached page (MC-025) that goes with it, so nothing you want the
                  judge to know gets squeezed out.
                </p>
              </div>
              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">
                  What comes back to you
                </p>
                <p className="mt-3 text-muted-foreground">
                  Your completed UD-105 with the attached page carrying your account,
                  the proof of service, and a fee waiver request if you need one — all
                  print-ready, plus editable copies if you want to change a word.
                </p>
              </div>

              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">What we are not</p>
                <p className="mt-3 text-muted-foreground">
                  We are not lawyers and we do not argue your case or tell you what to
                  claim. We do the paperwork part: your words, correctly formatted,
                  filed on time.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Free Paper Check: service validity + deadline */}
        <section id="deadline" className="scroll-mt-20 bg-background py-16">
          <div id="service-check" className="container-page scroll-mt-20">
            <p className="eyebrow text-signal">Free paper check · no card, no account</p>
            <h2 className="mt-3 max-w-3xl text-4xl sm:text-5xl">
              The Eviction Paper Check:
              <br />
              <span className="text-signal">were you even served properly</span>
              <br />
              — and how long have you got?
            </h2>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              Two free checks in about ninety seconds. First, whether the way those papers
              reached you is even valid under California law. Then the exact date your
              answer is due, counted the way the clerk counts it.
            </p>
          </div>

          <div className="container-page mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow text-signal">Step 1 · Free win, no strings</p>
              <h3 className="mt-3 text-3xl sm:text-4xl">
                Taped to your door
                <br />
                and never posted?
                <br />
                <span className="text-signal">That may not be service at all.</span>
              </h3>
              <p className="mt-5 text-muted-foreground">
                Landlords and their servers cut corners on this constantly. Door only,
                no mailed copy. Posting with no judge's order behind it. Papers handed
                to whoever happened to answer the door. Each of those is a step
                California requires, and a missing step is something you can raise.
              </p>
              <p className="mt-4 text-muted-foreground">
                Check it here for nothing. If it's bad on its face, we'll say so — and
                then tell you the uncomfortable part: it only counts if you file your
                answer and put it in writing.
              </p>
            </div>
            <ServiceCheck />
          </div>

          <div className="container-page mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow text-signal">Step 2 · Your clock</p>
              <h3 className="mt-3 text-3xl sm:text-4xl">
                The clock started
                <br />
                the day after
                <br />
                <span className="text-signal">you were served.</span>
              </h3>
              <p className="mt-5 text-muted-foreground">
                Weekends do not count. Court holidays do not count. That is why the date
                on your papers can be misleading — and why we count it the way the clerk
                does.
              </p>
              <p className="mt-5 text-muted-foreground">
                Nothing here is guessed. The count follows Code of Civil Procedure § 1167
                and the California court holiday calendar, and you can see every single
                day we counted.
              </p>
            </div>
            <DeadlineCalculator />
          </div>

          <div className="container-page mt-12">
            <div className="flex flex-wrap items-center justify-between gap-6 border-4 border-ink bg-ink p-6 text-ink-foreground sm:p-8">
              <div className="max-w-xl">
                <p className="eyebrow text-signal">Now the part that counts</p>
                <p className="mt-2 font-display text-3xl uppercase leading-tight">
                  Knowing the date changes nothing. Filing the answer does.
                </p>
                <p className="mt-3 text-sm opacity-85">
                  Start filling it in free — you only pay $220 when you want the
                  finished files.
                </p>
              </div>
              <Link
                to="/build"
                className="inline-flex items-center gap-2 border-2 border-ink-foreground bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
              >
                Start my answer <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>



        <UrgencyBand
          kicker="Knowing the date doesn't file anything"
          headline="Every day you sit on it is a day of the ten gone."
          body="The pack takes minutes to fill in and comes back inside the hour. Waiting until the last afternoon is how people miss it."
        />

        {/* Timeline comparison */}
        <section className="border-y-4 border-ink bg-background py-16">
          <div className="container-page">
            <p className="eyebrow text-signal">Two calendars</p>
            <h2 className="mt-2 max-w-3xl text-4xl sm:text-5xl">
              What happens if you stay quiet — and what happens if you answer.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Both are worst-case counts, in plain calendar days from the day the papers
              reached you. Real cases vary by court and by county.
            </p>
            <div className="mt-10">
              <EvictionTimeline />
            </div>
          </div>
        </section>







        {/* Flow */}
        <section className="border-y-4 border-ink bg-accent py-16">
          <div className="container-page">
            <p className="eyebrow text-signal">Four steps to your day in court</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.label} className="border-2 border-ink bg-card p-6">
                  <step.icon className="size-8 text-signal" />
                  <p className="mt-4 font-display text-2xl uppercase">{step.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speed */}
        <section className="border-b-4 border-ink bg-caution py-16 text-ink">
          <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow">No queue. No posting. No morning wait.</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">
                Within the hour. Guaranteed.
              </h2>
              <p className="mt-4 max-w-xl">
                Fill in the boxes tonight, pay your flat $220, and your filing pack comes
                back inside sixty minutes — signed, formatted and ready to print. Any
                hour, weekends included. Answer the questions properly and the clock is
                on us.
              </p>
            </div>
            <div className="self-center border-2 border-ink bg-card shadow-slab">
              <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3 text-ink-foreground">
                <p className="eyebrow">One night, start to filing window</p>
                <span className="font-mono text-xs uppercase">6 steps</span>
              </div>
              <ol className="relative px-5 py-5">
                <span
                  aria-hidden
                  className="absolute left-[2.35rem] top-8 bottom-8 w-0.5 bg-ink/20"
                />
                {[
                  [
                    "11:12pm",
                    "1. Tell your side",
                    "You start filling in the boxes — dates, the notice, what actually happened.",
                  ],
                  [
                    "11:30pm",
                    "2. We check it's enough",
                    "We read back every box and flag anything thin, missing or contradictory before you spend a cent.",
                  ],
                  [
                    "11:34pm",
                    "3. You pay $220",
                    "Flat fee, once, only when your answers are complete enough to proceed.",
                  ],
                  [
                    "11:52pm",
                    "4. Your pack lands",
                    "Signed and formatted UD-105, attached page, POS-030 and fee-waiver forms — PDFs plus editable Word and OpenDocument copies.",
                  ],
                  [
                    "11:58pm",
                    "5. Pick how you file",
                    "We coach you step by step through e-filing online, or you print and walk it in.",
                  ],
                  [
                    "8:35am",
                    "6. You're at the filing window",
                    "Papers in hand at whichever LA County courthouse handles your address — we tell you which one and what to hand over.",
                  ],
                ].map(([time, title, what], i, arr) => (
                  <li
                    key={time}
                    className="relative flex items-start gap-4 py-3 group"
                  >
                    <span
                      className={`relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-ink ${
                        i === arr.length - 1 ? "bg-signal" : "bg-card"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          i === arr.length - 1 ? "bg-signal-foreground" : "bg-ink"
                        }`}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-xs uppercase tracking-widest text-signal">
                        {time}
                      </span>
                      <span className="block font-semibold text-foreground">{title}</span>
                      <span className="block text-sm text-muted-foreground">{what}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>


          </div>
        </section>

        {/* Start it now */}
        <section className="border-b-4 border-ink bg-background py-16">
          <div className="container-page grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-signal">Free to start</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">
                Start filling it in now.
                <br />
                <span className="text-signal">Pay when you want the files.</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Open the form and answer the boxes in your own words. You watch page one
                of the real court form build on screen as you type. Nothing to install,
                nothing charged, and you can come back and change your answers as many
                times as you like for the whole ten days you have to respond.
              </p>
              <p className="mt-4 text-muted-foreground">
                The on-screen preview is a look, not a download — no files leave our hands
                before payment. When it looks right, pay ${220} and the finished pack —
                print-ready PDFs plus editable Word and OpenDocument copies — comes back
                within the hour.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/build"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-6 py-4 font-display uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
                >
                  Start filling it in — free
                </Link>
                <Link
                  to="/checkout"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-background px-6 py-4 font-display uppercase shadow-slab transition-transform hover:-translate-y-1"
                >
                  See what you get
                </Link>
              </div>
            </div>
            <div className="self-center border-2 border-ink bg-card shadow-slab">
              <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-ink px-5 py-3 text-ink-foreground">
                <p className="eyebrow">What it costs to look</p>
                <span className="border-2 border-signal bg-signal px-2 py-0.5 font-display text-sm uppercase text-signal-foreground">
                  $0
                </span>
              </div>
              <ul className="divide-y-2 divide-ink/10">
                {[
                  ["01", "Watch page one build on screen as you type"],
                  ["02", "No card, no account, nothing charged to look"],
                  ["03", "Edit as often as you like across your ten response days"],
                  ["04", "Preview only — no files, no downloads before payment"],
                  ["05", "Pay $220 and the finished pack comes back within the hour"],

                ].map(([n, item]) => (
                  <li
                    key={n}
                    className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent"
                  >
                    <span className="mt-0.5 font-mono text-xs font-bold text-signal">
                      {n}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">
                      {item}
                    </span>
                    <Check className="mt-0.5 size-4 shrink-0 text-go" />
                  </li>
                ))}
              </ul>
              <p className="border-t-2 border-ink bg-muted px-5 py-3 text-xs uppercase tracking-widest text-muted-foreground">
                $220 only when you ask for the files
              </p>
            </div>

          </div>
        </section>

        {/* Why the answer is the leverage */}
        <section className="border-b-4 border-ink bg-card py-16">
          <div className="container-page">
            <p className="eyebrow text-signal">Why the answer matters this much</p>
            <h2 className="mt-3 max-w-3xl text-5xl sm:text-7xl">
              File your answer.
            </h2>
            <p className="mt-4 max-w-2xl text-lg">
              The moment you file, this stops being a formality and starts being a case
              your landlord has to pay a lawyer to run.
            </p>

            {/* Red mark — the do-not-do-this stat */}
            <div className="mt-8 border-4 border-signal bg-signal p-6 text-signal-foreground sm:p-8">
              <p className="flex items-center gap-3 eyebrow">
                <AlertTriangle className="size-5" />
                Do not let this be you
              </p>
              <p className="mt-3 font-display text-5xl uppercase leading-none sm:text-7xl">
                About 9 in 10
              </p>
              <p className="mt-4 max-w-2xl text-lg opacity-95">
                Eviction cases where the tenant never answers end in a default. No
                hearing, no negotiation, no judge hearing a word from you — the landlord
                simply wins, usually within a fortnight, and the lockout follows.
              </p>
            </div>

            {/* Cost to the landlord */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-4 border-go bg-go-soft p-6 sm:p-8">
                <p className="eyebrow text-go">What changes when you answer</p>
                <h3 className="mt-3 font-display text-3xl uppercase leading-tight sm:text-4xl">
                  It gets expensive for them — fast.
                </h3>
                <p className="mt-4 text-foreground/80">
                  Representing yourself costs you nothing but your time. For the
                  landlord it is the opposite: an uncontested eviction is a cheap
                  paperwork exercise, a contested one runs into the thousands. Once your
                  answer is on file they pay their lawyer to read it, respond to it,
                  request a trial date, prepare witnesses and turn up on the day — with
                  no rent coming in the whole time.
                </p>
                <p className="mt-4 text-foreground/80">
                  That arithmetic is where your leverage comes from. A clear, well-built
                  answer is what puts it in your hands.
                </p>
                <p className="mt-4 font-display text-xl uppercase leading-tight">
                  $220 today buys you a seat at that table.
                </p>
              </div>

              <div className="border-4 border-go bg-go-soft p-6 sm:p-8">
                <p className="eyebrow text-go">
                  What some tenants and landlords routinely settle on before trial
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Extra weeks — sometimes months — in the home instead of days",
                    "Back rent reduced, or written off, as part of the deal",
                    "A neutral judgment, or a dismissal, rather than an eviction on your name",
                    "A move-out date agreed between you, not a sheriff's notice",
                    "The deposit dealt with in writing instead of quietly kept",
                    "Repairs and habitability problems put on the record",
                    "Time to find somewhere decent instead of anywhere at all",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 border-b border-go/25 pb-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-go" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-foreground/70">
                  These are the kinds of terms that get negotiated in answered cases —
                  not a guarantee, and never on the table for a tenant who stayed
                  silent. Every one of them exists because an answer was filed.
                </p>
              </div>
            </div>


            <div className="mt-8 flex flex-wrap items-center gap-4 border-2 border-ink bg-ink p-6 text-ink-foreground">
              <p className="font-display text-2xl uppercase leading-tight">
                Your deadline is not going to move. Start it now.
              </p>
              <Link
                to="/build"
                className="inline-flex items-center gap-2 border-2 border-ink-foreground bg-signal px-6 py-4 font-display uppercase text-signal-foreground transition-transform hover:-translate-y-1"
              >
                Start my answer <ArrowRight className="size-5" />
              </Link>


            </div>

            <p className="mt-6 max-w-3xl text-muted-foreground">
              That's the whole reason we exist. Your answer is the leverage — so we spend
              our time helping you build a strong one, in your own words, on the form the
              court expects. Filing it doesn't make you difficult. It makes you someone
              they have to deal with.
            </p>
            <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
              Figures reflect general patterns in California unlawful detainer cases and
              are not a promise about your case. We're not lawyers and this isn't legal
              advice.
            </p>
          </div>
        </section>







        {/* Defenses */}
        <section className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl sm:text-5xl">
                Winnable cases
                <br />
                get lost on
                <br />
                <span className="text-signal">paperwork.</span>
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                Landlords have lawyers who file for a living. Most tenants stand alone.
                The gap is not who is right — it is who filed on time, on the correct
                paper.
              </p>
              <Link
                to="/how-it-works"
                className="mt-8 inline-flex items-center gap-2 border-2 border-ink bg-background px-6 py-4 font-display uppercase shadow-slab transition-transform hover:-translate-y-1"
              >
                See the whole process <ArrowRight className="size-5" />
              </Link>
            </div>

            <div className="slab p-6 sm:p-8">
              <p className="eyebrow text-signal">Some reasons your eviction paperwork might be wrong</p>
              <p className="mt-3 text-sm text-muted-foreground">
                We check for these — and more — while you fill in your answer.
              </p>
              <ul className="mt-5 space-y-4">
                {DEFENSES.map((item) => (
                  <li key={item.label} className="flex gap-3 border-b border-border pb-4">
                    <span className="font-display text-signal">→</span>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm text-muted-foreground">
                Any of these can matter. We help you say them properly; we do not decide
                your case for you.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="bg-signal py-16 text-signal-foreground">
          <div className="container-page text-center">
            <h2 className="text-5xl sm:text-7xl">Don't hand them a default.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">
              Ten court days is enough time — if you start today.
            </p>
            <Link
              to="/build"
              className="mt-8 inline-block border-2 border-ink-foreground bg-ink px-8 py-5 font-display text-xl uppercase text-ink-foreground transition-transform hover:-translate-y-1"
            >
              Start my answer — free to fill in
            </Link>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
