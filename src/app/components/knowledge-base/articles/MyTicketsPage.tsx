import type { ReactNode } from "react";
import { ThumbsUp, RotateCcw } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "viewing",     label: "Viewing Your Tickets",  level: 2 as const },
  { id: "statuses",    label: "Ticket Statuses",       level: 2 as const },
  { id: "detail",      label: "Ticket Detail",         level: 2 as const },
  { id: "feedback",    label: "When a Ticket Is Resolved" },
  { id: "next-steps",  label: "Next Steps" },
];

interface Status {
  label: string;
  color: string;
  bg: string;
  description: string;
}

const STATUSES: Status[] = [
  { label: "Open",           color: "#2563eb", bg: "#eff6ff", description: "Received — waiting to be picked up." },
  { label: "In Progress",    color: "#d97706", bg: "#fffbeb", description: "An engineer is actively working on it." },
  { label: "Waiting on You", color: "#9333ea", bg: "#faf5ff", description: "We've asked a question or need more information." },
  { label: "Resolved",       color: "#059669", bg: "#f0fdf4", description: "A fix has been applied — confirm it worked, or reopen it." },
  { label: "Closed",         color: "#6b7280", bg: "#f9fafb", description: "Confirmed resolved, or auto-closed after no response." },
];

const SAMPLE_TICKETS = [
  { id: "TCK-10482", subject: "Virtual Router BGP session dropping", service: "Virtual Router", status: STATUSES[1], updated: "2 hours ago" },
  { id: "TCK-10467", subject: "Invoice showing incorrect GST amount", service: "Billing",        status: STATUSES[2], updated: "1 day ago" },
  { id: "TCK-10451", subject: "Port provisioning stuck at Pending",   service: "Port",            status: STATUSES[3], updated: "3 days ago" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function MyTicketsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">My Tickets</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
      </div>

      <P>
        <strong>My Tickets</strong> lists every ticket you've raised, its current status, and the full conversation
        with the support team — so you always know where things stand without needing to ask.
      </P>

      {/* ── Viewing tickets ── */}
      <H2 id="viewing">Viewing Your Tickets</H2>
      <P>Go to <strong>Get Support → My Tickets</strong> in the left sidebar to see the full list.</P>

      <TicketTablePreview />

      {/* ── Statuses ── */}
      <H2 id="statuses">Ticket Statuses</H2>
      <P>Every ticket is in exactly one of these states at any time:</P>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {STATUSES.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "12px 16px" }}>
            <StatusBadge status={s} />
            <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.6 }}>{s.description}</p>
          </div>
        ))}
      </div>

      {/* ── Detail view ── */}
      <H2 id="detail">Ticket Detail</H2>
      <P>
        Click any ticket to open its full detail — the original request, every reply from the support team, any
        attachments, and a timestamped timeline of status changes.
      </P>

      {/* ── Feedback on resolved tickets ── */}
      <H2 id="feedback">When a Ticket Is Resolved</H2>
      <P>
        When the support team applies a fix, your ticket moves to <strong>Resolved</strong> — not <strong>Closed</strong> yet.
        You're asked one question first:
      </P>

      <div style={{
        background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 14, padding: 20, margin: "16px 0 24px",
      }}>
        <p style={{ fontFamily: FONT_J, fontWeight: 700, fontSize: 15, color: "#0a3954", margin: "0 0 16px" }}>
          Was this resolved to your satisfaction?
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <FeedbackOption
            icon={<ThumbsUp size={18} />}
            color="#059669"
            title="Yes, it's resolved"
            description="The ticket closes. You can still reopen it later if the issue comes back."
          />
          <FeedbackOption
            icon={<RotateCcw size={18} />}
            color="#dc2626"
            title="No, reopen it"
            description="Add a note on what's still wrong — it goes straight back to the same engineer, not a new queue."
          />
        </div>
      </div>

      <Callout variant="info">
        If you don't respond, a resolved ticket closes automatically after a few days. Reopening later is always
        possible from the ticket's detail view — you don't need to raise a new one.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Something new come up? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
        <LI>Need a direct line instead? <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

function TicketTablePreview() {
  const cols = ["Ticket ID", "Subject", "Service", "Status", "Last Updated"];
  return (
    <div style={{ margin: "16px 0 24px", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 12.5, minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {cols.map((c) => (
                <th key={c} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_TICKETS.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < SAMPLE_TICKETS.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "10px 12px", color: "#64748b", fontFamily: "ui-monospace, monospace", fontSize: 11.5, whiteSpace: "nowrap" }}>{t.id}</td>
                <td style={{ padding: "10px 12px", color: "#0a3954" }}>{t.subject}</td>
                <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{t.service}</td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status={t.status} /></td>
                <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 12, color: "#9ca3af", padding: "8px 14px", background: "#f9fafb", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>
        Illustrative example — your actual tickets will differ.
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "#fff", color: status.color,
      border: `1px solid ${status.color}40`,
      borderRadius: 20, padding: "3px 12px",
      fontSize: 11.5, fontWeight: 700,
      fontFamily: FONT_J, whiteSpace: "nowrap",
    }}>
      {status.label}
    </span>
  );
}

function FeedbackOption({ icon, color, title, description }: { icon: ReactNode; color: string; title: string; description: string }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${color}30`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: `${color}15`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <p style={{ fontFamily: FONT_J, fontWeight: 700, fontSize: 13.5, color: "#0a3954", margin: 0 }}>{title}</p>
      <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
