/**
 * Visual facsimile of Judicial Council form UD-105 (Answer — Unlawful Detainer).
 * Design-only: this is a preview for screenshots, not a filable form.
 */

import type { CaptionFields } from "@/lib/pleading-preview";

export interface UD105Defense {
  code: string;
  formLabel: string;
  checked: boolean;
}

function Box({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-[1px] inline-flex size-[9px] shrink-0 items-center justify-center border border-paper-ink text-[7px] leading-none sm:size-[11px] sm:text-[9px] ${
        checked ? "bg-paper-ink text-paper" : ""
      }`}
    >
      {checked ? "X" : ""}
    </span>
  );
}

function Row({
  checked,
  code,
  children,
  highlight = false,
}: {
  checked: boolean;
  code: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex gap-1.5 py-[2px] ${highlight && checked ? "bg-seal" : ""}`}
    >
      <span className="w-4 shrink-0 text-right font-bold">{code}</span>
      <Box checked={checked} />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

export function UD105Sheet({
  caption,
  defenses,
  story,
  denialMode = "general",
  denials = [],
  className = "",
}: {
  caption: CaptionFields;
  defenses: UD105Defense[];
  story: string;
  /** Item 2: deny everything, or list the statements being denied. */
  denialMode?: "general" | "specific";
  /** Complaint item numbers being denied, e.g. ["3.a", "4.b"]. */
  denials?: string[];
  className?: string;
}) {
  const usedAttachment = story.trim().length > 0;


  return (
    <div
      className={`paper-sheet border border-paper-ink/40 px-3 py-4 shadow-[0_10px_30px_-12px_rgba(26,26,26,0.45)] sm:px-6 sm:py-7 ${className}`}
    >
      {/* Top bar — form number */}
      <div className="court-type flex items-start justify-between border border-paper-ink text-[6.5px] leading-tight sm:text-[8.5px]">
        <div className="flex-1 border-r border-paper-ink px-2 py-1">
          <p className="font-bold">
            ATTORNEY OR PARTY WITHOUT ATTORNEY (Name, State Bar number, and address):
          </p>
          <p className="mt-1">{caption.left[0]?.value}</p>
          <p>{caption.left[1]?.value}</p>
          <p>{caption.left[2]?.value}</p>
          <p className="mt-1">TELEPHONE NO.: {caption.left[3]?.value}</p>
          <p>E-MAIL ADDRESS: {caption.left[4]?.value}</p>
          <p className="mt-1">ATTORNEY FOR (Name): Defendant in Pro Per</p>
        </div>
        <div className="w-[30%] px-2 py-1 text-center font-bold">
          <p>UD-105</p>
          <p className="mt-3 font-normal opacity-60">
            FOR COURT USE ONLY
          </p>
        </div>
      </div>

      {/* Court block */}
      <div className="court-type border-x border-b border-paper-ink px-2 py-1 text-[6.5px] uppercase leading-tight sm:text-[8.5px]">
        <p className="font-bold">
          {caption.courtLine1}, {caption.courtLine2}
        </p>
        <p className="mt-0.5">STREET ADDRESS: 111 N. Hill Street</p>
        <p>CITY AND ZIP CODE: Los Angeles, CA 90012</p>
      </div>

      {/* Parties + case number */}
      <div className="court-type flex border-x border-b border-paper-ink text-[6.5px] leading-tight sm:text-[8.5px]">
        <div className="flex-1 border-r border-paper-ink px-2 py-1">
          <p>
            <span className="font-bold">PLAINTIFF:</span> {caption.plaintiff}
          </p>
          <p className="mt-1">
            <span className="font-bold">DEFENDANT:</span> {caption.defendant}
          </p>
        </div>
        <div className="w-[30%] px-2 py-1">
          <p className="font-bold">CASE NUMBER:</p>
          <p className="mt-1">{caption.caseNumber}</p>
        </div>
      </div>

      {/* Title */}
      <div className="court-type border-x border-b border-paper-ink px-2 py-1 text-center text-[7.5px] font-bold uppercase sm:text-[10px]">
        Answer — Unlawful Detainer
      </div>

      {/* Body */}
      <div className="court-type mt-2 space-y-1 text-[6.5px] leading-[1.55] sm:text-[8.5px]">
        <Row checked code="1." >
          Defendant (each defendant for whom this answer is filed must be named and
          must sign this answer unless represented by an attorney):{" "}
          <span className="underline">{caption.defendant}</span>
        </Row>

        <Row checked code="2.">
          <span className="font-bold">GENERAL DENIAL.</span> Defendant generally
          denies each statement of the complaint. (Permitted only where the amount
          demanded is under $35,000.)
        </Row>

        <p className="pt-1 font-bold">3. AFFIRMATIVE DEFENSES</p>
        <p className="pl-4 opacity-70">
          (Tick each one that applies. Facts supporting each are stated in item 3.k or
          on the attached page.)
        </p>

        <div className="pl-2">
          {defenses.map((d) => (
            <Row key={d.code} checked={d.checked} code={d.code} highlight>
              {d.formLabel}
            </Row>
          ))}
        </div>

        <Row checked={usedAttachment} code="3.k">
          <span className="font-bold">Facts supporting the defences above:</span>{" "}
          {usedAttachment ? (
            <span className="bg-seal">
              Continued on Attachment 3.k (form MC-025), attached and incorporated by
              reference.
            </span>
          ) : (
            <span className="opacity-50">____________________</span>
          )}
        </Row>

        <Row checked code="4.">
          <span className="font-bold">OTHER STATEMENTS.</span> Defendant vacated the
          premises on (date): ____________
        </Row>

        <Row checked code="5.">
          <span className="font-bold">DEFENDANT REQUESTS</span>
          <span className="block pl-2">
            a. that plaintiff take nothing requested in the complaint.
            <br />
            b. costs incurred in this proceeding.
            <br />
            c. reasonable attorney fees.
            <br />
            d. that plaintiff be ordered to (1) make repairs and correct the
            conditions that constitute a breach of the warranty to provide habitable
            premises and (2) reduce the monthly rent.
          </span>
        </Row>

        {/* Verification */}
        <div className="mt-3 border-t border-paper-ink pt-2">
          <p className="font-bold uppercase">Verification</p>
          <p className="mt-1">
            I am the defendant in this proceeding and have read this answer. I declare
            under penalty of perjury under the laws of the State of California that
            the foregoing is true and correct.
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <span>Date: ____________________</span>
            <span className="w-1/2 border-t border-paper-ink pt-0.5 text-center">
              {caption.defendant} — Defendant in Pro Per
            </span>
          </div>
        </div>
      </div>

      <p className="court-type mt-3 flex justify-between gap-2 border-t border-paper-ink pt-1 text-[6px] uppercase text-paper-ink/70 sm:text-[8px]">
        <span>Form approved for optional use — Judicial Council of California</span>
        <span className="font-bold">UD-105 [Rev. Jan 1, 2025] · Page 1 of 2</span>
      </p>
    </div>
  );
}
