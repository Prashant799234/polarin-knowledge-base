import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const NAVY = [10, 57, 84] as const;
const TEAL = [28, 128, 141] as const;
const MUTED = [71, 85, 105] as const;
const BODY = [15, 23, 42] as const;
const RULE = [203, 213, 225] as const;

const PLATFORM_URL = "https://polarin.lightstorm.net/app/login?next=/app/home";
const DOCS_BASE_URL = "https://docs.polarin.lightstorm.net";
const DOCS_HOST = "docs.polarin.lightstorm.net";
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

interface DocumentLink {
  url: string;
  top: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export async function downloadPageAsPdf(container: HTMLElement | null, pageTitle: string): Promise<string> {
  if (!container) throw new Error("Nothing to export — page content not found.");

  // Identify the core content element
  const contentEl = (container.querySelector(".kb-article-content") as HTMLElement) || container;

  // 1. Temporarily apply PDF export class to document body
  document.body.classList.add("kb-exporting-pdf");

  let canvas: HTMLCanvasElement;
  let breakPoints: { top: number; bottom: number; height: number; isHeading: boolean }[] = [];
  const documentLinks: DocumentLink[] = [];

  try {
    // Wait for fonts and reflow
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 2. Guarantee all images within contentEl are completely loaded
    const imgs = Array.from(contentEl.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight > 0) return resolve();
            const timer = setTimeout(resolve, 3000);
            img.onload = () => {
              clearTimeout(timer);
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve();
            };
          })
      )
    );

    // 3. Collect element coordinates for smart pagination and clickable links
    const targetRect = contentEl.getBoundingClientRect();
    const blockEls = Array.from(
      contentEl.querySelectorAll(
        "h1, h2, h3, figure, .kb-doc-image, table, tr, .kb-callout, .kb-step, .kb-flow-diagram, p, ul, ol"
      )
    );

    const rawLinks = Array.from(contentEl.querySelectorAll("a[href], button[data-page-link], [data-page-link]"));

    // 4. Capture exact DOM into high-resolution canvas
    canvas = await html2canvas(contentEl, {
      scale: 2.5, // 2.5x high-res DPI for razor-sharp text and crisp screenshots
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Copy stylesheet links to cloned document head so fonts load reliably
        const links = document.querySelectorAll('link[rel="stylesheet"], link[href*="fonts.googleapis.com"]');
        links.forEach((link) => {
          clonedDoc.head.appendChild(link.cloneNode(true));
        });
      },
      ignoreElements: (el) => {
        if (!el || typeof (el as any).getAttribute !== "function") return false;
        return (
          el.getAttribute("data-copy-page-exclude") === "true" ||
          el.getAttribute("data-pdf-exclude") === "true" ||
          (Boolean(el.classList) && (
            el.classList.contains("kb-toc-aside") ||
            el.classList.contains("kb-article-footer")
          ))
        );
      },
    });

    // Map element boundaries into canvas coordinate space
    const totalCanvasHeight = canvas.height;
    const targetHeight = targetRect.height > 0 ? targetRect.height : totalCanvasHeight;
    const targetWidth = targetRect.width > 0 ? targetRect.width : canvas.width;

    breakPoints = blockEls
      .map((el) => {
        const r = el.getBoundingClientRect();
        const top = (r.top - targetRect.top) * (totalCanvasHeight / targetHeight);
        const bottom = (r.bottom - targetRect.top) * (totalCanvasHeight / targetHeight);
        const tag = el.tagName.toUpperCase();
        const isHeading = tag === "H1" || tag === "H2" || tag === "H3";
        return { top, bottom, height: bottom - top, isHeading };
      })
      .filter((bp) => bp.height > 0 && !isNaN(bp.top));

    // Map links into canvas coordinate space
    rawLinks.forEach((linkEl) => {
      let href = (linkEl as HTMLAnchorElement).href || "";
      const pageId = linkEl.getAttribute("data-page-link");
      if (pageId) {
        href = `${DOCS_BASE_URL}/#${pageId}`;
      } else if (href) {
        try {
          const parsed = new URL(href, window.location.href);
          if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
            href = `${DOCS_BASE_URL}${parsed.hash || ""}`;
          }
        } catch {
          // keep href as is
        }
      }
      if (!href || href === "#" || href.startsWith("javascript:")) return;

      const r = linkEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        documentLinks.push({
          url: href,
          top: (r.top - targetRect.top) * (totalCanvasHeight / targetHeight),
          bottom: (r.bottom - targetRect.top) * (totalCanvasHeight / targetHeight),
          left: (r.left - targetRect.left) * (canvas.width / targetWidth),
          width: r.width * (canvas.width / targetWidth),
          height: r.height * (totalCanvasHeight / targetHeight),
        });
      }
    });
  } finally {
    // 5. Always clean up temporary class immediately
    document.body.classList.remove("kb-exporting-pdf");
  }

  // ── 6. Setup jsPDF Document (A4 in points) ──
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();   // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const marginX = 36;
  const contentWidthPt = pageWidth - marginX * 2;       // 523.28 pt

  // Scale: canvas pixels to PDF points
  const ptPerPx = contentWidthPt / canvas.width;
  const pxPerPt = canvas.width / contentWidthPt;

  // Header and footer heights
  const page1HeaderPt = 68;
  const page1ContentTop = 36 + page1HeaderPt + 8;
  const page1ContentMaxHeightPt = pageHeight - page1ContentTop - 46;
  const page1ContentMaxHeightPx = page1ContentMaxHeightPt * pxPerPt;

  const subsequentHeaderPt = 24;
  const subsequentContentTop = 32 + subsequentHeaderPt + 8;
  const subsequentContentMaxHeightPt = pageHeight - subsequentContentTop - 46;
  const subsequentContentMaxHeightPx = subsequentContentMaxHeightPt * pxPerPt;

  // ── 7. Calculate Smart Multi-Page Slices ──
  interface PageSlice {
    startY: number;
    endY: number;
    heightPt: number;
    contentTop: number;
  }

  const slices: PageSlice[] = [];
  let currentY = 0;

  while (currentY < canvas.height - 1) {
    const isFirst = slices.length === 0;
    const maxPx = isFirst ? page1ContentMaxHeightPx : subsequentContentMaxHeightPx;
    const contentTop = isFirst ? page1ContentTop : subsequentContentTop;
    const plannedEndY = currentY + maxPx;

    if (plannedEndY >= canvas.height) {
      slices.push({
        startY: currentY,
        endY: canvas.height,
        heightPt: (canvas.height - currentY) * ptPerPx,
        contentTop,
      });
      break;
    }

    // Inspect elements that straddle plannedEndY to avoid cutting images/headings
    let bestCutY = plannedEndY;
    for (const bp of breakPoints) {
      if (bp.top < plannedEndY && bp.bottom > plannedEndY) {
        // Element straddles the cut boundary
        if (bp.height <= maxPx && bp.top > currentY + 140) {
          bestCutY = Math.min(bestCutY, bp.top - 3);
        }
      } else if (bp.isHeading && bp.top < plannedEndY && plannedEndY - bp.top < 80 && bp.top > currentY + 140) {
        // Avoid leaving an orphaned heading at the bottom of a page
        bestCutY = Math.min(bestCutY, bp.top - 3);
      }
    }

    // Fallback: guarantee minimum forward progress of 140px
    if (bestCutY <= currentY + 140) {
      bestCutY = plannedEndY;
    }

    slices.push({
      startY: currentY,
      endY: bestCutY,
      heightPt: (bestCutY - currentY) * ptPerPx,
      contentTop,
    });

    currentY = bestCutY;
  }

  // ── 8. Render Canvas Slices into PDF Pages ──
  const logo = await loadImageDataUrl("/polarin-logo.png");

  for (let i = 0; i < slices.length; i++) {
    if (i > 0) doc.addPage();
    const slice = slices[i];
    const sliceHeightPx = slice.endY - slice.startY;

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeightPx;
    const sCtx = sliceCanvas.getContext("2d");

    if (sCtx) {
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = "high";
      sCtx.drawImage(
        canvas,
        0, slice.startY, canvas.width, sliceHeightPx,
        0, 0, canvas.width, sliceHeightPx
      );
      const imgData = sliceCanvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", marginX, slice.contentTop, contentWidthPt, slice.heightPt, undefined, "FAST");
    }

    // ── Add Clickable Hyperlink Annotations for this Page ──
    for (const lk of documentLinks) {
      if (lk.top >= slice.startY && lk.top < slice.endY) {
        const relY = lk.top - slice.startY;
        const linkPdfX = marginX + lk.left * ptPerPx;
        const linkPdfY = slice.contentTop + relY * ptPerPx;
        const linkPdfW = Math.max(lk.width * ptPerPx, 14);
        const linkPdfH = Math.max(lk.height * ptPerPx, 10);
        doc.link(linkPdfX, linkPdfY, linkPdfW, linkPdfH, { url: lk.url });
      }
    }
  }

  // ── 9. Resources Section ("More from Polarin") ──
  const lastSlice = slices[slices.length - 1];
  const spaceLeftOnLastPage = pageHeight - 40 - (lastSlice.contentTop + lastSlice.heightPt);
  const resourceBlockHeight = 110;

  let resourcePage = slices.length;
  let resourceStartY: number;

  if (spaceLeftOnLastPage >= resourceBlockHeight + 20) {
    resourceStartY = lastSlice.contentTop + lastSlice.heightPt + 18;
  } else {
    doc.addPage();
    resourcePage = slices.length + 1;
    resourceStartY = 54;
  }

  doc.setPage(resourcePage);
  doc.setDrawColor(...RULE);
  doc.setLineWidth(1);
  doc.line(marginX, resourceStartY, pageWidth - marginX, resourceStartY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("More from Polarin", marginX, resourceStartY + 18);

  const links = [
    { label: "Polarin Portal", value: "polarin.lightstorm.net", href: PLATFORM_URL },
    { label: "Knowledge Base", value: DOCS_HOST, href: DOCS_BASE_URL },
    { label: "Support Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    { label: "Support Phone", value: SUPPORT_PHONE, href: `tel:${SUPPORT_PHONE.replace(/\s/g, "")}` },
  ];

  let linkY = resourceStartY + 36;
  links.forEach((link) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...BODY);
    doc.text(`${link.label}:`, marginX, linkY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEAL);
    doc.textWithLink(link.value, marginX + 90, linkY, { url: link.href });
    doc.link(marginX, linkY - 9, contentWidthPt, 14, { url: link.href });
    linkY += 16;
  });

  // ── 10. Headers & Footers on Every Page ──
  const totalPages = doc.internal.getNumberOfPages();
  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const footerY = pageHeight - 26;

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    if (p === 1) {
      // First page branding header
      let topY = 32;
      if (logo) {
        const displayHeight = 24;
        const displayWidth = (logo.width / logo.height) * displayHeight;
        doc.addImage(logo.dataUrl, "PNG", marginX, topY, displayWidth, displayHeight);
        doc.link(marginX, topY, displayWidth, displayHeight, { url: PLATFORM_URL });
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...NAVY);
        doc.text("Polarin Docs", marginX, topY + 16);
      }

      // Documentation subtitle / meta
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text("Polarin Documentation", pageWidth - marginX, topY + 12, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(generatedOn, pageWidth - marginX, topY + 24, { align: "right" });

      // Header rule
      doc.setDrawColor(...RULE);
      doc.setLineWidth(1);
      doc.line(marginX, topY + 34, pageWidth - marginX, topY + 34);
    } else {
      // Running header on page 2+
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(`Polarin Documentation · ${pageTitle}`, marginX, 28);
      doc.text("polarin.lightstorm.net", pageWidth - marginX, 28, { align: "right" });
      doc.link(pageWidth - marginX - 100, 18, 100, 14, { url: PLATFORM_URL });

      doc.setDrawColor(...RULE);
      doc.setLineWidth(0.5);
      doc.line(marginX, 34, pageWidth - marginX, 34);
    }

    // Running footer on all pages
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.5);
    doc.line(marginX, footerY - 10, pageWidth - marginX, footerY - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Polarin Docs · Confidential & Proprietary", marginX, footerY);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, footerY, { align: "right" });
  }

  // ── 11. Trigger Direct Browser File Download ──
  const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const fileName = `polarin-docs-${slug || "page"}.pdf`;
  const blob = doc.output("blob");
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
