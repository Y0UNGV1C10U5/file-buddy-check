import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Gavel, ShieldCheck, Upload } from "lucide-react";
import heroImage from "@/assets/unlawful-detainer-papers.jpg";
import noticeImage from "@/assets/three-day-notice.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DeadlineCalculator } from "@/components/site/DeadlineCalculator";
import { EvictionTimeline } from "@/components/site/EvictionTimeline";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlawfully Detained — Answer Your LA Eviction Papers" },
      {
        name: "description",
        content:
          "Landlord trying to evict you in Los Angeles? We put your side of the story onto court-accepted pleading paper, and you can check your filing deadline free.",
      },
      { property: "og:title", content: "Unlawfully Detained — Stand Up and Fight" },
      {
        property: "og:description",
        content:
          "Your story, on proper 28-line pleading paper the California Superior Court accepts. Check your deadline free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: Gavel, label: "Check", text: "Your deadline, free, in seconds." },
  { icon: FileText, label: "Answer", text: "Short questions, on screen." },
  { icon: Upload, label: "Fills itself", text: "Form UD-105, as you type." },
  { icon: ShieldCheck, label: "File", text: "Get it on the record." },
];


const DEFENSES = [
  "The notice was never properly served",
  "The notice had the wrong amount or wrong address",
  "Required AB 1482 language was missing",
  "Repairs were ignored and the place was not livable",
  "You were punished for complaining (retaliation)",
  "You were treated differently because of who you are",
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
                  Check my deadline <ArrowRight className="size-5" />
                </a>
                <Link
                  to="/start"
                  className="inline-flex items-center border-2 border-ink-foreground px-6 py-4 font-display text-lg uppercase transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  Build my answer
                </Link>

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
              <a
                href="#deadline"
                className="mt-8 inline-flex items-center gap-2 border-2 border-ink bg-background px-6 py-4 font-display uppercase shadow-slab transition-transform hover:-translate-y-1"
              >
                Already been served? Check your deadline
                <ArrowRight className="size-5" />
              </a>
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
                  Where pleading paper comes in
                </p>
                <p className="mt-3 text-muted-foreground">
                  Anything beyond the answer — the attachment page, motions,
                  stipulations, discovery — goes on 28-numbered-line pleading paper,
                  the layout California courts require. We handle that formatting too.
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


        {/* Calculator */}
        <section id="deadline" className="scroll-mt-20 bg-background py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-4xl sm:text-5xl">
                The clock started
                <br />
                the day after
                <br />
                <span className="text-signal">you were served.</span>
              </h2>
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
        </section>

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
            <div className="grid gap-3 self-center">
              {[
                ["11:12pm", "You start filling in the boxes"],
                ["11:34pm", "You pay"],
                ["11:52pm", "Your pack lands in your inbox, ready to print"],
                ["8:35am", "You're at the filing window"],

              ].map(([time, what]) => (
                <p
                  key={time}
                  className="flex gap-4 border-2 border-ink bg-card px-4 py-3 text-sm text-foreground"
                >
                  <span className="w-20 shrink-0 font-mono text-xs uppercase">
                    {time}
                  </span>
                  <span>{what}</span>
                </p>
              ))}
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
                Open the form and answer the boxes in your own words. As you type, you
                watch your answer build on the real court form, page one and all. Nothing
                to install, nothing charged, and you can stop and come back — your
                answers stay on your own device.
              </p>
              <p className="mt-4 text-muted-foreground">
                When it looks right, pay ${220} and we send the finished pack — print-ready
                PDFs plus editable Word and OpenDocument copies — back within the hour.
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
            <div className="grid content-center gap-3">
              {[
                "See page one of your form as you type",
                "No card, no account, nothing charged to look",
                "Your draft saves on your own device",
                "Pay only when you want the finished files",
                "Print-ready PDFs plus editable Word and ODT",
              ].map((item) => (
                <p key={item} className="border-2 border-ink bg-card px-4 py-3 text-sm">
                  {item}
                </p>
              ))}
            </div>
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
              <p className="eyebrow text-signal">Things worth raising</p>
              <ul className="mt-4 space-y-3">
                {DEFENSES.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-border pb-3">
                    <span className="font-display text-signal">→</span>
                    <span>{item}</span>
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
            <a
              href="#deadline"
              className="mt-8 inline-block border-2 border-ink-foreground bg-ink px-8 py-5 font-display text-xl uppercase text-ink-foreground transition-transform hover:-translate-y-1"
            >
              Check my deadline
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
