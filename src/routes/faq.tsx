import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Eviction Answer FAQ — LA County Tenants" },
      {
        name: "description",
        content:
          "How long do you have to answer an eviction in California? What counts as a court day? What if you already missed the date? Plain answers for LA County tenants.",
      },
      { property: "og:title", content: "Eviction Answer FAQ — Unlawfully Detained" },
      {
        property: "og:description",
        content:
          "Straight answers about the 10 court day deadline, defenses, fees and filing in Los Angeles County.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faq,
});

const FAQS = [
  {
    q: "How long do I have to respond?",
    a: "Ten court days, counted from the day after the papers were served on you. That rule changed on January 1, 2025 under AB 2347 — it used to be five days, and a lot of websites still say five. Court days skip Saturdays, Sundays and court holidays, so ten court days is usually about two weeks.",
  },
  {
    q: "What is a court day?",
    a: "Any day the courthouse is open: Monday to Friday, minus California judicial holidays like New Year's Day, Memorial Day, Juneteenth, Thanksgiving and the day after. Our calculator shows you every skipped day so you can check the count yourself.",
  },
  {
    q: "What happens if I do nothing?",
    a: "The landlord can ask the clerk to enter a default, and the case can be decided without you ever telling your side. Filing something on time is what keeps your case alive.",
  },
  {
    q: "I think the deadline already passed. Is it over?",
    a: "Not necessarily. Until a default is actually entered, a late answer can sometimes still be filed, and there are ways to ask the court to set a default aside. Do not wait — go to a court self-help center or a legal aid provider today.",
  },
  {
    q: "Do I need a lawyer?",
    a: "You are allowed to represent yourself, and most tenants in eviction cases do. If you can get a lawyer, get one — Stay Housed LA and the court self-help centers are free. We exist for everyone who cannot.",
  },
  {
    q: "Are you lawyers?",
    a: "No. We are a registered legal document assistant. We prepare documents and give legal information. We do not give legal advice, choose your defenses for you, or represent you in court.",
  },
  {
    q: "Is the answer on pleading paper?",
    a: "No — the answer itself is an official Judicial Council tick-box form, UD-105. You do not download it or fill it in by hand: you answer short questions on screen and we fill the boxes for you. Where your own account of events needs more room, it goes on an attached page (MC-025) on 28-line pleading paper, and later documents like motions, stipulations and discovery use pleading paper too.",
  },
  {
    q: "What is 28-line pleading paper?",
    a: "California courts require certain documents on numbered paper with a specific caption, line numbering down the left margin and a footer. California Rule of Court 2.108 sets the format. Getting it wrong can get a filing rejected at the window, so we handle the formatting.",
  },

  {
    q: "What defenses can I raise?",
    a: "Common ones include improper service of the notice, a defective notice (wrong amount, wrong address, missing AB 1482 language), the place not being kept livable, retaliation, and discrimination. Our form lists them in plain English so you can tick what fits your situation.",
  },
  {
    q: "Do you work outside Los Angeles?",
    a: "We are starting with LA County Superior Court so we get the local details right. Other California counties are next.",
  },
  {
    q: "Is my information private?",
    a: "Your documents belong to you. We do not sell your information, and we do not share it with landlords or their attorneys.",
  },
];

function Faq() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="border-b-4 border-ink py-16">
          <div className="container-page">
            <p className="eyebrow text-signal">Plain answers</p>
            <h1 className="mt-3 text-5xl sm:text-7xl">Questions people ask at 2am</h1>
          </div>
        </section>

        <section className="container-page py-16">
          <dl className="grid gap-8 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q} className="border-l-4 border-signal pl-5">
                <dt className="font-display text-xl uppercase leading-tight">{item.q}</dt>
                <dd className="mt-3 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 border-2 border-ink bg-accent p-8">
            <h2 className="text-3xl">Still not sure of your date?</h2>
            <Link
              to="/"
              hash="deadline"
              className="mt-6 inline-block border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground shadow-slab transition-transform hover:-translate-y-1"
            >
              Check my deadline
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
