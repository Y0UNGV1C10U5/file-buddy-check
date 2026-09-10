/**
 * Phase 0 showcase fixtures. Fake but realistic, so no screen ever looks empty
 * in a screenshot. Nothing here is used for real filings.
 */

import { EMPTY_PLEADING, type PleadingData } from "./pleading";

export const DEMO_STORY =
  "I paid $600 on May 1. My rent is $2000. The landlord says $2000 is due but it should be $1400. There has been mold in the bathroom since March and I asked for repairs twice. The notice was taped to my door while I was at work.";

export const DEMO_PLEADING: PleadingData = {
  ...EMPTY_PLEADING,
  fullName: "Maria R. Delgado",
  street: "1428 E 4th Street, Apt 3",
  cityStateZip: "Los Angeles, CA 90033",
  phone: "(323) 555-0142",
  email: "maria.r@example.com",
  courtName: "SUPERIOR COURT OF CALIFORNIA",
  judicialDistrict: "COUNTY OF LOS ANGELES",
  caseNumber: "24STUD01234",
  department: "94",
  plaintiffs: "Maple Properties LLC",
  defendants: "Maria R. Delgado",
  title: "ANSWER - UNLAWFUL DETAINER",
  story: DEMO_STORY,
  defenses: ["defective", "habitability"],
  verificationDate: "September 7, 2026",
};

/**
 * The seven defence boxes shown on /build. `code` and `formLabel` mirror the
 * affirmative-defence items on Judicial Council form UD-105; `text` is the
 * wording that lands on the MC-025 attachment page (pleading paper).
 */
export const BUILD_DEFENSES = [
  {
    id: "service",
    code: "3.h",
    label: "Improper service",
    formLabel: "The notice was not served as required by law.",
    text: "The notice was not served in any manner permitted by Code of Civil Procedure section 1162.",
  },
  {
    id: "defective",
    code: "3.a",
    label: "Wrong amount demanded",
    formLabel:
      "Plaintiff's notice demanded more rent than was actually owed (overstated amount).",
    text: "The notice demands rent in excess of the amount lawfully owed and therefore overstates the sum due.",
  },
  {
    id: "ab1482",
    code: "3.j",
    label: "AB 1482 language missing",
    formLabel:
      "The notice omits the just cause and rent cap language required by law.",
    text: "The notice omits the just cause and rent cap language required by Civil Code section 1946.2.",
  },
  {
    id: "habitability",
    code: "3.b",
    label: "Habitability",
    formLabel:
      "Plaintiff breached the warranty to provide habitable premises.",
    text: "Plaintiff breached the implied warranty of habitability by failing to repair conditions affecting health and safety after notice.",
  },
  {
    id: "retaliation",
    code: "3.d",
    label: "Retaliation",
    formLabel: "Plaintiff is evicting in retaliation (Civ. Code, § 1942.5).",
    text: "This action is retaliatory within the meaning of Civil Code section 1942.5.",
  },
  {
    id: "discrimination",
    code: "3.e",
    label: "Discrimination",
    formLabel: "Plaintiff is evicting arbitrarily or for a discriminatory reason.",
    text: "This action is motivated by unlawful discrimination in violation of the Fair Employment and Housing Act.",
  },
  {
    id: "warranty",
    code: "3.c",
    label: "Breach of quiet enjoyment",
    formLabel: "Plaintiff breached the covenant of quiet enjoyment.",
    text: "Plaintiff breached the covenant of quiet enjoyment and the warranty of the premises' fitness for occupancy.",
  },
] as const;


/**
 * Statements the landlord's complaint (form UD-100) normally makes. On UD-105
 * item 2, anything the tenant does NOT list is treated by the judge as agreed,
 * so this is the most important part of the form.
 */
export const DENIAL_ITEMS = [
  { id: "amount", code: "3.a", label: "The amount of rent they say is owed" },
  { id: "notice", code: "4.a", label: "That the notice was correct and complete" },
  { id: "service", code: "4.b", label: "That the notice was served on me properly" },
  { id: "expired", code: "5", label: "That the notice ran out before they filed" },
  { id: "agreement", code: "6.a", label: "The rental agreement terms they describe" },
  { id: "damages", code: "12", label: "The daily damages or holdover amount claimed" },
  { id: "fees", code: "13", label: "Their claim for attorney fees" },
] as const;

/** Thirteen on-screen steps; step 6 is the one we show in screenshots. */
export const WIZARD_STEPS = [
  "Your name",
  "Your address",
  "How to reach you",
  "Case details",
  "What the landlord claims",
  "What happened in your own words?",
  "The notice you received",
  "Rent and payments",
  "Repairs and conditions",
  "Your defences",
  "Proof of service",
  "Sign and date",
  "Review and file",
] as const;


/** Every box the tenant fills in on screen. Nothing is uploaded or downloaded. */
export interface BuildFields {
  fullName: string;
  street: string;
  cityStateZip: string;
  phone: string;
  email: string;
  caseNumber: string;
  plaintiff: string;
  courthouse: string;
  story: string;
  noticeType: string;
  noticeDate: string;
  noticeServed: string;
  monthlyRent: string;
  amountDemanded: string;
  amountOwed: string;
  lastPayment: string;
  repairs: string;
  serviceMethod: string;
  serverName: string;
  signName: string;
  signDate: string;
}

export type FieldKey = keyof BuildFields;

export const DEMO_FIELDS: BuildFields = {
  fullName: "Maria R. Delgado",
  street: "1428 E 4th Street, Apt 3",
  cityStateZip: "Los Angeles, CA 90033",
  phone: "(323) 555-0142",
  email: "maria.r@example.com",
  caseNumber: "24STUD01234",
  plaintiff: "Maple Properties LLC",
  courthouse: "Stanley Mosk Courthouse, Dept. 94",
  story: DEMO_STORY,
  noticeType: "3-day notice to pay rent or quit",
  noticeDate: "May 12, 2026",
  noticeServed: "Taped to the door",
  monthlyRent: "$2,000",
  amountDemanded: "$2,000",
  amountOwed: "$1,400",
  lastPayment: "$600 on May 1",
  repairs:
    "There has been mold in the bathroom since March and I asked for repairs twice.",
  serviceMethod: "By mail",
  serverName: "A friend over 18",
  signName: "Maria R. Delgado",
  signDate: "September 8, 2026",
};



