export interface ContentNode {
  tag: "H1" | "H2" | "H3" | "LI" | "P" | "TABLE";
  text: string;
}

// Many pages (e.g. Welcome) use styled <p> tags instead of semantic <h1>/<h2>.
// Fall back to computed font-size/weight so those pages still get a real
// heading hierarchy instead of one flat block of text.
function classifyNode(el: Element): Exclude<ContentNode["tag"], "TABLE"> {
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "LI") return tag as Exclude<ContentNode["tag"], "TABLE">;
  const style = window.getComputedStyle(el as HTMLElement);
  const size = parseFloat(style.fontSize) || 0;
  const weight = parseInt(style.fontWeight, 10) || 400;
  if (size >= 20) return "H1";
  if (size >= 16 || (weight >= 700 && size >= 14)) return "H2";
  if (weight >= 700 && size >= 12) return "H3";
  return "P";
}

function cleanCell(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\|/g, "/").trim();
}

function tableToMarkdown(table: Element): string {
  const headerCells = Array.from(table.querySelectorAll("thead th"));
  const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
  const headers = headerCells.map((th) => cleanCell((th as HTMLElement).innerText));
  if (headers.length === 0) return "";

  const lines = [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`];
  bodyRows.forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll("td")).map((td) => cleanCell((td as HTMLElement).innerText));
    if (cells.length === 0) return;
    lines.push(`| ${cells.join(" | ")} |`);
  });
  return lines.length > 2 ? lines.join("\n") : "";
}

export function extractContentNodes(container: HTMLElement | null, fallbackTitle: string): ContentNode[] {
  if (!container) return [{ tag: "H1", text: fallbackTitle }];
  const els = Array.from(container.querySelectorAll("h1, h2, h3, p, li, table")).filter(
    (el) => !el.closest("[data-copy-page-exclude]")
  );

  const nodes: ContentNode[] = [];
  let hasH1 = false;
  els.forEach((el) => {
    if (el.tagName === "TABLE") {
      const md = tableToMarkdown(el);
      if (md) nodes.push({ tag: "TABLE", text: md });
      return;
    }
    const tag = classifyNode(el);
    if (tag === "H1") hasH1 = true;
    const text = (el as HTMLElement).innerText.trim();
    if (!text) return;
    nodes.push({ tag, text });
  });
  if (!hasH1) nodes.unshift({ tag: "H1", text: fallbackTitle });
  return nodes;
}
