/**
 * Three-day notice math (the step BEFORE a court case exists).
 *
 * CCP § 1161(2), as amended by AB 2347 (effective January 1, 2025): a notice to
 * pay rent or quit gives the tenant 3 COURT days — Saturdays, Sundays and
 * judicial holidays don't count. The landlord cannot file an unlawful detainer
 * until the day after the notice period runs out.
 *
 * Deterministic arithmetic only. Holiday/court-day rules are shared with
 * src/lib/deadline.ts so both tools always agree.
 */

import { holidayName, isWeekend, toISODate } from "./deadline";

export type NoticeKind = "pay_or_quit" | "perform_or_quit" | "thirty" | "sixty";

export const NOTICE_KINDS: {
  id: NoticeKind;
  label: string;
  /** Number of days the notice must run. */
  days: number;
  /** Court days (true) or calendar days (false). */
  courtDays: boolean;
  authority: string;
}[] = [
  {
    id: "pay_or_quit",
    label: "3-day notice to pay rent or quit",
    days: 3,
    courtDays: true,
    authority: "CCP § 1161(2) (AB 2347)",
  },
  {
    id: "perform_or_quit",
    label: "3-day notice to perform or quit",
    days: 3,
    courtDays: true,
    authority: "CCP § 1161(3)",
  },
  {
    id: "thirty",
    label: "30-day notice to end the tenancy",
    days: 30,
    courtDays: false,
    authority: "CCP § 1946.1",
  },
  {
    id: "sixty",
    label: "60-day notice to end the tenancy",
    days: 60,
    courtDays: false,
    authority: "CCP § 1946.1",
  },
];

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export interface NoticeDay {
  date: Date;
  counted: boolean;
  label: string;
}

export interface NoticeResult {
  kindLabel: string;
  authority: string;
  /** Day the notice period runs out. */
  expires: Date;
  /** First day the landlord can lodge an unlawful detainer. */
  earliestFiling: Date;
  days: NoticeDay[];
  /** Calendar days from today until the landlord can file. Negative = already possible. */
  daysUntilFiling: number;
  expired: boolean;
}

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function calculateNotice(
  servedOn: Date,
  kindId: NoticeKind,
  today: Date = new Date(),
): NoticeResult {
  const kind = NOTICE_KINDS.find((k) => k.id === kindId) ?? NOTICE_KINDS[0]!;
  const days: NoticeDay[] = [];

  let cursor = addDays(servedOn, 1);
  let counted = 0;

  if (kind.courtDays) {
    while (counted < kind.days) {
      const holiday = holidayName(cursor);
      if (isWeekend(cursor)) {
        days.push({
          date: cursor,
          counted: false,
          label: `${WEEKDAY[cursor.getDay()]} — doesn't count`,
        });
      } else if (holiday) {
        days.push({
          date: cursor,
          counted: false,
          label: `Court holiday (${holiday}) — doesn't count`,
        });
      } else {
        counted += 1;
        days.push({
          date: cursor,
          counted: true,
          label: `Day ${counted} of ${kind.days}`,
        });
      }
      if (counted === kind.days) break;
      cursor = addDays(cursor, 1);
    }
  } else {
    for (let i = 1; i <= kind.days; i += 1) {
      const date = addDays(servedOn, i);
      days.push({
        date,
        counted: true,
        label: `Day ${i} of ${kind.days}`,
      });
    }
    counted = kind.days;
  }

  const expires = days[days.length - 1]!.date;
  const earliestFiling = addDays(expires, 1);
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysUntilFiling = Math.round(
    (earliestFiling.getTime() - midnight.getTime()) / 86400000,
  );

  return {
    kindLabel: kind.label,
    authority: kind.authority,
    expires,
    earliestFiling,
    days: kind.courtDays ? days : [days[0]!, days[days.length - 1]!],
    daysUntilFiling,
    expired: daysUntilFiling <= 0,
  };
}

/** Stable key so the same notice isn't registered twice on one device. */
export function noticeKey(servedOn: Date, kind: NoticeKind): string {
  return `${toISODate(servedOn)}:${kind}`;
}
