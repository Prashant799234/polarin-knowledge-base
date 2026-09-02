import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Copy, Check, FileText, FileDown, Sparkles, Search, ChevronDown } from "lucide-react";
import { downloadPageAsPdf } from "./pdfExport";
import { extractContentNodes } from "./extractContent";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

function extractPageMarkdown(container: HTMLElement | null, fallbackTitle: string): string {
  const nodes = extractContentNodes(container, fallbackTitle);
  const lines: string[] = [];
  nodes.forEach(({ tag, text }) => {
    switch (tag) {
      case "H1": lines.push(`# ${text}`, ""); break;
      case "H2": lines.push(`## ${text}`, ""); break;
      case "H3": lines.push(`### ${text}`, ""); break;
      case "LI": lines.push(`- ${text}`); break;
      default: lines.push(text, "");
    }
  });
  return lines.join("\n").trim();
}

function buildPrompt(title: string): string {
  const pageUrl = window.location.href;
  return `Could you pull up this Polarin Docs page and get familiar with it? I'll have questions once you've had a look: ${pageUrl}\n\n(Page: "${title}")`;
}

interface MenuAction {
  icon: typeof Copy;
  label: string;
  description: string;
  onSelect: () => void;
}

interface Props {
  contentRef: RefObject<HTMLElement | null>;
  pageTitle: string;
}

export function CopyPageMenu({ contentRef, pageTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const openInService = (url: (encodedPrompt: string) => string) => {
    const prompt = buildPrompt(pageTitle);
    window.open(url(encodeURIComponent(prompt)), "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const actions: MenuAction[] = [
    {
      icon: copied ? Check : Copy,
      label: copied ? "Copied!" : "Copy page",
      description: "Copy page as Markdown for LLMs",
      onSelect: () => {
        const markdown = extractPageMarkdown(contentRef.current, pageTitle);
        navigator.clipboard.writeText(markdown).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
        setOpen(false);
      },
    },
    {
      icon: FileText,
      label: "View as Markdown",
      description: "View this page as plain text",
      onSelect: () => {
        const markdown = extractPageMarkdown(contentRef.current, pageTitle);
        const blob = new Blob([markdown], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setOpen(false);
      },
    },
    {
      icon: FileDown,
      label: "Download as PDF",
      description: "Save this page as a formatted PDF",
      onSelect: () => {
        downloadPageAsPdf(contentRef.current, pageTitle).catch((err) => console.error("PDF export failed", err));
        setOpen(false);
      },
    },
    {
      icon: Sparkles,
      label: "Open in ChatGPT",
      description: "Ask questions about this page",
      onSelect: () => openInService((q) => `https://chatgpt.com/?q=${q}`),
    },
    {
      icon: Sparkles,
      label: "Open in Claude",
      description: "Ask questions about this page",
      onSelect: () => openInService((q) => `https://claude.ai/new?q=${q}`),
    },
    {
      icon: Sparkles,
      label: "Open in Gemini",
      description: "Ask questions about this page",
      onSelect: () => openInService((q) => `https://gemini.google.com/app?q=${q}`),
    },
    {
      icon: Search,
      label: "Open in Perplexity",
      description: "Ask questions about this page",
      onSelect: () => openInService((q) => `https://www.perplexity.ai/search?q=${q}`),
    },
  ];

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid #e2e8f1", borderRadius: 10,
          padding: "7px 12px", cursor: "pointer",
          fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0a3954",
          boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
        }}
      >
        {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
        {copied ? "Copied!" : "Copy page"}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
          width: 260, background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12,
          boxShadow: "0px 8px 24px rgba(15,23,42,0.12)", padding: 6,
        }}>
          {actions.map((action) => (
            <MenuRow key={action.label} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuRow({ action }: { action: MenuAction }) {
  const Icon = action.icon;
  return (
    <button
      onClick={action.onSelect}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        background: "none", border: "none", borderRadius: 8, padding: "8px 8px",
        cursor: "pointer", textAlign: "left",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", color: "#1c808d",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: FONT_J, fontWeight: 700, fontSize: 13, color: "#0a3954", margin: 0 }}>{action.label}</p>
        <p style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", margin: "1px 0 0" }}>{action.description}</p>
      </div>
    </button>
  );
}
