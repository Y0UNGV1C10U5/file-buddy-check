import { useRef } from "react";
import { ArrowDown, ArrowUp, Camera, FileText, X } from "lucide-react";

/**
 * Multi-page capture for the served packet.
 *
 * Phase 0: everything stays in the browser. Pages are object URLs, never
 * uploaded. Cloud storage and OCR come later.
 */

export interface PacketPage {
  id: string;
  name: string;
  url: string;
  isPdf: boolean;
}

export const MAX_PAGES = 20;

/** What a served unlawful detainer packet usually contains. */
export const PACKET_CHECKLIST = [
  "Summons (SUM-130) — front and back",
  "Complaint (UD-100) and any UD-101 verification",
  "The three-day notice attached as an exhibit",
  "Your lease or rental agreement, if attached",
  "The blank UD-105 answer form, if they included one",
  "Case assignment or courthouse cover sheet",
];

export function makePages(list: FileList | null, existing: number): PacketPage[] {
  if (!list) return [];
  return Array.from(list)
    .slice(0, Math.max(0, MAX_PAGES - existing))
    .map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      url: URL.createObjectURL(f),
      isPdf: f.type === "application/pdf" || /\.pdf$/i.test(f.name),
    }));
}

export function PacketScanner({
  pages,
  onChange,
}: {
  pages: PacketPage[];
  onChange: (next: PacketPage[]) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function add(list: FileList | null) {
    const next = makePages(list, pages.length);
    if (next.length) onChange([...pages, ...next]);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  function remove(id: string) {
    onChange(pages.filter((p) => p.id !== id));
  }

  return (
    <div>
      <p className="flex items-center gap-2 font-display text-xl uppercase leading-tight">
        <Camera className="size-5 text-signal" /> Scan your packet
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Shoot every page they handed you or left on your door — most packets run six
        to twelve pages. Flat on a table, all four corners in shot, dates readable.
        You can shoot them in any order and drag them straight after.
      </p>

      <ul className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        {PACKET_CHECKLIST.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-signal">
              •
            </span>
            {item}
          </li>
        ))}
      </ul>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="border-2 border-ink bg-ink px-6 py-6 font-display uppercase text-ink-foreground transition-transform hover:-translate-y-1"
        >
          <Camera className="mx-auto mb-2 size-6 text-signal" />
          Photograph a page
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-ink px-6 py-6 font-display uppercase transition-colors hover:bg-accent"
        >
          <FileText className="mx-auto mb-2 size-6" />
          Choose files instead
        </button>
      </div>

      {pages.length > 0 ? (
        <>
          <p className="mt-5 font-mono text-xs uppercase text-muted-foreground">
            {pages.length} of {MAX_PAGES} pages · in filing order
          </p>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {pages.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 border-2 border-ink p-2 text-sm">
                <span className="grid size-6 shrink-0 place-items-center border-2 border-ink font-mono text-xs">
                  {i + 1}
                </span>
                {p.isPdf ? (
                  <span className="grid size-14 shrink-0 place-items-center border border-border">
                    <FileText className="size-6" />
                  </span>
                ) : (
                  <img
                    src={p.url}
                    alt={`Packet page ${i + 1}`}
                    className="size-14 shrink-0 border border-border object-cover"
                  />
                )}
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    aria-label={`Move page ${i + 1} earlier`}
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="border-2 border-border p-0.5 enabled:hover:border-ink disabled:opacity-30"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move page ${i + 1} later`}
                    onClick={() => move(i, 1)}
                    disabled={i === pages.length - 1}
                    className="border-2 border-border p-0.5 enabled:hover:border-ink disabled:opacity-30"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => remove(p.id)}
                  className="shrink-0 border-2 border-border p-1 hover:border-ink"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
