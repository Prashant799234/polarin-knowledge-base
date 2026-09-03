import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "before",     label: "Before You Start",    level: 2 as const },
  { id: "steps",      label: "Create Your Ticket",  level: 2 as const },
  { id: "priority",   label: "Choosing a Priority", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const TICKET_FIELDS = [
  { field: "Subject",     description: "A short, specific summary — e.g. \"Virtual Router BGP session dropping\" rather than \"Not working.\"", required: true },
  { field: "Service",     description: "Which service the issue affects: Port, Virtual Router, Cloud Connect, DCI, Billing, or Account.", required: true },
  { field: "Priority",    description: "How urgent the issue is. See Choosing a Priority below.", required: true },
  { field: "Description", description: "What happened, when it started, and what you expected instead. Include any error messages exactly as shown.", required: true },
  { field: "Attachments", description: "Screenshots, logs, or exports that help explain the issue.", required: false },
];

const PRIORITY_LEVELS = [
  { code: "P1", label: "Critical",  color: "#dc2626", bg: "#fef2f2", desc: "A live service is down or unusable for your organisation." },
  { code: "P2", label: "High",      color: "#ea580c", bg: "#fff7ed", desc: "Major functionality is impaired, but there's a workaround." },
  { code: "P3", label: "Medium",    color: "#d97706", bg: "#fffbeb", desc: "A non-critical issue or question that doesn't block your work." },
  { code: "P4", label: "Low",       color: "#2563eb", bg: "#eff6ff", desc: "General feedback, minor cosmetic issues, or feature requests." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateTicketPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Ticket</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
      </div>

      <P>
        Raise a ticket when something needs Polarin's team to look into it directly — a service issue, a billing
        question specific to your account, or a bug you've hit. The more detail you give up front, the faster
        it gets resolved.
      </P>

      <Callout variant="tip">
        Not sure this needs a ticket? Check <PageLink label="Get Support" onClick={() => onNavigate("ticket-overview")} /> first — most common
        questions are already answered in the Knowledge Base.
      </Callout>

      {/* ── Before you start ── */}
      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Make sure you're signed in — tickets are tied to your account so you (and your team) can track them.</LI>
        <LI>Know which service is affected, and roughly when the issue started.</LI>
        <LI>Have any error messages, screenshots, or logs ready to attach.</LI>
      </UL>

      {/* ── Steps ── */}
      <H2 id="steps">Create Your Ticket</H2>

      <Steps>
        <Step num={1} title="Open Create Ticket">
          Go to <strong>Get Support</strong> in the left sidebar, then click <strong>Create Ticket</strong>.
        </Step>
        <Step num={2} title="Fill in the details">
          Complete the following fields:
          <FieldTable rows={TICKET_FIELDS} />
        </Step>
        <Step num={3} title="Review and submit">
          Check the details, then click <strong>Submit</strong>. You'll get a unique <strong>Ticket ID</strong> immediately,
          and a copy of the ticket by email.
        </Step>
      </Steps>

      {/* ── Priority ── */}
      <H2 id="priority">Choosing a Priority</H2>
      <P>Priority determines how quickly your ticket gets picked up — pick the level that honestly matches the impact.</P>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {PRIORITY_LEVELS.map((p) => (
          <div key={p.code} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: p.bg, border: `1px solid ${p.color}30`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
              color: p.color, fontFamily: FONT_J, fontWeight: 800, fontSize: 12,
              background: "#fff", border: `1px solid ${p.color}40`, borderRadius: 20, padding: "3px 10px",
            }}>
              {p.code} {p.label}
            </span>
            <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <Callout variant="info">
        P1 and P2 tickets are acknowledged within 2 hours, 24×7. For a live outage, calling the support line
        directly is often faster than waiting on the queue — see <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Track your ticket's status and conversation in <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} />.</LI>
        <LI>Need to escalate an unresolved issue? See <strong>Escalation Matrix</strong> in the sidebar.</LI>
      </UL>
    </ArticlePage>
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
