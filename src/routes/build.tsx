import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PleadingSheet } from "@/components/site/PleadingSheet";
import { UD105Sheet } from "@/components/site/UD105Sheet";
import { StartGate } from "@/components/site/StartGate";
import { attachmentBlocks, captionFields } from "@/lib/pleading-preview";

import {
  BUILD_DEFENSES,
  DEMO_FIELDS,
  DEMO_PLEADING,
  DENIAL_ITEMS,
  WIZARD_STEPS,
  type BuildFields,
  type FieldKey,
} from "@/lib/demo-data";




const STORAGE_KEY = "ud-build-draft-v2";
const GATE_KEY = "ud-gate-v1";

const MAX_SHORT = 120;
const MAX_LONG = 2000;

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Fill in your answer — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Answer short questions on screen and watch the boxes tick themselves on form UD-105, with your own account on the attached MC-025 page.",
      },
      { property: "og:title", content: "Your words, on form UD-105, live" },
      {
        property: "og:description",
        content:
          "Type into simple boxes on one side; the filled-in UD-105 answer and its attachment page update on the other.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPage,
});

type Fields = BuildFields;

function BuildPage() {
  const [step, setStep] = useState(5);
  const [fields, setFields] = useState<Fields>(DEMO_FIELDS);
  const [enhance, setEnhance] = useState(true);
  const [defenses, setDefenses] = useState<string[]>(["defective", "habitability"]);
  const [denialMode, setDenialMode] = useState<"general" | "specific">("general");
  const [denials, setDenials] = useState<string[]>(["3.a", "4.b"]);
  const [unlocked, setUnlocked] = useState(false);


  // Remember that this browser already verified, so they aren't re-gated on return.
  useEffect(() => {
    if (window.localStorage.getItem(GATE_KEY) === "1") setUnlocked(true);
  }, []);


  // Draft is remembered in this browser only. Nothing leaves the device.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        fields?: Partial<Fields>;
        defenses?: string[];
        denialMode?: "general" | "specific";
        denials?: string[];
      };
      if (parsed.fields) setFields((f) => ({ ...f, ...parsed.fields }));
      if (Array.isArray(parsed.defenses)) setDefenses(parsed.defenses);
      if (parsed.denialMode) setDenialMode(parsed.denialMode);
      if (Array.isArray(parsed.denials)) setDenials(parsed.denials);
    } catch {
      /* ignore a corrupt draft */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fields, defenses, denialMode, denials }),
    );
  }, [fields, defenses, denialMode, denials]);


  function set(key: FieldKey, value: string, max = MAX_SHORT) {
    setFields((f) => ({ ...f, [key]: value.slice(0, max) }));
  }

  const data = useMemo(
    () => ({
      ...DEMO_PLEADING,
      fullName: fields.fullName,
      street: fields.street,
      cityStateZip: fields.cityStateZip,
      phone: fields.phone,
      email: fields.email,
      caseNumber: fields.caseNumber,
      plaintiffs: fields.plaintiff,
      defendants: fields.fullName,
      story: [fields.story, fields.repairs].filter((s) => s.trim()).join("\n\n"),
      verificationDate: fields.signDate,
      defenses,
    }),
    [fields, defenses],
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

  const inputClass =
    "mt-1 w-full border-2 border-ink bg-background px-3 py-2 text-base outline-none focus:border-signal";
  const labelClass = "block text-sm font-semibold";

  function Text({
    label,
    field,
    hint,
    placeholder,
  }: {
    label: string;
    field: FieldKey;
    hint?: string;
    placeholder?: string;
  }) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        {hint ? (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        ) : null}
        <input
          value={fields[field]}
          onChange={(e) => set(field, e.target.value)}
          placeholder={placeholder}
          maxLength={MAX_SHORT}
          className={inputClass}
        />
      </label>
    );
  }

  function Choice({
    label,
    field,
    options,
  }: {
    label: string;
    field: FieldKey;
    options: string[];
  }) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        <select
          value={fields[field]}
          onChange={(e) => set(field, e.target.value)}
          className={inputClass}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function Long({
    label,
    field,
    hint,
  }: {
    label: string;
    field: FieldKey;
    hint?: string;
  }) {
    return (
      <label className="block">
        <span className={labelClass}>{label}</span>
        {hint ? (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        ) : null}
        <textarea
          value={fields[field]}
          onChange={(e) => set(field, e.target.value, MAX_LONG)}
          rows={10}
          maxLength={MAX_LONG}
          className={inputClass}
        />
      </label>
    );
  }

  function StepFields() {
    switch (step) {
      case 0:
        return <Text label="Your full name" field="fullName" hint="Exactly as it appears on the court papers." />;
      case 1:
        return (
          <div className="space-y-4">
            <Text label="Street address" field="street" />
            <Text label="City, state and ZIP" field="cityStateZip" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Text label="Phone" field="phone" />
            <Text label="Email" field="email" />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Text label="Case number" field="caseNumber" hint="Top right of the papers you were served." />
            <Text label="Landlord (plaintiff)" field="plaintiff" />
            <Text label="Courthouse" field="courthouse" />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The landlord's complaint is a list of numbered statements. Anything you
              do not disagree with, the judge treats as agreed. This is item 2 of the
              answer form.
            </p>
            <div className="space-y-2">
              {(
                [
                  {
                    id: "general" as const,
                    label: "I disagree with all of it",
                    hint: "A general denial. Allowed when the landlord is asking for less than $35,000.",
                  },
                  {
                    id: "specific" as const,
                    label: "I only disagree with certain parts",
                    hint: "List the statements you dispute. Everything else counts as agreed.",
                  },
                ]
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 border-2 p-3 text-sm ${
                    denialMode === opt.id ? "border-ink bg-seal" : "border-border hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="denial-mode"
                    checked={denialMode === opt.id}
                    onChange={() => setDenialMode(opt.id)}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--signal)]"
                  />
                  <span className={denialMode === opt.id ? "text-paper-ink" : ""}>
                    <span className="font-semibold">{opt.label}</span>
                    <span className="mt-0.5 block text-xs opacity-70">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {denialMode === "specific" ? (
              <div className="space-y-2 border-t-2 border-ink pt-4">
                <p className="text-sm font-semibold">
                  Which of these do you say is wrong?
                </p>
                {DENIAL_ITEMS.map((item) => {
                  const checked = denials.includes(item.code);
                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer gap-3 border-2 p-3 text-sm ${
                        checked ? "border-ink bg-seal" : "border-border hover:border-ink"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setDenials((prev) =>
                            prev.includes(item.code)
                              ? prev.filter((c) => c !== item.code)
                              : [...prev, item.code],
                          )
                        }
                        className="mt-0.5 size-4 shrink-0 accent-[var(--signal)]"
                      />
                      <span className={checked ? "text-paper-ink" : ""}>
                        <span className="font-mono text-xs opacity-70">{item.code}</span>{" "}
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      case 5:
        return (
          <Long
            label="What happened, in your own words"
            field="story"
            hint="Plain words are fine. Start a new line for each thing you want the court to know."
          />
        );
      case 6:
        return (
          <div className="space-y-4">
            <Choice
              label="What notice did you get?"
              field="noticeType"
              options={[
                "3-day notice to pay rent or quit",
                "3-day notice to perform or quit",
                "30-day notice",
                "60-day notice",
                "No notice at all",
              ]}
            />
            <Text label="Date on the notice" field="noticeDate" placeholder="May 12, 2026" />
            <Choice
              label="How did it reach you?"
              field="noticeServed"
              options={[
                "Handed to me",
                "Left with someone else",
                "Taped to the door",
                "Posted and mailed",
                "I do not know",
              ]}
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <Text label="Monthly rent" field="monthlyRent" placeholder="$2,000" />
            <Text label="Amount the notice demands" field="amountDemanded" placeholder="$2,000" />
            <Text label="Amount you believe is actually owed" field="amountOwed" placeholder="$1,400" />
            <Text label="Last payment you made" field="lastPayment" placeholder="$600 on May 1" />
          </div>
        );
      case 8:
        return (
          <Long
            label="Repairs and conditions"
            field="repairs"
            hint="Anything broken, unsafe or unhealthy, and when you told the landlord."
          />
        );
      case 9:
        return (
          <p className="text-muted-foreground">
            Tick the reasons on the right. Each one ticks the matching box on form
            UD-105 and adds the supporting facts to your attachment page.
          </p>
        );
      case 10:
        return (
          <div className="space-y-4">
            <Choice
              label="How will the landlord's copy be delivered?"
              field="serviceMethod"
              options={["By mail", "In person", "By e-service"]}
            />
            <Text label="Who will deliver it?" field="serverName" hint="Anyone over 18 who is not you." />
          </div>
        );
      case 11:
        return (
          <div className="space-y-4">
            <Text label="Type your name to sign" field="signName" />
            <Text label="Date" field="signDate" placeholder="September 8, 2026" />
            <p className="border-2 border-ink bg-seal p-3 text-sm text-paper-ink">
              Everyone named on the papers has to sign. If another tenant has different
              reasons to fight than you do, they need their own answer.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Check the form on the right. When it looks right, unlock your documents and
              we prepare the UD-105, the attachment page and the proof of service.
            </p>
            <div className="border-2 border-ink p-4">
              <p className="font-display uppercase">When you get to the courthouse</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Bring at least 2 copies.</span>{" "}
                  The court keeps the original, one is yours, one goes to the landlord.
                </li>
                <li>
                  <span className="font-semibold text-foreground">The filing fee is $240–$450.</span>{" "}
                  If you can't afford it, hand in a fee waiver request at the same time —
                  we include the form.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Ask about local forms.</span>{" "}
                  Some courthouses have their own extra forms. The clerk or the self-help
                  centre will tell you.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Then serve the landlord.</span>{" "}
                  Filing is not the end — a copy has to go to the landlord and the proof
                  of service goes back to the court.
                </li>
              </ul>
            </div>
          </div>
        );

    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="bg-background">
        {!unlocked ? (
          <StartGate
            onUnlock={(id) => {
              setFields((f) => ({ ...f, email: id.email, phone: id.phone }));
              setUnlocked(true);
              window.localStorage.setItem(GATE_KEY, "1");
            }}
          />
        ) : (
        <>

        {/* Toolbar */}
        <div className="border-b-2 border-ink bg-ink text-ink-foreground">
          <div className="container-page flex flex-wrap items-center justify-between gap-4 py-3">
            <p className="eyebrow text-signal">
              Case {fields.caseNumber || "—"} · Draft saved on this device
            </p>
            <span className="flex items-center gap-2 font-mono text-xs uppercase opacity-75">
              <Lock className="size-4" /> Nothing charged until you ask for the files
            </span>

          </div>
        </div>

        <div className="container-page grid gap-6 py-8 lg:grid-cols-[30fr_50fr_20fr] lg:items-start">
          {/* LEFT — the questions */}
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

            <div className="mt-4 space-y-4">
              <StepFields />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-ink px-4 py-3 font-display uppercase"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-signal px-4 py-3 font-display uppercase text-signal-foreground"
              >
                Next <ArrowRight className="size-4" />
              </button>
            </div>

            <ol className="mt-6 space-y-1 text-sm">
              {WIZARD_STEPS.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className={`flex w-full gap-2 text-left ${
                      i === step
                        ? "font-semibold text-signal"
                        : i < step
                          ? "text-muted-foreground line-through"
                          : "text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </section>

          {/* CENTER — the form as the court sees it */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow text-signal">Your answer — live</p>
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Form UD-105 + attachment MC-025
              </p>
            </div>

            <div className="space-y-6">
              <UD105Sheet
                caption={caption}
                defenses={formDefenses}
                story={data.story}
                denialMode={denialMode}
                denials={denials}
              />

              <div>
                <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                  Attachment — your facts, in your own words
                </p>
                <PleadingSheet caption={caption} blocks={blocks} />
              </div>
            </div>
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
                    <span className={checked ? "text-paper-ink" : ""}>
                      <span className="font-mono text-xs opacity-70">{d.code}</span>{" "}
                      {d.label}
                    </span>
                  </label>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Ticking a box here ticks the matching box on form UD-105, and the facts
              behind it appear on the attached page, highlighted in yellow.
            </p>

            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-4 font-display uppercase text-ink-foreground transition-transform hover:-translate-y-1"
            >
              <Lock className="size-4" /> Unlock my documents
            </Link>
          </section>
        </div>
        </>
        )}
      </main>


      <SiteFooter />
    </div>
  );
}
