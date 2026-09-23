import {
  BellRing,
  ShieldCheck,
  Mail,
  SlidersHorizontal,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  Edit3,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, PageLink, DocImage } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",              label: "Overview" },
  { id: "rules-dashboard",      label: "Alert Rules Dashboard",    level: 2 as const },
  { id: "create-rule",          label: "Creating an Alert Rule",   level: 2 as const },
  { id: "conditions",           label: "SLA & Threshold Presets",  level: 2 as const },
  { id: "hold-duration",        label: "Hold Duration & Flapping", level: 2 as const },
  { id: "watched-services",     label: "Watched Services",         level: 2 as const },
  { id: "notifications-drawer", label: "In-App & Email Alerts",    level: 2 as const },
  { id: "managing-rules",       label: "Pause, Edit & Delete",     level: 2 as const },
  { id: "next-steps",           label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ManageAlertsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Manage Alerts</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Settings" color="#1c808d" />
        <Dot />
        <Tag label="Monitoring" color="#0ea5e9" />
      </div>

      <P>
        <strong>Manage Alerts</strong> puts you in control of automated network monitoring. Rather than waiting
        for end users to report an issue or manually checking telemetry graphs in VISTA, you can configure
        threshold rules that continuously monitor your Ports, Virtual Connections, and DCIs. When a service
        breaches your target availability or health metric for a sustained duration, Polarin alerts your team
        in real time via in-app banners, the top bell icon, and direct standalone email dispatches.
      </P>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12, margin: "16px 0 24px",
      }}>
        {[
          { icon: <SlidersHorizontal size={20} color="#1c808d" />, title: "Custom Thresholds", desc: "Set SLA benchmarks (99.9%, 99.7%) or tailored custom percentages." },
          { icon: <Clock size={20} color="#0284c7" />, title: "Flap Prevention", desc: "Enforce hold durations (15 to 60 min) before firing and clearing." },
          { icon: <Mail size={20} color="#9333ea" />, title: "No-Login Email Alerts", desc: "Dispatch email notifications directly to NOC inboxes without Polarin logins." },
          { icon: <ShieldCheck size={20} color="#16a34a" />, title: "Per-Service Granularity", desc: "Watch specific ports, connections, or entire multi-cloud fabrics." },
        ].map(card => (
          <div key={card.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#0a3954", marginBottom: 4 }}>{card.title}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", lineHeight: 1.55 }}>{card.desc}</div>
          </div>
        ))}
      </div>

      <Callout variant="info">
        <strong>SLA Clarification:</strong> These alerts are an internal monitoring and operational mechanism
        configured by your team to maintain proactive visibility over your network. They operate independently
        from the contractual, legal SLA commitments defined in your master service agreement with Polarin.
      </Callout>

      {/* ── Section: Rules Dashboard ── */}
      <H2 id="rules-dashboard">Alert Rules Dashboard</H2>
      <P>
        To access your alert rules, sign in to <strong>polarin.lightstorm.net</strong>, click <strong>Settings</strong> in
        the top header, and select <strong>Manage Alerts</strong> under the <strong>ALERTS</strong> section in the left
        sidebar.
      </P>

      <DocImage
        src="/screenshots/alerts/01-manage-alerts-overview.jpg"
        alt="Manage Alert Rules dashboard"
        caption="Manage Alert Rules table: review active rules, severity levels, watched services, conditions, and trigger actions."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, margin: "16px 0 24px" }}>
        {[
          { n: "1", title: "+ Create Alert Button", desc: "Opens the slide-over drawer to configure a new monitoring rule from scratch." },
          { n: "2", title: "Search & Time Filter", desc: "Search rules by name, metric, or service, or limit the view to 'Last 1 Month' or custom intervals." },
          { n: "3", title: "Rule Name & Severity", desc: "User-assigned rule name and urgency badge: Critical (red), Warning (amber), or Info (blue)." },
          { n: "4", title: "Watched Services", desc: "The specific connection (e.g. test_vc_live) or count of services monitored by this rule." },
          { n: "5", title: "Condition Threshold", desc: "Operational expression being evaluated (e.g., AVG Availability < 100% or AVG Availability < 99.7%)." },
          { n: "6", title: "Quick Actions Toolbar", desc: "One-click controls on every row to Pause (⏸), Edit rule settings (✏️), or Delete (🗑)." },
        ].map(c => (
          <div key={c.n} style={{ display: "flex", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 8, padding: "10px 12px" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: "#1c808d",
              color: "#fff", fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {c.n}
            </span>
            <div>
              <strong style={{ fontFamily: FONT_J, fontSize: 12.5, color: "#0a3954" }}>{c.title}</strong>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", margin: "2px 0 0", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section: Creating an Alert Rule ── */}
      <H2 id="create-rule">Creating an Alert Rule</H2>
      <P>
        Clicking the <strong>+ Create Alert</strong> button opens the rule configuration drawer on the right.
        Setting up a rule involves defining the target threshold, establishing flapping prevention, attaching
        the services to monitor, and choosing communication channels.
      </P>

      <DocImage
        src="/screenshots/alerts/02-create-alert-rule.jpg"
        alt="Create Alert Rule drawer"
        caption="Configuring condition presets, custom threshold percentages, hold durations, and attaching watched services."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, margin: "16px 0 24px" }}>
        {[
          { n: "1", title: "Condition & SLA Presets", desc: "Choose an SLA preset (Expected SLA 99.9%, Standard SLA 99.7%) or enter a Custom percentage threshold." },
          { n: "2", title: "Hold For Duration", desc: "Select 15 min, 30 min, 45 min, or 60 min to require a continuous breach before the alert triggers." },
          { n: "3", title: "Services This Alert Watches", desc: "Multi-select dropdown with checkboxes to assign specific active ports and Virtual Connections." },
          { n: "4", title: "In-App Notification Preview", desc: "Preview explaining that in-app alerts are always on across dashboards, service pages, and the top bell." },
        ].map(c => (
          <div key={c.n} style={{ display: "flex", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 8, padding: "10px 12px" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: "#1c808d",
              color: "#fff", fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {c.n}
            </span>
            <div>
              <strong style={{ fontFamily: FONT_J, fontSize: 12.5, color: "#0a3954" }}>{c.title}</strong>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", margin: "2px 0 0", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section: Conditions & SLA ── */}
      <H2 id="conditions">SLA & Threshold Presets</H2>
      <P>
        When configuring the alert condition, Polarin provides two one-click presets tuned to common SLA
        expectations, alongside a custom field:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "16px 0" }}>
        <div style={{ background: "#effcfd", border: "1.5px solid #1c808d", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 13, color: "#0a3954" }}>Expected SLA</span>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#1c808d" }}>99.9%</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#475569", margin: 0, lineHeight: 1.55 }}>
            Best for critical production interconnects, primary financial transits, and zero-downtime multi-cloud links. Alerts trigger as soon as availability dips below three nines.
          </p>
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 13, color: "#0a3954" }}>Standard SLA</span>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#0284c7" }}>99.7%</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#475569", margin: 0, lineHeight: 1.55 }}>
            Recommended for general enterprise connectivity, branch interconnects, and non-real-time synchronization links.
          </p>
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 13, color: "#0a3954" }}>Custom Threshold</span>
            <span style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#64748b" }}>User Defined</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#475569", margin: 0, lineHeight: 1.55 }}>
            Enter any percentage (e.g., 95% or 90%) to monitor backup lines, staging environments, or testing circuits without triggering unnecessary high-priority alarms.
          </p>
        </div>
      </div>

      {/* ── Section: Hold Duration ── */}
      <H2 id="hold-duration">Hold Duration & Flapping Prevention</H2>
      <P>
        Transient network blips, route convergence pauses, and sub-second BFD reconvergences should not wake
        up on-call engineers. Polarin solves this using a strict <strong>Hold Duration</strong> window.
      </P>

      <div style={{
        background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12, padding: "18px 20px",
        margin: "16px 0 20px", display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} color="#1c808d" />
          <span style={{ fontFamily: FONT_J, fontWeight: 700, fontSize: 14, color: "#0a3954" }}>How Breach Windows and Recovery Work</span>
        </div>
        <UL>
          <LI><strong>Breach Persistence:</strong> When performance drops below your condition threshold, Polarin opens an active breach window. The alert will <em>only</em> fire if the breach persists continuously for the selected hold duration (<strong>15 min</strong>, <strong>30 min</strong>, <strong>45 min</strong>, or <strong>60 min</strong>).</LI>
          <LI><strong>Recovery Symmetry:</strong> Once an alert has fired, it will not clear prematurely. The monitored service must sustain clean metrics above your threshold for the entire hold duration before the alert automatically resolves and notifies subscribers.</LI>
          <LI><strong>Evaluation Frequency:</strong> Rules are evaluated every 15 minutes by Polarin's background telemetry engine.</LI>
        </UL>
      </div>

      {/* ── Section: Watched Services ── */}
      <H2 id="watched-services">Watched Services</H2>
      <P>
        Alert rules are decoupled from individual services — a single rule can monitor one connection, several
        ports, or an entire regional fabric. Clicking any rule on the dashboard opens its detail drawer with the
        <strong>Services</strong> tab.
      </P>

      <DocImage
        src="/screenshots/alerts/04-alert-watched-services.jpg"
        alt="Watched Services tab in alert drawer"
        caption="Reviewing watched services, real-time breach status ('No Alerts Yet'), deep-links, and service detach options."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, margin: "16px 0 24px" }}>
        {[
          { n: "1", title: "Watched Service & Status", desc: "Lists the service name, type (e.g. Virtual Connection), and live health indicator ('No Alerts Yet' or active breach)." },
          { n: "2", title: "View Service Details Link", desc: "Directly opens the full telemetry and configuration page for the affected service in a single click." },
          { n: "3", title: "Detach Service (Trash Icon)", desc: "Remove an individual service from this rule without deleting the rule itself. Removing a service immediately clears any active breach window." },
        ].map(c => (
          <div key={c.n} style={{ display: "flex", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 8, padding: "10px 12px" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: "#1c808d",
              color: "#fff", fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {c.n}
            </span>
            <div>
              <strong style={{ fontFamily: FONT_J, fontSize: 12.5, color: "#0a3954" }}>{c.title}</strong>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", margin: "2px 0 0", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="tip">
        Need to inspect live interface utilization or latency before detaching a service? Click{" "}
        <strong>View Service Details</strong> to open the service telemetry page, or explore{" "}
        <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.
      </Callout>

      {/* ── Section: In-App & Email Alerts ── */}
      <H2 id="notifications-drawer">In-App & Email Alerts</H2>
      <P>
        The <strong>Notifications</strong> tab in the alert drawer controls who receives notifications and through
        which channels.
      </P>

      <DocImage
        src="/screenshots/alerts/03-alert-notifications-drawer.jpg"
        alt="Alert notifications drawer and recipients"
        caption="Delivery channels (In-App & In-Mail) and recipient subscription list with subscriber status."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, margin: "16px 0 24px" }}>
        {[
          { n: "1", title: "Rule Actions Toolbar", desc: "Edit Rule, Delete, or Pause buttons accessible at all times at the top of the slide-over drawer." },
          { n: "2", title: "Drawer Tabs", desc: "Switch between Watched Services, Alert History (past breaches), and Notifications." },
          { n: "3", title: "Delivery Channels", desc: "Shows In-App (always on across platform) and In-Mail (email dispatch)." },
          { n: "4", title: "Recipient Subscriber List", desc: "List of email addresses subscribed to this alert with their Active status badge and timestamp." },
        ].map(c => (
          <div key={c.n} style={{ display: "flex", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 8, padding: "10px 12px" }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%", background: "#1c808d",
              color: "#fff", fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {c.n}
            </span>
            <div>
              <strong style={{ fontFamily: FONT_J, fontSize: 12.5, color: "#0a3954" }}>{c.title}</strong>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", margin: "2px 0 0", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <H3>Comparing Delivery Channels</H3>
      <div style={{ overflowX: "auto", margin: "16px 0 24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f1", textAlign: "left" }}>
              <th style={{ padding: "12px 14px", fontFamily: FONT_J, color: "#0a3954", fontWeight: 700 }}>Channel</th>
              <th style={{ padding: "12px 14px", fontFamily: FONT_J, color: "#0a3954", fontWeight: 700 }}>Availability</th>
              <th style={{ padding: "12px 14px", fontFamily: FONT_J, color: "#0a3954", fontWeight: 700 }}>Login Required?</th>
              <th style={{ padding: "12px 14px", fontFamily: FONT_J, color: "#0a3954", fontWeight: 700 }}>Where It Appears</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0a3954" }}>In-App</td>
              <td style={{ padding: "12px 14px" }}><span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>Always On</span></td>
              <td style={{ padding: "12px 14px", color: "#475569" }}>Yes (logged-in user)</td>
              <td style={{ padding: "12px 14px", color: "#475569" }}>Top bell icon, Dashboard alert banner, and affected Service Detail header.</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0a3954" }}>In-Mail (Email)</td>
              <td style={{ padding: "12px 14px" }}><span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>Configurable</span></td>
              <td style={{ padding: "12px 14px", color: "#15803d", fontWeight: 700 }}>No Polarin login needed</td>
              <td style={{ padding: "12px 14px", color: "#475569" }}>Delivered directly to any specified email inbox (NOC distribution lists, pager gateways, team leads).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout variant="tip">
        <strong>NOC Integration Tip:</strong> Because email alerts do not require recipients to have an active
        Polarin account, you can add shared distribution lists like <code>noc-alerts@yourcompany.com</code> or
        pager service webhooks directly into the Recipients field.
      </Callout>

      {/* ── Section: Managing Existing Rules ── */}
      <H2 id="managing-rules">Pause, Edit & Delete Rules</H2>
      <P>
        Network maintenance windows and scheduled upgrades often cause intentional downtime. Polarin gives you
        full lifecycle controls over rules to prevent alert noise during scheduled work:
      </P>

      <UL>
        <LI><strong>Pause / Resume (⏸ / ▶):</strong> Temporarily suspend rule evaluation during maintenance. Pausing a rule stops all background checks and will not trigger in-app or email alerts while maintenance is underway. When work finishes, click Resume to reactivate the rule without reconfiguring settings.</LI>
        <LI><strong>Edit Rule (✏️):</strong> Update the rule name, condition threshold, hold duration, watched services, or email recipient list at any time. When saved, Polarin displays a confirmation toast (e.g. <em>"Rule updated"</em>) and updates evaluation parameters immediately.</LI>
        <LI><strong>Delete Rule (🗑):</strong> Permanently delete obsolete rules. If any watched services are currently experiencing an active breach under that rule, the breach window is automatically discarded.</LI>
      </UL>

      {/* ── Section: Next Steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Review active operational alerts in the top bell drawer at <PageLink label="Alerts & Notifications" onClick={() => onNavigate("notifications")} />.</LI>
        <LI>Track all administrative rule creation, pauses, and updates in the <PageLink label="Using Activity Log" onClick={() => onNavigate("activity-log-details")} />.</LI>
        <LI>Explore network-wide performance metrics and telemetry graphs in <PageLink label="VISTA" onClick={() => onNavigate("vista-overview")} />.</LI>
      </UL>
    </ArticlePage>
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

