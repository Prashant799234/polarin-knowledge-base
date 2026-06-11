import { ArticlePage, H1, H2, H3, P, UL, LI, Callout } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "status-table",  label: "Status Reference",    level: 2 as const },
  { id: "lifecycle",     label: "Port Lifecycle",      level: 2 as const },
  { id: "troubleshoot",  label: "Troubleshooting" },
];

const STATUSES = [
  {
    status: "Design",
    color: "#6b7280",
    bg: "#f3f4f6",
    description: "The port is in design mode — it has been configured but not yet submitted as an order.",
  },
  {
    status: "Ordered",
    color: "#2563eb",
    bg: "#eff6ff",
    description: "An order has been placed successfully. Polarin has received your request.",
  },
  {
    status: "Awaiting Deployment",
    color: "#d97706",
    bg: "#fffbeb",
    description: "The order has been accepted by the system and is queued for deployment in the Polarin network.",
  },
  {
    status: "Ready to Patch",
    color: "#7c3aed",
    bg: "#faf5ff",
    description: "The port is provisioned and ready. The physical cross-connect is pending in the data centre.",
  },
  {
    status: "Live",
    color: "#059669",
    bg: "#f0fdf4",
    description: "The port is fully deployed and active. Traffic can flow through this port.",
  },
  {
    status: "Failed",
    color: "#dc2626",
    bg: "#fef2f2",
    description: "The port could not be provisioned or deployed. Contact support for details on the failure reason.",
  },
  {
    status: "Cancelled",
    color: "#9ca3af",
    bg: "#f9fafb",
    description: "The port has been cancelled by the user. The subscription term remains active until it expires.",
  },
  {
    status: "Deleted",
    color: "#374151",
    bg: "#f3f4f6",
    description: "The port has been permanently removed from the Polarin platform and will no longer appear in your services list.",
  },
  {
    status: "Down",
    color: "#b45309",
    bg: "#fff7ed",
    description: "The port's network connection is currently down. This may indicate a physical or network issue.",
  },
];

export function PortStatusPage() {
  return (
    <ArticlePage toc={TOC}>
      <Breadcrumb items={["Home", "Services", "Port", "Understand Port Status"]} />

      <H1 id="overview">Understand Port Status</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Reference" color="#7c3aed" />
      </div>

      <P>
        After you order a port, Polarin moves it through a series of provisioning states — from initial design to live deployment. This page explains what each status means so you always know where your port stands.
      </P>
      <P>
        You can check the current status of any port on the <strong>Services</strong> page. The status badge updates automatically as the port progresses through each stage.
      </P>

      {/* ── Status table ── */}
      <H2 id="status-table">Port Status Reference</H2>
      <P>
        The table below lists every possible port status and its meaning:
      </P>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Lato', sans-serif", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #0a3954 0%, #1c808d 100%)" }}>
              <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13, width: "22%" }}>Status</th>
              <th style={{ padding: "13px 16px", textAlign: "left", fontWeight: 700, color: "#fff", fontSize: 13 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((s, i) => (
              <tr key={s.status} style={{ borderBottom: i < STATUSES.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    background: s.bg, color: s.color,
                    border: `1px solid ${s.color}30`,
                    borderRadius: 20, padding: "3px 12px",
                    fontSize: 12, fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: "13px 16px", color: "#4b5563", lineHeight: 1.65 }}>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">Normal Port Lifecycle</H2>
      <P>
        Under normal circumstances, a port moves through the following progression after you place an order:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
        {[
          { status: "Design", note: "Port configured, not yet ordered" },
          { status: "Ordered", note: "Order submitted" },
          { status: "Awaiting Deployment", note: "System has accepted the order" },
          { status: "Ready to Patch", note: "Port provisioned, awaiting physical cross-connect" },
          { status: "Live", note: "Fully active — traffic ready" },
        ].map((step, i, arr) => (
          <div key={step.status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1c808d", border: "2px solid #effcfd", boxShadow: "0 0 0 2px #1c808d" }} />
              {i < arr.length - 1 && <div style={{ width: 2, height: 32, background: "#e2e8f1" }} />}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", paddingBottom: i < arr.length - 1 ? 0 : 0 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#0a3954" }}>{step.status}</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#9ca3af" }}>—</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6b7280" }}>{step.note}</span>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="info">
        The time between <strong>Ordered</strong> and <strong>Live</strong> depends on data centre provisioning timelines. Most ports go live within 1–3 business days after reaching <strong>Ready to Patch</strong>.
      </Callout>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshoot">Troubleshooting</H2>

      <H3>Port is stuck on "Awaiting Deployment"</H3>
      <P>
        This usually means the provisioning request is queued on the Polarin network side. If the status hasn't changed after 24 hours, raise a support ticket.
      </P>

      <H3>Port shows "Failed"</H3>
      <P>
        A failed port means provisioning could not be completed. Common causes include location capacity constraints or configuration errors. Delete the port, review your settings, and try again — or contact support for help.
      </P>

      <H3>Port shows "Down"</H3>
      <P>
        A <strong>Down</strong> status indicates a live port has lost its network connection. Check your physical cross-connect and patch panel. If the physical layer is healthy, open a support ticket with your port ID.
      </P>

      <UL>
        <LI>Check the <strong>Services</strong> page for error detail messages alongside the failed port.</LI>
        <LI>Use the <strong>SPOG dashboard</strong> to view real-time port health and traffic metrics.</LI>
        <LI>Contact <strong>Polarin Support</strong> from Help &amp; Support → Contact Support.</LI>
      </UL>
    </ArticlePage>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#cbd5e1", fontSize: 12 }}>›</span>}
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: i === items.length - 1 ? "#0a3954" : "#94a3b8", fontWeight: i === items.length - 1 ? 600 : 400 }}>{item}</span>
        </span>
      ))}
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
