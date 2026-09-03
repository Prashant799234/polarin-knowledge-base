import type { ElementType } from "react";
import { ShieldCheck, Search, Eye, Users } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "why",        label: "Why This Exists",   level: 2 as const },
  { id: "how",        label: "How It Works",      level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface ValueItem {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
}

const VALUE_ITEMS: ValueItem[] = [
  { icon: Users,       color: "#1a65fd", title: "Accountability",     description: "See exactly who on your team did what, and when — every login, every change." },
  { icon: Search,      color: "#9e27fd", title: "Faster Troubleshooting", description: "When something changes unexpectedly, the log shows the exact event and timing behind it." },
  { icon: ShieldCheck, color: "#00b345", title: "Security Visibility", description: "Spot unusual sign-ins or actions early — including the IP, location, and device behind them." },
  { icon: Eye,         color: "#fd5900", title: "Nothing Gets Lost",   description: "Actions taken by Polarin's support team on your behalf show up here too — full transparency." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ActivityLogOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Activity Log</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Monitoring" color="#0ea5e9" />
      </div>

      <P>
        Every action across your Polarin organisation leaves a trace — sign-ins, service changes, billing
        updates, configuration edits. The <strong>Activity Log</strong> turns that into a single, searchable
        record, so you never have to wonder what happened or who did it.
      </P>

      {/* ── Why it exists ── */}
      <H2 id="why">Why This Exists</H2>
      <P>We built this so you can track everything that happens on your account, without asking anyone.</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "16px 0 24px" }}>
        {VALUE_ITEMS.map((item) => (
          <ValueCard key={item.title} item={item} />
        ))}
      </div>

      <Callout variant="tip">
        The bigger your team, the more this matters — the Activity Log is what lets multiple people safely
        share one organisation without losing track of who changed what.
      </Callout>

      {/* ── How it works ── */}
      <H2 id="how">How It Works</H2>
      <UL>
        <LI>Every event is listed with its <strong>service</strong>, <strong>timestamp</strong>, who <strong>initiated</strong> it, and a <strong>severity</strong> level from S0 (Emergency) to S7 (Debugging).</LI>
        <LI>Filter by service, date range, or severity, or search directly by Activity ID, to narrow thousands of events down to the one you need.</LI>
        <LI>Click any entry to see its full detail — including the IP address, location, browser, and device behind it.</LI>
      </UL>

      <P>
        See <PageLink label="Using Activity Log" onClick={() => onNavigate("activity-log-details")} /> for the full walkthrough — where to find it, how to filter, and what every severity level means.
      </P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to dig in? Go to <PageLink label="Using Activity Log" onClick={() => onNavigate("activity-log-details")} />.</LI>
        <LI>Noticed something that needs a human? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
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

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
