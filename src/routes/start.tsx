import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileEdit, ListChecks, Quote, Users } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FILED_THIS_WEEK, SOCIAL_PROOF } from "@/lib/demo-data";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start your answer — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Two ways to write your eviction answer: guided box-by-box questions, or edit the court document directly. Pick the one that suits you.",
      },
      { property: "og:title", content: "Start your eviction answer" },
      {
        property: "og:description",
        content:
          "Guided box-by-box, or straight into the document. Your words on court-ready pleading paper.",
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

function EditorArt() {
  return (
    <div className="paper-sheet border-2 border-ink p-4">
      <div className="court-type border border-paper-ink/60 px-2 py-1 text-[8px] uppercase">
        Superior Court of California — County of Los Angeles
      </div>
      <div className="mt-3 grid grid-cols-[1rem_1fr] gap-2">
        <div className="court-type space-y-[3px] text-right text-[7px] text-paper-ink/60">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="space-y-[3px] border-l-[3px] border-double border-paper-ink/70 pl-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="h-[6px] bg-paper-ink/15"
              style={{ width: `${60 + ((i * 13) % 38)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StartPage() {
  const [mode, setMode] = useState<"guided" | "editor">("guided");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="bg-background">
        <section className="border-b-4 border-ink bg-ink py-12 text-ink-foreground">
          <div className="container-page flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-signal">Step one</p>
              <h1 className="mt-3 text-5xl sm:text-6xl">How do you want to write it?</h1>
              <p className="mt-4 max-w-xl opacity-85">
                Both roads end in the same place: your answer on proper 28-line pleading
                paper, ready to file.
              </p>
            </div>

            <div className="flex items-center gap-3 border-2 border-ink-foreground/40 p-2">
              <span className="eyebrow opacity-70">Mode</span>
              <button
                type="button"
                onClick={() => setMode(mode === "guided" ? "editor" : "guided")}
                aria-label="Switch mode"
                className="relative h-8 w-16 border-2 border-ink-foreground bg-transparent"
              >
                <span
                  className={`absolute top-0 h-full w-1/2 bg-signal transition-all ${
                    mode === "guided" ? "left-0" : "left-1/2"
                  }`}
                />
              </button>
              <span className="font-display text-sm uppercase">
                {mode === "guided" ? "Guided" : "Edit doc"}
              </span>
            </div>
          </div>
        </section>

        <section className="container-page py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("guided")}
              className={`slab p-6 text-left transition-transform hover:-translate-y-1 sm:p-8 ${
                mode === "guided" ? "outline outline-4 outline-signal" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <ListChecks className="size-7 text-signal" />
                <span className="eyebrow text-signal">Recommended for 90%</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl">Guided mode — box by box</h2>
              <p className="mt-3 text-muted-foreground">
                Twelve short questions in plain English. Answer what you can, skip what
                you cannot. We build the court document behind the scenes as you go.
              </p>
              <div className="mt-6">
                <WizardArt />
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-display uppercase text-signal">
                Start guided <ArrowRight className="size-5" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("editor")}
              className={`slab p-6 text-left transition-transform hover:-translate-y-1 sm:p-8 ${
                mode === "editor" ? "outline outline-4 outline-signal" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <FileEdit className="size-7 text-lasc" />
                <span className="eyebrow text-lasc">For the confident</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl">
                Edit doc mode — I have your template
              </h2>
              <p className="mt-3 text-muted-foreground">
                Type straight into the document. Every box maps to a numbered line, so
                what you see is what the clerk sees.
              </p>
              <div className="mt-6">
                <EditorArt />
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-display uppercase text-lasc">
                Open the editor <ArrowRight className="size-5" />
              </span>
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/build"
              search={{ mode }}
              className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-8 py-5 font-display text-xl uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
            >
              Continue in {mode === "guided" ? "guided" : "edit doc"} mode
              <ArrowRight className="size-6" />
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
                Updated live as answers are downloaded.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
