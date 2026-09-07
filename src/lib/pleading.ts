/**
 * Deterministic model for a California (LASC) 28-line pleading.
 *
 * Everything here is plain data + string layout. No dates, no legal text and
 * no line counts come from a language model. Cal. Rules of Court, rule 2.108
 * governs the paper: 28 numbered lines, one-inch margins, line numbers in the
 * left margin, double spacing for the body.
 */

export const TEMPLATE_URL =
  "/__l5e/assets-v1/c649f1eb-a17f-4170-81c3-d0859bc17a4d/unlawfully-detained-pleading-template.docx";

export const LINES_PER_PAGE = 28;
/** Characters that fit on one 6.5in line of 12pt Times. Used for layout. */
export const CHARS_PER_LINE = 88;

export interface DefenseOption {
  id: string;
  label: string;
  /** The sentence written into the pleading when the box is ticked. */
  text: string;
}

export const DEFENSES: DefenseOption[] = [
  {
    id: "service",
    label: "The notice was never properly served",
    text: "The notice on which this action is based was not served on Defendant in any manner permitted by Code of Civil Procedure section 1162, and Defendant did not receive it as the law requires.",
  },
  {
    id: "defective",
    label: "The notice was defective (wrong amount, wrong address, missing AB 1482 language)",
    text: "The notice is defective on its face. It states an amount, address or term that is incorrect, and it omits language required by Civil Code section 1946.2 (AB 1482), so it cannot support this action.",
  },
  {
    id: "habitability",
    label: "The place was not livable (breach of warranty of habitability)",
    text: "Plaintiff breached the implied warranty of habitability. The premises contained conditions affecting health and safety that Plaintiff failed to repair after notice, reducing the reasonable rental value of the premises.",
  },
  {
    id: "retaliation",
    label: "I was punished for complaining (retaliation, CCP 1942.5)",
    text: "This action is retaliatory within the meaning of Civil Code section 1942.5. Plaintiff commenced it because Defendant complained about the condition of the premises or exercised a legal right.",
  },
  {
    id: "discrimination",
    label: "I was treated differently because of who I am",
    text: "This action is motivated by unlawful discrimination in violation of the Fair Employment and Housing Act and the Unruh Civil Rights Act.",
  },
  {
    id: "overcharge",
    label: "The rent demanded is wrong or was overcharged",
    text: "The rent demanded in the notice exceeds the rent lawfully owed, including any amount barred by applicable rent stabilization or rent increase limits, so the notice overstates the sum due.",
  },
  {
    id: "repairs",
    label: "Repairs were requested and never made",
    text: "Defendant requested repairs from Plaintiff, and Plaintiff failed to make them within a reasonable time, entitling Defendant to an offset against the rent claimed.",
  },
  {
    id: "waiver",
    label: "The landlord accepted rent after the notice",
    text: "Plaintiff accepted rent for a period after the notice expired, waiving the notice and the right to declare a forfeiture of the tenancy.",
  },
];

export interface PleadingData {
  fullName: string;
  street: string;
  cityStateZip: string;
  phone: string;
  email: string;

  courtName: string;
  courtAddress: string;
  caseNumber: string;
  judicialDistrict: string;

  plaintiffs: string;
  defendants: string;
  otherDefendants: string;

  title: string;
  hearingDate: string;
  department: string;

  story: string;
  defenses: string[];
  otherDefense: string;

  verificationDate: string;
  notes: string;

  /** POS-030 proof of service */
  serverName: string;
  serverAddress: string;
  posServiceDate: string;
  posServedName: string;
  posServedAddress: string;
  posMethod: "mail" | "personal";
}

export const EMPTY_PLEADING: PleadingData = {
  fullName: "",
  street: "",
  cityStateZip: "",
  phone: "",
  email: "",
  courtName: "SUPERIOR COURT OF CALIFORNIA, COUNTY OF LOS ANGELES",
  courtAddress: "111 North Hill Street, Los Angeles, CA 90012",
  caseNumber: "",
  judicialDistrict: "Stanley Mosk Courthouse",
  plaintiffs: "",
  defendants: "",
  otherDefendants: "",
  title: "ANSWER — UNLAWFUL DETAINER",
  hearingDate: "",
  department: "",
  story: "",
  defenses: [],
  otherDefense: "",
  verificationDate: "",
  notes: "",
  serverName: "",
  serverAddress: "",
  posServiceDate: "",
  posServedName: "",
  posServedAddress: "",
  posMethod: "mail",
};

