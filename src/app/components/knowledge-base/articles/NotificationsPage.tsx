import { ArticlePage, H1, H2, P, UL, LI, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "types",      label: "Types of Notifications", level: 2 as const },
  { id: "managing",   label: "Managing Notifications",  level: 2 as const },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function NotificationsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Notifications</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="Getting Around" color="#1c808d" />
      </div>

      <P>
        The bell icon in the top navigation opens your <strong>Notifications</strong> panel — a running feed of
        everything happening on your account, grouped by day, with <strong>All</strong> and <strong>Unread</strong> tabs
        and a one-click <strong>Mark All as Read</strong>.
      </P>

      {/* ── Types ── */}
      <H2 id="types">Types of Notifications</H2>
      <UL>
        <LI><strong>Order &amp; provisioning updates</strong> — a service moving between states, e.g. "Saved in Design State" or "moved to Ready to Patch state." See <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} /> for what each state means.</LI>
        <LI><strong>Performance alerts</strong> — threshold-based alerts from VISTA, such as a Virtual Connection's latency going above its configured limit. These are typically informational — Polarin is already monitoring and will notify you again once things return to normal. See <PageLink label="VISTA" onClick={() => onNavigate("vista-overview")} />.</LI>
      </UL>

      {/* ── Managing ── */}
      <H2 id="managing">Managing Notifications</H2>
      <P>
        Switch to the <strong>Unread</strong> tab to see only what you haven't looked at yet, or use <strong>Mark All
        as Read</strong> to clear the badge without reading each one individually. Notifications stay in the panel
        under their date grouping even after being read, so you can always scroll back through recent activity.
      </P>
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
