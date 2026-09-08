import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, ScanSearch, ShieldAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  DEFAULT_SERVICE_ANSWERS,
  HOW_OPTIONS,
  checkService,
  type HowDelivered,
  type ServiceAnswers,
  type YesNoUnsure,
} from "@/lib/service-check";

const YES_NO: { id: YesNoUnsure; label: string }[] = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "unsure", label: "Not sure" },
];

function Toggle({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: YesNoUnsure;
  onChange: (v: YesNoUnsure) => void;
}) {
  return (
    <div className="border-2 border-border p-4">
      <p className="font-semibold">{label}</p>
      {help ? <p className="mt-1 text-sm text-muted-foreground">{help}</p> : null}
      <div className="mt-3 flex gap-2">
        {YES_NO.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`flex-1 border-2 px-3 py-2 font-display text-sm uppercase transition-colors ${
              value === o.id
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border hover:border-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ServiceCheck() {
  const [answers, setAnswers] = useState<ServiceAnswers>(DEFAULT_SERVICE_ANSWERS);
  const [started, setStarted] = useState(false);

  const set = <K extends keyof ServiceAnswers>(key: K, value: ServiceAnswers[K]) => {
    setStarted(true);
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const finding = useMemo(() => checkService(answers), [answers]);

  const showMailed = answers.how === "substituted" || answers.how === "posted";

  return (
    <div className="slab p-5 sm:p-8">
      <p className="eyebrow text-signal">Free · no card · no account</p>
      <h2 className="mt-2 text-3xl sm:text-4xl">Were you even served properly?</h2>
      <p className="mt-3 text-muted-foreground">
        California is strict about how eviction papers reach you. Taped to the door is
        not enough on its own — a copy must be posted to you as well, and posting needs
        a judge's permission first. Miss a step and the service can be bad on its face.
        Answer four questions and we'll tell you straight, whether or not you ever buy
        anything from us.
      </p>

      <fieldset className="mt-7">
        <legend className="eyebrow">How did the papers reach you?</legend>
        <div className="mt-2 grid gap-2">
          {HOW_OPTIONS.map((option) => {
            const active = option.id === answers.how;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer gap-3 border-2 p-4 transition-colors ${
                  active ? "border-ink bg-accent" : "border-border hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name="how-delivered"
                  value={option.id}
                  checked={active}
                  onChange={() => set("how", option.id as HowDelivered)}
                  className="mt-1 size-5 accent-[var(--signal)]"
                />
                <span>
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {option.blurb}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-3">
        {showMailed ? (
          <Toggle
            label="Was a copy also sent to you in the post?"
            help="Look for a mailing date on the proof of service, and think back to whether a second copy ever arrived."
            value={answers.mailed}
            onChange={(v) => set("mailed", v)}
          />
        ) : null}

        {answers.how === "substituted" ? (
          <Toggle
            label="Was it left with an adult who lives or works there?"
            help="A child, a visitor or a passing neighbour is not enough."
            value={answers.adultReceiver}
            onChange={(v) => set("adultReceiver", v)}
          />
        ) : null}

        {answers.how === "posted" ? (
          <Toggle
            label="Was there a court order allowing them to post it on the door?"
            help="A signed order from a judge, inside the same packet."
            value={answers.courtOrder}
            onChange={(v) => set("courtOrder", v)}
          />
        ) : null}

        {answers.how === "mail_only" ? (
          <Toggle
            label="Did you sign a form and post it back to them?"
            help="An acknowledgment of receipt. Service by post is only complete once that is signed and returned."
            value={answers.signedAck}
            onChange={(v) => set("signedAck", v)}
          />
        ) : null}
      </div>

      {started ? (
        <div className="mt-7">
          <div
            className={`border-2 border-ink p-5 ${
              finding.verdict === "flag"
                ? "bg-signal text-signal-foreground"
                : finding.verdict === "check"
                  ? "bg-caution text-ink"
                  : "bg-accent"
            }`}
          >
            <p className="flex items-center gap-2 font-display text-xl uppercase leading-tight sm:text-2xl">
              {finding.verdict === "flag" ? (
                <ShieldAlert className="size-6 shrink-0" />
              ) : (
                <ScanSearch className="size-6 shrink-0" />
              )}
              {finding.title}
            </p>
            <p className="mt-3 text-sm">{finding.summary}</p>
          </div>

          <ul className="mt-4 grid gap-3">
            {finding.points.map((p) => (
              <li
                key={p.text}
                className={`border-2 p-4 text-sm ${
                  p.strong ? "border-signal bg-signal/5" : "border-border"
                }`}
              >
                <p>{p.text}</p>
                <p className="mt-2 font-mono text-xs uppercase text-muted-foreground">
                  {p.authority}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-2 border-ink bg-ink p-5 text-ink-foreground">
            <p className="flex gap-2 font-display text-lg uppercase leading-tight">
              <AlertTriangle className="size-5 shrink-0 text-signal" />
              Bad service is not a reason to stay quiet
            </p>
            <p className="mt-3 text-sm opacity-90">
              This is the part that catches people out. A defect in how you were served
              does nothing on its own — the court never hears about it unless you put it
              in front of them. If you say nothing, they take a default anyway and the
              bad service becomes irrelevant. It is raised by filing your answer, on
              time, with the point written down.
            </p>
            <Link
              to="/build"
              className="mt-5 inline-flex items-center gap-2 border-2 border-ink-foreground bg-signal px-5 py-3 font-display uppercase text-signal-foreground transition-transform hover:-translate-y-1"
            >
              Put it in my answer <ArrowRight className="size-5" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            General information about California service rules, not legal advice about
            your case. The proof of service filed with the court is the document that
            settles what actually happened.
          </p>
        </div>
      ) : (
        <p className="mt-7 border-2 border-dashed border-border p-6 text-center text-muted-foreground">
          Pick how the papers reached you to see the rules that applied.
        </p>
      )}
    </div>
  );
}
