import { useMemo, useRef, useState } from "react";
import { Download, FileDown, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  DEFENSES,
  EMPTY_PLEADING,
  LINES_PER_PAGE,
  TEMPLATE_URL,
  paginate,
  pleadingBlocks,
  proofOfServiceBlocks,
  type PleadingData,
} from "@/lib/pleading";
import {
  buildDocx,
  buildOdt,
  buildPdf,
  downloadBlob,
  extractTextFromFile,
} from "@/lib/pleading-docs";

type Field = keyof PleadingData;

function Text({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-2 border-ink bg-background px-3 py-2 text-base outline-none focus:border-signal"
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-2 border-ink bg-background px-3 py-2 text-base outline-none focus:border-signal"
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function PaperPreview({ data }: { data: PleadingData }) {
  const pages = useMemo(() => paginate(pleadingBlocks(data), LINES_PER_PAGE), [data]);

  return (
    <div className="space-y-6">
      {pages.map((lines, pageIndex) => (
        <div
          key={pageIndex}
          className="border-2 border-ink bg-[#fffdf7] p-3 shadow-slab sm:p-5"
        >
          <div className="grid grid-cols-[2rem_1fr] gap-2">
            <div className="border-r-4 border-double border-ink pr-2 text-right">
              {lines.map((line) => (
                <div
                  key={line.number}
                  className="font-mono text-[9px] leading-[1.6] text-muted-foreground sm:text-[11px]"
                >
                  {line.number}
                </div>
              ))}
            </div>
            <div>
              {lines.map((line) => (
                <div
                  key={line.number}
                  className={`whitespace-pre font-mono text-[6.5px] leading-[1.6] sm:text-[8.5px] ${
                    line.align === "center"
                      ? "text-center"
                      : line.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${line.bold ? "font-bold" : ""} ${line.underline ? "underline" : ""}`}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 border-t border-border pt-2 text-center font-mono text-[10px] uppercase text-muted-foreground">
            Page {pageIndex + 1} of {pages.length} · 28-line pleading paper · Rule 2.108
          </p>
        </div>
      ))}
    </div>
  );
}

export function PleadingBuilder() {
  const [data, setData] = useState<PleadingData>(EMPTY_PLEADING);
  const [busy, setBusy] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (field: Field) => (value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleDefense = (id: string) =>
    setData((prev) => ({
      ...prev,
      defenses: prev.defenses.includes(id)
        ? prev.defenses.filter((d) => d !== id)
        : [...prev.defenses, id],
    }));

  async function handleUpload(file: File) {
    setBusy("upload");
    try {
      const text = await extractTextFromFile(file);
      setData((prev) => ({ ...prev, ...parseTemplate(text, prev) }));
      toast.success("We read your file and filled in what we could find.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We could not read that file.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function generate(kind: "docx" | "odt" | "pdf" | "pos") {
    setBusy(kind);
    try {
      const base = data.fullName.trim().split(/\s+/).join("-").toLowerCase() || "answer";
      if (kind === "pos") {
        const blob = await buildPdf(proofOfServiceBlocks(data));
        downloadBlob(blob, `${base}-proof-of-service-pos-030.pdf`);
      } else if (kind === "pdf") {
        downloadBlob(await buildPdf(pleadingBlocks(data)), `${base}-answer.pdf`);
      } else if (kind === "docx") {
        downloadBlob(await buildDocx(pleadingBlocks(data)), `${base}-answer.docx`);
      } else {
        downloadBlob(await buildOdt(pleadingBlocks(data)), `${base}-answer.odt`);
      }
      toast.success("Your document is downloading.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong making the file.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
      {/* Left: input */}
      <div className="space-y-8">
        <div className="slab p-5 sm:p-7">
          <p className="eyebrow text-signal">Step 1 · optional</p>
          <h3 className="mt-2 font-display text-2xl uppercase">
            Fill it out away from the screen
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Download the blank form, write your answers in Word, Pages or Google Docs,
            then bring it back here and drop it in. Or just type straight into the boxes
            below — either way works.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={TEMPLATE_URL}
              download="unlawfully-detained-pleading-template.docx"
              className="inline-flex items-center gap-2 border-2 border-ink bg-signal px-5 py-3 font-display uppercase text-signal-foreground transition-transform hover:-translate-y-1"
            >
              <FileDown className="size-5" /> Download the form
            </a>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="inline-flex items-center gap-2 border-2 border-ink bg-background px-5 py-3 font-display uppercase transition-transform hover:-translate-y-1"
            >
              {busy === "upload" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Upload className="size-5" />
              )}
              Upload my filled form
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".docx,.odt,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Accepts .docx, .odt and .txt. Your file is read on your own phone or computer
            — it is not sent anywhere.
          </p>
        </div>

        <div className="slab space-y-4 p-5 sm:p-7">
          <p className="eyebrow text-signal">Step 2 · about you</p>
          <Text label="Your full legal name" value={data.fullName} onChange={set("fullName")} />
          <Text label="Street address" value={data.street} onChange={set("street")} />
          <Text label="City, state, ZIP" value={data.cityStateZip} onChange={set("cityStateZip")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Phone" value={data.phone} onChange={set("phone")} />
            <Text label="Email" value={data.email} onChange={set("email")} />
          </div>
        </div>

        <div className="slab space-y-4 p-5 sm:p-7">
          <p className="eyebrow text-signal">Step 3 · the case</p>
          <Text label="Court" value={data.courtName} onChange={set("courtName")} />
          <Text
            label="Courthouse"
            value={data.judicialDistrict}
            onChange={set("judicialDistrict")}
            hint="The courthouse named on your papers."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Text
              label="Case number"
              value={data.caseNumber}
              onChange={set("caseNumber")}
              hint="Top right of your summons."
            />
            <Text label="Department" value={data.department} onChange={set("department")} />
          </div>
          <Text
            label="Landlord (plaintiff)"
            value={data.plaintiffs}
            onChange={set("plaintiffs")}
          />
          <Text
            label="Tenant named on the papers (defendant)"
            value={data.defendants}
            onChange={set("defendants")}
          />
          <Text
            label="Anyone else named"
            value={data.otherDefendants}
            onChange={set("otherDefendants")}
          />
          <Text label="Title of the document" value={data.title} onChange={set("title")} />
        </div>

        <div className="slab space-y-4 p-5 sm:p-7">
          <p className="eyebrow text-signal">Step 4 · your side of the story</p>
          <Area
            label="What happened, in your own words"
            value={data.story}
            onChange={set("story")}
            rows={10}
            placeholder="Start a new line for each thing you want the court to know. No legal language needed."
            hint="Each new line becomes its own numbered paragraph in the court document."
          />
          <div>
            <span className="eyebrow">Reasons this eviction should not go ahead</span>
            <div className="mt-2 space-y-2">
              {DEFENSES.map((defense) => (
                <label key={defense.id} className="flex cursor-pointer gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={data.defenses.includes(defense.id)}
                    onChange={() => toggleDefense(defense.id)}
                    className="mt-1 size-4 shrink-0 accent-[var(--signal)]"
                  />
                  <span>{defense.label}</span>
                </label>
              ))}
            </div>
          </div>
          <Area
            label="Anything else"
            value={data.otherDefense}
            onChange={set("otherDefense")}
            rows={3}
          />
          <Text
            label="Date you are signing"
            value={data.verificationDate}
            onChange={set("verificationDate")}
            placeholder="e.g. September 12, 2026"
          />
        </div>

        <div className="slab space-y-4 p-5 sm:p-7">
          <p className="eyebrow text-signal">Step 5 · proof of service (POS-030)</p>
          <p className="text-sm text-muted-foreground">
            Someone other than you has to send a copy to the landlord or their lawyer.
            These details go on the proof of service that gets filed with your answer.
          </p>
          <Text
            label="Who is sending the copy"
            value={data.serverName}
            onChange={set("serverName")}
            hint="Any adult who is not you."
          />
          <Text label="Their address" value={data.serverAddress} onChange={set("serverAddress")} />
          <Text
            label="Date it is sent"
            value={data.posServiceDate}
            onChange={set("posServiceDate")}
          />
          <Text
            label="Landlord or their lawyer"
            value={data.posServedName}
            onChange={set("posServedName")}
          />
          <Text
            label="Their address"
            value={data.posServedAddress}
            onChange={set("posServedAddress")}
          />
          <div>
            <span className="eyebrow">How it is sent</span>
            <div className="mt-2 flex gap-4 text-sm">
              {(["mail", "personal"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    checked={data.posMethod === m}
                    onChange={() => setData((prev) => ({ ...prev, posMethod: m }))}
                    className="size-4 accent-[var(--signal)]"
                  />
                  {m === "mail" ? "By post" : "Handed over in person"}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: live preview + downloads */}
      <div className="lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-signal">Live preview</p>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            <FileText className="mr-1 inline size-4" />
            28 lines per page
          </p>
        </div>

        <div className="mt-3 max-h-[70vh] overflow-y-auto border-2 border-ink bg-accent p-3">
          <PaperPreview data={data} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["docx", "Word (.docx)"],
              ["odt", "OpenDocument (.odt)"],
              ["pdf", "Print-ready PDF"],
              ["pos", "Proof of service PDF"],
            ] as const
          ).map(([kind, label]) => (
            <button
              key={kind}
              type="button"
              disabled={busy !== null}
              onClick={() => void generate(kind)}
              className="inline-flex items-center justify-center gap-2 border-2 border-ink bg-background px-4 py-3 font-display text-sm uppercase shadow-slab transition-transform hover:-translate-y-1 disabled:opacity-50"
            >
              {busy === kind ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          We are not lawyers and this is not legal advice. Read every page before you file
          it, and check the deadline on your own papers.
        </p>
      </div>
    </div>
  );
}

/** Pull values back out of a filled-in copy of our template. */
function parseTemplate(text: string, prev: PleadingData): Partial<PleadingData> {
  const lines = text.split("\n").map((l) => l.trim());
  const out: Partial<PleadingData> = {};

  const grab = (label: RegExp): string | null => {
    for (const line of lines) {
      const m = label.exec(line);
      if (m) {
        const value = line
          .slice(m[0].length)
          .replace(/^[:\s]+/, "")
          .replace(/_+/g, "")
          .replace(/\[[^\]]*\]/g, "")
          .trim();
        if (value) return value;
      }
    }
    return null;
  };

  const map: [RegExp, Field][] = [
    [/^Full Legal Name/i, "fullName"],
    [/^Street Address/i, "street"],
    [/^City, State, ZIP/i, "cityStateZip"],
    [/^Phone/i, "phone"],
    [/^Email/i, "email"],
    [/^Superior Court/i, "courtName"],
    [/^Court Address/i, "courtAddress"],
    [/^Case Number/i, "caseNumber"],
    [/^Judicial District/i, "judicialDistrict"],
    [/^Plaintiff\(s\)/i, "plaintiffs"],
    [/^Defendant\(s\)/i, "defendants"],
    [/^Other Defendants/i, "otherDefendants"],
    [/^Title of Pleading/i, "title"],
    [/^Hearing Date/i, "hearingDate"],
    [/^Department/i, "department"],
    [/^Date/i, "verificationDate"],
  ];

  for (const [pattern, field] of map) {
    const value = grab(pattern);
    if (value) (out as Record<string, unknown>)[field] = value;
  }

  const paragraphs = lines
    .filter((l) => /^Paragraph \d+\s*:/i.test(l))
    .map((l) => l.replace(/^Paragraph \d+\s*:\s*/i, "").trim())
    .filter(Boolean);
  if (paragraphs.length > 0) out.story = paragraphs.join("\n");

  const ticked = DEFENSES.filter((d) =>
    lines.some(
      (l) =>
        /^\[\s*[xX]\s*\]/.test(l) &&
        d.label
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 5)
          .some((w) => l.toLowerCase().includes(w)),
    ),
  ).map((d) => d.id);
  if (ticked.length > 0) out.defenses = Array.from(new Set([...prev.defenses, ...ticked]));

  return out;
}
