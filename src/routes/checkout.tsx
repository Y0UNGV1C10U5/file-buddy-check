import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Lock, ShieldCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FILED_THIS_WEEK } from "@/lib/demo-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pricing — Unlawfully Detained" },
      {
        name: "description",
        content:
          "From a free deadline check to the full Fight Kit and Defender packs. Flat prices, no lawyer retainer, pay in four instalments.",
      },
      { property: "og:title", content: "Answer, fight, and keep it off your record" },
      {
        property: "og:description",
        content:
          "Free deadline check, $97 answer, $197 Fight Kit, $397 Defender, $497 Ultimate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

interface Plan {
  id: string;
  name: string;
  price: number;
  tagline: string;
  ribbon?: string;
  features: string[];
  note?: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Deadline Check",
    price: 0,
    tagline: "Know the exact date you have to file by.",
    features: [
      "Court-day deadline, counted properly",
      "Every skipped weekend and holiday listed",
      "No account, no card",
    ],
  },
  {
    id: "record",
    name: "Get It On Record",
    price: 97,
    tagline: "Your answer, filed-ready.",
    features: [
      "Answer — official form UD-105, filled in for you",
      "Proof of service (POS-030)",
      "Filing checklist for your courthouse",
    ],
  },
  {
    id: "fight",
    name: "Fight Kit",
    price: 197,
    tagline: "Answer plus the paperwork that puts pressure back on them.",
    ribbon: "Most popular",
    features: [
      "Everything in Get It On Record",
      "Discovery Pack: requests for admission, requests for production, form interrogatories UD-106",
      "Motion to Deem Admitted, ready to file",
    ],
    note: "60% of landlords miss the response deadline. Miss it, and the facts are deemed admitted.",
  },
  {
    id: "defender",
    name: "Defender",
    price: 397,
    tagline: "Settle it, and keep it off your record.",
    ribbon: "Best value",
    features: [
      "Everything in Fight Kit",
      "Settlement & Seal Pack: stipulation with a CCP 1161.2 sealing clause",
      "Motion to Seal and Stay of Execution (CCP 918)",
      "Coach access for 30 days",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 497,
    tagline: "Everything, plus someone in your corner for two months.",
    features: [
      "Everything in Defender",
      "60 days of coach access",
      "Settlement negotiation script",
      "Rent ledger audit",
      "Sheriff delay letter",
    ],
    note: "Keeps it off your record — a lawyer quoted $3,000 for the same work.",
  },
];

function CheckoutPage() {
  const [selected, setSelected] = useState("fight");
  const [email, setEmail] = useState("");
  // Showcase state: pretend the visitor's deadline is close.
  const daysLeft = 4;
  const urgent = daysLeft < 7;

  function join(planName: string) {
    if (!email.trim()) {
      toast.error("Pop your email in first and we'll save your spot.");
      return;
    }
    toast.success(`You're on the list for ${planName}. We'll email you when it opens.`);
    setEmail("");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="bg-background">
        {urgent ? (
          <div className="border-b-2 border-ink bg-signal py-3 text-signal-foreground">
            <div className="container-page flex flex-wrap items-center justify-center gap-3 text-center">
              <Clock className="size-5" />
              <p className="font-display text-lg uppercase">
                Only {daysLeft} days left to file your answer
              </p>
            </div>
          </div>
        ) : null}

        <section className="border-b-4 border-ink bg-ink py-12 text-ink-foreground">
          <div className="container-page">
            <p className="eyebrow text-signal">Flat prices, no retainer</p>
            <h1 className="mt-3 max-w-3xl text-5xl sm:text-6xl">
              Pick how hard you want to fight.
            </h1>
            <p className="mt-4 flex items-center gap-2 opacity-80">
              <Users className="size-5" /> {FILED_THIS_WEEK} tenants filed this week in
              LA County
            </p>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="grid gap-6 lg:grid-cols-5">
            {PLANS.map((plan) => {
              const active = plan.id === selected;
              const isUltimate = plan.id === "ultimate";
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  className={`relative flex flex-col border-2 bg-card p-5 text-left transition-transform hover:-translate-y-1 ${
                    active
                      ? "border-lasc shadow-slab"
                      : isUltimate && urgent
                        ? "border-signal"
                        : "border-ink"
                  }`}
                >
                  {plan.ribbon ? (
                    <span
                      className={`absolute -top-3 left-4 border-2 border-ink px-2 py-0.5 font-display text-[10px] uppercase ${
                        plan.id === "fight"
                          ? "bg-lasc text-ink-foreground"
                          : "bg-caution text-ink"
                      }`}
                    >
                      {plan.ribbon}
                    </span>
                  ) : null}
                  {isUltimate && urgent ? (
                    <span className="absolute -top-3 left-4 border-2 border-ink bg-signal px-2 py-0.5 font-display text-[10px] uppercase text-signal-foreground">
                      Deadline in {daysLeft} days
                    </span>
                  ) : null}

                  <p className="font-display text-xl uppercase leading-tight">
                    {plan.name}
                  </p>
                  <p className="mt-2 font-display text-4xl">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>

                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-go" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.note ? (
                    <p className="mt-4 border-2 border-ink bg-seal p-3 text-xs text-paper-ink">
                      {plan.note}
                    </p>
                  ) : null}

                  {isUltimate ? (
                    <p className="mt-3 font-mono text-xs uppercase text-muted-foreground">
                      Or 4 payments of $124.25 with Afterpay
                    </p>
                  ) : null}

                  <span
                    className={`mt-5 block border-2 border-ink px-4 py-3 text-center font-display uppercase ${
                      active
                        ? "bg-signal text-signal-foreground"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {active ? "Selected" : "Choose"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Waitlist capture */}
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="slab p-6 sm:p-8">
              <p className="eyebrow text-signal">Almost open</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Get started</h2>
              <p className="mt-3 text-muted-foreground">
                We are letting tenants in a group at a time so every document gets
                checked. Leave your email and we will open your spot next.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-ink bg-background px-4 py-4 text-base outline-none focus:border-signal"
                />
                <button
                  type="button"
                  onClick={() =>
                    join(PLANS.find((p) => p.id === selected)?.name ?? "Fight Kit")
                  }
                  className="shrink-0 border-2 border-ink bg-signal px-8 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
                >
                  Get Started
                </button>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-4" /> No card taken today. Pay only when your
                documents are ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-2 border-ink bg-accent p-5">
                <ShieldCheck className="size-6 text-go" />
                <p className="mt-2 font-display text-lg uppercase">
                  Not a law firm — and we say so
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Registered legal document assistant disclosure on every page.
                </p>
              </div>
              <div className="border-2 border-ink bg-background p-5">
                <Star className="size-6 text-caution" />
                <p className="mt-2 font-display text-lg uppercase">
                  Pay in 4 with Afterpay or Klarna
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Interest free. Ultimate works out at $124.25 a fortnight.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
