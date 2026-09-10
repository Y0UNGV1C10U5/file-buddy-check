import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  FileSearch,
  Lock,
  Plus,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
const FILED_THIS_WEEK = 127;

export const Route = createFileRoute("/pricing-tiers")({
  head: () => ({
    meta: [
      { title: "Pricing — Unlawfully Detained" },
      {
        name: "description",
        content:
          "Free deadline check, $97 answer, $197 Fight Kit, $397 Defender, $697 Full Fight. Ready in about 20 minutes, or in an hour on rush.",
      },
      { property: "og:title", content: "Answer, fight, and keep it off your record" },
      {
        property: "og:description",
        content:
          "Flat prices, no retainer. Your paperwork is ready the same night you pay.",
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
  ready: string;
  features: string[];
  note?: string;
  /** What they give up by stopping here — used for the upgrade nudge. */
  missing?: string;
  nextId?: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Deadline Check",
    price: 0,
    ready: "Instant",
    tagline: "Know the exact date you have to file by.",
    features: [
      "Court-day deadline, counted properly",
      "Every skipped weekend and holiday listed",
      "No account, no card",
    ],
    missing:
      "A deadline you can't meet is just a countdown. The answer itself is the only thing that stops a default.",
    nextId: "record",
  },
  {
    id: "record",
    name: "Get It On Record",
    price: 97,
    ready: "Ready in ~20 minutes",
    tagline: "Your answer, filed-ready.",
    features: [
      "Answer — official form UD-105, filled in for you",
      "Your side of the story on an MC-025 attachment",
      "Proof of service (POS-030) and a filing checklist",
    ],
    missing:
      "You stay on record, but you never get to ask them a single question. No discovery means no paper trail, and nothing to use later.",
    nextId: "fight",
  },
  {
    id: "fight",
    name: "Fight Kit",
    price: 197,
    ready: "Ready in ~20 minutes",
    tagline: "The paperwork that puts the pressure back on them.",
    ribbon: "Most popular",
    features: [
      "Everything in Get It On Record",
      "Discovery Pack: requests for admission, requests for production, form interrogatories UD-106",
      "Motion to Deem Admitted, ready to file",
      "Everything they hand over is yours to keep",
    ],
    note: "In an unlawful detainer the clock on them is short, and about 60% of landlords blow it. Miss the date and the facts are deemed admitted — in writing, for good.",
    missing:
      "You can win the paperwork war and still end up with an eviction on your record. Sealing is what keeps the next landlord from seeing it.",
    nextId: "defender",
  },
  {
    id: "defender",
    name: "Defender",
    price: 397,
    ready: "Ready in ~20 minutes",
    tagline: "Settle it, and keep it off your record.",
    ribbon: "Best value",
    features: [
      "Everything in Fight Kit",
      "Settlement & Seal Pack: stipulation with a CCP 1161.2 sealing clause",
      "Motion to Seal and Stay of Execution (CCP 918)",
      "Coach access for 30 days",
    ],
    missing:
      "The last stretch — follow-up discovery, the negotiation script, the ledger audit — is where the money usually comes back.",
    nextId: "ultimate",
  },
  {
    id: "ultimate",
    name: "Full Fight",
    price: 697,
    ready: "Ready in ~20 minutes",
    tagline: "Everything, all the way to the end, with someone in your corner.",
    features: [
      "Everything in Defender",
      "60 days of coach access",
      "Second round of discovery and follow-up demands",
      "Settlement negotiation script and rent ledger audit",
      "Sheriff delay letter",
      "Damages file: your discovery record, organised for what comes after",
    ],
    note: "A lawyer quoted $3,000 for the same stack of paperwork. This keeps it off your record and keeps the file in your hands.",
  },
];

interface AddOn {
  id: string;
  name: string;
  price: number;
  blurb: string;
  icon: typeof Zap;
  /** Tiers where this is already included. */
  includedIn: string[];
}

const ADD_ONS: AddOn[] = [
  {
    id: "rush",
    name: "Rush — ready within the hour",
    price: 39,
    blurb:
      "Filing tomorrow morning? Jump the queue. Your pack is checked and back to you inside 60 minutes, any hour of the night.",
    icon: Zap,
    includedIn: ["ultimate"],
  },
  {
    id: "discovery",
    name: "Discovery Pack",
    price: 149,
    blurb:
      "The questions they have to answer under oath, on a short clock. Whatever they hand over is yours to keep — win or lose.",
    icon: FileSearch,
    includedIn: ["fight", "defender", "ultimate"],
  },
  {
    id: "coach",
    name: "Coach — 30 days",
    price: 79,
    blurb:
      "Plain-English answers when the next letter lands. Not legal advice, just someone who has read a thousand of these.",
    icon: ShieldCheck,
    includedIn: ["defender", "ultimate"],
  },
];

function CheckoutPage() {
  const [selected, setSelected] = useState("fight");
  const [addOns, setAddOns] = useState<string[]>(["rush"]);
  const [email, setEmail] = useState("");
  // Showcase state: pretend the visitor's deadline is close.
  const daysLeft = 4;
  const urgent = daysLeft < 7;

  const plan: Plan = PLANS.find((p) => p.id === selected) ?? (PLANS[2] as Plan);
  const nextPlan = PLANS.find((p) => p.id === plan.nextId);

  const activeAddOns = useMemo(
    () => ADD_ONS.filter((a) => addOns.includes(a.id) && !a.includedIn.includes(plan.id)),
    [addOns, plan.id],
  );
  const total = plan.price + activeAddOns.reduce((sum, a) => sum + a.price, 0);
  const instalment = (total / 4).toFixed(2);

  function toggleAddOn(id: string) {
    setAddOns((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function join() {
    if (!email.trim()) {
      toast.error("Pop your email in first and we'll save your spot.");
      return;
    }
    toast.success(`You're on the list for ${plan.name}. We'll email you when it opens.`);
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
            <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 opacity-80">
              <span className="flex items-center gap-2">
                <Users className="size-5" /> {FILED_THIS_WEEK} tenants filed this week in
                LA County
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-5 text-caution" /> No waiting list — pay at 11pm,
                print by midnight
              </span>
            </p>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="grid gap-6 lg:grid-cols-5">
            {PLANS.map((p) => {
              const active = p.id === selected;
              const isUltimate = p.id === "ultimate";
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className={`relative flex flex-col border-2 bg-card p-5 text-left transition-transform hover:-translate-y-1 ${
                    active
                      ? "border-lasc shadow-slab"
                      : isUltimate && urgent
                        ? "border-signal"
                        : "border-ink"
                  }`}
                >
                  {p.ribbon ? (
                    <span
                      className={`absolute -top-3 left-4 border-2 border-ink px-2 py-0.5 font-display text-[10px] uppercase ${
                        p.id === "fight"
                          ? "bg-lasc text-ink-foreground"
                          : "bg-caution text-ink"
                      }`}
                    >
                      {p.ribbon}
                    </span>
                  ) : null}
                  {isUltimate && urgent ? (
                    <span className="absolute -top-3 left-4 border-2 border-ink bg-signal px-2 py-0.5 font-display text-[10px] uppercase text-signal-foreground">
                      Deadline in {daysLeft} days
                    </span>
                  ) : null}

                  <p className="font-display text-xl uppercase leading-tight">{p.name}</p>
                  <p className="mt-2 font-display text-4xl">
                    {p.price === 0 ? "Free" : `$${p.price}`}
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-mono text-[11px] uppercase text-go">
                    <Clock className="size-3" /> {p.ready}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>

                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-go" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {p.note ? (
                    <p className="mt-4 border-2 border-ink bg-seal p-3 text-xs text-paper-ink">
                      {p.note}
                    </p>
                  ) : null}

                  {isUltimate ? (
                    <p className="mt-3 font-mono text-xs uppercase text-muted-foreground">
                      Or 4 payments of $174.25 with Afterpay
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

          {/* What discovery is really for — the quiet reason to go all the way */}
          <div className="mt-12 border-2 border-ink bg-accent p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="eyebrow text-signal">The part most tenants never hear</p>
                <h2 className="mt-2 text-3xl sm:text-4xl">
                  Discovery is yours to keep — even if the eviction goes against you.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  An unlawful detainer runs on a short fuse, and that cuts both ways. Once
                  you serve discovery, your landlord is on a tight clock to answer under
                  oath and hand over the ledger, the inspection history, the texts, the
                  repair requests they say never happened. Miss the date and those facts
                  can be deemed admitted.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Whatever they produce — or fail to produce — does not disappear when the
                  eviction ends. It becomes a signed, dated record. Tenants who lose
                  possession and still hold that file are the ones in a position to come
                  back later over habitability, deposits, or the way the whole thing was
                  handled.
                </p>
                <p className="mt-4 font-display text-lg uppercase">
                  Fight Kit and above is where that file gets built.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Their rent ledger, in writing",
                  "Every repair complaint they have on file",
                  "Who inspected the unit, and when",
                  "Admissions they can't walk back",
                  "A dated record of what they ignored",
                ].map((item) => (
                  <p
                    key={item}
                    className="border-2 border-ink bg-card px-4 py-3 text-sm"
                  >
                    <Check className="mr-2 inline size-4 text-go" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Upgrade nudge */}
          {nextPlan && plan.missing ? (
            <div className="mt-8 border-2 border-signal bg-card p-6 sm:p-8">
              <p className="eyebrow text-signal">Before you settle on {plan.name}</p>
              <p className="mt-2 max-w-3xl text-lg">{plan.missing}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelected(nextPlan.id)}
                  className="border-2 border-ink bg-signal px-6 py-3 font-display uppercase text-signal-foreground transition-transform hover:-translate-y-1"
                >
                  Step up to {nextPlan.name} — ${nextPlan.price - plan.price} more
                </button>
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Same 20 minutes. Same night.
                </p>
              </div>
            </div>
          ) : null}

          {/* Add-ons */}
          <div className="mt-12">
            <p className="eyebrow text-signal">Add to your pack</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {ADD_ONS.map((a) => {
                const included = a.includedIn.includes(plan.id);
                const on = included || addOns.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={included}
                    onClick={() => toggleAddOn(a.id)}
                    className={`flex flex-col border-2 p-5 text-left transition-transform ${
                      on ? "border-lasc bg-card" : "border-ink bg-background"
                    } ${included ? "opacity-70" : "hover:-translate-y-1"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <a.icon className="size-6 text-signal" />
                      <span className="font-display text-2xl">
                        {included ? "Included" : `+$${a.price}`}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-lg uppercase leading-tight">
                      {a.name}
                    </p>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.blurb}</p>
                    <span className="mt-4 flex items-center gap-2 font-mono text-xs uppercase">
                      {on ? (
                        <>
                          <Check className="size-4 text-go" />
                          {included ? "In your pack" : "Added"}
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" /> Add
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Waitlist capture + running total */}
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="slab p-6 sm:p-8">
              <p className="eyebrow text-signal">No queue, no waiting</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Get started</h2>
              <p className="mt-3 text-muted-foreground">
                You fill in the boxes, we put the pack together. Standard packs come back
                in about 20 minutes; on rush, inside the hour — 2am on a Sunday included.
              </p>

              <div className="mt-6 border-2 border-ink bg-background p-4">
                <div className="flex items-center justify-between font-display text-lg uppercase">
                  <span>{plan.name}</span>
                  <span>{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                </div>
                {activeAddOns.map((a) => (
                  <div
                    key={a.id}
                    className="mt-2 flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <span>{a.name}</span>
                    <span>+${a.price}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3 font-display text-2xl">
                  <span>Total</span>
                  <span>{total === 0 ? "Free" : `$${total}`}</span>
                </div>
                {total > 0 ? (
                  <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                    Or 4 payments of ${instalment} with Afterpay
                  </p>
                ) : null}
              </div>

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
                  onClick={join}
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
              <div className="border-2 border-ink bg-caution p-5 text-ink">
                <Zap className="size-6" />
                <p className="mt-2 font-display text-lg uppercase">
                  Ready in about 20 minutes
                </p>
                <p className="mt-1 text-sm">
                  Nothing is posted to you, nothing is queued for the morning. Pay, print,
                  file.
                </p>
              </div>
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
                  Interest free. Card, PayPal, Venmo, Cash App Pay and bank debit at
                  launch.
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