/* ------------------------------------------------------------------ */
/* Block model                                                         */
/* ------------------------------------------------------------------ */

export type BlockAlign = "left" | "center" | "right";

export interface Block {
  text: string;
  align?: BlockAlign;
  bold?: boolean;
  underline?: boolean;
  /** Leading spaces applied when the block is laid out. */
  indent?: number;
  /** Force the block to start on a fresh line even if empty. */
  blank?: boolean;
}

const blank = (): Block => ({ text: "", blank: true });

function splitParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Numbered story paragraphs plus the affirmative defenses. */
export function pleadingBlocks(data: PleadingData): Block[] {
  const blocks: Block[] = [];
  const party = data.fullName.trim() || "[Your name]";

  // Caption header — party info block, top left.
  blocks.push({ text: party.toUpperCase() });
  if (data.street.trim()) blocks.push({ text: data.street.trim() });
  if (data.cityStateZip.trim()) blocks.push({ text: data.cityStateZip.trim() });
  if (data.phone.trim()) blocks.push({ text: `Telephone: ${data.phone.trim()}` });
  if (data.email.trim()) blocks.push({ text: `Email: ${data.email.trim()}` });
  blocks.push({ text: "Defendant In Pro Per" });
  blocks.push(blank());
  blocks.push(blank());

  blocks.push({ text: data.courtName.trim().toUpperCase(), align: "center", bold: true });
  if (data.judicialDistrict.trim()) {
    blocks.push({ text: data.judicialDistrict.trim().toUpperCase(), align: "center" });
  }
  blocks.push(blank());

  const caseNo = data.caseNumber.trim() || "[Case number]";
  blocks.push({
    text: `${(data.plaintiffs.trim() || "[Landlord name]").toUpperCase()},`,
  });
  blocks.push({ text: "Plaintiff,", indent: 8 });
  blocks.push({ text: `Case No. ${caseNo}`, align: "right" });
  blocks.push({ text: "vs.", indent: 4 });
  blocks.push({
    text: `${(data.defendants.trim() || party).toUpperCase()}${
      data.otherDefendants.trim() ? `, ${data.otherDefendants.trim().toUpperCase()}` : ""
    },`,
  });
  blocks.push({ text: "Defendant.", indent: 8 });
  if (data.department.trim()) {
    blocks.push({ text: `Dept.: ${data.department.trim()}`, align: "right" });
  }
  if (data.hearingDate.trim()) {
    blocks.push({ text: `Hearing: ${data.hearingDate.trim()}`, align: "right" });
  }
  blocks.push(blank());

  blocks.push({
    text: (data.title.trim() || "ANSWER — UNLAWFUL DETAINER").toUpperCase(),
    align: "center",
    bold: true,
    underline: true,
  });
  blocks.push(blank());

  let n = 1;
  const story = splitParagraphs(data.story);
  if (story.length === 0) {
    blocks.push({
      text: `${n++}. Defendant denies each and every allegation of the Complaint, and denies that Plaintiff is entitled to possession of the premises.`,
    });
  } else {
    blocks.push({
      text: `${n++}. Defendant denies each and every allegation of the Complaint, and denies that Plaintiff is entitled to possession of the premises.`,
    });
    for (const p of story) {
      blocks.push(blank());
      blocks.push({ text: `${n++}. ${p}` });
    }
  }

  const chosen = DEFENSES.filter((d) => data.defenses.includes(d.id));
  if (chosen.length > 0 || data.otherDefense.trim()) {
    blocks.push(blank());
    blocks.push({ text: "AFFIRMATIVE DEFENSES", align: "center", bold: true });
    blocks.push(blank());
    let d = 1;
    for (const def of chosen) {
      blocks.push({ text: `${d++}. ${def.text}` });
      blocks.push(blank());
    }
    if (data.otherDefense.trim()) {
      blocks.push({ text: `${d++}. ${data.otherDefense.trim()}` });
      blocks.push(blank());
    }
  } else {
    blocks.push(blank());
  }

  blocks.push({ text: "WHEREFORE, Defendant requests:", bold: true });
  blocks.push({ text: "1. That Plaintiff take nothing by this Complaint;", indent: 4 });
  blocks.push({ text: "2. That Defendant be awarded costs of suit; and", indent: 4 });
  blocks.push({ text: "3. Such other relief as the Court deems just.", indent: 4 });
  blocks.push(blank());

  if (data.notes.trim()) {
    for (const p of splitParagraphs(data.notes)) {
      blocks.push({ text: p });
      blocks.push(blank());
    }
  }

  blocks.push({
    text: "I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.",
  });
  blocks.push(blank());
  blocks.push({
    text: `Dated: ${data.verificationDate.trim() || "____________________"}`,
  });
  blocks.push(blank());
  blocks.push({ text: "____________________________________", align: "right" });
  blocks.push({ text: `${party}, Defendant In Pro Per`, align: "right" });

  return blocks;
}

