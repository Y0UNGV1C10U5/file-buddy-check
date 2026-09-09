/**
 * Are they in Los Angeles County? We only file in LA at launch.
 *
 * ZIP ranges are close but not perfect (a handful of ZIPs straddle the Orange
 * and Ventura county lines), so wording everywhere says we confirm the
 * courthouse from the full address — never "you are definitely outside".
 */

const RANGES: [number, number][] = [
  [90001, 90899], // LA basin, South Bay, Long Beach, Westside
  [91001, 91799], // San Gabriel Valley, San Fernando Valley, Santa Clarita
];

const SINGLES = new Set([
  93510, 93532, 93534, 93535, 93536, 93543, 93544, 93550, 93551, 93552, 93553,
  93560, 93563, 93591, // Antelope Valley — Lancaster, Palmdale, Acton
]);

export type CountyCheck = "la" | "outside" | "incomplete";

export function checkLaZip(zip: string): CountyCheck {
  const clean = zip.replace(/\D/g, "").slice(0, 5);
  if (clean.length < 5) return "incomplete";
  const n = Number(clean);
  if (SINGLES.has(n)) return "la";
  return RANGES.some(([lo, hi]) => n >= lo && n <= hi) ? "la" : "outside";
}
