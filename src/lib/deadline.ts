/**
 * Deterministic California unlawful detainer answer-deadline math.
 *
 * Rule: CCP § 1167 as amended by AB 2347 (effective January 1, 2025) —
 * a defendant has 10 COURT days to respond to an unlawful detainer summons.
 * Court days exclude Saturdays, Sundays and judicial holidays (CCP § 12a,
 * Gov. Code §§ 6700-6701). The clock starts the day AFTER service is complete.
 *
 * No dates are computed with a language model. This file is plain arithmetic.
 */

export type ServiceMethod =
  | "personal"
  | "substituted"
  | "posting"
  | "mail_ack";

export interface ServiceMethodInfo {
  id: ServiceMethod;
  label: string;
  blurb: string;
  /** Calendar days added before service is legally "complete". */
  completionDays: number;
  /** True when the completion date depends on facts we cannot know. */
  needsReview?: boolean;
  authority: string;
}

export const SERVICE_METHODS: ServiceMethodInfo[] = [
  {
    id: "personal",
    label: "Handed to me in person",
    blurb: "A process server or someone handed the papers directly to you.",
    completionDays: 0,
    authority: "CCP § 415.10",
  },
  {
    id: "substituted",
    label: "Left with someone else, then mailed",
    blurb:
      "Papers were left with another adult at your home or work and a copy was mailed to you.",
    completionDays: 10,
    authority: "CCP § 415.20(b)",
  },
  {
    id: "posting",
    label: "Taped to my door, then mailed",
    blurb:
      "Papers were posted on your door or gate and a copy was mailed. This requires a court order.",
    completionDays: 10,
    authority: "CCP § 415.45",
  },
  {
    id: "mail_ack",
    label: "Mailed to me only",
    blurb:
      "Papers arrived by mail with a form to sign and send back. Timing depends on when you signed it.",
    completionDays: 0,
    needsReview: true,
    authority: "CCP § 415.30",
  },
];

const PERSONAL_SERVICE: ServiceMethodInfo = SERVICE_METHODS[0]!;

/* ------------------------------------------------------------------ */
/* Date helpers — all operate on local calendar dates, time stripped.  */
/* ------------------------------------------------------------------ */

export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  nth: number,
): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - offset);
}

/** Fixed-date holidays observed Friday when they land on Saturday, Monday when Sunday. */
function observed(date: Date): Date {
  const day = date.getDay();
  if (day === 6) return addDays(date, -1);
  if (day === 0) return addDays(date, 1);
  return date;
}

interface Holiday {
  date: Date;
  name: string;
}

/**
 * California judicial holidays for a given year (Gov. Code §§ 6700-6701, CCP § 135).
 *
 * VERIFIED against the Judicial Council 2026 and 2027 published court holiday
 * schedules (courts.ca.gov/about/court-holidays). These rules reproduce both
 * official lists exactly, date for date.
 *
 * Two things people get wrong, and both are wrong in the same direction:
 *  - The second Monday in October is NOT a California court holiday. Columbus
 *    Day was removed as a state holiday in 2009 and the courts stay open. Any
 *    calendar that skips it hands the tenant a deadline one day too late.
 *  - The fourth Friday in September IS a court holiday — Native American Day.
 */
export function judicialHolidays(year: number): Holiday[] {
  const thanksgiving = nthWeekdayOfMonth(year, 10, 4, 4);
  return [
    { date: observed(new Date(year, 0, 1)), name: "New Year's Day" },
    {
      date: nthWeekdayOfMonth(year, 0, 1, 3),
      name: "Martin Luther King Jr. Day",
    },
    { date: observed(new Date(year, 1, 12)), name: "Lincoln's Birthday" },
    { date: nthWeekdayOfMonth(year, 1, 1, 3), name: "Presidents' Day" },
    { date: observed(new Date(year, 2, 31)), name: "César Chávez Day" },
    { date: lastWeekdayOfMonth(year, 4, 1), name: "Memorial Day" },
    { date: observed(new Date(year, 5, 19)), name: "Juneteenth" },
    { date: observed(new Date(year, 6, 4)), name: "Independence Day" },
    { date: nthWeekdayOfMonth(year, 8, 1, 1), name: "Labor Day" },
    { date: nthWeekdayOfMonth(year, 8, 5, 4), name: "Native American Day" },
    { date: observed(new Date(year, 10, 11)), name: "Veterans Day" },
    { date: thanksgiving, name: "Thanksgiving Day" },
    { date: addDays(thanksgiving, 1), name: "Day after Thanksgiving" },
    { date: observed(new Date(year, 11, 25)), name: "Christmas Day" },
  ];
}

