import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — $79 for One Eviction Answer" },
      {
        name: "description",
        content:
          "$79 for a single court-ready pleading or $97 a month for unlimited filings. Free deadline calculator, free form download, no charge to see your due date.",
      },
      { property: "og:title", content: "Pricing — Unlawfully Detained" },
      {
        property: "og:description",
        content:
          "$79 per pleading, $97 a month unlimited. The deadline check and the form are always free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "always",
    pitch: "Know your date and get the form.",
    features: [
      "Deadline calculator with the day-by-day count",
      "Blank answer form to download",
      "Plain-English guide to common defenses",
      "Links to free legal aid in LA County",
    ],
    cta: "Check my deadline",
    to: "/" as const,
    hash: "deadline",
    emphasis: false,
  },
  {
    name: "One pleading",
    price: "$79",
    cadence: "one time",
    pitch: "One case, one document, done.",
    features: [
      "Your words on 28-line court pleading paper",
      "Editable Word file, ODT and print-ready PDF",
      "POS-030 proof of service filled in",
      "Live preview before you pay",
      "Filing checklist for your courthouse",
    ],
    cta: "Coming soon",
    to: "/" as const,
    hash: "deadline",
    emphasis: true,
  },
  {
    name: "Unlimited",
    price: "$97",
    cadence: "per month",
    pitch: "For a long fight, or an organiser helping many.",
    features: [
      "Everything in One pleading",
      "Unlimited pleadings and revisions",
      "Declarations, motions and extension requests",
      "All documents stored and re-editable",
      "Cancel any time",
    ],
    cta: "Coming soon",
    to: "/" as const,
    hash: "deadline",
    emphasis: false,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="border-b-4 border-ink py-16">
          <div className="container-page">
            <p className="eyebrow text-signal">Straight pricing</p>
            <h1 className="mt-3 text-5xl sm:text-7xl">
              Cheaper than
              <br />
              one night lost.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Checking your deadline is free and always will be. You only pay when you
              want the finished document the court accepts.
            </p>
          </div>
        </section>

        <section className="container-page py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col border-2 border-ink p-7 ${
                  plan.emphasis
                    ? "bg-ink text-ink-foreground shadow-slab-signal"
                    : "bg-card shadow-slab"
                }`}
              >
                <p className="eyebrow text-signal">{plan.name}</p>
                <p className="mt-3 font-display text-6xl leading-none">{plan.price}</p>
                <p className="mt-1 text-sm opacity-70">{plan.cadence}</p>
                <p className="mt-4 font-semibold">{plan.pitch}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-signal" />
                      <span className={plan.emphasis ? "opacity-90" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.to}
                  hash={plan.hash}
                  className={`mt-8 border-2 px-5 py-3 text-center font-display uppercase transition-transform hover:-translate-y-0.5 ${
                    plan.emphasis
                      ? "border-signal bg-signal text-signal-foreground"
                      : "border-ink bg-background"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
            Cannot afford it? You should not go without help. Court self-help centers and
            Stay Housed LA assist tenants for free, and we will always point you there.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
