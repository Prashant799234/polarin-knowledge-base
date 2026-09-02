export interface ContentNode {
  tag: "H1" | "H2" | "H3" | "LI" | "P";
  text: string;
}

// Many pages (e.g. Welcome) use styled <p> tags instead of semantic <h1>/<h2>.
// Fall back to computed font-size/weight so those pages still get a real
// heading hierarchy instead of one flat block of text.
function classifyNode(el: Element): ContentNode["tag"] {
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "LI") return tag as ContentNode["tag"];
  const style = window.getComputedStyle(el as HTMLElement);
  const size = parseFloat(style.fontSize) || 0;
  const weight = parseInt(style.fontWeight, 10) || 400;
  if (size >= 20) return "H1";
  if (size >= 16 || (weight >= 700 && size >= 14)) return "H2";
  if (weight >= 700 && size >= 12) return "H3";
  return "P";
}

export function extractContentNodes(container: HTMLElement | null, fallbackTitle: string): ContentNode[] {
  if (!container) return [{ tag: "H1", text: fallbackTitle }];
  const els = Array.from(container.querySelectorAll("h1, h2, h3, p, li")).filter(
    (el) => !el.closest("[data-copy-page-exclude]")
  );
  const classified = els.map((el) => ({ el, tag: classifyNode(el) }));
  const hasH1 = classified.some((c) => c.tag === "H1");
  const nodes: ContentNode[] = [];
  if (!hasH1) nodes.push({ tag: "H1", text: fallbackTitle });
  classified.forEach(({ el, tag }) => {
    const text = (el as HTMLElement).innerText.trim();
    if (!text) return;
    nodes.push({ tag, text });
  });
  return nodes;
}
