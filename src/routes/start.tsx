import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ListChecks, Lock, Quote, Users } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FILED_THIS_WEEK, SOCIAL_PROOF, WIZARD_STEPS } from "@/lib/demo-data";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start your answer — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Twelve short questions on screen. Nothing to download, nothing to print, nothing to send back. We fill in official form UD-105 as you type.",
      },
      { property: "og:title", content: "Start your eviction answer" },
      {
        property: "og:description",
        content:
          "Answer plain questions on screen and watch the official UD-105 answer fill itself in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartPage,
});

function WizardArt() {
  return (
    <div className="border-2 border-ink bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-signal">Step 5 of 12</span>
        <span className="font-mono text-xs text-muted-foreground">42%</span>
      </div>
      <div className="mt-2 h-3 w-full border-2 border-ink">
        <div className="h-full bg-signal" style={{ width: "42%" }} />
      </div>
      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 border-2 border-border bg-muted" />
        ))}
        <div className="h-16 border-2 border-ink bg-accent" />
      </div>
    </div>
  );
}

function StartPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="bg-background">
        <section className="border-b-4 border-ink bg-ink py-12 text-ink-foreground">
          <div className="container-page">
            <p className="eyebrow text-signal">Step one</p>
            <h1 className="mt-3 text-5xl sm:text-6xl">
              Twelve short questions. That is the whole job.
            </h1>
            <p className="mt-4 max-w-2xl opacity-85">
              Nothing to download, nothing to print, nothing to send back to us. You
              type into simple boxes on screen and the official answer form — UD-105 —
              fills itself in beside you.
            </p>
          </div>
        </section>

        <section className="container-page py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="slab p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ListChecks className="size-7 text-signal" />
                <span className="eyebrow text-signal">Box by box</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl">What we will ask you</h2>
              <ol className="mt-5 space-y-2 text-sm">
                {WIZARD_STEPS.map((label, i) => (
                  <li key={label} className="flex gap-3">
                    <span className="font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-muted-foreground">
                Answer what you can, skip what you cannot, and come back later — your
                draft stays on your own device.
              </p>
            </div>

            <div className="space-y-6">
              <WizardArt />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border-2 border-ink bg-background p-5">
                  <Clock className="size-6 text-signal" />
                  <p className="mt-3 font-display text-lg uppercase leading-tight">
                    About 15 minutes
                  </p>
                </div>
                <div className="border-2 border-ink bg-background p-5">
                  <Lock className="size-6 text-signal" />
                  <p className="mt-3 font-display text-lg uppercase leading-tight">
                    Free until you are happy with it
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-8 py-5 font-display text-xl uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
            >
              Start my answer <ArrowRight className="size-6" />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="border-2 border-ink bg-accent p-6">
              <Quote className="size-6 text-signal" />
              <p className="mt-3 font-display text-xl uppercase leading-tight">
                {SOCIAL_PROOF}
              </p>
            </div>
            <div className="border-2 border-ink bg-background p-6">
              <Users className="size-6 text-signal" />
              <p className="mt-3 font-display text-xl uppercase leading-tight">
                {FILED_THIS_WEEK} tenants filed this week in LA County
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Updated live as answers are finished.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

