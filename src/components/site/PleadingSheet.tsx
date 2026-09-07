import { LINES_PER_PAGE, paginate, type Block } from "@/lib/pleading";
import type { CaptionFields } from "@/lib/pleading-preview";

function CaptionBox({ caption }: { caption: CaptionFields }) {
  return (
    <div className="court-type grid grid-cols-[1.15fr_1fr] gap-4 border border-paper-ink px-3 py-2 text-[7px] leading-[1.75] sm:text-[9px]">
      <div>
        {caption.left.map((row) => (
          <div key={row.label} className="flex gap-1">
            <span className="shrink-0 font-bold">{row.label}:</span>
            <span className="min-w-0 flex-1 truncate border-b border-paper-ink/60">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="uppercase">
        <div className="font-bold">{caption.courtLine1}</div>
        <div className="font-bold">{caption.courtLine2}</div>
        <div className="mt-0.5 flex gap-1">
          <span className="shrink-0">Case No.:</span>
          <span className="min-w-0 flex-1 truncate border-b border-paper-ink/60">
            {caption.caseNumber}
          </span>
        </div>
        <div className="mt-0.5 truncate">{caption.plaintiff},</div>
        <div>v.</div>
        <div className="truncate">{caption.defendant}.</div>
      </div>
    </div>
  );
}

export function PleadingSheet({
  caption,
  blocks,
  title,
  className = "",
}: {
  caption: CaptionFields;
  blocks: Block[];
  title: string;
  className?: string;
}) {
  const pages = paginate(blocks, LINES_PER_PAGE);

  return (
    <div className={`space-y-6 ${className}`}>
      {pages.map((lines, pageIndex) => (
        <div
          key={pageIndex}
          className="paper-sheet border border-paper-ink/40 px-4 py-5 shadow-[0_10px_30px_-12px_rgba(26,26,26,0.45)] sm:px-7 sm:py-8"
        >
          {pageIndex === 0 ? (
            <>
              <CaptionBox caption={caption} />
              <h3 className="court-type mt-3 text-center text-[10px] font-bold uppercase tracking-wide sm:text-sm">
                {title}
              </h3>
            </>
          ) : null}

          {/* 28 numbered lines: double rule left, single rule right */}
          <div
            className={`grid grid-cols-[1.6rem_1fr] sm:grid-cols-[2.2rem_1fr] ${
              pageIndex === 0 ? "mt-3" : ""
            }`}
          >
            <div className="court-type text-right text-[7px] leading-[1.85] text-paper-ink/70 sm:text-[9px]">
              {lines.map((line) => (
                <div key={line.number} className="pr-1.5">
                  {line.number}
                </div>
              ))}
            </div>
            <div className="border-l-[3px] border-double border-paper-ink/80 border-r border-r-paper-ink/60 pl-2 pr-1.5">
              {lines.map((line) => (
                <div
                  key={line.number}
                  className={`court-type whitespace-pre text-[5.5px] leading-[1.85] sm:text-[7.5px] ${
                    line.align === "center"
                      ? "text-center"
                      : line.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${line.bold ? "font-bold" : ""} ${
                    line.underline ? "underline" : ""
                  } ${line.highlight ? "bg-seal" : ""}`}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>
          </div>

          <p className="court-type mt-3 text-center text-[7px] uppercase tracking-wide text-paper-ink/60 sm:text-[9px]">
            Page {pageIndex + 1} of {pages.length} — 28-line pleading paper, Cal. Rules
            of Court rule 2.108
          </p>
        </div>
      ))}
    </div>
  );
}
