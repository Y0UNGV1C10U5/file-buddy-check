/**
 * Preview-only layout helpers for the LASC 28-line sheet.
 *
 * The caption box is drawn as a box (matching the physical form), so the body
 * blocks below start at the document title rather than repeating the caption.
 */

import type { Block, PleadingData } from "./pleading";

export interface CaptionFields {
  left: { label: string; value: string }[];
  courtLine1: string;
  courtLine2: string;
  caseNumber: string;
  plaintiff: string;
  defendant: string;
}

export function captionFields(data: PleadingData): CaptionFields {
  return {
    left: [
      { label: "Defendant In Pro Per", value: data.fullName || "____________________" },
      { label: "Address", value: data.street || "____________________" },
      { label: "City, CA", value: data.cityStateZip || "____________________" },
      { label: "Phone", value: data.phone || "____________________" },
      { label: "Email", value: data.email || "____________________" },
    ],
    courtLine1: data.courtName || "SUPERIOR COURT OF CALIFORNIA",
    courtLine2: data.judicialDistrict || "COUNTY OF LOS ANGELES",
    caseNumber: data.caseNumber || "____________________",
    plaintiff: data.plaintiffs || "PLAINTIFF",
    defendant: data.defendants || data.fullName || "DEFENDANT",
  };
}

function paragraphs(value: string): string[] {
  return value
    .split(/\n\s*\n|\n|(?<=\.)\s+(?=[A-Z])/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const blank = (): Block => ({ text: "", blank: true });

export interface BodyOptions {
  /** Rewrite the tenant's sentences into court phrasing (visual only). */
  enhance: boolean;
  /** Defence sentences to append, painted yellow in the preview. */
  defenseTexts: string[];
  /** Defence ids added most recently, so the preview can flash them. */
  highlightDefenses?: boolean;
}

export function answerBodyBlocks(
  data: PleadingData,
  options: BodyOptions,
): Block[] {
  const blocks: Block[] = [];

  blocks.push({
    text: (data.title || "ANSWER - UNLAWFUL DETAINER").toUpperCase(),
    align: "center",
    bold: true,
  });
  blocks.push(blank());

  let n = 1;
  blocks.push({
    text: `${n++}. Defendant denies each and every allegation of the Complaint and denies that Plaintiff is entitled to possession of the premises.`,
  });

  for (const p of paragraphs(data.story)) {
    blocks.push(blank());
    blocks.push({
      text: options.enhance
        ? `${n++}. Defendant alleges that ${p.startsWith("I ") ? p : `${p.charAt(0).toLowerCase()}${p.slice(1)}`}`
        : `${n++}. ${p}`,
    });
  }

  if (options.defenseTexts.length > 0) {
    blocks.push(blank());
    blocks.push({ text: "AFFIRMATIVE DEFENSES", align: "center", bold: true });
    blocks.push(blank());
    let d = 1;
    for (const text of options.defenseTexts) {
      blocks.push({
        text: `${d++}. ${text}`,
        highlight: options.highlightDefenses ?? true,
      });
      blocks.push(blank());
    }
  }

  blocks.push(blank());
  blocks.push({ text: "WHEREFORE, Defendant requests:" });
  blocks.push({ text: "1. That Plaintiff take nothing by this Complaint;", indent: 4 });
  blocks.push({ text: "2. That Defendant be awarded costs of suit; and", indent: 4 });
  blocks.push({ text: "3. Such other relief as the Court deems just.", indent: 4 });
  blocks.push(blank());
  blocks.push({
    text: "I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.",
  });
  blocks.push(blank());
  blocks.push({ text: `Dated: ${data.verificationDate || "____________________"}` });
  blocks.push(blank());
  blocks.push({ text: "____________________________________", align: "right" });
  blocks.push({
    text: `${data.fullName || "Defendant"}, Defendant In Pro Per`,
    align: "right",
  });

  return blocks;
}

/**
 * Attachment 3.k (form MC-025) — the continuation page that carries the
 * tenant's own account and the facts behind each ticked defence. This is the
 * part that lives on 28-line pleading paper; the answer itself is UD-105.
 */
export function attachmentBlocks(
  data: PleadingData,
  options: BodyOptions & { defenseLabels?: string[] },
): Block[] {
  const blocks: Block[] = [];

  blocks.push({ text: "ATTACHMENT 3.k (MC-025)", align: "center", bold: true });
  blocks.push({
    text: "FACTS SUPPORTING DEFENDANT'S AFFIRMATIVE DEFENSES",
    align: "center",
    bold: true,
  });
  blocks.push(blank());

  let n = 1;
  for (const p of paragraphs(data.story)) {
    blocks.push({
      text: options.enhance
        ? `${n++}. Defendant alleges that ${p.startsWith("I ") ? p : `${p.charAt(0).toLowerCase()}${p.slice(1)}`}`
        : `${n++}. ${p}`,
    });
    blocks.push(blank());
  }

  for (const text of options.defenseTexts) {
    blocks.push({
      text: `${n++}. ${text}`,
      highlight: options.highlightDefenses ?? true,
    });
    blocks.push(blank());
  }

  blocks.push({
    text: "I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.",
  });
  blocks.push(blank());
  blocks.push({ text: `Dated: ${data.verificationDate || "____________________"}` });
  blocks.push(blank());
  blocks.push({ text: "____________________________________", align: "right" });
  blocks.push({
    text: `${data.fullName || "Defendant"}, Defendant In Pro Per`,
    align: "right",
  });

  return blocks;
}

