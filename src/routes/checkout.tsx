import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Lock, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";


export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pricing — $220 eviction answer, ready within the hour" },
      {
        name: "description",
        content:
          "One flat price of $220 for your answer to an unlawful detainer — official form UD-105, your MC-025 attachment and proof of service, in your hands within the hour.",
      },
      {
        property: "og:title",
        content: "Your eviction answer, ready within the hour — $220",
      },
      {
        property: "og:description",
        content:
          "Flat $220. No retainer, no queue. Fill in the boxes and your filing pack comes back within the hour, guaranteed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const INCLUDED = [
  "Answer — official Judicial Council form UD-105, filled in for you",
  "Your side of the story on the attached page that goes with the form",
  "Proof of service (POS-030), ready to sign",
  "Fee waiver form FW-001 attached by default",
  "A filing checklist and the right courthouse for your property",
  "Print-ready PDFs — nothing posted, nothing queued",
  "Editable Word (.docx) and OpenDocument (.odt) copies, so you can change a line yourself",
];


const PRICE = 220;

function CheckoutPage() {
  const [email, setEmail] = useState("");
  // Showcase state: pretend the visitor's deadline is close.
  const daysLeft = 4;
  const urgent = daysLeft < 7;
  const instalment = (PRICE / 4).toFixed(2);

  function join() {
    if (!email.trim()) {
      toast.error("Pop your email in first and we'll save your spot.");
      return;
    }
    toast.success("You're on the list. We'll email you the moment it opens.");
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
            <p className="eyebrow text-signal">One price. One job. Done tonight.</p>
            <h1 className="mt-3 max-w-3xl text-5xl sm:text-6xl">
              Your answer to the eviction — ${PRICE}, in your hands within the hour.
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 opacity-80">
              <span className="flex items-center gap-2">
                <Users className="size-5" /> {FILED_THIS_WEEK} tenants filed this week in
                LA County
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-5 text-caution" /> No queue — pay at 11pm, print by
                midnight
              </span>
            </p>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* The offer */}
            <div className="relative border-2 border-lasc bg-card p-6 shadow-slab sm:p-8">
              <span className="absolute -top-3 left-6 border-2 border-ink bg-lasc px-2 py-0.5 font-display text-[10px] uppercase text-ink-foreground">
                Everything you need to answer
              </span>
              <p className="font-display text-xl uppercase leading-tight">
                The Answer Pack
              </p>
              <p className="mt-2 font-display text-6xl">${PRICE}</p>
              <p className="mt-1 flex items-center gap-1 font-mono text-[11px] uppercase text-go">
                <Clock className="size-3" /> Guaranteed within the hour
              </p>
              <p className="mt-3 text-muted-foreground">
                Flat price, no retainer, no monthly anything. You fill in the boxes, we
                put the pack together and send it back ready to print and file.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {INCLUDED.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-go" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-2 border-ink bg-seal p-4 text-sm text-paper-ink">
                <strong className="font-display uppercase">
                  The within-the-hour guarantee.
                </strong>{" "}
                Answer the questions honestly and completely and your pack is back inside
                sixty minutes, any hour of the night. If your answers need real chasing —
                missing dates, missing case number, a story we can't follow — we'll come
                back to you fast and the clock restarts when you reply.
              </p>

              <p className="mt-4 border-2 border-ink bg-seal p-4 text-sm text-paper-ink">
                <strong className="font-display uppercase">
                  Accepted-on-the-paperwork guarantee.
                </strong>{" "}
                If the LA Superior Court knocks your pack back on a technicality — wrong
                form, wrong format, wrong line count, a signature block in the wrong place
                — we fix it free, and if it still won't go through you get your money
                back.
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                This covers our drafting and formatting only. It doesn't cover a rejection
                over what your case actually says — the facts, the defenses you chose, a
                missed deadline, or anything the court decides on the substance. We're not
                lawyers and this isn't legal advice.
              </p>


              <p className="mt-4 font-mono text-xs uppercase text-muted-foreground">
                Or 4 payments of ${instalment} with Afterpay
              </p>
            </div>

            {/* Sign up */}
            <div className="space-y-6">
              <div className="slab p-6 sm:p-8">
                <p className="eyebrow text-signal">No queue, no waiting</p>
                <h2 className="mt-2 text-3xl sm:text-4xl">Get started</h2>
                <p className="mt-3 text-muted-foreground">
                  Put your email in and we'll save your spot for launch. Nothing is
                  charged today.
                </p>

                <div className="mt-6 border-2 border-ink bg-background p-4">
                  <div className="flex items-center justify-between font-display text-2xl">
                    <span>Total</span>
                    <span>${PRICE}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                    One payment. No add-ons, no upsells.
                  </p>
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
                    Within the hour, guaranteed
                  </p>
                  <p className="mt-1 text-sm">
                    Nothing is posted to you, nothing waits for the morning. Pay, print,
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
          </div>

          {/* Try before you pay */}
          <div className="mt-12 border-2 border-ink bg-accent p-6 sm:p-8">
            <p className="eyebrow text-signal">Free to look</p>
            <h2 className="mt-2 max-w-3xl text-3xl sm:text-4xl">
              Fill it in first. Pay when you want the files.
            </h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Answer the boxes and watch your form build in front of you. Nothing is
              charged until you ask for the finished pack.
            </p>
            <Link
              to="/build"
              className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-signal px-6 py-4 font-display uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
            >
              Start filling it in — free
            </Link>
          </div>

        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
