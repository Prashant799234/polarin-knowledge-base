import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "alerts",     label: "How Alerts Work",   level: 2 as const },
  { id: "tiers",      label: "VISTA Free vs Premium", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const TIERS = [
  { name: "VISTA Free",    detail: "10,000 API calls/day per circuit, included automatically with every service." },
  { name: "VISTA Premium", detail: "50,000 API calls/day per circuit, plus 180-day historical data. Contact your account manager to enable it." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function VistaOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Monitoring" color="#7c3aed" />
      </div>

      <P>
        <strong>VISTA</strong> is Polarin's performance monitoring layer — it watches metrics like latency
        across your live circuits and tells you the moment something drifts outside the range you'd expect,
        well before it becomes an outage.
      </P>

      <Callout variant="tip">
        You don't need to set anything up to benefit from VISTA on the metrics Polarin monitors by default —
        alerts show up automatically in your <strong>Notifications</strong> panel.
      </Callout>

      {/* ── How alerts work ── */}
      <H2 id="alerts">How Alerts Work</H2>
      <P>
        When a monitored metric crosses its alert threshold, you get a notification explaining exactly what
        happened — for example, a Virtual Connection's latency going above its configured limit. A typical
        alert includes:
      </P>
      <UL>
        <LI>Which service is affected, and which specific rule was triggered.</LI>
        <LI>The threshold you'd set, and the value that crossed it.</LI>
        <LI>Whether it needs action from you, or Polarin is already monitoring it.</LI>
      </UL>
      <P>
        You'll get a follow-up notification once the metric returns to normal — you don't need to keep
        checking back.
      </P>

      {/* ── Tiers ── */}
      <H2 id="tiers">VISTA Free vs Premium</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {TIERS.map((t) => (
          <div key={t.name} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <div>
              <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#0a3954", margin: "0 0 4px" }}>{t.name}</p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.65 }}>{t.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <P>
        Full API details and rate limits live in <PageLink label="Polarin API Pricing" onClick={() => onNavigate("api-pricing")} />.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>See where alerts show up day to day: <PageLink label="Notifications" onClick={() => onNavigate("notifications")} />.</LI>
        <LI>Configure what triggers an alert under <strong>Manage Alerts</strong> in Settings.</LI>
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
