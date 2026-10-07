import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, DocImage, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";

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
    description: "The port has been started but not fully ordered yet. A separate \"Setup Incomplete\" tag next to it means a required step in the wizard was never finished — open the port and complete Checkout to submit it.",
  },
  {
    status: "Deployment in Progress",
    color: "#d97706",
    bg: "#fffbeb",
    description: "The order has been submitted and Polarin is setting up the physical infrastructure. If your organisation requires a Purchase Order, you'll also see a \"Purchase Order Required\" step here with a deadline — provisioning won't continue past it until you add PO details.",
  },
  {
    status: "Ready to Patch",
    color: "#7c3aed",
    bg: "#faf5ff",
    description: "The port itself is provisioned. If you ordered Cross Connect, this is when Lightstorm patches it in at the data centre — shown as its own \"In process\" step.",
  },
  {
    status: "Live",
    color: "#059669",
    bg: "#f0fdf4",
    description: "The port is fully deployed and active. Traffic can flow, and billing starts from this point.",
  },
  {
    status: "Down",
    color: "#b45309",
    bg: "#fff7ed",
    description: "A previously live port has lost its network connection. This may indicate a physical or network issue.",
  },
  {
    status: "Deleted",
    color: "#374151",
    bg: "#f3f4f6",
    description: "The port has been permanently removed and moved to Archived Services — it no longer appears in your main services list.",
  },
];

export function PortStatusPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understand Port Status</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Reference" color="#0f766e" />
      </ArticleMeta>

      <P>
        After you order a port, Polarin moves it through a small number of real statuses — from Design to Live.
        This page lists exactly what each one means, using the same six statuses you'll see in the Services
        page's own <strong>Advance Filter</strong> panel.
      </P>
      <P>
        You can check the current status of any port on the <strong>Services</strong> page. The status badge
        updates automatically as the port progresses through each stage.
      </P>

      {/* ── Status table ── */}
      <H2 id="status-table">Port Status Reference</H2>
      <DocImage
        src="/screenshots/services/06-advance-filter.jpg"
        alt="Advance Filter panel showing the full real status list: Live, Down, Design, Deployment in Progress, Configured, Deleted"
        caption="① The complete real status list, straight from the Advance Filter panel — these six apply to every product, not just Port"
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
        <strong>Configured</strong> is also in the filter list, but it's a Virtual Router status, not a Port one —
        see <strong>Understand Virtual Router Status</strong> for that. A Port never shows "Configured"; it goes
        straight from Deployment in Progress to Ready to Patch to Live.
      </Callout>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">Normal Port Lifecycle</H2>
      <P>
        Under normal circumstances, a port moves through the following progression after you place an order —
        exactly matching the <strong>Track Order</strong> tab on the port's own detail page:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "20px 0" }}>
        {[
          { status: "Order Details Validated", note: "Your order information has been reviewed and approved" },
          { status: "Deployment in Progress", note: "Polarin is setting up the physical infrastructure (Purchase Order Required step inserts here if your organisation issues POs)" },
          { status: "Ready to Patch", note: "Port provisioned; Cross Connect patched in if you ordered it" },
          { status: "Live", note: "Fully active — traffic ready, billing starts" },
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

      <Callout variant="tip">
        Each completed step on the Track Order tab shows the exact date and time it happened — handy context to
        have ready if you end up raising a ticket about a delay.
      </Callout>

      {/* ── Troubleshooting ── */}
      <H3>Port shows "Setup Incomplete" next to Design</H3>
      <P>
        This just means the order wizard was started but never submitted — nothing has been ordered or billed
        yet. Open the port and pick up where you left off in Checkout.
      </P>

      <H3>Port is stuck on "Deployment in Progress"</H3>
      <P>
        If there's an outstanding <strong>Purchase Order Required</strong> step shown on the Track Order tab,
        provisioning won't continue until you add PO details — do that first. Otherwise, if the status hasn't
        changed after 24 hours, raise a support ticket with the port's Service ID.
      </P>

      <H2 id="troubleshoot">Troubleshooting</H2>
      <H3>Port shows "Down"</H3>
      <P>
        A <strong>Down</strong> status indicates a live port has lost its network connection. Check your physical
        cross-connect and patch panel. If the physical layer is healthy, open a support ticket with your port ID.
      </P>

      <UL>
        <LI>Check the <strong>Services</strong> page for any error detail alongside the port.</LI>
        <LI>Use <strong>VISTA</strong> to view real-time port health and traffic metrics.</LI>
        <LI>Contact <strong>Polarin Support</strong> from Help &amp; Support → Contact Support.</LI>
      </UL>
    </ArticlePage>
  );
}
