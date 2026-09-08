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


/** Twelve guided-mode steps; step 5 is the one we show. */
export const WIZARD_STEPS = [
  "Your name",
  "Your address",
  "How to reach you",
  "Case details",
  "What happened in your own words?",
  "The notice you received",
  "Rent and payments",
  "Repairs and conditions",
  "Your defences",
  "Proof of service",
  "Sign and date",
  "Review and download",
] as const;

export const SOCIAL_PROOF =
  "Maria from Boyle Heights filed at 11:47pm and stopped a default.";

export const FILED_THIS_WEEK = 127;
