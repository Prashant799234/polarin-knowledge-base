import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview: What Is VISTA?" },
  { id: "value-benefits",      label: "Benefits & Value: What You Get", level: 2 as const },
  { id: "products-covered",    label: "VISTA Across 3 Product Categories" },
  { id: "product-port",        label: "1. Port (VISTA Premium Included Free)", level: 2 as const },
  { id: "product-vc",          label: "2. Virtual Connection & DCI Layer 2", level: 2 as const },
  { id: "product-wave",        label: "3. DCI Wave (Layer 1 Optical)",        level: 2 as const },
  { id: "comparison-matrix",   label: "Metrics & Feature Comparison Matrix" },
  { id: "how-to-access",       label: "Accessing VISTA in the Portal" },
  { id: "traffic-analytics",   label: "Interactive Traffic Analytics" },
  { id: "rate-limit-scaling",  label: "Effective Rate Limit & Scaling" },
  { id: "troubleshooting",     label: "Troubleshooting 'No Data Found'" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function VistaOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA Network Performance Monitoring</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={6} />
        <Dot />
        <Tag label="Telemetry & Performance" color="#7c3aed" />
      </div>

      <P>
        <strong>VISTA</strong> is Polarin's real-time network observability and telemetry engine. Built directly into the platform, VISTA transforms traditional black-box carrier connections into fully transparent, software-defined circuits with live telemetry, automated SLA auditing, and dynamic bandwidth elasticity.
      </P>

      <P>
        Instead of relying on fragmented third-party SNMP monitoring or waiting for end-of-month carrier tickets, VISTA provides unified second-by-second visibility into your live traffic, optical health, link flaps, round-trip latency, jitter, and packet loss.
      </P>

      <Callout variant="tip">
        VISTA monitoring starts automatically the moment your circuit reaches <strong>Live</strong> status — no hardware agents, external software probes, or complex configurations are needed.
      </Callout>

      {/* ── Value & Benefits ── */}
      <H2 id="value-benefits">Benefits & Value: What You Get</H2>
      <P>
        VISTA equips network architects, DevOps engineers, and IT leadership with actionable network intelligence:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, margin: "20px 0" }}>
        <ValueCard
          icon="⚡"
          title="Proactive Anomaly Detection"
          description="Identify link micro-flaps, jitter fluctuations, and packet loss before they impact end-user cloud applications or voice/video traffic."
        />
        <ValueCard
          icon="📊"
          title="Autonomous SLA Verification"
          description="Track uptime availability (99.99%+ SLA) and exact round-trip propagation delay (Latency RTD in ms) with tamper-proof historical telemetry."
        />
        <ValueCard
          icon="🚀"
          title="Dynamic Bandwidth Scaling"
          description="Link live utilization insights directly to your Effective Rate Limit. Burst temporary add-on bandwidth in seconds without circuit teardown."
        />
        <ValueCard
          icon="🔍"
          title="End-to-End Fault Isolation"
          description="Pinpoint whether latency or errors originate at your A-End port, the carrier optical core, or the Z-End cloud provider edge."
        />
      </div>

      {/* ── Products Covered ── */}
      <H2 id="products-covered">VISTA Across 3 Product Categories</H2>
      <P>
        VISTA telemetry is purpose-built for three core Polarin network infrastructure categories:
      </P>

      {/* 1. Port */}
      <H3 id="product-port">1. Port (Physical Core Infrastructure)</H3>
      <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "16px 20px", margin: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>🔌</span>
          <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#166534", margin: 0 }}>
            Port: VISTA Premium Included Completely Free
          </p>
          <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, border: "1px solid #bbf7d0", marginLeft: "auto" }}>
            Included by Default
          </span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#1e293b", margin: 0, lineHeight: 1.65 }}>
          For every physical <strong>Port</strong> provisioned on the Polarin network (1 Gbps, 10 Gbps, 100 Gbps), <strong>VISTA Premium is provided by default at no additional charge</strong>. You receive full enterprise-tier visibility without any add-on subscription fees.
        </p>
      </div>

      <P><strong>What you get with Port VISTA:</strong></P>
      <UL>
        <LI><strong>Traffic In & Out Analytics</strong>: Live interface utilization measured in Mbps and Gbps.</LI>
        <LI><strong>Packets In & Out Analytics</strong>: Real-time Ethernet frame counts for burst and capacity profiling.</LI>
        <LI><strong>Port-Level Optical Power Monitoring</strong>: Transmit (Tx) and Receive (Rx) optical power levels measured in dBm to identify fiber patch attenuation and dirty optical transceivers.</LI>
        <LI><strong>Direct Case Submissions & Tracking</strong>: One-click support ticket creation pre-populated with port serial, facility, and telemetry state.</LI>
        <LI><strong>Physical Link Stability & Errors</strong>: Port status, line protocol, and optical layer flap detection.</LI>
      </UL>
      <P>
        <PageLink label="Read full VISTA for Port guide →" onClick={() => onNavigate?.("vista-port")} />
      </P>

      {/* 2. Virtual Connection & DCI Layer 2 */}
      <H3 id="product-vc">2. Virtual Connection (VC) & DCI Layer 2</H3>
      <P>
        VISTA applies across all Point-to-Point Layer 2/3 connections — including <strong>Data Centre to Cloud (Cloud Connect)</strong>, <strong>Cloud to Cloud</strong>, <strong>Data Centre to Data Centre (DC-to-DC)</strong>, and <strong>DCI Layer 2</strong> circuits.
      </P>
      <P>
        For Virtual Connections, VISTA is available in two packages during service creation or as a post-provisioning add-on:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, margin: "20px 0" }}>
        {/* Standard */}
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#0a3954", margin: 0 }}>Standard Package</p>
            <span style={{ background: "#e2e8f0", color: "#475569", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>Free</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>
            Included free with every Virtual Connection for fundamental operational visibility.
          </p>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>What's Included:</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontFamily: FONT, fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
              <li><strong>Access from Anywhere</strong>: Monitor performance on the go via portal and mobile</li>
              <li><strong>Traffic In/Out Analytics</strong>: Ingress & egress throughput graphs</li>
              <li><strong>Packet In/Out Analytics</strong>: Packet volume tracking</li>
              <li><strong>Port-Level Power Monitoring</strong>: Baseline transceiver health</li>
              <li><strong>Case Submissions with Tracking</strong>: Linked incident tickets</li>
            </ul>
          </div>
        </div>

        {/* Premium */}
        <div style={{ background: "#faf5ff", border: "2px solid #a855f7", borderRadius: 12, padding: "18px 20px", position: "relative" }}>
          <div style={{ position: "absolute", top: -11, right: 16, background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ⭐ Recommended
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#581c87", margin: 0 }}>Premium Package</p>
            <span style={{ background: "#f3e8ff", color: "#7e22ce", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, border: "1px solid #d8b4fe" }}>Full Analytics</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#6b21a8", margin: "0 0 12px", lineHeight: 1.5 }}>
            Enterprise deep-dive telemetry designed for production workloads, database replication, and strict SLA compliance.
          </p>
          <div style={{ borderTop: "1px solid #e9d5ff", paddingTop: 12 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#581c87", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Unlocks Everything in Standard Plus:</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontFamily: FONT, fontSize: 13.5, color: "#3b0764", lineHeight: 1.7 }}>
              <li><strong>Service Availability for Last 180 Days</strong>: Extended 6-month uptime auditing</li>
              <li><strong>Errors Report</strong>: CRC, frame errors, and interface drops analysis</li>
              <li><strong>Packet Loss Analysis</strong>: Granular transmission integrity telemetry</li>
              <li><strong>Jitter Monitoring</strong>: Latency variance analytics for VoIP & streaming</li>
              <li><strong>Advanced SLA Insights</strong>: Proactive SLA breach forecasting</li>
            </ul>
          </div>
        </div>
      </div>
      <P>
        <PageLink label="Read full VISTA for Virtual Connection guide →" onClick={() => onNavigate?.("vista-vc")} />
      </P>

      {/* 3. DCI Wave */}
      <H3 id="product-wave">3. DCI Wave (Optical Layer 1 Interconnect)</H3>
      <P>
        For enterprise data centre interconnects running over dedicated optical wavelengths (DWDM / Wave), VISTA provides physical-layer optical telemetry:
      </P>
      <UL>
        <LI><strong>Optical Availability (%)</strong>: Verifies 99.999% optical carrier SLA performance.</LI>
        <LI><strong>Latency RTD (Round Trip Delay)</strong>: Accurate nanosecond/millisecond transit propagation delay across metropolitan and long-haul fiber paths.</LI>
        <LI><strong>Optical Flaps Counter</strong>: Tracks optical signal interruptions, loss of signal (LOS), or automatic protection switching (APS) events.</LI>
        <LI><strong>Mapped Maintenance & Incident Tickets</strong>: Correlates scheduled carrier maintenance windows directly against your circuit performance.</LI>
      </UL>
      <P>
        <PageLink label="Read full VISTA for DCI Wave guide →" onClick={() => onNavigate?.("vista-dci-wave")} />
      </P>

      {/* ── Feature Comparison Matrix ── */}
      <H2 id="comparison-matrix">Metrics & Feature Comparison Matrix</H2>
      <P>Overview of metrics across products and packages:</P>

      <div className="kb-field-table" style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#0f172a", borderBottom: "1.5px solid #e2e8f0" }}>VISTA Capability / Metric</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#166534", borderBottom: "1.5px solid #e2e8f0" }}>Port<br /><span style={{ fontSize: 11, fontWeight: 500 }}>(Premium Free)</span></th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#0369a1", borderBottom: "1.5px solid #e2e8f0" }}>Virtual Connection<br /><span style={{ fontSize: 11, fontWeight: 500 }}>(Standard)</span></th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#7c3aed", borderBottom: "1.5px solid #e2e8f0" }}>Virtual Connection<br /><span style={{ fontSize: 11, fontWeight: 500 }}>(Premium)</span></th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#b45309", borderBottom: "1.5px solid #e2e8f0" }}>DCI Wave<br /><span style={{ fontSize: 11, fontWeight: 500 }}>(Layer 1)</span></th>
            </tr>
          </thead>
          <tbody>
            {[
              { metric: "Traffic In & Out (Mbps)",            port: "Yes", vcStd: "Yes", vcPrem: "Yes", wave: "N/A (L1 Optical)" },
              { metric: "Packets In & Out Analytics",        port: "Yes", vcStd: "Yes", vcPrem: "Yes", wave: "N/A (L1 Optical)" },
              { metric: "Port Level Optical Power (dBm)",     port: "Yes", vcStd: "Yes", vcPrem: "Yes", wave: "Yes" },
              { metric: "Case Submissions with Tracking",    port: "Yes", vcStd: "Yes", vcPrem: "Yes", wave: "Yes" },
              { metric: "Flaps Monitoring",                  port: "Yes", vcStd: "Yes", vcPrem: "Yes", wave: "Yes" },
              { metric: "Latency RTD (ms)",                  port: "Yes", vcStd: "Baseline", vcPrem: "Real-time", wave: "Real-time" },
              { metric: "180-Day Historical Availability",   port: "Yes", vcStd: "No (30-day)", vcPrem: "Yes (180-day)", wave: "Yes" },
              { metric: "Errors Report (CRC / Drops)",       port: "Yes", vcStd: "No", vcPrem: "Yes", wave: "Yes" },
              { metric: "Packet Loss Analysis (%)",          port: "Yes", vcStd: "No", vcPrem: "Yes", wave: "N/A (L1 Bit Error)" },
              { metric: "Jitter Variance (ms)",              port: "Yes", vcStd: "No", vcPrem: "Yes", wave: "N/A (L1)" },
              { metric: "Dynamic Rate Limit Scaling",        port: "N/A", vcStd: "Yes", vcPrem: "Yes", wave: "N/A" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: i < 10 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "11px 16px", fontWeight: 700, color: "#0f172a", fontFamily: FONT_J }}>{row.metric}</td>
                <td style={{ padding: "11px 12px", textAlign: "center" }}><TableBadge val={row.port} color="#166534" /></td>
                <td style={{ padding: "11px 12px", textAlign: "center" }}><TableBadge val={row.vcStd} color="#0369a1" /></td>
                <td style={{ padding: "11px 12px", textAlign: "center" }}><TableBadge val={row.vcPrem} color="#7c3aed" /></td>
                <td style={{ padding: "11px 12px", textAlign: "center" }}><TableBadge val={row.wave} color="#b45309" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── How to Access ── */}
      <H2 id="how-to-access">Accessing VISTA in the Portal</H2>
      <P>
        VISTA telemetry is integrated directly into the <strong>Service Detail</strong> view:
      </P>
      <Steps>
        <Step num={1} title="Navigate to Services">
          From the top navigation bar, click <strong>Services</strong> and select your desired category (<strong>Port</strong>, <strong>Virtual Connection</strong>, or <strong>Data Centre Interconnect</strong>).
        </Step>
        <Step num={2} title="Select an Active Connection">
          Click on any connection with an active <em>Live</em> status tag (e.g. <code>PPOBOM...</code> or <code>PVCBLR...</code>).
        </Step>
        <Step num={3} title="Open the Performance Tab">
          In the service sub-navigation (alongside Overview, Connections, Subscription, Invoices & Payments), click the <strong>Performance</strong> tab to open the VISTA monitoring dashboard.
        </Step>
      </Steps>

      {/* ── Traffic Analytics ── */}
      <H2 id="traffic-analytics">Interactive Traffic Analytics</H2>
      <P>
        VISTA provides both visual time-series charts and granular numeric data tables:
      </P>

      <DocImage
        src="/screenshots/vista/01-vista-traffic-graph.jpg"
        alt="VISTA Traffic Graph View"
        caption="VISTA Traffic Graph: (1) Service header & Performance tab, (2) Granular time interval selector, (3) Bidirectional throughput chart, (4) Ingress/Egress legend."
      />

      <UL>
        <LI><strong>Badge 1 — Service Context</strong>: Displays Service ID (e.g. <code>PPOBOM1302588</code>), provisioned interface bandwidth (e.g. 10 Gbps), data centre location (e.g. <em>Equinix MB1</em>), and quick actions (<em>+ Add Connection</em>, <em>Raise an Issue</em>).</LI>
        <LI><strong>Badge 2 — Time Windows</strong>: Inspect metrics across <em>Last 24 hours</em>, <em>Last 7 days</em>, <em>Last 30 days</em>, or custom intervals with 15-minute resolution.</LI>
        <LI><strong>Badge 3 — Ingress & Egress Curves</strong>: Real-time throughput in Mbps/Gbps. Hover over data points to inspect exact instantaneous rates.</LI>
        <LI><strong>Badge 4 — Visual Legend</strong>: <strong>Purple</strong> represents Traffic Out (Egress), while <strong>Cyan / Blue</strong> represents Traffic In (Ingress).</LI>
      </UL>

      <P>
        Click the <strong>Table View</strong> icon to switch from the graph to discrete numeric records:
      </P>

      <DocImage
        src="/screenshots/vista/02-vista-traffic-table.jpg"
        alt="VISTA Numeric Table View"
        caption="VISTA Table View: (1) Time interval and last update timestamp, (2) Timestamped rows with Traffic Out and Traffic In megabits per second."
      />

      {/* ── Rate Limit Scaling ── */}
      <H2 id="rate-limit-scaling">Effective Rate Limit & Dynamic Bandwidth Scaling</H2>
      <P>
        For Virtual Connections and DCI Layer 2 links, VISTA features direct bandwidth management on demand:
      </P>

      <DocImage
        src="/screenshots/vista/03-vista-telemetry-rate-limit.jpg"
        alt="VISTA Effective Rate Limit and Health KPIs"
        caption="VISTA Telemetry & Controls: (1) Effective Rate Limit with Base + Temp Add-on, (2) Real-time Health KPIs (Flaps, Latency, Availability 100%), (3) End-to-End A-End to Z-End circuit topology."
      />

      <UL>
        <LI>
          <strong>Base Rate Limit (Badge 1)</strong>: Your contracted monthly baseline bandwidth (e.g., <code>1 Mbps @ ₹3,617.50/mo</code>). Click <strong>Upgrade</strong> to adjust your baseline tier.
        </LI>
        <LI>
          <strong>Temp Add-on (Badge 1)</strong>: On-demand burst capacity (e.g., <code>+22 Mbps</code>) for seasonal spikes, migrations, or temporary workloads. Click <strong>Edit</strong> to add or remove capacity instantly.
        </LI>
        <LI>
          <strong>Total Effective Bandwidth</strong>: Combined active throughput (e.g., <code>23 Mbps</code>) enforced across the link in seconds without renegotiating BGP or re-cabling.
        </LI>
        <LI>
          <strong>Health KPIs (Badge 2)</strong>: Continuous 24-hour tracking of <strong>Flaps</strong> (0 flaps = healthy link), <strong>Latency RTD</strong>, and <strong>Availability</strong> (100.00% target).
        </LI>
        <LI>
          <strong>A-End & Z-End Topology (Badge 3)</strong>: Originating facility (e.g. <em>NTT Bengaluru DC3</em>) and destination facility (e.g. <em>STT GDC Chennai DC1</em>) with <em>View Details</em> to inspect physical optics.
        </LI>
      </UL>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshooting">Troubleshooting 'No Data Found'</H2>
      <P>If VISTA displays a <em>"No Data Found"</em> state:</P>
      <UL>
        <LI><strong>Connection Not Yet Live</strong>: Telemetry collection begins only after a service transitions from <em>Design</em> or <em>Ordered</em> to <strong>Live</strong>.</LI>
        <LI><strong>No Active IP Traffic</strong>: If connected routers or cross-connects are idle and no IP packets are being transmitted, throughput counters show zero.</LI>
        <LI><strong>Time Filter Mismatch</strong>: Ensure your date range filter aligns with when the circuit was actively passing traffic.</LI>
      </UL>

      <Callout variant="info">
        To configure automated email and in-app alerts when latency spikes or flaps occur, visit <PageLink label="Manage Alerts" onClick={() => onNavigate?.("manage-alerts")} />.
      </Callout>
    </ArticlePage>
  );
}

function ValueCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <p style={{ fontFamily: FONT_J, fontSize: 14.5, fontWeight: 700, color: "#0a3954", margin: 0 }}>{title}</p>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

function TableBadge({ val, color }: { val: string; color: string }) {
  if (val === "Yes" || val === "Real-time") {
    return <span style={{ background: "#ecfdf5", color: "#047857", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid #a7f3d0" }}>{val}</span>;
  }
  if (val.startsWith("Yes")) {
    return <span style={{ background: "#f5f3ff", color: "#6d28d9", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid #ddd6fe" }}>{val}</span>;
  }
  if (val === "Baseline") {
    return <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1px solid #bfdbfe" }}>{val}</span>;
  }
  if (val.startsWith("No")) {
    return <span style={{ background: "#fef2f2", color: "#b91c1c", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1px solid #fecaca" }}>{val}</span>;
  }
  return <span style={{ color: "#94a3b8", fontSize: 11 }}>{val}</span>;
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
