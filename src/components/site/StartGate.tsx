import { useRef, useState } from "react";
import { Check, ImagePlus, Mail, MapPin, ShieldCheck, Smartphone, X } from "lucide-react";
import { checkLaZip } from "@/lib/la-county";
import { saveWaitlist } from "@/lib/waitlist";



/**
 * Hard gate in front of the builder.
 *
 * Phase 0: no backend. Codes are not really sent and photos never leave the
 * device — this is the shape of the flow, ready for Cloud to be wired behind it.
 */

export interface GateIdentity {
  email: string;
  phone: string;
  notices: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9]{10,11}$/;

function digits(v: string) {
  return v.replace(/\D/g, "");
}

export function StartGate({ onUnlock }: { onUnlock: (id: GateIdentity) => void }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [sent, setSent] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [notices, setNotices] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const emailOk = EMAIL_RE.test(email.trim());
  const phoneOk = PHONE_RE.test(digits(phone));
  const codesOk = emailCode.trim().length === 6 && smsCode.trim().length === 6;
  const county = checkLaZip(zip);

  function send() {
    if (!emailOk || !phoneOk) {
      setError("We need a working email address and a mobile number we can text.");
      return;
    }
    if (county === "incomplete") {
      setError("Add the ZIP code of the home the case is about.");
      return;
    }
    setError("");
    if (county === "outside") {
      saveWaitlist({
        email: email.trim(),
        phone: digits(phone),
        zip,
        source: "gate",
      });
      setWaitlisted(true);
      return;
    }
    setSent(true);
  }


  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list)
      .slice(0, 4)
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setNotices((n) => [...n, ...next].slice(0, 4));
  }

  function unlock() {
    if (!codesOk) {
      setError("Enter the six-digit code from the email and the one from the text.");
      return;
    }
    if (notices.length === 0) {
      setError("Add a photo of your notice or court papers so we can read the dates.");
      return;
    }
    setError("");
    onUnlock({
      email: email.trim(),
      phone: digits(phone),
      notices: notices.map((n) => n.url),
    });
  }


  const inputClass =
    "mt-1 w-full border-2 border-ink bg-background px-3 py-3 text-base outline-none focus:border-signal";

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-signal">Before you start</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">
          Two contacts and a photo. Then the form opens.
        </h1>
        <p className="mt-3 text-muted-foreground">
          About fifteen minutes, free to fill in. Your deadline is counted in court
          days and it does not wait for anybody — we hold your email and mobile so we
          can warn you before it runs out, and we read the dates straight off your
          notice instead of asking you to type them twice.
        </p>


        <div className="slab mt-7 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
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

          <label className="mt-4 block">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-signal" /> ZIP code of the home
            </span>
            <span className="block text-xs text-muted-foreground">
              Los Angeles County only at the moment. This is how we work out your
              courthouse.
            </span>
            <input
              inputMode="numeric"
              value={zip}
              maxLength={5}
              onChange={(e) => setZip(digits(e.target.value).slice(0, 5))}
              placeholder="90026"
              className={`${inputClass} font-mono tracking-widest`}
            />
            {county === "la" ? (
              <span className="mt-1 block text-xs font-semibold text-signal">
                Los Angeles County — we cover you.
              </span>
            ) : null}
          </label>



          {!sent ? (
            <button
              type="button"
              onClick={send}
              className="mt-5 w-full border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
            >
              Send my codes
            </button>
          ) : (
            <div className="mt-5">
              <p className="border-2 border-ink bg-accent p-3 text-sm">
                Code sent to <strong>{email.trim()}</strong> and texted to{" "}
                <strong>{phone.trim()}</strong>. Both expire in ten minutes.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold">Code from the email</span>
                  <input
                    inputMode="numeric"
                    value={emailCode}
                    maxLength={6}
                    onChange={(e) => setEmailCode(digits(e.target.value))}
                    placeholder="000000"
                    className={`${inputClass} font-mono tracking-[0.4em]`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Code from the text</span>
                  <input
                    inputMode="numeric"
                    value={smsCode}
                    maxLength={6}
                    onChange={(e) => setSmsCode(digits(e.target.value))}
                    placeholder="000000"
                    className={`${inputClass} font-mono tracking-[0.4em]`}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={send}
                className="mt-2 font-mono text-xs uppercase text-muted-foreground underline"
              >
                Send them again
              </button>
            </div>
          )}

          <hr className="my-7 border-t-2 border-ink/15" />


          <p className="flex items-center gap-2 font-display text-xl uppercase leading-tight">
            <ImagePlus className="size-5 text-signal" /> Photograph your papers
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The three-day notice to pay or quit, and the court papers if they have
            arrived. Flat on a table, all four corners in shot, dates readable. Add up to
            four.
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
            className="mt-4 w-full border-2 border-dashed border-ink px-6 py-8 font-display uppercase transition-colors hover:bg-accent"
          >
            Take a photo or choose a file
          </button>

          {notices.length > 0 ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {notices.map((n, i) => (
                <li
                  key={n.url}
                  className="flex items-center gap-3 border-2 border-ink p-2 text-sm"
                >
                  <img
                    src={n.url}
                    alt={`Notice page ${i + 1}`}
                    className="size-14 shrink-0 border border-border object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate">{n.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${n.name}`}
                    onClick={() => setNotices((list) => list.filter((x) => x.url !== n.url))}
                    className="border-2 border-border p-1 hover:border-ink"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {error ? (
          <p className="mt-5 border-2 border-signal bg-signal/10 p-4 text-sm font-semibold">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={unlock}
          disabled={!sent}
          className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-6 py-5 font-display text-xl uppercase text-ink-foreground transition-transform enabled:hover:-translate-y-1 disabled:opacity-40"
        >
          <Check className="size-6 text-signal" /> Open my answer
        </button>

        <p className="mt-4 flex gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0" />
          We use your email and mobile for your deadline reminders and your documents.
          Your photos stay on your own device until you ask us to prepare your files.
        </p>
      </div>
    </div>
  );
}