const holidayCache = new Map<number, Map<string, string>>();

/**
 * Holidays that FALL IN a given year, which is not the same as the holidays
 * GENERATED FOR that year. When January 1 lands on a Saturday it is observed on
 * Friday December 31 of the year before, so the next year's list has to be
 * folded in or that December 31 silently counts as a court day.
 */
function holidayMap(year: number): Map<string, string> {
  let cached = holidayCache.get(year);
  if (!cached) {
    cached = new Map<string, string>();
    for (const h of [...judicialHolidays(year), ...judicialHolidays(year + 1)]) {
      if (h.date.getFullYear() === year) cached.set(toISODate(h.date), h.name);
    }
    holidayCache.set(year, cached);
  }
  return cached;
}

export function holidayName(date: Date): string | null {
  return holidayMap(date.getFullYear()).get(toISODate(date)) ?? null;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isCourtDay(date: Date): boolean {
  return !isWeekend(date) && holidayName(date) === null;
}

/* ------------------------------------------------------------------ */
/* The calculation                                                     */
/* ------------------------------------------------------------------ */

export interface CountedDay {
  date: Date;
  counted: boolean;
  /** 1-10 when this day counts toward the 10 court days. */
  courtDayNumber: number | null;
  reason: string;
}

export interface DeadlineResult {
  serviceDate: Date;
  method: ServiceMethodInfo;
  /** Date service is legally complete (same as serviceDate for personal service). */
  completionDate: Date;
  /** Last day to file the answer. */
  deadline: Date;
  days: CountedDay[];
  /** Court days remaining from today, negative when the deadline has passed. */
  courtDaysRemaining: number;
  calendarDaysRemaining: number;
  status: "urgent" | "soon" | "ok" | "passed";
}

const WEEKDAY_LABEL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatLongDate(date: Date): string {
  return `${WEEKDAY_LABEL[date.getDay()] ?? ""}, ${date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function countCourtDaysBetween(from: Date, to: Date): number {
  let count = 0;
  let cursor = addDays(from, 1);
  while (cursor.getTime() <= to.getTime()) {
    if (isCourtDay(cursor)) count += 1;
    cursor = addDays(cursor, 1);
  }
  return count;
}

export function calculateDeadline(
  serviceDate: Date,
  methodId: ServiceMethod,
  today: Date = new Date(),
): DeadlineResult {
  const method: ServiceMethodInfo =
    SERVICE_METHODS.find((m) => m.id === methodId) ?? PERSONAL_SERVICE;

  const completionDate = addDays(serviceDate, method.completionDays);

  const days: CountedDay[] = [];
  let counted = 0;
  let cursor = addDays(completionDate, 1);

  while (counted < 10) {
    const holiday = holidayName(cursor);
    if (isWeekend(cursor)) {
      days.push({
        date: cursor,
        counted: false,
        courtDayNumber: null,
        reason: WEEKDAY_LABEL[cursor.getDay()] ?? "Weekend",
      });
    } else if (holiday) {
      days.push({
        date: cursor,
        counted: false,
        courtDayNumber: null,
        reason: `Court holiday — ${holiday}`,
      });
    } else {
      counted += 1;
      days.push({
        date: cursor,
        counted: true,
        courtDayNumber: counted,
        reason: `Court day ${counted} of 10`,
      });
    }
    if (counted === 10) break;
    cursor = addDays(cursor, 1);
  }

  const deadline = days[days.length - 1]!.date;
  const midnightToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const calendarDaysRemaining = Math.round(
    (deadline.getTime() - midnightToday.getTime()) / 86400000,
  );
  const courtDaysRemaining =
    calendarDaysRemaining < 0
      ? -countCourtDaysBetween(deadline, midnightToday)
      : countCourtDaysBetween(midnightToday, deadline);

  let status: DeadlineResult["status"];
  if (calendarDaysRemaining < 0) status = "passed";
  else if (courtDaysRemaining <= 2) status = "urgent";
  else if (courtDaysRemaining <= 5) status = "soon";
  else status = "ok";

  return {
    serviceDate,
    method,
    completionDate,
    deadline,
    days,
    courtDaysRemaining,
    calendarDaysRemaining,
    status,
  };
}
