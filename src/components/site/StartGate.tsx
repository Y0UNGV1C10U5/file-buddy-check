import { useState } from "react";
import { Check, Mail, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { checkLaZip } from "@/lib/la-county";
import { saveWaitlist } from "@/lib/waitlist";
import { PacketScanner, type PacketPage } from "@/components/site/PacketScanner";



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
  const [notices, setNotices] = useState<PacketPage[]>([]);
  const [error, setError] = useState("");

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
          can reach you about your documents, and we read the dates straight off your
          notice instead of asking you to type them twice.
        </p>

        {waitlisted ? (
          <div className="slab mt-7 p-5 sm:p-7">
            <p className="flex items-center gap-2 font-display text-2xl uppercase">
              <MapPin className="size-6 text-signal" /> We're not in your county yet
            </p>
            <p className="mt-3 text-sm">
              ZIP {zip} doesn't look like Los Angeles County, and LA is the only
              county we prepare filings for right now. We've kept your details —{" "}
              <strong>{email.trim()}</strong> — so you're on the list for the day we
              open where you are.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              The deadline and service checks you ran still apply everywhere in
              California, so hold on to your dates. Your answer is still due within
              ten court days of being served, wherever you live.
            </p>
            <button
              type="button"
              onClick={() => setWaitlisted(false)}
              className="mt-4 font-mono text-xs uppercase underline"
            >
              Change my ZIP code
            </button>
          </div>
        ) : (
        <>
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
            ) : county === "outside" ? (
              <span className="mt-1 block text-xs font-semibold">
                That ZIP is outside Los Angeles County. LA is the only county we
                prepare filings for right now — carry on and we'll take your
                details for the day we open there.
              </span>
            ) : null}

          </label>



          {!sent ? (
            <button
              type="button"
              onClick={send}
              className="mt-5 w-full border-2 border-ink bg-signal px-6 py-4 font-display text-lg uppercase text-signal-foreground transition-transform hover:-translate-y-1"
            >
              {county === "outside" ? "Put me on the list" : "Send my codes"}
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


          <PacketScanner pages={notices} onChange={setNotices} />
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
          We hold your email and mobile so we can send your documents. Your photos
          stay on your own device until you ask us to prepare your files.
        </p>
        </>
        )}

      </div>
    </div>
  );
}
