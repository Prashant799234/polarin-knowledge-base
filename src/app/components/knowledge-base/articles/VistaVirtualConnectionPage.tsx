import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "applicable-types",    label: "Supported Connection Types",   level: 2 as const },
  { id: "packages",            label: "Standard vs Premium Packages" },
  { id: "standard-package",    label: "Standard Package (Free)",      level: 2 as const },
  { id: "premium-package",     label: "Premium Package (Recommended)",level: 2 as const },
  { id: "rate-limit-scaling",  label: "Effective Rate Limit & Scaling" },
  { id: "health-kpis",         label: "Real-Time Telemetry & Health" },
  { id: "circuit-topology",    label: "End-to-End A/Z Topology",      level: 2 as const },
  { id: "metrics-reference",   label: "Virtual Connection Metrics" },
  { id: "troubleshooting",     label: "Troubleshooting & Support" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function VistaVirtualConnectionPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA for Virtual Connection</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Layer 2 / Layer 3 Telemetry" color="#7c3aed" />
      </div>

      <P>
        A <strong>Virtual Connection (VC)</strong> delivers dedicated, private point-to-point bandwidth across the Polarin software-defined network. Whether linking two on-premise facilities, connecting a data centre to public cloud on-ramps, or bridging multi-cloud environments, VISTA provides end-to-end telemetry on connection performance, packet integrity, and latency.
      </P>

      <P>
        VISTA for Virtual Connection combines continuous performance monitoring with self-service bandwidth scaling through the <strong>Effective Rate Limit</strong> engine.
      </P>

      {/* ── Applicable Types ── */}
      <H2 id="applicable-types">Supported Connection Types</H2>
      <P>
        VISTA telemetry applies identically across all Polarin Virtual Connection product categories:
      </P>
      <UL>
        <LI><strong>DC to Cloud (Cloud Connect)</strong>: Private, direct interconnection to hyperscalers (AWS Direct Connect, Microsoft Azure ExpressRoute, Google Cloud Interconnect, Oracle FastConnect).</LI>
        <LI><strong>Cloud to Cloud</strong>: Low-latency interconnects linking workloads running across different cloud service providers.</LI>
        <LI><strong>DC to DC (Data Centre to Data Centre)</strong>: Private point-to-point links connecting customer facilities across metropolitan or interstate regions.</LI>
        <LI><strong>DCI Layer 2</strong>: Dedicated Ethernet LAN extension across data centres for stretched clusters and storage replication.</LI>
      </UL>

      {/* ── Packages ── */}
      <H2 id="packages">Standard vs Premium Packages</H2>
      <P>
        During connection creation or at any point from the service dashboard, you can choose between two VISTA monitoring packages:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16, margin: "20px 0" }}>
        {/* Standard */}
        <div style={{ background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: 12, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#0a3954", margin: 0 }}>Standard Package</p>
            <span style={{ background: "#e2e8f0", color: "#334155", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>Free</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 }}>
            Included free with every Virtual Connection. Provides baseline real-time visibility into your connection throughput.
          </p>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Included Capabilities:</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontFamily: FONT, fontSize: 13.5, color: "#334155", lineHeight: 1.75 }}>
              <li><strong>Access from Anywhere</strong>: Monitor live link performance from desktop or mobile</li>
              <li><strong>Real-time Traffic Analytics</strong>: Ingress & egress throughput curves</li>
              <li><strong>Packet In/Out Analytics</strong>: Total Ethernet packet volume counters</li>
              <li><strong>Port-Level Power Monitoring</strong>: Baseline transceiver diagnostics</li>
              <li><strong>Case Submissions with Tracking</strong>: Direct ticketing with telemetry context</li>
            </ul>
          </div>
        </div>

        {/* Premium */}
        <div style={{ background: "#faf5ff", border: "2px solid #a855f7", borderRadius: 12, padding: "20px", position: "relative" }}>
          <div style={{ position: "absolute", top: -11, right: 16, background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ⭐ Recommended
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#581c87", margin: 0 }}>Premium Package</p>
            <span style={{ background: "#f3e8ff", color: "#7e22ce", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, border: "1px solid #d8b4fe" }}>Full Analytics</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#6b21a8", margin: "0 0 14px", lineHeight: 1.5 }}>
            Enterprise observability for mission-critical production interconnects, database synchronization, and strict SLA compliance.
          </p>
          <div style={{ borderTop: "1px solid #e9d5ff", paddingTop: 12 }}>
            <p style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#581c87", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Unlocks Everything in Standard Plus:</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontFamily: FONT, fontSize: 13.5, color: "#3b0764", lineHeight: 1.75 }}>
              <li><strong>Service Availability for Last 180 Days</strong>: 6 months of historical SLA compliance data</li>
              <li><strong>Errors Report</strong>: CRC, frame errors, and interface packet drop diagnostics</li>
              <li><strong>Packet Loss Analysis (%)</strong>: Continuous transmission integrity tracking</li>
              <li><strong>Jitter Monitoring (ms)</strong>: Latency variance analysis for voice, video, and API calls</li>
              <li><strong>SLA Breach Forecasting</strong>: Early warnings when latency drifts from SLA baselines</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Rate Limit Scaling ── */}
      <H2 id="rate-limit-scaling">Effective Rate Limit & Dynamic Bandwidth Scaling</H2>
      <P>
        VISTA pairs deep telemetry with instantaneous bandwidth scaling. On any active Virtual Connection, the <strong>EFFECTIVE RATE LIMIT</strong> card displays your active bandwidth ceiling:
      </P>

      <DocImage
        src="/screenshots/vista/03-vista-telemetry-rate-limit.jpg"
        alt="VISTA Effective Rate Limit and Health KPIs on Virtual Connection"
        caption="VISTA Virtual Connection: (1) Effective Rate Limit with Base + Temp Add-on, (2) Health KPIs (Flaps, Latency, Availability 100%), (3) End-to-End A-End to Z-End topology."
      />

      <UL>
        <LI>
          <strong>Base Rate Limit (Badge 1)</strong>:
          Your contracted monthly baseline subscription (e.g., <code>1 Mbps @ ₹3,617.50/mo</code>). Click <strong>Upgrade</strong> to adjust your permanent monthly bandwidth tier.
        </LI>
        <LI>
          <strong>Temp Add-on (Badge 1)</strong>:
          On-demand burst capacity added dynamically (e.g., <code>+22 Mbps</code>) for seasonal traffic spikes, data migrations, or unexpected workloads. Click <strong>Edit</strong> to increase or decrease temporary bandwidth in seconds.
        </LI>
        <LI>
          <strong>Total Effective Bandwidth</strong>:
          The combined throughput enforced across the link (e.g., <code>23 Mbps</code>). Rate limit modifications take effect immediately in the data plane without dropping packets or renegotiating BGP sessions.
        </LI>
      </UL>

      {/* ── Health KPIs ── */}
      <H2 id="health-kpis">Real-Time Telemetry & Health</H2>
      <P>
        Beneath the rate limit card, VISTA continuously audits your circuit's SLA health over the last 24 hours (<strong>Badge 2</strong>):
      </P>
      <UL>
        <LI><strong>Flaps</strong>: Tracks interface state transitions. A reliable connection maintains <code>0 flaps</code>.</LI>
        <LI><strong>Latency RTD (Round Trip Delay)</strong>: Millisecond-level round-trip propagation transit time across endpoints.</LI>
        <LI><strong>Availability (%)</strong>: Uptime percentage evaluated against Polarin's 99.99% SLA commitment (e.g. <code>100.00%</code>).</LI>
      </UL>

      <H3 id="circuit-topology">End-to-End A-End to Z-End Topology</H3>
      <P>
        The topology section (<strong>Badge 3</strong>) maps the physical data centre endpoints anchoring your connection:
      </P>
      <UL>
        <LI><strong>A-END - PORT</strong>: The originating port and facility (e.g. <em>NTT Bengaluru DC3, Bidarahalli Hobli</em>).</LI>
        <LI><strong>Z-END - PORT</strong>: The destination port and facility (e.g. <em>STT GDC Chennai DC1, VSB Sivananda Salai</em>).</LI>
        <LI>Click <strong>View Details</strong> to inspect physical patch IDs, optical transceivers, and cross-connect patch cords.</LI>
      </UL>

      {/* ── Metrics Table ── */}
      <H2 id="metrics-reference">Virtual Connection Metrics Reference</H2>
      <FieldTable rows={[
        { field: "Traffic In & Out (Mbps)",  description: "Bidirectional throughput transmitted across the virtual connection in megabits per second." },
        { field: "Packet In & Out",          description: "Count of Ethernet frames forwarded across the virtual circuit." },
        { field: "Latency RTD (ms)",         description: "Round Trip Delay measured continuously between A-End and Z-End endpoints." },
        { field: "Jitter (ms)",              description: "Statistical variance in packet arrival delay (Premium Package). Critical for voice and real-time streaming." },
        { field: "Packet Loss (%)",          description: "Percentage of transmitted frames that failed to reach the destination interface (Premium Package)." },
        { field: "Errors Report",            description: "Detailed breakdown of CRC errors, frame alignment errors, and interface drops (Premium Package)." },
        { field: "Availability (180 Days)",  description: "Historical uptime percentage across 6 months for SLA compliance verification (Premium Package)." },
        { field: "Effective Rate Limit",     description: "Active throughput ceiling (Base contracted rate limit + Temporary Add-on bandwidth)." },
      ]} />

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshooting">Troubleshooting & Support</H2>
      <UL>
        <LI><strong>Traffic Drops at Rate Limit</strong>: If traffic graphs plateau at your configured rate limit, your application is saturating capacity. Click <strong>Edit</strong> under Temp Add-on to instantly add bandwidth.</LI>
        <LI><strong>Sudden Latency Spikes</strong>: Check the <em>Latency RTD</em> graph. If latency suddenly doubles, an optical protection switch or reroute may have occurred. Check the <em>Tickets</em> panel for carrier maintenance notices.</LI>
      </UL>

      <Callout variant="tip">
        Learn how to provision new connections in <PageLink label="Virtual Connection Overview" onClick={() => onNavigate?.("vc-overview")} /> and <PageLink label="Create a Virtual Connection" onClick={() => onNavigate?.("cloud-connect")} />.
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
