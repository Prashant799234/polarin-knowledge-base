import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { prefersReducedMotion } from "./animations/motionConfig";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Public types ─────────────────────────────────────────────────────────────

export interface TocEntry {
  id: string;
  label: string;
  level?: 1 | 2;
}

export interface ArticleLink {
  label: string;
  pageId: string;
}

export interface ArticlePageProps {
  toc: TocEntry[];
  prev?: ArticleLink;
  next?: ArticleLink;
  related?: ArticleLink[];
  onNavigate: (id: string) => void;
  children: ReactNode;
}

// ── Callout / Note components (exported for article pages) ───────────────────

type CalloutVariant = "info" | "warning" | "tip" | "important";

const CALLOUT_STYLES: Record<CalloutVariant, { bg: string; border: string; icon: string; label: string; labelColor: string }> = {
  info:      { bg: "#f0f9ff", border: "#bae6fd", icon: "ℹ️",  label: "Note",      labelColor: "#0369a1" },
  warning:   { bg: "#fffbeb", border: "#fde68a", icon: "⚠️",  label: "Warning",   labelColor: "#92400e" },
  tip:       { bg: "#f0fdf4", border: "#bbf7d0", icon: "💡",  label: "Tip",       labelColor: "#166534" },
  important: { bg: "#fdf4ff", border: "#e9d5ff", icon: "📌",  label: "Important", labelColor: "#6b21a8" },
};

export function Callout({ variant = "info", children }: { variant?: CalloutVariant; children: ReactNode }) {
  const s = CALLOUT_STYLES[variant];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "12px 16px", margin: "16px 0", display: "flex", gap: 12 }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
      <div style={{ fontFamily: FONT, fontSize: 14, color: "#374151", lineHeight: 1.65 }}>
        <span style={{ fontWeight: 700, color: s.labelColor, marginRight: 6 }}>{s.label}:</span>
        {children}
      </div>
    </div>
  );
}

// ── Step component ────────────────────────────────────────────────────────────

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
      {children}
    </div>
  );
}

