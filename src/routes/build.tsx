import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Sparkles, Users } from "lucide-react";
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
  FILED_THIS_WEEK,
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
  const [step, setStep] = useState(4);
  const [fields, setFields] = useState<Fields>(DEMO_FIELDS);
  const [enhance, setEnhance] = useState(true);
  const [defenses, setDefenses] = useState<string[]>(["defective", "habitability"]);

  // Draft is remembered in this browser only. Nothing leaves the device.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        fields?: Partial<Fields>;
        defenses?: string[];
      };
      if (parsed.fields) setFields((f) => ({ ...f, ...parsed.fields }));
      if (Array.isArray(parsed.defenses)) setDefenses(parsed.defenses);
    } catch {
      /* ignore a corrupt draft */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ fields, defenses }));
  }, [fields, defenses]);

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
          <Long
            label="What happened, in your own words"
            field="story"
            hint="Plain words are fine. Start a new line for each thing you want the court to know."
          />
        );
      case 5:
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
      case 6:
        return (
          <div className="space-y-4">
            <Text label="Monthly rent" field="monthlyRent" placeholder="$2,000" />
            <Text label="Amount the notice demands" field="amountDemanded" placeholder="$2,000" />
            <Text label="Amount you believe is actually owed" field="amountOwed" placeholder="$1,400" />
            <Text label="Last payment you made" field="lastPayment" placeholder="$600 on May 1" />
          </div>
        );
      case 7:
        return (
          <Long
            label="Repairs and conditions"
            field="repairs"
            hint="Anything broken, unsafe or unhealthy, and when you told the landlord."
          />
        );
      case 8:
        return (
          <p className="text-muted-foreground">
            Tick the reasons on the right. Each one ticks the matching box on form
            UD-105 and adds the supporting facts to your attachment page.
          </p>
        );
      case 9:
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
      case 10:
        return (
          <div className="space-y-4">
            <Text label="Type your name to sign" field="signName" />
            <Text label="Date" field="signDate" placeholder="September 8, 2026" />
          </div>
        );
      default:
        return (
          <p className="text-muted-foreground">
            Check the form on the right. When it looks right, unlock your documents and
            we prepare the UD-105, the attachment page and the proof of service.
          </p>
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
              <Users className="size-4" /> {FILED_THIS_WEEK} filed this week in LA County
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
              />
              <div>
                <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                  Attachment 3.k — your facts, on 28-line pleading paper
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
