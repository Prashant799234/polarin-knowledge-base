import { pdf } from "@react-pdf/renderer";
import { createElement } from "react";
import { extractPdfNodes } from "./extractPdfContent";
import { KBPdfDocument } from "./KBPdfDocument";

// Builds the PDF from real vector text (via @react-pdf/renderer), rendered
// from the same content the reader sees on screen — not a canvas screenshot
// of the live DOM. See extractPdfContent.ts for what's read out of the page,
// and KBPdfDocument.tsx for how it's laid out.
export async function downloadPageAsPdf(container: HTMLElement | null, pageTitle: string): Promise<string> {
  if (!container) throw new Error("Nothing to export — page content not found.");

  const contentEl = (container.querySelector(".kb-article-content") as HTMLElement) || container;
  const nodes = extractPdfNodes(contentEl, pageTitle);

  const origin = window.location.origin;
  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const blob = await pdf(
    createElement(KBPdfDocument, {
      nodes,
      pageTitle,
      logoSrc: `${origin}/polarin-logo.png`,
      generatedOn,
    })
  ).toBlob();

  const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const fileName = `polarin-docs-${slug || "page"}.pdf`;

  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  setTimeout(() => {
    try {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // already cleaned up
    }
  }, 2000);

  return fileName;
}