export function Step({ num, title, children }: { num: number; title?: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, position: "relative" }}>
      {/* Line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #1c808d 0%, #0a3954 100%)",
          color: "#fff", fontFamily: FONT_J, fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, zIndex: 1,
        }}>
          {num}
        </div>
        <div style={{ width: 2, flex: 1, background: "#e2e8f1", minHeight: 16 }} />
      </div>
      <div style={{ paddingBottom: 24, flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "6px 0 8px" }}>{title}</p>
        )}
        <div style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 1.7, marginTop: title ? 0 : 6 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Field table ───────────────────────────────────────────────────────────────

export function FieldTable({ rows }: { rows: { field: string; description: string; required?: boolean }[] }) {
  return (
    <div style={{ border: "1px solid #e2e8f1", borderRadius: 10, overflow: "hidden", margin: "16px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#0a3954", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f1", width: "30%" }}>Field</th>
            <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#0a3954", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f1" }}>Description</th>
            <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#0a3954", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f1", width: "90px" }}>Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1c808d", verticalAlign: "top" }}>{r.field}</td>
              <td style={{ padding: "12px 16px", color: "#475569", lineHeight: 1.6 }}>{r.description}</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                {r.required ? (
                  <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: "1px solid #fecaca" }}>Required</span>
                ) : (
                  <span style={{ background: "#f1f5f9", color: "#94a3b8", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>Optional</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Doc image ─────────────────────────────────────────────────────────────────

export function DocImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure style={{ margin: "20px 0", borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f1", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      {caption && (
        <figcaption style={{ fontFamily: FONT, fontSize: 12, color: "#94a3b8", padding: "8px 12px", background: "#f8fafc", textAlign: "center" }}>{caption}</figcaption>
      )}
    </figure>
  );
}

// ── Section heading helpers ───────────────────────────────────────────────────

export function H1({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h1 id={id} style={{ fontFamily: FONT_J, fontSize: 26, fontWeight: 800, color: "#0a3954", margin: "0 0 8px", lineHeight: 1.25 }}>{children}</h1>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} style={{ fontFamily: FONT_J, fontSize: 18, fontWeight: 700, color: "#0a3954", margin: "36px 0 12px", lineHeight: 1.3, scrollMarginTop: 80 }}>{children}</h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 700, color: "#1c3d5a", margin: "24px 0 8px", lineHeight: 1.4, scrollMarginTop: 80 }}>{children}</h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", paddingLeft: 24 }}>{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li style={{ marginBottom: 6 }}>{children}</li>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return <code style={{ background: "#f1f5f9", border: "1px solid #e2e8f1", borderRadius: 4, padding: "1px 6px", fontSize: 13, fontFamily: "ui-monospace, monospace", color: "#0f766e" }}>{children}</code>;
}

// ── KYC document table ────────────────────────────────────────────────────────

export function KYCTable({ rows }: { rows: { entity: string; docs: string }[] }) {
  return (
    <div style={{ border: "1px solid #e2e8f1", borderRadius: 10, overflow: "hidden", margin: "16px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 14 }}>
        <thead>
          <tr style={{ background: "linear-gradient(90deg,#0a3954,#1c808d)" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Type of Entity</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Documents Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
              <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0a3954", verticalAlign: "top", width: "35%" }}>{r.entity}</td>
              <td style={{ padding: "12px 16px", color: "#475569", lineHeight: 1.6 }}>{r.docs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main ArticlePage layout ───────────────────────────────────────────────────

export function ArticlePage({ toc, prev, next, related, onNavigate, children }: ArticlePageProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll spy
  useEffect(() => {
    const root = contentRef.current;
    if (!root || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { root, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    toc.forEach(({ id }) => {
      const el = root.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollTo = (id: string) => {
    const root = contentRef.current;
    const el = root?.querySelector(`#${id}`) as HTMLElement | null;
    if (el && root) root.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* Main scrollable content */}
      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "32px 40px 48px", minWidth: 0 }}>
        {children}

        {/* ── Feedback ── */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e2e8f1" }}>
          <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 16px" }}>Was this article helpful?</p>
          <div style={{ display: "flex", gap: 10 }}>
            {(["up", "down"] as const).map((v) => {
              const active = feedback === v;
              return (
                <motion.button
                  key={v}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
                  onClick={() => setFeedback(active ? null : v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 20px", borderRadius: 8, cursor: "pointer",
                    fontFamily: FONT, fontSize: 14, fontWeight: 600,
                    border: `1.5px solid ${active ? (v === "up" ? "#1c808d" : "#e11d48") : "#e2e8f1"}`,
                    background: active ? (v === "up" ? "#f0fdfa" : "#fff1f2") : "#fff",
                    color: active ? (v === "up" ? "#1c808d" : "#e11d48") : "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  {v === "up" ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                  {v === "up" ? "Yes, helpful" : "Not really"}
                </motion.button>
              );
            })}
          </div>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", margin: "12px 0 0" }}
            >
              {feedback === "up" ? "Thanks for the feedback! Glad it helped." : "Thanks — we'll work on improving this article."}
            </motion.p>
          )}
        </div>

        {/* ── Prev / Next ── */}
        {(prev || next) && (
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            {prev && (
              <NavCard dir="prev" label={prev.label} onClick={() => onNavigate(prev.pageId)} />
            )}
            {next && (
              <NavCard dir="next" label={next.label} onClick={() => onNavigate(next.pageId)} />
            )}
          </div>
        )}

        {/* ── Related ── */}
        {related && related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={16} color="#1c808d" /> Related Articles
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {related.map((r) => (
                <button
                  key={r.pageId}
                  onClick={() => onNavigate(r.pageId)}
                  style={{
                    background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 8,
                    padding: "10px 16px", textAlign: "left", cursor: "pointer",
                    fontFamily: FONT, fontSize: 14, color: "#1c808d", fontWeight: 600,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdfa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
                >
                  → {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Table of Contents sidebar ── */}
      {toc.length > 1 && (
        <aside style={{ width: 220, flexShrink: 0, padding: "32px 20px 32px 0", overflowY: "auto" }}>
          <p style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>On This Page</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {toc.map(({ id, label, level }) => {
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    textAlign: "left", background: "none", border: "none", cursor: "pointer",
                    fontFamily: FONT, fontSize: 13, lineHeight: 1.5,
                    paddingLeft: level === 2 ? 12 : 0,
                    paddingTop: 5, paddingBottom: 5, paddingRight: 4,
                    borderLeft: isActive ? "2px solid #1c808d" : "2px solid transparent",
                    color: isActive ? "#1c808d" : "#64748b",
                    fontWeight: isActive ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </div>
  );
}

// ── Prev/Next card ────────────────────────────────────────────────────────────

function NavCard({ dir, label, onClick }: { dir: "prev" | "next"; label: string; onClick: () => void }) {
  const isPrev = dir === "prev";
  return (
    <motion.button
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      style={{
        flex: 1, minWidth: 180,
        display: "flex", flexDirection: "column", gap: 4,
        padding: "14px 18px",
        background: "#fff", border: "1.5px solid #e2e8f1", borderRadius: 10,
        cursor: "pointer", textAlign: isPrev ? "left" : "right",
        alignItems: isPrev ? "flex-start" : "flex-end",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#1c808d";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(28,128,141,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8f1";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}>
        {isPrev && <ChevronLeft size={12} />} {isPrev ? "Previous" : "Next"} {!isPrev && <ChevronRight size={12} />}
      </span>
      <span style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#1c808d" }}>{label}</span>
    </motion.button>
  );
}
