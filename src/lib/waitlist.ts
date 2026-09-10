/**
 * Out-of-county waitlist.
 *
 * Phase 0: stored on the visitor's own device only. Nothing is sent anywhere
 * yet — this is the shape of the record, ready for Cloud behind it.
 */

export type WaitlistSource = "notice" | "gate";

export interface WaitlistEntry {
  email: string;
  phone: string;
  zip: string;
  source: WaitlistSource;
  savedAt: string;
}

const KEY = "ud-waitlist-v1";

export function saveWaitlist(entry: Omit<WaitlistEntry, "savedAt">) {
  if (typeof window === "undefined") return;
  const record: WaitlistEntry = { ...entry, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // Storage can be blocked in private browsing — not worth breaking the page.
  }
}

export function readWaitlist(): WaitlistEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry) : null;
  } catch {
    return null;
  }
}
