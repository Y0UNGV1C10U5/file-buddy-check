import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import {
  SERVICE_METHODS,
  calculateDeadline,
  formatLongDate,
  parseDateInput,
  toISODate,
  type ServiceMethod,
} from "@/lib/deadline";

export function DeadlineCalculator() {
  const [dateValue, setDateValue] = useState("");
  const [method, setMethod] = useState<ServiceMethod>("personal");
  const [showWork, setShowWork] = useState(false);

  const serviceDate = parseDateInput(dateValue);
  const result = useMemo(
    () => (serviceDate ? calculateDeadline(serviceDate, method) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateValue, method],
  );

  const statusStyles: Record<string, string> = {
    urgent: "bg-signal text-signal-foreground",
    soon: "bg-ink text-ink-foreground",
    ok: "bg-ink text-ink-foreground",
    passed: "bg-signal text-signal-foreground",
  };

  return (
    <div className="slab p-5 sm:p-8">
      <p className="eyebrow text-signal">Free deadline check</p>
      <h2 className="mt-2 text-3xl sm:text-4xl">When is my answer due?</h2>
      <p className="mt-3 text-muted-foreground">
        Two questions. No account, no card. The date is worked out by fixed rules, not
        guesswork.
      </p>

      <div className="mt-8 grid gap-6">
        <div>
          <label htmlFor="service-date" className="eyebrow block">
            1. Date you were served
          </label>
          <input
            id="service-date"
            type="date"
            value={dateValue}
            max={toISODate(new Date())}
            onChange={(e) => setDateValue(e.target.value)}
            className="mt-2 w-full border-2 border-ink bg-background px-4 py-4 font-display text-xl uppercase outline-none focus:ring-4 focus:ring-signal/30"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            The day the eviction papers reached you — not the date printed on them.
          </p>
        </div>

        <fieldset>
          <legend className="eyebrow">2. How did you get the papers?</legend>
          <div className="mt-2 grid gap-2">
            {SERVICE_METHODS.map((option) => {
              const active = option.id === method;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer gap-3 border-2 p-4 transition-colors ${
                    active
                      ? "border-ink bg-accent"
                      : "border-border hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="service-method"
                    value={option.id}
                    checked={active}
                    onChange={() => setMethod(option.id)}
                    className="mt-1 size-5 accent-[var(--signal)]"
                  />
                  <span>
                    <span className="block font-semibold">{option.label}</span>
                    <span className="block text-sm text-muted-foreground">
                      {option.blurb}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {result ? (
        <div className="mt-8">
          <div className={`border-2 border-ink p-6 ${statusStyles[result.status]}`}>
            <p className="eyebrow opacity-80">
              {result.status === "passed"
                ? "This date has already passed"
                : "Your answer is due by"}
            </p>
            <p className="mt-2 font-display text-3xl uppercase leading-none sm:text-5xl">
              {formatLongDate(result.deadline)}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              {result.status === "passed" ? (
                <AlertTriangle className="size-5 shrink-0" />
              ) : result.status === "urgent" ? (
                <Clock className="size-5 shrink-0" />
              ) : (
                <CheckCircle2 className="size-5 shrink-0" />
              )}
              {result.status === "passed"
                ? "You may still be able to act — a default has to be entered before you lose. Get help today."
                : `${result.courtDaysRemaining} court ${
                    result.courtDaysRemaining === 1 ? "day" : "days"
                  } left (${result.calendarDaysRemaining} calendar days).`}
            </p>
          </div>

          {result.method.needsReview ? (
            <p className="mt-4 flex gap-2 border-2 border-caution bg-caution/10 p-4 text-sm">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-caution" />
              <span>
                Service by mail only is counted from the day you signed and returned the
                acknowledgment form. If you never signed one, the clock may not have
                started. Confirm this with the court self-help center.
              </span>
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setShowWork((v) => !v)}
            className="mt-6 flex items-center gap-2 eyebrow underline-offset-4 hover:underline"
          >
            <CalendarDays className="size-4" />
            {showWork ? "Hide the count" : "Show me the count, day by day"}
          </button>

          {showWork ? (
            <div className="mt-4 border-2 border-ink">
              <p className="border-b-2 border-ink bg-accent px-4 py-3 text-sm">
                Service complete {formatLongDate(result.completionDate)} (
                {result.method.authority}). Counting starts the next day. Weekends and
                California court holidays do not count.
              </p>
              <ul className="divide-y divide-border">
                {result.days.map((day) => (
                  <li
                    key={toISODate(day.date)}
                    className={`flex items-center justify-between gap-4 px-4 py-2 text-sm ${
                      day.counted ? "" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono">{formatLongDate(day.date)}</span>
                    <span
                      className={
                        day.counted ? "font-semibold text-signal" : "text-right"
                      }
                    >
                      {day.counted ? day.courtDayNumber : day.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-6 text-xs text-muted-foreground">
            Based on Code of Civil Procedure § 1167 as amended by AB 2347, effective
            January 1, 2025: 10 court days to respond, counted from the day after service
            is complete. This is legal information, not legal advice. Confirm the date
            with the court.
          </p>
        </div>
      ) : (
        <p className="mt-8 border-2 border-dashed border-border p-6 text-center text-muted-foreground">
          Pick the date you were served to see your deadline.
        </p>
      )}
    </div>
  );
}
