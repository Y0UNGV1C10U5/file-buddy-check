import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Check,
  ImagePlus,
  Mail,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import noticeImage from "@/assets/three-day-notice.jpg";
import {
  formatLongDate,
  parseDateInput,
  toISODate,
} from "@/lib/deadline";
import { checkLaZip } from "@/lib/la-county";
import {
  NOTICE_KINDS,
  calculateNotice,
  type NoticeKind,
} from "@/lib/notice";


/**
 * Top-of-funnel page. Everyone who ends up in an unlawful detainer case gets a
 * notice first — this catches them days earlier, gives away a real free answer
 * (when can the landlord actually file?) and holds their contact details so we
 * can warn them the day the court papers land.
 *
 * Phase 0: nothing is sent and nothing leaves the device.
 */

export const Route = createFileRoute("/3-day-notice")({
  head: () => ({
    meta: [
      { title: "3-Day Notice to Pay or Quit — Free Check for LA Tenants" },
      {
        name: "description",
        content:
          "Got a 3-day notice to pay rent or quit in Los Angeles? Check it free: the three days are court days, see the exact date your landlord can file for eviction, and get warned before it happens.",
      },
      {
        property: "og:title",
        content: "Got a 3-day notice? Find out what happens next — free",
      },
      {
        property: "og:description",
        content:
          "Register your 3-day notice to pay or quit. We count the court days, show the first date your landlord can file an unlawful detainer, and remind you before it lands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoticePage,
});

const STORE_KEY = "ud-notice-register-v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function digits(v: string) {
  return v.replace(/\D/g, "");
}

const inputClass =
  "mt-1 w-full border-2 border-ink bg-background px-3 py-3 text-base outline-none focus:border-signal";

function NoticePage() {
  const [served, setServed] = useState("");
  const [kind, setKind] = useState<NoticeKind>("pay_or_quit");
  const [how, setHow] = useState("posted");
  const [mailed, setMailed] = useState("unsure");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [shots, setShots] = useState<{ name: string; url: string }[]>([]);
  const [registered, setRegistered] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { served?: string; kind?: NoticeKind };
        if (saved.served) setServed(saved.served);
        if (saved.kind) setKind(saved.kind);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const servedDate = parseDateInput(served);
  const result = useMemo(
    () => (servedDate ? calculateNotice(servedDate, kind) : null),
    [served, kind],
  );

  const postedNoMail = how === "posted" && mailed === "no";
  const subNoMail = how === "substituted" && mailed === "no";
  const flagged = postedNoMail || subNoMail;
  const county = checkLaZip(zip);

  function register() {
    if (!servedDate) {
      setError("Put in the date the notice was given to you first.");
      return;
    }
    if (!EMAIL_RE.test(email.trim()) || digits(phone).length < 10) {
      setError("We need a working email address and a mobile we can text.");
      return;
    }
    if (county === "incomplete") {
      setError("Add the ZIP code of the home the notice is about.");
      return;
    }
    setError("");
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ served: toISODate(servedDate), kind, zip }),
    );
    if (county === "outside") {
      setWaitlisted(true);
      return;
    }
    setRegistered(true);
  }


  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list)
      .slice(0, 3)
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setShots((s) => [...s, ...next].slice(0, 3));
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b-4 border-ink bg-ink text-ink-foreground">
          <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div>
              <p className="eyebrow text-signal">
                Los Angeles County · Before the court case starts
              </p>
              <h1 className="mt-3 font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
                A 3-day notice to pay or quit is the warning shot.
              </h1>
              <p className="mt-5 max-w-xl text-lg opacity-90">
                It is not an eviction, and you do not have to move out because of
                it. It is the paper a landlord has to serve before they are
                allowed to sue you. Register it here and we will tell you — free —
                the exact date they can file, whether the three days were counted
                properly, and we will warn you the moment the court papers are due.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#check"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
                >
                  Register my notice — free <ArrowRight className="size-5" />
                </a>
                <Link
                  to="/build"
                  className="inline-flex items-center gap-2 border-2 border-ink-foreground px-6 py-4 font-display text-lg uppercase transition-colors hover:bg-ink-foreground hover:text-ink"
                >
                  I already have court papers
                </Link>
              </div>
            </div>
            <img
              src={noticeImage}
              alt="A three-day notice to pay rent or quit taped to an apartment door"
              className="w-full -rotate-2 border-4 border-signal object-cover shadow-2xl"
              loading="lazy"
            />
          </div>
        </section>

        {/* Why it matters */}
        <section className="border-b-4 border-ink bg-background">
          <div className="container-page grid gap-5 py-12 md:grid-cols-3">
            {[
              {
                title: "The three days are court days",
                body: "Since January 2025 weekends and court holidays do not count in a notice to pay or quit. A notice served on a Thursday may not run out until the middle of next week.",
              },
              {
                title: "The amount has to be right",
                body: "A notice that demands more rent than you actually owe, or names the wrong unit, can be bad on its face. Late fees and utilities often do not belong in it.",
              },
              {
                title: "How it reached you matters",
                body: "Taped to the door on its own is not enough — the law also wants a copy in the mail. Get that wrong and the case built on it is weak.",
              },
            ].map((c) => (
              <article key={c.title} className="slab p-5">
                <h2 className="font-display text-xl uppercase leading-tight">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* The check + register */}
        <section id="check" className="border-b-4 border-ink bg-accent/40">
          <div className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="slab p-5 sm:p-7">
              <p className="eyebrow text-signal">Step one — free, no sign-up</p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-tight">
                Your notice, counted properly
              </h2>

              <label className="mt-5 block">
                <span className="text-sm font-semibold">
                  What kind of notice is it?
                </span>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as NoticeKind)}
                  className={inputClass}
                >
                  {NOTICE_KINDS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-semibold">
                  The day it was given to you
                </span>
                <input
                  type="date"
                  value={served}
                  onChange={(e) => setServed(e.target.value)}
                  className={inputClass}
                />
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold">How did it reach you?</span>
                  <select
                    value={how}
                    onChange={(e) => setHow(e.target.value)}
                    className={inputClass}
                  >
                    <option value="personal">Handed to me</option>
                    <option value="substituted">Left with someone else</option>
                    <option value="posted">Taped to the door</option>
                    <option value="mail_only">Only came in the post</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">
                    Was a copy also mailed to you?
                  </span>
                  <select
                    value={mailed}
                    onChange={(e) => setMailed(e.target.value)}
                    className={inputClass}
                  >
                    <option value="unsure">I'm not sure</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>

              {result ? (
                <div className="mt-6 border-2 border-ink bg-background p-4">
                  <p className="eyebrow text-signal">{result.kindLabel}</p>
                  <p className="mt-2 font-display text-2xl uppercase leading-tight">
                    Notice runs out {formatLongDate(result.expires)}
                  </p>
                  <p className="mt-2 text-sm">
                    Earliest your landlord can file an unlawful detainer:{" "}
                    <strong>{formatLongDate(result.earliestFiling)}</strong>{" "}
                    <span className="text-muted-foreground">
                      ({result.authority})
                    </span>
                  </p>
                  <p
                    className={`mt-3 border-2 p-3 font-display text-lg uppercase ${
                      result.expired
                        ? "border-signal bg-signal/10"
                        : "border-ink bg-accent"
                    }`}
                  >
                    {result.expired
                      ? "The notice has run out — court papers can arrive any day."
                      : `${result.daysUntilFiling} day${result.daysUntilFiling === 1 ? "" : "s"} before they can file.`}
                  </p>

                  {result.days.length > 2 ? (
                    <ul className="mt-4 space-y-1 font-mono text-xs">
                      {result.days.map((d) => (
                        <li
                          key={toISODate(d.date)}
                          className={d.counted ? "" : "text-muted-foreground"}
                        >
                          {formatLongDate(d.date)} — {d.label}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {flagged ? (
                    <p className="mt-4 flex gap-2 border-2 border-signal bg-signal/10 p-3 text-sm">
                      <AlertTriangle className="size-5 shrink-0 text-signal" />
                      <span>
                        {postedNoMail
                          ? "Taped to the door with nothing in the mail. California wants both — posting on its own does not complete service of a notice."
                          : "Left with another person with nothing in the mail. That combination does not complete service either."}{" "}
                        Keep the envelope, photograph the door, and write down the
                        date. That is the sort of thing that goes straight into an
                        answer.
                      </span>
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-6 border-2 border-dashed border-ink p-4 text-sm text-muted-foreground">
                  Put the date in and we count the days for you — weekends and
                  court holidays taken out.
                </p>
              )}
            </div>

            {/* Register */}
            <div className="slab p-5 sm:p-7">
              <p className="eyebrow text-signal">Step two — keep the countdown</p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-tight">
                Register the notice and we watch the clock
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We hold the date, keep a countdown running, and message you before
                the day your landlord is allowed to file — and again when your
                answer is due if they do. Free. Nothing to pay unless you later ask
                us to prepare your answer.
              </p>

              {waitlisted ? (
                <div className="mt-6 border-2 border-ink bg-background p-5">
                  <p className="flex items-center gap-2 font-display text-2xl uppercase">
                    <MapPin className="size-6 text-signal" /> You're outside LA
                    County
                  </p>
                  <p className="mt-3 text-sm">
                    ZIP {zip} doesn't look like Los Angeles County, and LA is the
                    only county we prepare filings for right now. Your date and
                    details are saved — we'll email <strong>{email.trim()}</strong>{" "}
                    the day we open in your county.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The counting above still applies everywhere in California, so
                    keep your dates. If that ZIP is wrong, fix it and register
                    again.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWaitlisted(false)}
                    className="mt-4 font-mono text-xs uppercase underline"
                  >
                    Change my ZIP code
                  </button>
                </div>
              ) : registered ? (
                <div className="mt-6 border-2 border-ink bg-accent p-5">
                  <p className="flex items-center gap-2 font-display text-2xl uppercase">
                    <Check className="size-6 text-signal" /> Notice registered
                  </p>
                  <p className="mt-3 text-sm">
                    Countdown running for <strong>{email.trim()}</strong>. We will
                    text <strong>{phone.trim()}</strong>
                    {result
                      ? ` before ${formatLongDate(result.earliestFiling)}.`
                      : "."}
                  </p>
                  <Link
                    to="/build"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
                  >
                    Get a head start on my answer <ArrowRight className="size-5" />
                  </Link>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Most people who start early file the same night the papers
                    arrive. It costs nothing to fill in.
                  </p>
                </div>
              ) : (

                <>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="size-4 text-signal" /> Email address
                      </span>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        maxLength={120}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Smartphone className="size-4 text-signal" /> Mobile number
                      </span>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        maxLength={20}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(213) 555-0142"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <p className="mt-5 flex items-center gap-2 font-display text-lg uppercase">
                    <ImagePlus className="size-5 text-signal" /> Photograph the
                    notice (optional)
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Flat, all four corners in shot, dates readable. It saves you
                    typing later.
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 w-full border-2 border-dashed border-ink px-6 py-6 font-display uppercase transition-colors hover:bg-accent"
                  >
                    Take a photo or choose a file
                  </button>

                  {shots.length > 0 ? (
                    <ul className="mt-3 grid gap-2">
                      {shots.map((s) => (
                        <li
                          key={s.url}
                          className="flex items-center gap-3 border-2 border-ink p-2 text-sm"
                        >
                          <img
                            src={s.url}
                            alt="Notice page"
                            className="size-12 shrink-0 border border-border object-cover"
                          />
                          <span className="min-w-0 flex-1 truncate">{s.name}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${s.name}`}
                            onClick={() =>
                              setShots((l) => l.filter((x) => x.url !== s.url))
                            }
                            className="border-2 border-border p-1 hover:border-ink"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {error ? (
                    <p className="mt-4 border-2 border-signal bg-signal/10 p-3 text-sm font-semibold">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={register}
                    className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-6 py-5 font-display text-xl uppercase text-ink-foreground transition-transform hover:-translate-y-1"
                  >
                    <BellRing className="size-6 text-signal" /> Register my notice
                  </button>
                  <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 shrink-0" />
                    We use your email and mobile for your countdown and reminders.
                    Photos stay on your own device until you ask us to prepare your
                    files.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* What happens next */}
        <section className="border-b-4 border-ink bg-background">
          <div className="container-page py-14">
            <h2 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
              What happens after the three days
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                {
                  t: "The notice runs out",
                  b: "Nothing automatically happens. You are not evicted and no one can change the locks.",
                },
                {
                  t: "The landlord files",
                  b: "That filing is the unlawful detainer — the eviction lawsuit itself.",
                },
                {
                  t: "You are served",
                  b: "Summons and complaint. Now you have ten court days to file your answer.",
                },
                {
                  t: "You answer",
                  b: "The answer is what stops a default judgment and makes the case cost the landlord real money.",
                },
              ].map((s, i) => (
                <li key={s.t} className="slab p-5">
                  <span className="font-mono text-xs text-signal">
                    0{i + 1}
                  </span>
                  <p className="mt-1 font-display text-lg uppercase leading-tight">
                    {s.t}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              This page is legal information, not legal advice, and we are not
              lawyers. Nothing here creates a lawyer-client relationship.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
