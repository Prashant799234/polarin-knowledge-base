import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "premium-included",    label: "VISTA Premium Included Free",  level: 2 as const },
  { id: "capabilities",        label: "What You Get with Port VISTA", level: 2 as const },
  { id: "accessing",           label: "Accessing Port Performance" },
  { id: "traffic-monitoring",  label: "Traffic & Ingress/Egress Analysis" },
  { id: "table-auditing",      label: "Granular Numeric Records",     level: 2 as const },
  { id: "optical-power",       label: "Optical Power & Hardware Health" },
  { id: "metrics-reference",   label: "Port Metrics Reference Table" },
  { id: "troubleshooting",     label: "Troubleshooting Port Metrics" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function VistaPortPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA for Port</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Physical Layer Telemetry" color="#059669" />
      </div>

      <P>
        A <strong>Port</strong> represents your physical cross-connect entry point into the Polarin high-performance optical network (available in 1 Gbps, 10 Gbps, and 100 Gbps port speeds). Because the port forms the physical anchor upon which all Virtual Connections, Virtual Routers, and Data Centre Interconnects run, monitoring its health is vital.
      </P>

      <P>
        VISTA for Port delivers continuous, real-time telemetry on transceiver optical levels, interface frame rates, physical link state transitions, and bandwidth saturation.
      </P>

      {/* ── Premium Included Free ── */}
      <H2 id="premium-included">VISTA Premium Included Completely Free</H2>
      <div style={{ background: "#ecfdf5", border: "1.5px solid #6ee7b7", borderRadius: 12, padding: "18px 20px", margin: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>🎁</span>
          <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#065f46", margin: 0 }}>
            Enterprise VISTA Premium Features at Zero Additional Cost
          </p>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#1e293b", margin: 0, lineHeight: 1.65 }}>
          For every physical Port ordered on Polarin, <strong>VISTA Premium is included by default for free</strong>. There are no add-on charges or tier limitations. You receive full port-level optical power diagnostics, hardware error logging, and long-term historical analytics automatically.
        </p>
      </div>

      {/* ── Capabilities ── */}
      <H2 id="capabilities">What You Get with Port VISTA</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, margin: "16px 0" }}>
        <FeatureCard
          icon="📈"
          title="Live Traffic Analytics"
          description="Real-time ingress and egress throughput curves (Mbps / Gbps) sampled at granular 15-minute intervals."
        />
        <FeatureCard
          icon="📦"
          title="Packet In/Out Volume"
          description="Hardware Ethernet frame counters to detect packet size skew, micro-bursts, and interface throughput."
        />
        <FeatureCard
          icon="💡"
          title="Port Optical Power (dBm)"
          description="Continuous Transmit (Tx) and Receive (Rx) optical power tracking to detect dirty fiber transceivers or optical degradation."
        />
        <FeatureCard
          icon="🔄"
          title="Link Flaps & Error Logging"
          description="Immediate detection of link up/down transitions and CRC interface drop errors."
        />
        <FeatureCard
          icon="🎫"
          title="One-Click Incident Tracking"
          description="Direct 'Raise an Issue' action pre-filled with port identifiers, switch serials, and live telemetry states."
        />
        <FeatureCard
          icon="🌍"
          title="Access from Anywhere"
          description="Monitor port performance securely from any browser or device with zero SNMP polling overhead."
        />
      </div>

      {/* ── Accessing ── */}
      <H2 id="accessing">Accessing Port Performance in the Portal</H2>
      <Steps>
        <Step num={1} title="Navigate to Ports">
          Click <strong>Services</strong> in the top navigation bar, then select <strong>Port</strong> under <em>CORE PRODUCTS</em> in the left sidebar.
        </Step>
        <Step num={2} title="Select a Live Port">
          Click on any port with a <em>Live</em> status badge (e.g. <code>PPOBOM1302588</code>).
        </Step>
        <Step num={3} title="Open the Performance Tab">
          Click the <strong>Performance</strong> tab on the port detail view to open VISTA telemetry.
        </Step>
      </Steps>

      {/* ── Traffic Monitoring ── */}
      <H2 id="traffic-monitoring">Traffic & Ingress/Egress Analysis</H2>
      <P>
        VISTA renders bidirectional port throughput in a clean, interactive time-series chart:
      </P>

      <DocImage
        src="/screenshots/vista/01-vista-traffic-graph.jpg"
        alt="Port VISTA Traffic Graph View"
        caption="Port VISTA: (1) Port header showing 1 Gbps speed at Equinix MB1, (2) 15-minute interval picker, (3) Ingress/Egress graph, (4) Purple = Out, Cyan = In."
      />

      <UL>
        <LI><strong>Port Speed Context (Badge 1)</strong>: Shows provisioned interface speed (e.g., <code>1 Gbps</code> or <code>10 Gbps</code>) and hosting data centre facility (e.g., <em>Equinix MB1</em>).</LI>
        <LI><strong>Aggregation Windows (Badge 2)</strong>: Switch between <em>Last 24 hours</em>, <em>Last 7 days</em>, and <em>Last 30 days</em> with 15-minute resolution.</LI>
        <LI><strong>Dual-Series Throughput (Badges 3 & 4)</strong>: Hover over any timestamp to inspect exact values. <strong>Purple</strong> indicates egress (Traffic Out), and <strong>Cyan / Blue</strong> indicates ingress (Traffic In).</LI>
      </UL>

      <H3 id="table-auditing">Granular Numeric Records</H3>
      <P>
        Click the <strong>Table View</strong> icon in the chart controls to view exact numerical values for compliance audits or billing verification:
      </P>

      <DocImage
        src="/screenshots/vista/02-vista-traffic-table.jpg"
        alt="Port VISTA Table View"
        caption="Port Table View: Timestamped rows displaying discrete Traffic Out (Mbps) and Traffic In (Mbps) measurements."
      />

      {/* ── Optical Power ── */}
      <H2 id="optical-power">Optical Power & Hardware Health</H2>
      <P>
        Physical optical interfaces depend on proper laser transmission levels. VISTA reads digital optical monitoring (DOM) counters directly from the data centre switch transceiver:
      </P>
      <UL>
        <LI><strong>Tx Power (Transmit)</strong>: The optical signal power generated by the Polarin switch laser towards your patch panel.</LI>
        <LI><strong>Rx Power (Receive)</strong>: The optical power received from your cross-connect. If Rx power drops below transceiver thresholds, VISTA alerts you to optical attenuation, bent patch cords, or dust contamination.</LI>
        <LI><strong>Link Stability (Flaps)</strong>: Monitors physical link state transitions. A reliable port maintains 0 flaps over a 24-hour period.</LI>
      </UL>

      {/* ── Metrics Table ── */}
      <H2 id="metrics-reference">Port Metrics Reference</H2>
      <FieldTable rows={[
        { field: "Traffic In (Mbps)",        description: "Ingress throughput entering the Polarin port from the customer premises cross-connect." },
        { field: "Traffic Out (Mbps)",       description: "Egress throughput exiting the Polarin port towards customer equipment." },
        { field: "Packets In & Out",         description: "Total count of Ethernet frames forwarded through the physical interface." },
        { field: "Optical Power (dBm)",      description: "Transmit (Tx) and Receive (Rx) optical decibel levels for transceiver diagnostics." },
        { field: "Flaps Counter",            description: "Number of physical link transitions between Up and Down states in the last 24 hours." },
        { field: "Error Drops / CRC",        description: "Hardware packet drop counters caused by CRC errors or physical layer signal distortion." },
      ]} />

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshooting">Troubleshooting Port Metrics</H2>
      <UL>
        <LI><strong>Zero Traffic on a Live Port</strong>: If your port is <em>Live</em> but displays zero throughput, check that your local switch interface is un-shutdown and transmitting tagged VLAN packets.</LI>
        <LI><strong>Non-Zero Flap Counts</strong>: If flap counts increment, inspect physical fiber patches at the colocation facility or raise a ticket via the <strong>Raise an Issue</strong> button on the port header.</LI>
      </UL>

      <Callout variant="tip">
        Learn more about ordering and configuring physical ports in <PageLink label="Port Overview" onClick={() => onNavigate?.("port-overview")} /> and <PageLink label="Create a Port" onClick={() => onNavigate?.("port-create")} />.
      </Callout>
    </ArticlePage>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: 0 }}>{title}</p>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.55 }}>{description}</p>
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

