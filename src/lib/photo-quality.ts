/**
 * Client-side page-photo quality check.
 *
 * Runs entirely in the browser on the object URL — nothing is uploaded.
 * Two signals: pixel size (can we read 10pt type?) and sharpness
 * (variance of a Laplacian on a downscaled grayscale copy).
 */

export type PhotoVerdict = "good" | "small" | "blurry" | "unknown";

export interface PhotoQuality {
  verdict: PhotoVerdict;
  width: number;
  height: number;
  sharpness: number;
}

/** Long edge below this can't hold readable body text from a full page. */
export const MIN_LONG_EDGE = 1400;
/** Laplacian variance below this reads as out of focus or motion-blurred. */
export const MIN_SHARPNESS = 90;

const SAMPLE = 480;

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("load failed"));
    img.src = url;
  });
}

function sharpnessOf(img: HTMLImageElement): number {
  const scale = Math.min(1, SAMPLE / Math.max(img.width, img.height));
  const w = Math.max(8, Math.round(img.width * scale));
  const h = Math.max(8, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return Number.NaN;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4] ?? 0;
    const g = data[i * 4 + 1] ?? 0;
    const b = data[i * 4 + 2] ?? 0;
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap =
        4 * (gray[i] ?? 0) -
        (gray[i - 1] ?? 0) -
        (gray[i + 1] ?? 0) -
        (gray[i - w] ?? 0) -
        (gray[i + w] ?? 0);
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  if (n === 0) return Number.NaN;
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

export async function checkPhoto(url: string): Promise<PhotoQuality> {
  try {
    const img = await loadImage(url);
    const longEdge = Math.max(img.width, img.height);
    const sharpness = sharpnessOf(img);
    let verdict: PhotoVerdict = "good";
    if (longEdge < MIN_LONG_EDGE) verdict = "small";
    else if (Number.isFinite(sharpness) && sharpness < MIN_SHARPNESS) verdict = "blurry";
    return { verdict, width: img.width, height: img.height, sharpness };
  } catch {
    return { verdict: "unknown", width: 0, height: 0, sharpness: Number.NaN };
  }
}

export function qualityMessage(q: PhotoQuality): string | null {
  if (q.verdict === "small")
    return "Too small to read — get closer and shoot the page again.";
  if (q.verdict === "blurry")
    return "Out of focus — hold steady, tap the page, shoot again.";
  return null;
}
