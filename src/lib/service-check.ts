/**
 * Free "was I even served properly?" check.
 *
 * Deterministic rules only — no model guessing. Sources:
 *  - CCP § 415.10  personal service
 *  - CCP § 415.20(b) substituted service: leave with a competent adult AND mail a copy
 *  - CCP § 415.45  posting: requires a COURT ORDER first, and a mailed copy
 *  - CCP § 415.30  service by mail: only complete when the acknowledgment is signed & returned
 *  - CCP § 1162    notice service before the case (personal, substituted+mail, post+mail)
 *
 * Output is legal information, not advice, and never tells anyone to skip the answer.
 */

export type HowDelivered =
  | "personal"
  | "substituted"
  | "posted"
  | "mail_only"
  | "unsure";

export type YesNoUnsure = "yes" | "no" | "unsure";

export interface ServiceAnswers {
  how: HowDelivered;
  /** Was a copy also mailed to you? */
  mailed: YesNoUnsure;
  /** For substituted service: was the person an adult member of the household/workplace? */
  adultReceiver: YesNoUnsure;
  /** For posting: did the papers include a court order allowing posting? */
  courtOrder: YesNoUnsure;
  /** For mail-only: did you sign and post back the acknowledgment form? */
  signedAck: YesNoUnsure;
}

export const DEFAULT_SERVICE_ANSWERS: ServiceAnswers = {
  how: "unsure",
  mailed: "unsure",
  adultReceiver: "unsure",
  courtOrder: "unsure",
  signedAck: "unsure",
};

export const HOW_OPTIONS: { id: HowDelivered; label: string; blurb: string }[] = [
  {
    id: "personal",
    label: "Handed to me, in my hand",
    blurb: "A server or someone gave the papers directly to me.",
  },
  {
    id: "substituted",
    label: "Left with someone else",
    blurb: "Given to another person at my home or work while I wasn't there.",
  },
  {
    id: "posted",
    label: "Taped to my door or gate",
    blurb: "Nobody handed them to anyone — they were stuck on the door.",
  },
  {
    id: "mail_only",
    label: "Only came in the post",
    blurb: "They turned up in the mailbox, nothing at the door.",
  },
  {
    id: "unsure",
    label: "I'm not sure how they got to me",
    blurb: "I just found them, or someone told me they arrived.",
  },
];

export type Verdict = "flag" | "check" | "regular";

export interface ServiceFinding {
  /** Headline verdict for the whole combination. */
  verdict: Verdict;
  title: string;
  summary: string;
  /** Each specific point worth raising, in plain words. */
  points: { text: string; authority: string; strong: boolean }[];
}

const YES = "yes";
const NO = "no";

export function checkService(a: ServiceAnswers): ServiceFinding {
  const points: ServiceFinding["points"] = [];
  let strongCount = 0;

  const add = (text: string, authority: string, strong: boolean) => {
    points.push({ text, authority, strong });
    if (strong) strongCount += 1;
  };

  if (a.how === "substituted") {
    if (a.mailed === NO) {
      add(
        "Leaving the papers with someone else only works if a copy is ALSO posted to you. You've said no copy was mailed — on the face of it, service isn't complete.",
        "CCP § 415.20(b)",
        true,
      );
    } else if (a.mailed === "unsure") {
      add(
        "Leaving papers with someone else only counts if a copy was also mailed to you. Check the proof of service for a mailing date — if there isn't one, that's a real problem for them.",
        "CCP § 415.20(b)",
        false,
      );
    }
    if (a.adultReceiver === NO) {
      add(
        "The papers have to be left with a competent adult at your home or work. Leaving them with a child, a visitor or a stranger doesn't count.",
        "CCP § 415.20(b)",
        true,
      );
    } else if (a.adultReceiver === "unsure") {
      add(
        "Find out who actually took the papers. If it wasn't an adult who lives or works there, the service is open to challenge.",
        "CCP § 415.20(b)",
        false,
      );
    }
  }

  if (a.how === "posted") {
    if (a.courtOrder === NO) {
      add(
        "Taping court papers to the door is only allowed after a judge signs an order permitting it. No order in the packet means the posting shouldn't have happened at all.",
        "CCP § 415.45",
        true,
      );
    } else if (a.courtOrder === "unsure") {
      add(
        "Look through the packet for an order signed by a judge allowing service by posting. Without one, posting isn't a legal way to serve you.",
        "CCP § 415.45",
        false,
      );
    }
    if (a.mailed === NO) {
      add(
        "Posting on the door must ALWAYS be paired with a mailed copy. Door only, no post, is a defect on the face of it — this is one of the most common mistakes there is.",
        "CCP §§ 415.45, 1162",
        true,
      );
    } else if (a.mailed === "unsure") {
      add(
        "Posting must be paired with mailing. Check the proof of service for the mailing date and address, and check whether that copy ever arrived.",
        "CCP §§ 415.45, 1162",
        false,
      );
    }
  }

  if (a.how === "mail_only") {
    if (a.signedAck === NO) {
      add(
        "Papers sent by post alone only count once you sign the acknowledgment form and send it back. If you never signed one, the clock may never have started.",
        "CCP § 415.30",
        true,
      );
    } else if (a.signedAck === "unsure") {
      add(
        "Check whether you signed and returned an acknowledgment of receipt. That signature — not the postmark — is what completes service by mail.",
        "CCP § 415.30",
        false,
      );
    }
  }

  if (a.how === "unsure") {
    add(
      "Get the proof of service from the court file or the back of your packet. It states who served you, how, when and whether anything was mailed — everything below turns on that page.",
      "CCP § 417.10",
      false,
    );
  }

  if (a.how === "personal") {
    add(
      "Papers put straight into your hand are the cleanest kind of service. Still check the date on the proof of service matches the day you actually got them — a wrong date moves your deadline.",
      "CCP § 415.10",
      false,
    );
  }

  const verdict: Verdict =
    strongCount > 0 ? "flag" : points.some((p) => !p.strong) && a.how !== "personal" ? "check" : "regular";

  const title =
    verdict === "flag"
      ? "This looks defective on its face"
      : verdict === "check"
        ? "There's something here worth checking"
        : "Nothing obviously wrong with how they served you";

  const summary =
    verdict === "flag"
      ? "Based on what you've told us, at least one step California requires appears to be missing. That is raised inside your answer — and it is exactly why the answer has to go in."
      : verdict === "check"
        ? "We can't tell from here, but the proof of service will settle it. Pull that page out and check it against the points below."
        : "That doesn't end the case — the reasons you shouldn't be evicted still go in your answer.";

  return { verdict, title, summary, points };
}
