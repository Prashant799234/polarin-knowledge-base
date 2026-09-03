import { ArticlePage, H1, H2, P, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "view-logs",     label: "View Activity Log",   level: 2 as const },
  { id: "log-detail",    label: "Log Detail Panel",    level: 2 as const },
  { id: "filters",       label: "Filter & Search",     level: 2 as const },
  { id: "severity",      label: "Severity Levels" },
];

interface Severity {
  code: string;
  label: string;
  color: string;
  bg: string;
}

const SEVERITY_LEVELS: Severity[] = [
  { code: "S0", label: "Emergency",    color: "#dc2626", bg: "#fef2f2" },
  { code: "S1", label: "Alert",        color: "#e11d48", bg: "#fef2f2" },
  { code: "S2", label: "Critical",     color: "#ea580c", bg: "#fff7ed" },
  { code: "S3", label: "Error",        color: "#ea580c", bg: "#fff7ed" },
  { code: "S4", label: "Warning",      color: "#d97706", bg: "#fffbeb" },
  { code: "S5", label: "Notification", color: "#2563eb", bg: "#eff6ff" },
  { code: "S6", label: "Info",         color: "#0ea5e9", bg: "#f0f9ff" },
  { code: "S7", label: "Debugging",    color: "#6b7280", bg: "#f9fafb" },
];

const SAMPLE_ROWS = [
  { id: "a1b2c3d4-e5f6-4a7b-8c9d…", service: "Authentication",      date: "Sep 02 2026, 04:51 PM", event: "User Login",                initiatedBy: "jane.doe@example.com", severity: SEVERITY_LEVELS[5] },
  { id: "e5f6a7b8-c9d0-4e1f-a2b3…", service: "Virtual Connection",  date: "Sep 02 2026, 11:52 AM", event: "Create Virtual Connection", initiatedBy: "jane.doe@example.com", severity: SEVERITY_LEVELS[6] },
  { id: "9c8d7e6f-1a2b-4c3d-9e8f…", service: "Port",                date: "Sep 02 2026, 11:46 AM", event: "Service Ready To Pair",     initiatedBy: "Sales Assist",         severity: SEVERITY_LEVELS[6] },
];

const FILTER_OPTIONS = [
  { label: "Search by Activity ID", icon: "🔍", description: "Type or paste an Activity ID to jump straight to that event." },
  { label: "Date range",            icon: "📅", description: "Pick a Start Date and End Date from the calendar, then click Apply to narrow results to that window." },
  { label: "Services",              icon: "⚙️", description: "Filter by service: Organisation Profile, Billing Profile, Authentication, Port, Virtual Connection, or Virtual Router." },
  { label: "Initiated By",          icon: "👤", description: "Filter by the user or system actor who triggered the event." },
  { label: "Severity",              icon: "🚨", description: "Filter by one or more severity levels, from S0 (Emergency) to S7 (Debugging)." },
  { label: "Sort by date & time",   icon: "↕️", description: "Click the sort icon on the Date & time column to switch between newest-first and oldest-first." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ActivityLogPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Using Activity Log</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Monitoring" color="#0ea5e9" />
      </div>

      <P>
        The <strong>Activity Log</strong> gives you a complete audit trail of everything that happens across your Polarin organisation — from service provisioning and billing updates to user logins and configuration changes. Every event is timestamped, attributed to a user, and tagged with a severity level so you can quickly spot issues or verify past actions.
      </P>
      <P>
        New to this page? <PageLink label="Activity Log Overview" onClick={() => onNavigate("activity-log-overview")} /> covers why it exists and what it's for, before you dive into the details below.
      </P>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, margin: "16px 0 24px",
      }}>
        {[
          { icon: "📋", label: "Full audit trail",     detail: "Every platform event logged" },
          { icon: "🔍", label: "Powerful filtering",    detail: "By service, user, date, and severity" },
          { icon: "🚦", label: "Severity tagging",      detail: "S0 Emergency through S7 Debugging" },
          { icon: "🗂️", label: "Full event detail",     detail: "IP, location, browser, device on demand" },
        ].map(item => (
          <div key={item.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#0a3954", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* ── View logs ── */}
      <H2 id="view-logs">View the Activity Log</H2>

      <P>Follow these steps to open and browse your activity log:</P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { num: 1, title: "Sign in", body: <>Go to <strong>polarin.lightstorm.net</strong> and sign in with your credentials.</> },
          { num: 2, title: "Open Settings → Activity Logs", body: <>Click <strong>Settings</strong> in the top navigation, then <strong>Activity Logs</strong> under the <strong>Organisation</strong> section of the left sidebar.</> },
          { num: 3, title: "Browse events", body: <>The table lists every event with its <strong>Activity ID</strong>, <strong>Services</strong>, <strong>Date &amp; time</strong>, <strong>Event</strong>, who it was <strong>Initiated By</strong>, and its <strong>Severity</strong> badge.</> },
        ].map((step, i, arr) => (
          <div key={step.num} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#effcfd", border: "2px solid #1c808d",
                color: "#1c808d", fontFamily: FONT_J,
                fontSize: 12, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {step.num}
              </div>
              {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: "#e2e8f1", marginTop: 4, minHeight: 20 }} />}
            </div>
            <div style={{ paddingBottom: 24, flex: 1, minWidth: 0, paddingTop: 2 }}>
              <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>{step.title}</p>
              <div style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563", lineHeight: 1.75 }}>{step.body}</div>
              {step.num === 3 && <LogTablePreview />}
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail panel ── */}
      <H2 id="log-detail">Log Detail Panel</H2>
      <P>
        Click any row to open its full detail in a panel on the right — including the network and device information behind that event.
      </P>
      <LogDetailPreview />

      {/* ── Filters ── */}
      <H2 id="filters">Filter & Search</H2>
      <P>
        The Activity Log page gives you several ways to narrow down events, and you can combine them for precise results.
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
              <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#0a3954", margin: "0 0 4px" }}>{f.label}</p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.65 }}>{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="tip">
        Combine the <strong>Services</strong> filter with a <strong>date range</strong> and <strong>Severity</strong> to quickly audit all errors affecting a specific service within a given period.
      </Callout>

      {/* ── Severity table ── */}
      <H2 id="severity">Severity Levels</H2>
      <P>
        Every event is assigned a severity level from <strong>S0 (Emergency)</strong> to <strong>S7 (Debugging)</strong>. Use the Severity filter to select one or more levels and focus on what matters right now.
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, margin: "20px 0" }}>
        {SEVERITY_LEVELS.map((s) => (
          <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 10, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: s.color, fontFamily: FONT_J, fontWeight: 800, fontSize: 12,
              whiteSpace: "nowrap",
            }}>
              {s.code}
            </span>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: "#0a3954" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <Callout variant="info">
        Not every severity level shows up in every organisation's log — which ones you see depends on what's actually happened on your account. <strong>S5 (Notification)</strong> and <strong>S6 (Info)</strong> are the most common day-to-day events; <strong>S0–S2</strong> flag the events that need the fastest attention.
      </Callout>
    </ArticlePage>
  );
}

