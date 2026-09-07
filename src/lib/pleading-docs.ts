/**
 * Browser-side generators for the pleading: DOCX, ODT and PDF.
 * All three render the same block model from pleading.ts.
 */

import type { Block } from "./pleading";
import { LINES_PER_PAGE, paginate } from "./pleading";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2000);

}

/* ----------------------------- DOCX ----------------------------- */

export async function buildDocx(blocks: Block[]): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, LineNumberRestartFormat } =
    await import("docx");

  const paragraphs = blocks.map((block) => {
    if (block.blank) return new Paragraph({ children: [new TextRun("")] });
    return new Paragraph({
      alignment:
        block.align === "center"
          ? AlignmentType.CENTER
          : block.align === "right"
            ? AlignmentType.RIGHT
            : AlignmentType.LEFT,
      spacing: { line: 480, lineRule: "auto" },
      ...(block.indent ? { indent: { left: block.indent * 120 } } : {}),
      children: [
        new TextRun({
          text: block.text,
          bold: block.bold ?? false,
          ...(block.underline ? { underline: {} } : {}),
        }),
      ],

    });
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
},
          lineNumbers: {
            countBy: 1,
            start: 1,
            restart: LineNumberRestartFormat.NEW_PAGE,
            distance: 720,
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

/* ------------------------------ ODT ------------------------------ */

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function buildOdt(blocks: Block[]): Promise<Blob> {
  const { zipSync, strToU8 } = await import("fflate");

  const body = blocks
    .map((block) => {
      if (block.blank) return `<text:p text:style-name="Body"/>`;
      const style =
        block.align === "center" ? "Centered" : block.align === "right" ? "Righted" : "Body";
      const inner = block.bold
        ? `<text:span text:style-name="Strong">${escapeXml(block.text)}</text:span>`
        : escapeXml(block.text);
      return `<text:p text:style-name="${style}">${inner}</text:p>`;
    })
    .join("\n");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.2">
<office:automatic-styles>
<style:style style:name="Body" style:family="paragraph"><style:paragraph-properties fo:line-height="200%"/><style:text-properties style:font-name="Times New Roman" fo:font-size="12pt"/></style:style>
<style:style style:name="Centered" style:family="paragraph"><style:paragraph-properties fo:text-align="center" fo:line-height="200%"/><style:text-properties style:font-name="Times New Roman" fo:font-size="12pt"/></style:style>
<style:style style:name="Righted" style:family="paragraph"><style:paragraph-properties fo:text-align="end" fo:line-height="200%"/><style:text-properties style:font-name="Times New Roman" fo:font-size="12pt"/></style:style>
<style:style style:name="Strong" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style>
</office:automatic-styles>
<office:body><office:text>${body}</office:text></office:body>
</office:document-content>`;

  const styles = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.2">
<office:styles>
<text:linenumbering-configuration text:number-lines="true" text:increment="1" text:number-position="left" text:offset="0.25in" text:restart-on-page="true"/>
</office:styles>
<office:automatic-styles>
<style:page-layout style:name="pm1"><style:page-layout-properties fo:page-width="8.5in" fo:page-height="11in" fo:margin-top="1in" fo:margin-bottom="1in" fo:margin-left="1in" fo:margin-right="1in"/></style:page-layout>
</office:automatic-styles>
<office:master-styles><style:master-page style:name="Standard" style:page-layout-name="pm1"/></office:master-styles>
</office:document-styles>`;

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
<manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

  const zipped = zipSync(
    {
      mimetype: strToU8("application/vnd.oasis.opendocument.text"),
      "content.xml": strToU8(content),
      "styles.xml": strToU8(styles),
      "META-INF/manifest.xml": strToU8(manifest),
    },
    { level: 0 },
  );

  return new Blob([zipped as unknown as BlobPart], {
    type: "application/vnd.oasis.opendocument.text",
  });
}

/* ------------------------------ PDF ------------------------------ */

export async function buildPdf(blocks: Block[]): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const pages = paginate(blocks, LINES_PER_PAGE);
  const WIDTH = 612;
  const HEIGHT = 792;
  const TOP = 720; // 1 inch down
  const LINE_HEIGHT = 24;
  const TEXT_LEFT = 84;
  const TEXT_RIGHT = 576;
  const SIZE = 12;
  const black = rgb(0, 0, 0);

  for (const lines of pages) {
    const page = pdf.addPage([WIDTH, HEIGHT]);

    // Double rule down the left margin, single rule on the right.
    page.drawLine({ start: { x: 66, y: 756 }, end: { x: 66, y: 36 }, thickness: 1, color: black });
    page.drawLine({ start: { x: 69, y: 756 }, end: { x: 69, y: 36 }, thickness: 1, color: black });
    page.drawLine({
      start: { x: 582, y: 756 },
      end: { x: 582, y: 36 },
      thickness: 1,
      color: black,
    });

    lines.forEach((line, i) => {
      const y = TOP - i * LINE_HEIGHT;
      const label = String(line.number);
      const labelWidth = font.widthOfTextAtSize(label, 10);
      page.drawText(label, { x: 58 - labelWidth, y, size: 10, font, color: black });

      if (!line.text) return;
      const f = line.bold ? bold : font;
      const textWidth = f.widthOfTextAtSize(line.text, SIZE);
      let x = TEXT_LEFT;
      if (line.align === "center") x = (TEXT_LEFT + TEXT_RIGHT - textWidth) / 2;
      if (line.align === "right") x = TEXT_RIGHT - textWidth;
      page.drawText(line.text, { x, y, size: SIZE, font: f, color: black });
      if (line.underline) {
        page.drawLine({
          start: { x, y: y - 2 },
          end: { x: x + textWidth, y: y - 2 },
          thickness: 0.7,
          color: black,
        });
      }
    });
  }

  const bytes = await pdf.save();
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}

/* -------------------- Uploaded file text extraction -------------------- */

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md")) {
    return file.text();
  }

  const { unzipSync, strFromU8 } = await import("fflate");
  const buffer = new Uint8Array(await file.arrayBuffer());
  const files = unzipSync(buffer);

  const entry =
    files["word/document.xml"] ?? files["content.xml"] ?? files["word/document2.xml"];
  if (!entry) {
    throw new Error("We could not read that file. Try a .docx, .odt or .txt file.");
  }

  const xml = strFromU8(entry);
  return xml
    .replace(/<\/w:p>|<\/text:p>|<text:line-break\/>/g, "\n")
    .replace(/<w:tab\/>|<text:tab\/>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
