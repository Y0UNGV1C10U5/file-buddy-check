import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Gavel, ShieldCheck, Upload } from "lucide-react";
import heroImage from "@/assets/unlawful-detainer-papers.jpg";
import noticeImage from "@/assets/three-day-notice.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DeadlineCalculator } from "@/components/site/DeadlineCalculator";

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
  { icon: FileText, label: "Download", text: "A simple form, no legalese." },
  { icon: Gavel, label: "Fill", text: "Your story, your words." },
  { icon: Upload, label: "Upload", text: "We format it for the court." },
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
                  to="/how-it-works"
                  className="inline-flex items-center border-2 border-ink-foreground px-6 py-4 font-display text-lg uppercase transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  How it works
                </Link>
              </div>
              <p className="mt-6 eyebrow opacity-60">
                Free to check · No account · No card
              </p>
            </div>

            <div className="relative pb-10 pr-6 sm:pr-16">
              <img
                src={heroImage}
                width={1280}
                height={1120}
                alt="An unlawful detainer summons and complaint from the Superior Court of California lying on a kitchen table next to house keys"
                className="w-full border-2 border-ink-foreground/30 object-cover"
              />
              <img
                src={noticeImage}
                width={912}
                height={1200}
                loading="lazy"
                alt="A three day notice to pay rent or quit served on a tenant by a landlord"
                className="absolute -bottom-2 right-0 w-32 rotate-6 border-2 border-ink shadow-slab sm:w-44"
              />
              <p className="absolute bottom-0 left-0 max-w-[70%] border-2 border-ink bg-signal px-4 py-3 font-display text-lg uppercase leading-tight text-signal-foreground">
                Got papers? Answer them. Get it on record.
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
                <span className="text-signal">onto pleading paper.</span>
              </h2>
            </div>
            <div className="space-y-6">
              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">
                  What is pleading paper?
                </p>
                <p className="mt-3 text-muted-foreground">
                  It is the special page courts use — 28 numbered lines down the left
                  side, your name and case details in a set spot at the top, wide
                  margins, one particular font and spacing. A court clerk can reject
                  papers that are not on it, even when everything you wrote is true.
                </p>
              </div>
              <div className="slab p-6">
                <p className="font-display text-2xl uppercase">What we do</p>
                <p className="mt-3 text-muted-foreground">
                  You tell us what happened in your own words — no legal language
                  needed. We turn that into a written answer laid out on proper
                  pleading paper, in the format the Superior Court of California
                  accepts, so it can be filed and put on the record.
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