function LogTablePreview() {
  const cols = ["Activity ID", "Services", "Date & time", "Event", "Initiated By", "Severity"];
  return (
    <div style={{ marginTop: 12, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 12.5, minWidth: 640 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {cols.map((c) => (
                <th key={c} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROWS.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < SAMPLE_ROWS.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "10px 12px", color: "#64748b", fontFamily: "ui-monospace, monospace", fontSize: 11, whiteSpace: "nowrap" }}>{row.id}</td>
                <td style={{ padding: "10px 12px", color: "#0a3954" }}>{row.service}</td>
                <td style={{ padding: "10px 12px", color: "#0a3954", whiteSpace: "nowrap" }}>{row.date}</td>
                <td style={{ padding: "10px 12px", color: "#0a3954" }}>{row.event}</td>
                <td style={{ padding: "10px 12px", color: "#64748b" }}>{row.initiatedBy}</td>
                <td style={{ padding: "10px 12px" }}>
                  <SeverityBadge severity={row.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 12, color: "#9ca3af", padding: "8px 14px", background: "#f9fafb", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>
        Illustrative example — your organisation's actual events and users will differ.
      </div>
    </div>
  );
}

function LogDetailPreview() {
  const fields = [
    { label: "Services", value: "Authentication" },
    { label: "Date & Time", value: "Sep 02 2026, 04:51 PM" },
    { label: "Event", value: "User Login" },
    { label: "Initiated By", value: "jane.doe@example.com" },
  ];
  const networkFields = [
    { label: "IP Address", value: "192.0.2.10" },
    { label: "Location", value: "San Francisco, US" },
    { label: "Browser", value: "Chrome (128.0.0)" },
    { label: "Device", value: "macOS" },
  ];
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", maxWidth: 460, margin: "16px 0 24px" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 700, color: "#0a3954", margin: "0 0 8px", wordBreak: "break-all" }}>
          a1b2c3d4-e5f6-4a7b-8c9d-example
        </p>
        <SeverityBadge severity={SEVERITY_LEVELS[5]} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "16px 18px" }}>
        {fields.map((f) => (
          <div key={f.label}>
            <p style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</p>
            <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 600, color: "#0a3954", margin: 0 }}>{f.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "16px 18px", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
        {networkFields.map((f) => (
          <div key={f.label}>
            <p style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</p>
            <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 600, color: "#0a3954", margin: 0 }}>{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: severity.bg, color: severity.color,
      border: `1px solid ${severity.color}30`,
      borderRadius: 20, padding: "3px 12px",
      fontSize: 11.5, fontWeight: 700,
      fontFamily: FONT_J, whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 10, opacity: 0.75 }}>{severity.code}</span>
      {severity.label}
    </span>
  );
}

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: FONT, fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