/** POS-030 style proof of service, laid out on the same pleading paper. */
export function proofOfServiceBlocks(data: PleadingData): Block[] {
  const blocks: Block[] = [];
  const server = data.serverName.trim() || "[Name of person who served]";
  const method =
    data.posMethod === "mail"
      ? "by placing a true copy in a sealed envelope with postage fully prepaid and depositing it with the United States Postal Service"
      : "by personally delivering a true copy to the person named below";

  blocks.push({ text: (data.fullName.trim() || "[Your name]").toUpperCase() });
  if (data.street.trim()) blocks.push({ text: data.street.trim() });
  if (data.cityStateZip.trim()) blocks.push({ text: data.cityStateZip.trim() });
  blocks.push({ text: "Defendant In Pro Per" });
  blocks.push(blank());
  blocks.push({ text: data.courtName.trim().toUpperCase(), align: "center", bold: true });
  blocks.push(blank());
  blocks.push({ text: `Case No. ${data.caseNumber.trim() || "[Case number]"}`, align: "right" });
  blocks.push(blank());
  blocks.push({
    text: "PROOF OF SERVICE (POS-030)",
    align: "center",
    bold: true,
    underline: true,
  });
  blocks.push(blank());
  blocks.push({
    text: `1. I am over 18 years of age and not a party to this action. My name is ${server} and my address is ${
      data.serverAddress.trim() || "[Address of person who served]"
    }.`,
  });
  blocks.push(blank());
  blocks.push({
    text: `2. On ${
      data.posServiceDate.trim() || "[Date of service]"
    } I served the document titled ${
      data.title.trim() || "ANSWER — UNLAWFUL DETAINER"
    } ${method}, addressed to:`,
  });
  blocks.push(blank());
  blocks.push({ text: data.posServedName.trim() || "[Name of landlord or their attorney]", indent: 8 });
  blocks.push({ text: data.posServedAddress.trim() || "[Their address]", indent: 8 });
  blocks.push(blank());
  blocks.push({
    text: "I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.",
  });
  blocks.push(blank());
  blocks.push({ text: `Dated: ${data.posServiceDate.trim() || "____________________"}` });
  blocks.push(blank());
  blocks.push({ text: "____________________________________", align: "right" });
  blocks.push({ text: server, align: "right" });

  return blocks;
}

/* ------------------------------------------------------------------ */
/* Pagination — wrap blocks into pages of 28 numbered lines            */
/* ------------------------------------------------------------------ */

export interface LaidOutLine {
  /** 1-28 */
  number: number;
  text: string;
  align: BlockAlign;
  bold: boolean;
  underline: boolean;
}

export type Page = LaidOutLine[];

function wrap(text: string, width: number): string[] {
  if (!text) return [""];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function paginate(blocks: Block[], linesPerPage = LINES_PER_PAGE): Page[] {
  const pages: Page[] = [];
  let page: Page = [];

  const push = (line: Omit<LaidOutLine, "number">) => {
    if (page.length === linesPerPage) {
      pages.push(page);
      page = [];
    }
    page.push({ ...line, number: page.length + 1 });
  };

  for (const block of blocks) {
    if (block.blank) {
      push({ text: "", align: "left", bold: false, underline: false });
      continue;
    }
    const indent = " ".repeat(block.indent ?? 0);
    const width = CHARS_PER_LINE - (block.indent ?? 0);
    for (const line of wrap(block.text, width)) {
      push({
        text: block.align === "left" || !block.align ? indent + line : line,
        align: block.align ?? "left",
        bold: block.bold ?? false,
        underline: block.underline ?? false,
      });
    }
  }

  while (page.length < linesPerPage) {
    page.push({
      number: page.length + 1,
      text: "",
      align: "left",
      bold: false,
      underline: false,
    });
  }
  pages.push(page);
  return pages;
}
