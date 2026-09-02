import { jsPDF } from "jspdf";
import { extractContentNodes } from "./extractContent";

const NAVY = [10, 57, 84] as const;
const TEAL = [28, 128, 141] as const;
const MUTED = [148, 163, 184] as const;
const BODY = [51, 65, 85] as const;
const RULE = [226, 232, 241] as const;

const PLATFORM_URL = "https://polarin.lightstorm.net/app/login?next=/app/home";
const SUPPORT_EMAIL = "polarinsupport@lightstorm.net";
const SUPPORT_PHONE = "+91 22 6931 5544";

function loadImageDataUrl(src: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL("image/png"), width: img.naturalWidth, height: img.naturalHeight });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadPageAsPdf(container: HTMLElement | null, pageTitle: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 28;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > footerY - 12) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Header: logo + wordmark ──
  const logo = await loadImageDataUrl("/polarin-logo.png");
  if (logo) {
    const displayHeight = 26;
    const displayWidth = (logo.width / logo.height) * displayHeight;
    doc.addImage(logo.dataUrl, "PNG", margin, y, displayWidth, displayHeight);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text("Polarin Docs", margin, y + 18);
  }
  y += 40;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;

  // ── Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(pageTitle, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 24 + 4;

  // ── Meta line ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text(`Downloaded from Polarin Docs · ${generatedOn} · ${window.location.origin}`, margin, y);
  y += 28;

  // ── Body ──
  const nodes = extractContentNodes(container, pageTitle).filter((n) => n.tag !== "H1" || n.text !== pageTitle);
  for (const node of nodes) {
    let fontSize = 10.5;
    let fontStyle: "normal" | "bold" = "normal";
    let color: readonly [number, number, number] = BODY;
    let prefix = "";
    let indent = 0;
    let spaceBefore = 6;
    let spaceAfter = 10;

    switch (node.tag) {
      case "H1": fontSize = 16; fontStyle = "bold"; color = NAVY; spaceBefore = 20; spaceAfter = 10; break;
      case "H2": fontSize = 13.5; fontStyle = "bold"; color = NAVY; spaceBefore = 18; spaceAfter = 8; break;
      case "H3": fontSize = 11.5; fontStyle = "bold"; color = TEAL; spaceBefore = 14; spaceAfter = 6; break;
      case "LI": fontSize = 10.5; color = BODY; prefix = "•  "; indent = 14; spaceBefore = 2; spaceAfter = 2; break;
      default: fontSize = 10.5; color = BODY; spaceBefore = 4; spaceAfter = 10; break;
    }

    ensureSpace(spaceBefore);
    y += spaceBefore;

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(prefix + node.text, contentWidth - indent);
    const lineHeight = fontSize * 1.4;
    lines.forEach((line: string) => {
      ensureSpace(lineHeight);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    });
    y += spaceAfter;
  }

  // ── Resources section ──
  ensureSpace(120);
  y += 16;
  doc.setDrawColor(...RULE);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("More from Polarin", margin, y);
  y += 20;

  const links: { label: string; value: string; href: string }[] = [
    { label: "Polarin Portal", value: "polarin.lightstorm.net", href: PLATFORM_URL },
    { label: "Knowledge Base", value: window.location.origin, href: window.location.origin },
    { label: "Support Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    { label: "Support Phone", value: SUPPORT_PHONE, href: `tel:${SUPPORT_PHONE.replace(/\s/g, "")}` },
  ];

  links.forEach((link) => {
    ensureSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...BODY);
    doc.text(`${link.label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEAL);
    doc.textWithLink(link.value, margin + 110, y, { url: link.href });
    y += 18;
  });

  // ── Footer on every page ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...RULE);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text("Polarin Docs", margin, footerY);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, footerY, { align: "right" });
  }

  const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`polarin-docs-${slug || "page"}.pdf`);
}
