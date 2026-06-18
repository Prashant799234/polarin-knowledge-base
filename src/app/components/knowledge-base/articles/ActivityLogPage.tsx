import { ArticlePage, H1, H2, H3, P, UL, LI, Callout } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "view-logs",     label: "View Activity Log",   level: 2 as const },
  { id: "filters",       label: "Filter & Search",     level: 2 as const },
  { id: "severity",      label: "Severity Levels" },
];

const SEVERITY_LEVELS = [
  {
    code: "S0",
    label: "Emergency",
    color: "#dc2626",
    bg: "#fef2f2",
    description: "Service is down — a Port, Virtual Connection, or Virtual Router has lost connectivity.",
    active: true,
  },
  {
    code: "S1",
    label: "Alert",
    color: "#9ca3af",
    bg: "#f9fafb",
    description: "No S1-level events are currently defined on the Polarin platform.",
    active: false,
  },
  {
    code: "S2",
    label: "Critical",
    color: "#9ca3af",
    bg: "#f9fafb",
    description: "No S2-level events are currently defined on the Polarin platform.",
    active: false,
  },
  {
    code: "S3",
    label: "Error",
    color: "#ef4444",
    bg: "#fef2f2",
    description: "Provisioning error — the status of a service changed to Failed due to insufficient inventory or another reason during creation or update.",
    active: true,
  },
  {
    code: "S4",
    label: "Warning",
    color: "#d97706",
    bg: "#fffbeb",
    description: "The organisation profile submission was rejected.",
    active: true,
  },
  {
    code: "S5",
    label: "Notification",
    color: "#2563eb",
    bg: "#eff6ff",
    description: "Tracks user login activity across the Polarin platform.",
    active: true,
  },
  {
    code: "S6",
    label: "Info",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    description: "Informational events — organisation profile approval, billing profile updates, service creation, and similar lifecycle events.",
    active: true,
  },
  {
    code: "S7",
    label: "Debugging",
    color: "#9ca3af",
    bg: "#f9fafb",
    description: "No S7-level events are currently defined on the Polarin platform.",
    active: false,
  },
];

const FILTER_OPTIONS = [
  {
    label: "Search",
    icon: "🔍",
    description: "Type any keyword to search across activity log entries by event name, service, or description.",
  },
  {
    label: "Sort",
    icon: "↕",
    description: "Order results by Newest First, Oldest First, A–Z, or Z–A.",
  },
  {
    label: "Date",
    icon: "📅",
    description: "Filter by a custom date range to narrow results to a specific time window.",
  },
  {
    label: "Services",
    icon: "⚙️",
    description: "Filter by service type: Organisation Profile, Billing Profile, Authentication, Port, Virtual Connection, or Virtual Router.",
  },
  {
    label: "Initiated by",
    icon: "👤",
    description: "Filter activity by the email address of the user who triggered the event.",
  },
  {
    label: "Severity",
    icon: "🚨",
    description: "Filter by severity level (S0–S7) to focus on critical issues or browse informational events.",
  },
];

