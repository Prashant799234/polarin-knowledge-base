// Walks the live, on-screen article DOM into a structured node tree that
// KBPdfDocument.tsx renders with @react-pdf/renderer — real vector text
// generated from the same content the reader sees, instead of a canvas
// screenshot. Covers the shared component vocabulary (headings, paragraphs,
// lists, callouts, tables, images, steps) with full fidelity; anything else
// (bespoke per-page card grids, comparison layouts, etc.) falls back to a
// best-effort text extraction rather than attempting pixel-perfect replication
// of every one-off layout.

export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
}

export type CalloutVariant = "info" | "warning" | "tip" | "important";

export type PdfNode =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; runs: Run[] }
  | { type: "list"; items: Run[][] }
  | { type: "callout"; variant: CalloutVariant; runs: Run[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "steps"; items: { num: string; title?: string; blocks: PdfNode[] }[] }
  | { type: "caption"; text: string }
  | { type: "generic"; blocks: { heading?: string; text: string }[] };

// Strip emoji/pictographs — Lato and Plus Jakarta Sans (the only fonts
// registered for the PDF) don't include these glyphs, and asking fontkit to
// render an unsupported code point can produce garbled substitute glyphs
// instead of just an empty box.
const EMOJI_RE = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{E000}-\u{F8FF}️]/gu;

function clean(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();
}

function isExcluded(el: Element): boolean {
  return !!el.closest('[data-copy-page-exclude="true"], [data-pdf-exclude="true"]');
}

/** Extracts rich-text runs from an element's children, skipping the given node (if any). */
function extractRuns(el: Element, skip?: Node): Run[] {
  const runs: Run[] = [];
  const walk = (node: Node, style: Omit<Run, "text">) => {
    if (node === skip) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.textContent || "";
      const text = raw === " " ? raw : raw.replace(EMOJI_RE, "");
      if (text.trim() || text === " ") runs.push({ text, ...style });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el2 = node as Element;
    const tag = el2.tagName;
    if (tag === "A" || tag === "BUTTON") {
      const text = clean(el2.textContent || "");
      const href = el2.getAttribute("href") || undefined;
      if (text) runs.push({ text, link: href });
      return;
    }
    if (tag === "STRONG" || tag === "B") {
      Array.from(el2.childNodes).forEach((c) => walk(c, { ...style, bold: true }));
      return;
    }
    if (tag === "EM" || tag === "I") {
      Array.from(el2.childNodes).forEach((c) => walk(c, { ...style, italic: true }));
      return;
    }
    if (tag === "CODE") {
      const text = clean(el2.textContent || "");
      if (text) runs.push({ text, code: true });
      return;
    }
    if (tag === "SPAN") {
      const fw = (el2 as HTMLElement).style?.fontWeight;
      const isBold = fw === "bold" || (fw != null && fw !== "" && parseInt(fw, 10) >= 700);
      Array.from(el2.childNodes).forEach((c) => walk(c, { ...style, bold: style.bold || !!isBold }));
      return;
    }
    Array.from(el2.childNodes).forEach((c) => walk(c, style));
  };
  Array.from(el.childNodes).forEach((c) => walk(c, {}));
  return runs.filter((r) => r.text.trim() || r.text === " ");
}

function extractTable(tableEl: Element): { headers: string[]; rows: string[][] } {
  const headers = Array.from(tableEl.querySelectorAll("thead th")).map((th) => clean(th.textContent || ""));
  const rows = Array.from(tableEl.querySelectorAll("tbody tr")).map((tr) =>
    Array.from(tr.querySelectorAll("td")).map((td) => clean(td.textContent || ""))
  );
  return { headers, rows };
}

function extractImage(figureEl: Element): { src: string; alt: string; caption?: string } {
  const img = figureEl.querySelector("img");
  const caption = figureEl.querySelector("figcaption");
  let src = img?.getAttribute("src") || "";
  try {
    src = new URL(src, window.location.href).href;
  } catch {
    // keep as-is
  }
  return { src, alt: img?.getAttribute("alt") || "", caption: caption ? clean(caption.textContent || "") : undefined };
}

function extractCard(card: Element): { heading?: string; text: string } {
  // innerText (not textContent) reflects rendered line breaks between block
  // children — textContent just concatenates every text node with no
  // separator at all, regardless of the elements' CSS display.
  const innerText = (card as HTMLElement).innerText || card.textContent || "";
  const lines = innerText.split("\n").map((s) => clean(s)).filter(Boolean);
  if (lines.length > 1 && lines[0].length < 80) {
    return { heading: lines[0], text: lines.slice(1).join("\n") };
  }
  return { text: clean(innerText) };
}

/** Classifies one top-level block element into zero or more PdfNodes. Shared
 * by the article root and by any nested container (e.g. a Step's body) that
 * can itself hold block-level content like a table or paragraph. */
