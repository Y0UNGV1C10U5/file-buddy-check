import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Gavel, ShieldCheck, Upload } from "lucide-react";
import heroImage from "@/assets/hero-tenant.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { DeadlineCalculator } from "@/components/site/DeadlineCalculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlawfully Detained — Fight Your LA Eviction on Time" },
      {
        name: "description",
        content:
          "Served with an eviction in Los Angeles? You have 10 court days to answer. Check your exact deadline free, then turn your story into a court-ready filing.",
      },
      { property: "og:title", content: "Unlawfully Detained — Answer Your Eviction" },
      {
        property: "og:description",
        content:
          "10 court days to respond. Check your deadline free and get your answer onto court-accepted paper.",
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
                You have
                <br />
                <span className="text-signal">10 court days.</span>
                <br />
                Not 5.
              </h1>
              <p className="mt-6 max-w-lg text-lg opacity-85">
                The law changed on January 1, 2025. Most websites still say five days.
                Miss the real date and you can lose a case you would have won — without
                ever telling your side.
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

            <div className="relative">
              <img
                src={heroImage}
                width={1280}
                height={1600}
                alt="A tenant standing in the doorway of her Los Angeles apartment at night holding her eviction papers"
                className="w-full border-2 border-ink-foreground/30 object-cover"
              />
              <p className="absolute bottom-0 left-0 max-w-[85%] border-2 border-ink bg-signal px-4 py-3 font-display text-lg uppercase leading-tight text-signal-foreground">
                Got papers? Answer them. Get it on record.
              </p>
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
