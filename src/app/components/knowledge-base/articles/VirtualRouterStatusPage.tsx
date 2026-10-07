import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, DocImage, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";

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
    description: "The router has been started but not fully ordered yet. A \"Setup Incomplete\" tag next to it means a required step in the wizard was never finished.",
  },
  {
    status: "Deployment in Progress",
    color: "#d97706",
    bg: "#fffbeb",
    description: "The order has been submitted and the router instance is being provisioned. If your organisation requires a Purchase Order, a \"Purchase Order Required\" step appears here with a deadline.",
  },
  {
    status: "Configured",
    color: "#7c3aed",
    bg: "#faf5ff",
    description: "The Virtual Router has been deployed and its configuration applied. Final activation is in progress — this status is specific to Virtual Router; Ports don't show it.",
  },
  {
    status: "Live",
    color: "#059669",
    bg: "#f0fdf4",
    description: "The Virtual Router is fully operational. Connections can now be attached to it, and billing starts.",
  },
  {
    status: "Down",
    color: "#b45309",
    bg: "#fff7ed",
    description: "The Virtual Router's network connectivity is currently down. Check BGP sessions and attached connections.",
  },
  {
    status: "Deleted",
    color: "#374151",
    bg: "#f3f4f6",
    description: "The Virtual Router has been permanently removed and moved to Archived Services.",
  },
];

export function VirtualRouterStatusPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understand Virtual Router Status</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Reference" color="#0f766e" />
      </ArticleMeta>

      <P>
        After you order a Virtual Router, Polarin moves it through a small number of real statuses before it
        becomes operational. This page lists exactly what each one means, using the same status list you'll see
        in the Services page's own <strong>Advance Filter</strong> panel.
      </P>
      <P>
        You can check the current status of any Virtual Router on the <strong>Services</strong> page. The status
        badge updates automatically as provisioning advances.
      </P>

      {/* ── Status table ── */}
      <H2 id="status-table">Virtual Router Status Reference</H2>
      <DocImage
        src="/screenshots/services/06-advance-filter.jpg"
        alt="Advance Filter panel showing the full real status list: Live, Down, Design, Deployment in Progress, Configured, Deleted"
        caption="The complete real status list, straight from the Advance Filter panel — these apply to every product, not just Virtual Router"
      />

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
      <Callout variant="info">
        <strong>Ready to Patch</strong> is also a real status, but it's Port-specific — a Virtual Router never
        shows it, since there's no physical cross-connect to patch in. See{" "}
        <strong>Understand Port Status</strong> for that one.
      </Callout>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">Normal Router Lifecycle</H2>
      <P>
        Under normal circumstances, a Virtual Router moves through the following progression after you place an
        order — matching the Track Order tab on the router's own detail page:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
        {[
          { status: "Order Details Validated", note: "Your order information has been reviewed and approved" },
          { status: "Deployment in Progress", note: "The router instance is being provisioned (Purchase Order Required step inserts here if your organisation issues POs)" },
          { status: "Configured",              note: "Router deployed and configuration applied" },
          { status: "Live",                note: "Fully operational — connections can be attached, billing starts" },
        ].map((step, i, arr) => (
          <div key={step.status} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1c808d", border: "2px solid #effcfd", boxShadow: "0 0 0 2px #1c808d", flexShrink: 0, marginTop: 4 }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: "#e2e8f1", marginTop: 4 }} />}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 10, rowGap: 2, alignItems: "baseline", paddingBottom: 20 }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#0a3954" }}>{step.status}</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#9ca3af" }}>—</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6b7280" }}>{step.note}</span>
            </div>
          </div>
        ))}
      </div>

      <Callout variant="info">
        <strong>Configured</strong> means the software routing instance has been deployed and its parameters are
        applied. <strong>Live</strong> confirms it's actually ready to carry traffic.
      </Callout>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshoot">Troubleshooting</H2>

      <H3>Router is stuck on "Deployment in Progress"</H3>
      <P>
        If there's an outstanding <strong>Purchase Order Required</strong> step on the Track Order tab,
        provisioning won't continue until PO details are added. Otherwise, if the status hasn't advanced after 24
        hours, raise a support ticket with your Virtual Router's Service ID.
      </P>

      <H3>Router shows "Down"</H3>
      <P>
        A <strong>Down</strong> status on a live router indicates a network connectivity issue. Check:
      </P>
      <UL>
        <LI>BGP session state for all attached connections.</LI>
        <LI>Health of the underlying ports that carry traffic to this router.</LI>
        <LI>Whether there are any active incidents affecting the PoP.</LI>
      </UL>
      <P>
        If everything looks healthy on your side, open a support ticket with the router's Service ID and PoP
        location.
      </P>
    </ArticlePage>
  );
}
