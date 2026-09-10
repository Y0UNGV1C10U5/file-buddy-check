import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Answer Your Eviction in 5 Steps" },
      {
        name: "description",
        content:
          "Download the form, write your side in plain English, upload it, and get a court-formatted answer plus proof of service ready to file in LA County.",
      },
      { property: "og:title", content: "How It Works — Unlawfully Detained" },
      {
        property: "og:description",
        content:
          "Download, fill, upload, file. See how tenants turn their own words into a court-ready answer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    title: "Check your deadline",
    body: "Enter the day you were served. We count 10 court days the way the court counts them — skipping weekends and court holidays. Write the date on your wall.",
  },
  {
    title: "Answer short questions on screen",
    body: "Nothing to download, nothing to print, nothing to send back. You type into simple boxes — your name, the case number, what happened — and you can stop and come back.",
  },
  {
    title: "Say what you disagree with",
    body: "The landlord's complaint is a list of numbered claims. Anything you don't dispute, the judge treats as agreed — so we walk you through each one and mark the ones you say are wrong.",
  },
  {
    title: "Tick the reasons that fit",
    body: "Improper notice, wrong amount, repairs ignored, retaliation. Each one you tick ticks the matching box on the official answer form, UD-105.",
  },
  {
    title: "Watch the form fill itself in",
    body: "Beside your questions you see the real UD-105 as the court sees it, plus the attached page carrying your own account of events.",
  },
  {
    title: "File it",
    body: "You get a print-ready set with a proof of service, and instructions for filing it — at the courthouse window or online. Bring at least two copies; the court's filing fee is $240–$450, and we include the fee waiver form if you need it.",
  },
  {
    title: "Give the landlord their copy",
    body: "Filing isn't the last step. Someone over 18 who isn't you delivers a copy to the landlord or their attorney, signs the proof of service, and that goes to the court.",
  },
];



function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="border-b-4 border-ink bg-ink py-16 text-ink-foreground">
          <div className="container-page">
            <p className="eyebrow text-signal">The whole thing</p>
            <h1 className="mt-3 text-5xl sm:text-7xl">
              Answer. Check.
              <br />
              <span className="text-signal">File. Serve.</span>

            </h1>
            <p className="mt-6 max-w-xl text-lg opacity-80">
              You know your story better than any lawyer does. Our job is to get it onto
              paper the clerk will accept, before the clock runs out.
            </p>
          </div>
        </section>

        <section className="container-page py-16">
          <ol className="grid gap-8 md:grid-cols-2">
            {STEPS.map((step, index) => (
              <li key={step.title} className="slab p-6">
                <span className="font-display text-5xl text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-2xl">{step.title}</h2>
                <p className="mt-3 text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 border-2 border-ink bg-accent p-8">
            <h2 className="text-3xl">Start with the date</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Everything else can be fixed. A missed deadline usually cannot. Check yours
              first — it is free.
            </p>
            <Link
              to="/"
              hash="deadline"
              className="mt-6 inline-block border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
            >
              Check my deadline
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
