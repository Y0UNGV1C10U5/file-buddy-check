import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PleadingSheet } from "@/components/site/PleadingSheet";
import { UD105Sheet } from "@/components/site/UD105Sheet";
import { attachmentBlocks, captionFields } from "@/lib/pleading-preview";
import {
  BUILD_DEFENSES,
  DEMO_PLEADING,
  DEMO_STORY,
  FILED_THIS_WEEK,
  WIZARD_STEPS,
} from "@/lib/demo-data";

type Mode = "guided" | "editor";

const STORAGE_KEY = "ud-build-draft-v1";

export const Route = createFileRoute("/build")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "editor" ? "editor" : "guided",
  }),
  head: () => ({
    meta: [
      { title: "Build your answer — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Type your story on the left and watch the boxes tick themselves on form UD-105, with your facts on the attached MC-025 page.",
      },
      { property: "og:title", content: "Your words, on form UD-105, live" },
      {
        property: "og:description",
        content:
          "Box-by-box questions on one side, the filled-in UD-105 answer and its attachment page on the other.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPage,
});


function BuildPage() {
  const { mode: initialMode } = Route.useSearch();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState(4);
  const [story, setStory] = useState(DEMO_STORY);
  const [enhance, setEnhance] = useState(true);
  const [defenses, setDefenses] = useState<string[]>(["defective", "habitability"]);

  // Draft is remembered in this browser only. Nothing is uploaded.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { story?: string; defenses?: string[] };
      if (typeof parsed.story === "string") setStory(parsed.story);
      if (Array.isArray(parsed.defenses)) setDefenses(parsed.defenses);
    } catch {
      /* ignore a corrupt draft */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ story, defenses }));
  }, [story, defenses]);

  const data = useMemo(
    () => ({ ...DEMO_PLEADING, story, defenses }),
    [story, defenses],
  );

  const defenseTexts = BUILD_DEFENSES.filter((d) => defenses.includes(d.id)).map(
    (d) => d.text,
  );

  const blocks = useMemo(
    () => attachmentBlocks(data, { enhance, defenseTexts }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, enhance, defenseTexts.join("|")],
  );

  const formDefenses = BUILD_DEFENSES.map((d) => ({
    code: d.code,
    formLabel: d.formLabel,
    checked: defenses.includes(d.id),
  }));

  const caption = captionFields(data);
  const stepLabel = WIZARD_STEPS[step] ?? WIZARD_STEPS[0]!;


  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="bg-background">
        {/* Toolbar */}
        <div className="border-b-2 border-ink bg-ink text-ink-foreground">
          <div className="container-page flex flex-wrap items-center justify-between gap-4 py-3">
            <p className="eyebrow text-signal">
              Case 24STUD01234 · Draft saved on this device
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 font-mono text-xs uppercase opacity-75">
                <Users className="size-4" /> {FILED_THIS_WEEK} filed this week in LA
                County
              </span>
              <div className="flex border-2 border-ink-foreground/50">
                {(["guided", "editor"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 font-display text-xs uppercase ${
                      mode === m ? "bg-signal text-signal-foreground" : ""
                    }`}
                  >
                    {m === "guided" ? "Guided" : "Edit doc"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container-page grid gap-6 py-8 lg:grid-cols-[30fr_50fr_20fr] lg:items-start">
          {/* LEFT — wizard */}
          <section className="slab p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-signal">
                Step {step + 1} of {WIZARD_STEPS.length}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                {Math.round(((step + 1) / WIZARD_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-3 w-full border-2 border-ink">
              <div
                className="h-full bg-signal transition-all"
                style={{ width: `${((step + 1) / WIZARD_STEPS.length) * 100}%` }}
              />
            </div>

            <h1 className="mt-5 font-display text-2xl uppercase leading-tight">
              {stepLabel}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Plain words are fine. Start a new line for each thing you want the court to
              know.
            </p>

            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={12}
              className="mt-4 w-full border-2 border-ink bg-background px-3 py-2 text-base outline-none focus:border-signal"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-ink px-4 py-3 font-display uppercase"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={() =>
                  setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))
                }
                className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-signal px-4 py-3 font-display uppercase text-signal-foreground"
              >
                Next <ArrowRight className="size-4" />
              </button>
            </div>

            <ol className="mt-6 space-y-1 text-sm">
              {WIZARD_STEPS.map((label, i) => (
                <li
                  key={label}
                  className={`flex gap-2 ${
                    i === step
                      ? "font-semibold text-signal"
                      : i < step
                        ? "text-muted-foreground line-through"
                        : "text-muted-foreground"
                  }`}
                >
                  <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </li>
              ))}
            </ol>
          </section>

          {/* CENTER — the sheet */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow text-signal">
                {mode === "guided" ? "Court version — live" : "Edit doc mode"}
              </p>
              <p className="font-mono text-xs uppercase text-muted-foreground">
                LASC · rule 2.108 · 28 lines
              </p>
            </div>

            {mode === "guided" ? (
              <PleadingSheet
                caption={caption}
                blocks={blocks}
              />
            ) : (
              <div className="paper-sheet border-2 border-ink p-4 sm:p-6">
                <p className="court-type text-[10px] uppercase text-paper-ink/60">
                  Editable document — each box maps to a numbered line
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    { line: "1-6", label: "Caption block", value: DEMO_PLEADING.fullName },
                    { line: "8", label: "Case number", value: DEMO_PLEADING.caseNumber },
                    { line: "9", label: "Plaintiff", value: DEMO_PLEADING.plaintiffs },
                    { line: "11", label: "Defendant", value: DEMO_PLEADING.defendants },
                    { line: "14", label: "Title", value: DEMO_PLEADING.title },
                  ].map((row) => (
                    <div key={row.line} className="grid grid-cols-[3rem_1fr] gap-2">
                      <span className="court-type text-right text-[10px] text-paper-ink/60">
                        {row.line}
                      </span>
                      <input
                        readOnly
                        value={row.value}
                        className="court-type w-full border border-paper-ink/40 bg-paper px-2 py-1 text-xs text-paper-ink"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-[3rem_1fr] gap-2">
                    <span className="court-type text-right text-[10px] text-paper-ink/60">
                      16+
                    </span>
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      rows={14}
                      className="court-type w-full border border-paper-ink/40 bg-paper px-2 py-1 text-xs leading-[1.9] text-paper-ink"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT — defences */}
          <section className="slab p-5">
            <button
              type="button"
              onClick={() => setEnhance((v) => !v)}
              className={`flex w-full items-center justify-between gap-2 border-2 border-ink px-3 py-3 text-left font-display text-sm uppercase ${
                enhance ? "bg-signal text-signal-foreground" : "bg-background"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" /> Enhance into court language
              </span>
              <span>{enhance ? "On" : "Off"}</span>
            </button>

            <p className="mt-5 eyebrow text-signal">Reasons to raise</p>
            <div className="mt-3 space-y-2">
              {BUILD_DEFENSES.map((d) => {
                const checked = defenses.includes(d.id);
                return (
                  <label
                    key={d.id}
                    className={`flex cursor-pointer gap-3 border-2 p-3 text-sm transition-colors ${
                      checked ? "border-ink bg-seal" : "border-border hover:border-ink"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDefenses((prev) =>
                          prev.includes(d.id)
                            ? prev.filter((x) => x !== d.id)
                            : [...prev, d.id],
                        )
                      }
                      className="mt-0.5 size-4 shrink-0 accent-[var(--signal)]"
                    />
                    <span className={checked ? "text-paper-ink" : ""}>{d.label}</span>
                  </label>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Ticking a box drops the matching paragraph into the document, highlighted
              in yellow so you can see exactly what changed.
            </p>

            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-4 font-display uppercase text-ink-foreground transition-transform hover:-translate-y-1"
            >
              <Lock className="size-4" /> Unlock my documents
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