export function ActivityLogPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Activity Log</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Monitoring" color="#0ea5e9" />
      </div>

      <P>
        The <strong>Activity Log</strong> gives you a complete audit trail of everything that happens across your Polarin organisation — from service provisioning and billing updates to user logins and configuration changes. Every event is timestamped, attributed to a user, and tagged with a severity level so you can quickly spot issues or verify past actions.
      </P>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, margin: "16px 0 24px",
      }}>
        {[
          { icon: "📋", label: "Full audit trail",       detail: "Every platform event logged" },
          { icon: "🔍", label: "Powerful search",         detail: "Filter by service, user, date, severity" },
          { icon: "🚦", label: "Severity tagging",        detail: "S0 Emergency to S6 Info" },
          { icon: "👥", label: "Multi-user visibility",   detail: "See activity from any team member" },
        ].map(item => (
          <div key={item.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#0a3954", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* ── View logs ── */}
      <H2 id="view-logs">View the Activity Log</H2>

      <P>Follow these steps to open and browse your activity log:</P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { num: 1, title: "Sign in", body: <>Go to <strong>polarin.lightstorm.net</strong> and sign in with your credentials.</> },
          { num: 2, title: "Open Activity Log", body: <>From the left sidebar, click <strong>Activity Log</strong>.</> },
          { num: 3, title: "Browse events", body: <>The Activity Log page displays a list of all recent events — each showing the event name, timestamp, service, initiated-by user, and severity badge.</> },
          { num: 4, title: "Expand a log entry", body: <>Click on any log row to expand it. The full event details — including the log ID, service state changes, and any error messages — are displayed below the row.</> },
        ].map((step, i, arr) => (
          <div key={step.num} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#effcfd", border: "2px solid #1c808d",
                color: "#1c808d", fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {step.num}
              </div>
              {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: "#e2e8f1", marginTop: 4, minHeight: 20 }} />}
            </div>
            <div style={{ paddingBottom: 24, flex: 1, minWidth: 0, paddingTop: 2 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>{step.title}</p>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#4b5563", lineHeight: 1.75 }}>{step.body}</div>
              {step.num === 2 && (
                <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <img src="https://docs.polarin.lightstorm.net/act_1.jpg" alt="Activity Log page" style={{ width: "100%", display: "block" }} />
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#9ca3af", padding: "8px 14px", background: "#f9fafb", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>
                    The Activity Log page lists all platform events with timestamps and severity badges.
                  </div>
                </div>
              )}
              {step.num === 4 && (
                <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <img src="https://docs.polarin.lightstorm.net/act_2.jpg" alt="Expanded activity log entry" style={{ width: "100%", display: "block" }} />
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#9ca3af", padding: "8px 14px", background: "#f9fafb", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>
                    Click any log row to reveal full event details below the log ID.
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <H2 id="filters">Filter & Search</H2>
      <P>
        The Activity Log page provides six ways to narrow down events. You can combine multiple filters simultaneously for precise results.
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
        {FILTER_OPTIONS.map((f) => (
          <div
            key={f.label}
            style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: "#f9fafb", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "14px 16px",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#0a3954", margin: "0 0 4px" }}>{f.label}</p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.65 }}>{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="tip">
        Combine the <strong>Services</strong> filter with a <strong>Date</strong> range and <strong>Severity</strong> to quickly audit all errors affecting a specific service within a given period.
      </Callout>

      {/* ── Severity table ── */}
      <H2 id="severity">Severity Levels</H2>
      <P>
        Every event in the Activity Log is assigned a severity level from <strong>S0 (Emergency)</strong> to <strong>S7 (Debugging)</strong>. Use the severity filter to focus on the events most relevant to your current task.
      </P>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Lato', sans-serif", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #0a3954 0%, #1c808d 100%)" }}>
              <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13, width: "28%" }}>Severity</th>
              <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {SEVERITY_LEVELS.map((s, i) => (
              <tr key={s.code} style={{ borderBottom: i < SEVERITY_LEVELS.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: s.bg, color: s.color,
                      border: `1px solid ${s.color}30`,
                      borderRadius: 20, padding: "3px 12px",
                      fontSize: 12, fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      whiteSpace: "nowrap", alignSelf: "flex-start",
                    }}>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>{s.code}</span>
                      {s.label}
                    </span>
                    {!s.active && (
                      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#9ca3af", paddingLeft: 4 }}>Not currently used</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "13px 16px", color: s.active ? "#4b5563" : "#9ca3af", lineHeight: 1.65, fontStyle: s.active ? "normal" : "italic" }}>
                  {s.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout variant="info">
        Severity levels <strong>S1</strong>, <strong>S2</strong>, and <strong>S7</strong> are reserved for future use. No events are currently generated at these levels. Active severity alerts are S0, S3, S4, S5, and S6.
      </Callout>
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
