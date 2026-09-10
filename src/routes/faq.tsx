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
    a: "No. We are not a law firm and not attorneys. We help you prepare your own court documents and give legal information. We do not give legal advice, choose your defenses for you, or represent you in court.",
  },
  {
    q: "What form is the answer on?",
    a: "The official Judicial Council tick-box form, UD-105. You do not download it or fill it in by hand: you answer short questions on screen and we fill the boxes for you. Where your own account of events needs more room, it continues on the attached page that goes with the form, formatted the way the court expects.",
  },
  {
    q: "What does it cost to actually file?",
    a: "The court charges a filing fee of about $240 to $450. That is the court's money, not ours. If you cannot afford it, you can hand in a fee waiver request at the same time and the court decides — we include that form in your pack.",
  },
  {
    q: "Do I have to give the landlord a copy?",
    a: "Yes. Filing at the court is only half of it — a copy of your answer has to be delivered to the landlord or their attorney by someone over 18 who is not you, and the proof of service goes to the court. Your pack includes that form, ready to sign.",
  },
  {
    q: "My roommates are on the papers too. One answer or several?",
    a: "You can all sign one answer only if you all have the same reasons for fighting it. If one of you has a reason the others do not, that person should file their own. Everyone named who wants to be heard has to be on an answer.",
  },
  {
    q: "How many copies should I bring?",
    a: "At least two, plus the original. The court keeps the original, you keep one, and one goes to the landlord. Ask the clerk whether your courthouse has its own local forms as well.",
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
