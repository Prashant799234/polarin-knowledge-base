import { ArticlePage, H1, H2, H3, P, UL, LI, Callout } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "status-table",  label: "Status Reference",    level: 2 as const },
  { id: "lifecycle",     label: "Router Lifecycle",    level: 2 as const },
  { id: "troubleshoot",  label: "Troubleshooting" },
];

const STATUSES = [
  {
    status: "Design",
    color: "#6b7280",
    bg: "#f3f4f6",
    description: "The Virtual Router is in design mode — configured but not yet submitted as an order.",
  },
  {
    status: "Ordered",
    color: "#2563eb",
    bg: "#eff6ff",
    description: "An order has been placed successfully. Polarin has received your provisioning request.",
  },
  {
    status: "Awaiting Deployment",
    color: "#d97706",
    bg: "#fffbeb",
    description: "The order has been accepted by the system and is queued for deployment in the Polarin network.",
  },
  {
    status: "Configured",
    color: "#7c3aed",
    bg: "#faf5ff",
    description: "The Virtual Router has been deployed and configured on the network. Final activation is in progress.",
  },
  {
    status: "Live",
    color: "#059669",
    bg: "#f0fdf4",
    description: "The Virtual Router is fully operational. Layer 3 connections can now be attached.",
  },
  {
    status: "Failed",
    color: "#dc2626",
    bg: "#fef2f2",
    description: "Provisioning could not be completed. Contact support with the router ID for failure details.",
  },
  {
    status: "Cancelled",
    color: "#9ca3af",
    bg: "#f9fafb",
    description: "The Virtual Router has been cancelled by the user. The subscription term remains active until it expires.",
  },
  {
    status: "Deleted",
    color: "#374151",
    bg: "#f3f4f6",
    description: "The Virtual Router has been permanently removed from the Polarin platform and will no longer appear in your services list.",
  },
  {
    status: "Down",
    color: "#b45309",
    bg: "#fff7ed",
    description: "The Virtual Router's network connectivity is currently down. Check BGP sessions and attached connections.",
  },
];

export function VirtualRouterStatusPage() {
  return (
    <ArticlePage toc={TOC}>
      <Breadcrumb items={["Home", "Services", "Virtual Router", "Understand Virtual Router Status"]} />

      <H1 id="overview">Understand Virtual Router Status</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Reference" color="#7c3aed" />
      </div>

      <P>
        After you order a Virtual Router, Polarin moves it through a series of provisioning states before it becomes operational. This page explains what each status means so you can track your router's progress and act quickly if something goes wrong.
      </P>
      <P>
        You can check the current status of any Virtual Router on the <strong>Services</strong> page. The status badge updates automatically as provisioning advances.
      </P>

      {/* ── Status table ── */}
      <H2 id="status-table">Virtual Router Status Reference</H2>

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
      <H2 id="lifecycle">Normal Router Lifecycle</H2>
      <P>
        Under normal circumstances, a Virtual Router moves through the following progression after you place an order:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
        {[
          { status: "Design",              note: "Router configured, not yet ordered" },
          { status: "Ordered",             note: "Order submitted" },
          { status: "Awaiting Deployment", note: "System has accepted the order" },
          { status: "Configured",          note: "Router deployed and network configuration applied" },
          { status: "Live",                note: "Fully operational — Layer 3 connections can be attached" },
        ].map((step, i, arr) => (
          <div key={step.status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1c808d", border: "2px solid #effcfd", boxShadow: "0 0 0 2px #1c808d" }} />
              {i < arr.length - 1 && <div style={{ width: 2, height: 32, background: "#e2e8f1" }} />}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#0a3954" }}>{step.status}</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#9ca3af" }}>—</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6b7280" }}>{step.note}</span>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="info">
        The <strong>Configured</strong> status is unique to Virtual Routers — it means the software routing instance has been deployed and network parameters (ASN, IP, rate limit) are applied. <strong>Live</strong> confirms full Layer 3 readiness.
      </Callout>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshoot">Troubleshooting</H2>

      <H3>Router is stuck on "Awaiting Deployment"</H3>
      <P>
        This usually indicates the provisioning task is queued. If the status hasn't advanced after 24 hours, raise a support ticket with your Virtual Router ID.
      </P>

      <H3>Router shows "Failed"</H3>
      <P>
        A failed state means provisioning could not be completed — often due to IP address conflicts or location constraints. Delete the router, review your IP address and ASN settings, and try again. Contact support if the issue persists.
      </P>

      <H3>Router shows "Down"</H3>
      <P>
        A <strong>Down</strong> status on a live router indicates a network connectivity issue. Check:
      </P>
      <UL>
        <LI>BGP session state for all attached Layer 3 connections.</LI>
        <LI>Health of the underlying ports that carry traffic to this router.</LI>
        <LI>Whether there are any active incidents affecting the PoP from the Polarin status page.</LI>
      </UL>
      <P>
        If everything looks healthy on your side, open a support ticket with the router ID and the PoP location.
      </P>
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
