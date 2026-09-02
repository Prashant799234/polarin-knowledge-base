import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, BookOpen, User, ChevronsRight } from "lucide-react";
import { prefersReducedMotion } from "./animations/motionConfig";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Public types ──────────────────────────────────────────────────────────────

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
  children: ReactNode;
}

export interface ArticleFooterProps {
  prev?: ArticleLink;
  next?: ArticleLink;
  related?: ArticleLink[];
  onNavigate: (id: string) => void;
}

// ── Callout ───────────────────────────────────────────────────────────────────

type CalloutVariant = "info" | "warning" | "tip" | "important";

const CV: Record<CalloutVariant, { accent: string; bg: string; label: string; labelColor: string; iconPath: ReactNode }> = {
  info:      { accent: "#0ea5e9", bg: "#f0f9ff", label: "Note",      labelColor: "#0369a1", iconPath: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-13v5m0 3h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> },
  warning:   { accent: "#f59e0b", bg: "#fffbeb", label: "Warning",   labelColor: "#b45309", iconPath: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" /><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
  tip:       { accent: "#10b981", bg: "#f0fdf4", label: "Tip",       labelColor: "#059669", iconPath: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
  important: { accent: "#8b5cf6", bg: "#faf5ff", label: "Important", labelColor: "#6d28d9", iconPath: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
};

export function Callout({ variant = "info", children }: { variant?: CalloutVariant; children: ReactNode }) {
  const s = CV[variant];
  return (
    <div style={{
      background: s.bg,
      borderLeft: `3.5px solid ${s.accent}`,
      borderRadius: "0 8px 8px 0",
      padding: "14px 18px",
      margin: "20px 0",
      display: "flex",
      gap: 12,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1, color: s.accent }}>
        {s.iconPath}
      </svg>
      <div style={{ fontFamily: FONT, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
        <span style={{ fontWeight: 700, color: s.labelColor, marginRight: 6 }}>{s.label}:</span>
        {children}
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "flex", flexDirection: "column" }}>
      {children}
    </ol>
  );
}

export function Step({ num, title, children }: { num: number; title?: string; children: ReactNode }) {
  return (
    <li style={{ display: "flex", gap: 16 }}>
      {/* Number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "#effcfd", border: "2px solid #1c808d",
          color: "#1c808d", fontFamily: FONT_J, fontSize: 12, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {num}
        </div>
        <div style={{ width: 1.5, flex: 1, background: "#e2e8f1", marginTop: 4, marginBottom: 0, minHeight: 20 }} />
      </div>
      {/* Content */}
      <div style={{ paddingBottom: 28, flex: 1, minWidth: 0, paddingTop: 2 }}>
        {title && (
          <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 8px" }}>{title}</p>
        )}
        <div style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563", lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </li>
  );
}

// ── Field table ───────────────────────────────────────────────────────────────

export function FieldTable({ rows }: { rows: { field: string; description: string; required?: boolean }[] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e5e7eb", width: "28%" }}>Field</th>
            <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e5e7eb" }}>Description</th>
            <th style={{ padding: "11px 16px", textAlign: "center", fontWeight: 700, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e5e7eb", width: "96px" }}>Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <td style={{ padding: "13px 16px", fontWeight: 600, color: "#1c808d", verticalAlign: "top", fontFamily: FONT_J, fontSize: 13 }}>{r.field}</td>
              <td style={{ padding: "13px 16px", color: "#4b5563", lineHeight: 1.65 }}>{r.description}</td>
              <td style={{ padding: "13px 16px", textAlign: "center" }}>
                {r.required ? (
                  <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #fecaca" }}>Required</span>
                ) : (
                  <span style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Optional</span>
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
    <figure style={{ margin: "24px 0", borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      {caption && (
        <figcaption style={{ fontFamily: FONT, fontSize: 12, color: "#9ca3af", padding: "8px 14px", background: "#f9fafb", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>{caption}</figcaption>
      )}
    </figure>
  );
}

// ── Typography ────────────────────────────────────────────────────────────────

export function H1({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h1 id={id} style={{
      fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: "#0a3954",
      margin: "0 0 4px", lineHeight: 1.2, letterSpacing: "-0.02em",
    }}>
      {children}
    </h1>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} style={{
      fontFamily: FONT_J, fontSize: 20, fontWeight: 700, color: "#0a3954",
      margin: "44px 0 14px", lineHeight: 1.3,
      paddingTop: 40, borderTop: "1px solid #f1f5f9",
      scrollMarginTop: 24,
    }}>
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} style={{
      fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#1c3d5a",
      margin: "28px 0 10px", lineHeight: 1.4,
      scrollMarginTop: 24,
    }}>
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ fontFamily: FONT, fontSize: 15, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px" }}>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul style={{ fontFamily: FONT, fontSize: 15, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px", paddingLeft: 20, listStyle: "none" }}>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li style={{ marginBottom: 8, paddingLeft: 16, position: "relative" }}>
      <span style={{ position: "absolute", left: 0, top: "0.55em", width: 5, height: 5, borderRadius: "50%", background: "#1c808d", display: "block" }} />
      {children}
    </li>
  );
}

export function PageLink({ label, onClick }: { label: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", padding: 0, margin: 0,
        font: "inherit", color: "#1367D6",
        textDecoration: "none", textUnderlineOffset: 2,
        cursor: "pointer", display: "inline",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
    >
      {label}
    </button>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code style={{ background: "#f1f5f9", border: "1px solid #e2e8f1", borderRadius: 5, padding: "2px 7px", fontSize: 13, fontFamily: "ui-monospace, 'Cascadia Code', monospace", color: "#0f766e" }}>
      {children}
    </code>
  );
}

// ── KYC table ─────────────────────────────────────────────────────────────────

export function KYCTable({ rows }: { rows: { entity: string; docs: string }[] }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 14 }}>
        <thead>
          <tr style={{ background: "linear-gradient(90deg, #0a3954 0%, #1c808d 100%)" }}>
            <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Type of Entity</th>
            <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Documents Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={{ padding: "13px 16px", fontWeight: 600, color: "#0a3954", verticalAlign: "top", width: "35%", fontFamily: FONT_J, fontSize: 13 }}>{r.entity}</td>
              <td style={{ padding: "13px 16px", color: "#4b5563", lineHeight: 1.65 }}>{r.docs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Flow diagram ──────────────────────────────────────────────────────────────

export interface FlowStage {
  title: string;
  items: { icon: ReactNode; label: string; caption?: string }[];
}

export function FlowDiagram({ actor, stages }: { actor?: string; stages: FlowStage[] }) {
  const nodes: ReactNode[] = [];
  if (actor) {
    nodes.push(<ActorNode key="actor" label={actor} />);
    nodes.push(<Connector key="c-actor" />);
  }
  stages.forEach((stage, i) => {
    nodes.push(<StageCard key={stage.title} stage={stage} />);
    if (i < stages.length - 1) nodes.push(<Connector key={`c-${i}`} />);
  });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 12, margin: "24px 0" }}>
      {nodes}
    </div>
  );
}

function ActorNode({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, padding: "0 8px", minWidth: 72 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 }}>
        <User size={20} />
      </div>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "center" }}>{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1c808d", padding: "0 2px" }}>
      <ChevronsRight size={18} />
    </div>
  );
}

function StageCard({ stage }: { stage: FlowStage }) {
  return (
    <div style={{ flex: "1 1 180px", minWidth: 180, maxWidth: 260, background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}>
      <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#1c808d", margin: 0 }}>{stage.title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stage.items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 10, padding: "9px 12px" }}>
            <span style={{ color: "#1c808d", flexShrink: 0, display: "flex" }}>{item.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0a3954" }}>{item.label}</div>
              {item.caption && <div style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8" }}>{item.caption}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ArticlePage layout ───────────────────────────────────────────────────

export function ArticlePage({ toc, children }: ArticlePageProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  // Scroll spy — observe against viewport (works with any outer scroll container)
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-8% 0px -72% 0px", threshold: 0 }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ display: "flex" }}>

      {/* ── Main content — no overflow, grows naturally ── */}
      <div style={{ flex: 1, padding: "36px 48px 40px 40px", minWidth: 0 }}>
        {children}
      </div>

      {/* ── TOC sidebar — sticky within the outer scroll container ── */}
      {toc.length > 1 && (
        <aside
          style={{
            width: 216,
            flexShrink: 0,
            padding: "36px 20px 36px 0",
            borderLeft: "1px solid #f1f5f9",
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div style={{ paddingLeft: 16, marginBottom: 20 }}>
            <span style={{
              fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              On This Page
            </span>
          </div>

          {/* TOC track — the vertical rail lives here */}
          <nav style={{ position: "relative", paddingLeft: 0 }}>
            {/* Full-height gray rail */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 2, background: "#e5e7eb", borderRadius: 2,
            }} />

            {toc.map(({ id, label, level }) => {
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    position: "relative",
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontSize: level === 2 ? 13 : 13,
                    lineHeight: 1.5,
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: level === 2 ? 22 : 14,
                    paddingRight: 8,
                    color: isActive ? "#1c808d" : "#6b7280",
                    fontWeight: isActive ? 700 : level === 1 ? 500 : 400,
                    transition: "color 0.15s",
                  }}
                >
                  {/* Active indicator segment on the rail */}
                  {isActive && (
                    <span style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: "#1c808d",
                      borderRadius: 2,
                    }} />
                  )}
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

// ── Article footer (rendered outside the white card by KnowledgeBase) ─────────

export function ArticleFooter({ prev, next, related, onNavigate }: ArticleFooterProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  return (
    <div style={{ padding: "24px 40px 32px" }}>
      {/* Feedback */}
      <div style={{ paddingBottom: 24 }}>
        <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 12px" }}>
          Was this article helpful?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["up", "down"] as const).map((v) => {
            const active = feedback === v;
            return (
              <motion.button
                key={v}
                whileTap={prefersReducedMotion ? {} : { scale: 0.93 }}
                onClick={() => setFeedback(active ? null : v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 20px",
                  borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 600,
                  border: `1.5px solid ${active ? (v === "up" ? "#1c808d" : "#e11d48") : "#e5e7eb"}`,
                  background: active ? (v === "up" ? "#f0fdfa" : "#fff1f2") : "#fff",
                  color: active ? (v === "up" ? "#1c808d" : "#e11d48") : "#6b7280",
                  transition: "all 0.15s",
                }}
              >
                {v === "up" ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
                {v === "up" ? "Yes, helpful" : "Not really"}
              </motion.button>
            );
          })}
        </div>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: FONT, fontSize: 13, color: "#6b7280", margin: "10px 0 0" }}
          >
            {feedback === "up" ? "Thanks for the feedback! Glad it helped." : "Thanks — we'll work on improving this article."}
          </motion.p>
        )}
      </div>

      {/* Prev / Next */}
      {(prev || next) && (
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {prev && <NavCard dir="prev" label={prev.label} onClick={() => onNavigate(prev.pageId)} />}
          {next && <NavCard dir="next" label={next.label} onClick={() => onNavigate(next.pageId)} />}
        </div>
      )}

      {/* Related Articles */}
      {related && related.length > 0 && (
        <div>
          <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#6b7280", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <BookOpen size={14} color="#1c808d" /> Related Articles
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {related.map((r) => (
              <button
                key={r.pageId}
                onClick={() => onNavigate(r.pageId)}
                style={{
                  background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8,
                  padding: "10px 16px", textAlign: "left", cursor: "pointer",
                  fontFamily: FONT, fontSize: 14, color: "#1c808d", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 8, transition: "all 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0fdfa"; e.currentTarget.style.borderColor = "#99f6e4"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <ChevronRight size={14} style={{ flexShrink: 0 }} />
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Prev / Next card ──────────────────────────────────────────────────────────

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
        background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10,
        cursor: "pointer", textAlign: isPrev ? "left" : "right",
        alignItems: isPrev ? "flex-start" : "flex-end",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#1c808d"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(28,128,141,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
    >
      <span style={{ fontFamily: FONT, fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 4 }}>
        {isPrev && <ChevronLeft size={12} />}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && <ChevronRight size={12} />}
      </span>
      <span style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#1c808d" }}>{label}</span>
    </motion.button>
  );
}
