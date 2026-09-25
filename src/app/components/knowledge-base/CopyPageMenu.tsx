import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Check, FileText, FileDown, Sparkles, Search, ChevronDown, Printer, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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

function buildPrompt(title: string, pageId: string): string {
  // Points at a pre-built static HTML page, not the live app — the app is
  // client-rendered, so a plain fetch (no JS execution) would only see an
  // empty shell. HTML (rather than raw .md/text) is used because some
  // browsing tools refuse to read non-HTML responses outright.
  const origin = typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")
    ? window.location.origin
    : "https://docs.polarin.lightstorm.net";
  const pageUrl = `${origin}/md/${pageId}.html`;
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
  pageId: string;
}

export function CopyPageMenu({ contentRef, pageTitle, pageId }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const showToast = (message: string, variant: "success" | "error") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, variant });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const openInService = (url: (encodedPrompt: string) => string) => {
    const prompt = buildPrompt(pageTitle, pageId);
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
      icon: isGeneratingPdf ? Loader2 : FileDown,
      label: isGeneratingPdf ? "Generating PDF..." : "Download as PDF",
      description: "Save exact page replica with screenshots",
      onSelect: async () => {
        setOpen(false);
        setIsGeneratingPdf(true);
        try {
          const fileName = await downloadPageAsPdf(contentRef.current, pageTitle);
          showToast(`Downloaded ${fileName}`, "success");
        } catch (err: any) {
          console.error("PDF export failed:", err);
          showToast("Could not generate PDF — " + (err?.message || "render error"), "error");
        } finally {
          setIsGeneratingPdf(false);
        }
      },
    },
    {
      icon: Printer,
      label: "Print page",
      description: "Print directly or save via browser dialog",
      onSelect: () => {
        setOpen(false);
        setTimeout(() => window.print(), 100);
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
    <div ref={wrapperRef} data-copy-page-exclude="true" style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isGeneratingPdf}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid #e2e8f1", borderRadius: 10,
          padding: "7px 12px", cursor: isGeneratingPdf ? "wait" : "pointer",
          fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0a3954",
          boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
          opacity: isGeneratingPdf ? 0.75 : 1,
        }}
      >
        {isGeneratingPdf ? (
          <>
            <Loader2 size={15} style={{ animation: "spin 1s linear infinite", color: "#1c808d" }} />
            <span>Generating PDF...</span>
          </>
        ) : copied ? (
          <>
            <Check size={15} color="#059669" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={15} />
            <span>Copy page</span>
          </>
        )}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 30,
          width: 270, background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12,
          boxShadow: "0px 8px 24px rgba(15,23,42,0.12)", padding: 6,
        }}>
          {actions.map((action) => (
            <MenuRow key={action.label} action={action} />
          ))}
        </div>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: { message: string; variant: "success" | "error" } | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          data-copy-page-exclude="true"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 1000,
            display: "flex", alignItems: "center", gap: 10,
            maxWidth: 360, background: "#fff",
            border: `1px solid ${toast.variant === "success" ? "#a7f3d0" : "#fecaca"}`,
            borderRadius: 12, padding: "12px 14px",
            boxShadow: "0px 8px 24px rgba(15,23,42,0.16)",
          }}
        >
          {toast.variant === "success" ? (
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
          )}
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0a3954", lineHeight: 1.4 }}>
            {toast.message}
          </span>
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2, flexShrink: 0 }}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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