function classifyBlock(el: Element, out: PdfNode[], hasH1Ref: { value: boolean }) {
  if (isExcluded(el)) return;

  if (/^H[123]$/.test(el.tagName)) {
    const level = Number(el.tagName[1]) as 1 | 2 | 3;
    if (level === 1) hasH1Ref.value = true;
    out.push({ type: "heading", level, text: clean(el.textContent || "") });
    return;
  }
  if (el.tagName === "P") {
    const runs = extractRuns(el);
    if (runs.length) out.push({ type: "paragraph", runs });
    return;
  }
  if (el.tagName === "UL" || el.tagName === "OL") {
    if (el.classList.contains("kb-steps")) {
      const items = Array.from(el.querySelectorAll(":scope > li")).map(extractStep);
      if (items.length) out.push({ type: "steps", items });
      return;
    }
    const items = Array.from(el.querySelectorAll(":scope > li")).map((li) => extractRuns(li)).filter((r) => r.length);
    if (items.length) out.push({ type: "list", items });
    return;
  }
  if (el.classList.contains("kb-callout")) {
    const variant = (el.getAttribute("data-variant") as CalloutVariant | null) || "info";
    const textContainer = el.children[1] || el;
    // The component renders its own bold "Note:" / "Warning:" label as the
    // first child span — skip it here so KBPdfDocument's synthetic,
    // correctly-coloured label isn't duplicated.
    const labelNode = textContainer.tagName === "SPAN" ? undefined : textContainer.children[0]?.tagName === "SPAN" ? textContainer.children[0] : undefined;
    const runs = extractRuns(textContainer, labelNode);
    if (runs.length) out.push({ type: "callout", variant, runs });
    return;
  }
  if (el.classList.contains("kb-doc-image")) {
    out.push({ type: "image", ...extractImage(el) });
    return;
  }
  const table = el.querySelector("table");
  if (table) {
    const t = extractTable(table);
    if (t.headers.length || t.rows.length) out.push({ type: "table", ...t });
    return;
  }
  // wrapper div containing a heading (e.g. H1's flex row with CopyPageMenu)
  const innerHeading = el.querySelector(":scope > h1, :scope > h2, :scope > h3");
  if (innerHeading) {
    const level = Number(innerHeading.tagName[1]) as 1 | 2 | 3;
    if (level === 1) hasH1Ref.value = true;
    out.push({ type: "heading", level, text: clean(innerHeading.textContent || "") });
    return;
  }

  // Short, borderless caption rows (e.g. "4 min read · Beginner" under H1) —
  // detect by: no nested block-level children (p/ul/table/div-with-children)
  // and a short combined text.
  const hasBlockChildren = Array.from(el.children).some(
    (c) => /^(P|UL|OL|TABLE|FIGURE)$/.test(c.tagName) || c.children.length > 0
  );
  const text = clean(el.textContent || "");
  if (!hasBlockChildren && text && text.length <= 80) {
    const childTexts = Array.from(el.children).map((c) => clean(c.textContent || "")).filter(Boolean);
    out.push({ type: "caption", text: childTexts.length > 1 ? childTexts.join(" · ") : text });
    return;
  }

  // Bespoke per-page layout (card grids, comparison tables, etc.): best-effort.
  let target = el;
  while (target.children.length === 1 && target.children[0].children.length > 1) {
    target = target.children[0];
  }
  const children = Array.from(target.children);
  if (children.length >= 2 && children.every((c) => c.children.length > 0)) {
    const blocks = children.map(extractCard).filter((b) => b.text || b.heading);
    if (blocks.length >= 2) {
      out.push({ type: "generic", blocks });
      return;
    }
  }
  if (text) out.push({ type: "generic", blocks: [{ text }] });
}

const INLINE_TAGS = new Set(["A", "STRONG", "B", "EM", "I", "CODE", "SPAN", "BUTTON", "BR"]);

/** True if every element child is inline-level — i.e. this container is mixed
 * text+inline content (like "Navigate to the <a>Sign Up</a> page.") and
 * should be read as ONE paragraph, not recursed into per child (which would
 * silently drop all the surrounding plain text — element.children ignores
 * text nodes entirely). */
function isInlineContent(el: Element): boolean {
  return Array.from(el.children).every((c) => INLINE_TAGS.has(c.tagName));
}

function extractStep(li: Element): { num: string; title?: string; blocks: PdfNode[] } {
  const circle = li.querySelector(":scope > div:first-child > div:first-child");
  const num = clean(circle?.textContent || "");
  const contentWrap = li.children[1];
  let title: string | undefined;
  let bodyEl: Element | null = contentWrap || null;
  if (contentWrap && contentWrap.children[0]?.tagName === "P") {
    title = clean(contentWrap.children[0].textContent || "");
    bodyEl = contentWrap.children[1] || null;
  } else if (contentWrap) {
    bodyEl = contentWrap.children[0] || contentWrap;
  }
  const blocks: PdfNode[] = [];
  const hasH1Ref = { value: false };
  if (bodyEl) {
    if (!bodyEl.children.length || isInlineContent(bodyEl)) {
      const runs = extractRuns(bodyEl);
      if (runs.length) blocks.push({ type: "paragraph", runs });
    } else {
      Array.from(bodyEl.children).forEach((child) => classifyBlock(child, blocks, hasH1Ref));
    }
  }
  return { num, title, blocks };
}

export function extractPdfNodes(container: HTMLElement | null, fallbackTitle: string): PdfNode[] {
  if (!container) return [{ type: "heading", level: 1, text: fallbackTitle }];
  const nodes: PdfNode[] = [];
  const hasH1Ref = { value: false };
  Array.from(container.children).forEach((el) => classifyBlock(el, nodes, hasH1Ref));
  if (!hasH1Ref.value) nodes.unshift({ type: "heading", level: 1, text: fallbackTitle });
  return nodes;
}
