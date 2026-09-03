import type { ElementType } from "react";
import { Search, Ticket, Loader, CheckCircle2, Archive, RotateCcw, Headphones, ListChecks, Eye, Zap, Inbox } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, FlowDiagram, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "why",        label: "Why This Exists",   level: 2 as const },
  { id: "lifecycle",  label: "Ticket Lifecycle",  level: 2 as const },
  { id: "channels",   label: "Ways to Get Help",  level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface ValueItem {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
}

const VALUE_ITEMS: ValueItem[] = [
  { icon: Eye,   color: "#1a65fd", title: "Transparency",       description: "Track a ticket's real status yourself, any time — no need to ask for an update." },
  { icon: Zap,   color: "#9e27fd", title: "Faster Resolution",  description: "Structured intake — service, category, description — gets full context to the right team immediately." },
  { icon: Inbox, color: "#00b345", title: "One Record",         description: "Every ticket and every reply lives in one place, not scattered across email threads." },
  { icon: Headphones, color: "#fd5900", title: "A Direct Line, Too", description: "When self-serve or a ticket isn't enough, you can always reach a person directly." },
];

interface QuickLink {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
  pageId: KBPage;
}

const QUICK_LINKS: QuickLink[] = [
  { icon: Search,     color: "#1a65fd", title: "Search the Knowledge Base", description: "Most questions are already answered here — worth a look before you raise a ticket.", pageId: "welcome" },
  { icon: Ticket,     color: "#9e27fd", title: "Create a Ticket",           description: "Something only Polarin's team can fix? Raise a ticket with the details.",           pageId: "create-ticket" },
  { icon: ListChecks, color: "#00b345", title: "My Tickets",                description: "Track every ticket you've raised, its status, and the full conversation.",         pageId: "my-tickets" },
  { icon: Headphones, color: "#fd5900", title: "Contact Support",           description: "Prefer to talk to someone directly? Email or call the support team.",              pageId: "contact-support" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function SupportOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Get Support</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
      </div>

      <P>
        Most questions have an answer already written down in this Knowledge Base. When they don't — a bug,
        something only Polarin's team can see or fix, an account issue — that's what a <strong>support ticket</strong> is
        for. This page covers how tickets work end to end, and every other way to reach the team.
      </P>

      <P>
        Everything lives under the <strong>Help</strong> tab: a landing page with your open/high-priority/closed
        ticket counts, your dedicated Account Manager's contact details, a <strong>Knowledge Base</strong> shortcut,
        and a <strong>Create a Ticket</strong> button — followed by the full list of every ticket you've raised.
      </P>

      {/* ── Why this exists ── */}
      <H2 id="why">Why This Exists</H2>
      <P>We built this so getting help never feels like a black box.</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "16px 0 24px" }}>
        {VALUE_ITEMS.map((item) => (
          <ValueCard key={item.title} item={item} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "24px 0" }}>
        {QUICK_LINKS.map((link) => (
          <QuickLinkCard key={link.title} link={link} onNavigate={onNavigate} />
        ))}
      </div>

      <Callout variant="tip">
        Search the Knowledge Base first — it's usually faster than waiting on a reply, and covers most account,
        billing, and service questions already.
      </Callout>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">Ticket Lifecycle</H2>
      <P>Every ticket's detail view tracks it through five possible stages, from the moment you raise it onward.</P>

      <FlowDiagram
        stages={[
          { title: "Open",        items: [{ icon: <Ticket size={16} />, label: "Ticket raised" }] },
          { title: "Reopen",      items: [{ icon: <RotateCcw size={16} />, label: "Only if sent back" }] },
          { title: "In Progress", items: [{ icon: <Loader size={16} />, label: "Team working on it" }] },
          { title: "Resolved",    items: [{ icon: <CheckCircle2 size={16} />, label: "Fix applied" }] },
          { title: "Closed",      items: [{ icon: <Archive size={16} />, label: "Confirmed done" }] },
        ]}
      />

      <P>
        Once a ticket is <strong>Closed</strong>, you're asked to rate the experience — and if it isn't actually
        fixed, you can send it right back through <strong>Reopen</strong> rather than starting over. See{" "}
        <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} /> for exactly how that works.
      </P>

      {/* ── Channels ── */}
      <H2 id="channels">Ways to Get Help</H2>
      <UL>
        <LI><strong>Knowledge Base</strong> — self-serve answers, available any time, no waiting.</LI>
        <LI><strong>Support Tickets</strong> — for issues that need Polarin's team to investigate or act.</LI>
        <LI><strong>Direct contact</strong> — email or phone, for urgent issues or when you'd rather talk it through. See <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.</LI>
      </UL>

      <Callout variant="info">
        Polarin support is available 24×7. Critical and high-priority tickets are acknowledged within 2 hours.
      </Callout>

      <P>
        You don't have to start from Help, either — every service's own detail page has a <strong>Raise a Ticket</strong> shortcut, useful when you're already looking at the exact Port, connection, or router having the issue. See{" "}
        <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} /> for both routes.
      </P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to raise an issue? Go to <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
        <LI>Already have one open? Check <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} /> for its status.</LI>
        <LI>Need to talk to someone now? Head to <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

function ValueCard({ item }: { item: ValueItem }) {
  const Icon = item.icon;
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 20,
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, color: item.color,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#0a3954", margin: "0 0 4px" }}>{item.title}</p>
        <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
      </div>
    </div>
  );
}

function QuickLinkCard({ link, onNavigate }: { link: QuickLink; onNavigate: (page: KBPage) => void }) {
  const Icon = link.icon;
  return (
    <button
      onClick={() => onNavigate(link.pageId)}
      style={{
        textAlign: "left", cursor: "pointer",
        background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 20,
        display: "flex", flexDirection: "column", gap: 12,
        boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${link.color}18`, color: link.color,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#0a3954", margin: "0 0 4px" }}>{link.title}</p>
        <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{link.description}</p>
      </div>
    </button>
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
