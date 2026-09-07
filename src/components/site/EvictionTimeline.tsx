import { AlertTriangle, ShieldCheck } from "lucide-react";

interface Milestone {
  day: number;
  label: string;
  detail: string;
}

const NO_ANSWER: Milestone[] = [
  { day: 0, label: "Papers served", detail: "The court case against you starts." },
  {
    day: 14,
    label: "Your deadline passes",
    detail:
      "You get 10 court days to answer — weekends and court holidays are not counted, so that lands around day 14. You file nothing.",
  },
  {
    day: 15,
    label: "Default entered",
    detail: "The landlord asks the clerk to rule against you. No hearing, no judge.",
  },
  {
    day: 19,
    label: "Judgment for the landlord",
    detail: "Possession, unpaid rent and costs are awarded against you.",
  },
  {
    day: 21,
    label: "Sheriff notice on the door",
    detail: "A 5-day notice to vacate is posted at the property.",
  },
  {
    day: 26,
    label: "Lockout",
    detail: "The sheriff removes you. Under four weeks from day one.",
  },
];


const ANSWER: Milestone[] = [
  { day: 0, label: "Papers served", detail: "The court case against you starts." },
  {
    day: 5,
    label: "Your answer is filed",
    detail: "Your side of the story is on the record. No default can be entered.",
  },
  {
    day: 15,
    label: "Trial is requested",
    detail: "Either side asks the court to set a trial date.",
  },
  {
    day: 40,
    label: "Trial date",
    detail: "You appear and a judge hears both sides. Many cases settle before this.",
  },
  {
    day: 55,
    label: "If you lose at trial",
    detail: "Judgment is entered — but weeks later, with a chance to be heard first.",
  },
  {
    day: 62,
    label: "Lockout at the earliest",
    detail: "Two months or more, and only after a judge actually listened.",
  },
];

function Track({
  title,
  eyebrow,
  milestones,
  tone,
  footnote,
}: {
  title: string;
  eyebrow: string;
  milestones: Milestone[];
  tone: "bad" | "good";
  footnote: string;
}) {
  const max = milestones[milestones.length - 1]!.day;
  const accent = tone === "bad" ? "text-signal" : "text-go";
  const dot = tone === "bad" ? "bg-signal" : "bg-go";

  return (
    <div className="slab flex flex-col p-5 sm:p-7">
      <p className={`eyebrow ${accent}`}>{eyebrow}</p>
      <h3 className="mt-2 font-display text-2xl uppercase leading-none sm:text-3xl">
        {title}
      </h3>

      <div className="mt-5 flex h-3 w-full border-2 border-ink">
        <div
          className={dot}
          style={{ width: `${(milestones[milestones.length - 1]!.day / 62) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Worst case: about {max} days from being served.
      </p>

      <ol className="mt-6 grid gap-0 border-2 border-ink">
        {milestones.map((m, i) => (
          <li
            key={m.label}
            className={`grid grid-cols-[4.5rem_1fr] gap-3 p-4 ${
              i === 0 ? "" : "border-t-2 border-ink"
            } ${i === milestones.length - 1 ? "bg-accent" : ""}`}
          >
            <span className="font-mono text-sm uppercase text-muted-foreground">
              Day {m.day}
            </span>
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <span className={`inline-block size-2 shrink-0 ${dot}`} />
                {m.label}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {m.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-5 flex gap-2 text-sm">
        {tone === "bad" ? (
          <AlertTriangle className={`mt-0.5 size-5 shrink-0 ${accent}`} />
        ) : (
          <ShieldCheck className={`mt-0.5 size-5 shrink-0 ${accent}`} />
        )}
        <span className="text-muted-foreground">{footnote}</span>
      </p>
    </div>
  );
}

export function EvictionTimeline() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Track
        eyebrow="If you do nothing"
        title="Out in about two weeks"
        tone="bad"
        milestones={NO_ANSWER}
        footnote="Silence is treated as agreement. The landlord wins without a judge ever hearing why you stopped paying or what was wrong with the place."
      />
      <Track
        eyebrow="If you answer"
        title="Two months, and a judge hears you"
        tone="good"
        milestones={ANSWER}
        footnote="Answering does not automatically win the case. It buys real time, forces a hearing, and gives you room to negotiate a move-out date or a payment deal."
      />
    </div>
  );
}
