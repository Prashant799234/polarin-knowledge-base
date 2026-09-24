import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "what-is-wave",        label: "What Is DCI Wave?",            level: 2 as const },
  { id: "telemetry-pillars",   label: "Optical Layer 1 Telemetry" },
  { id: "optical-availability",label: "Optical SLA & Availability",   level: 2 as const },
  { id: "latency-rtd",         label: "Ultra-Low Latency RTD",        level: 2 as const },
  { id: "optical-flaps",       label: "Optical Flaps & Signal Health",level: 2 as const },
  { id: "tickets-correlation", label: "Maintenance Windows & Tickets" },
  { id: "metrics-reference",   label: "DCI Wave Metrics Reference" },
  { id: "troubleshooting",     label: "Optical Troubleshooting" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function VistaDCIWavePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA for DCI Wave</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Optical Layer 1 Telemetry" color="#b45309" />
      </div>

      <P>
        <strong>DCI Wave</strong> delivers dedicated, unshared Layer 1 optical wavelength connectivity over Polarin's dense wavelength division multiplexing (DWDM) fiber backbone. Unlike packet-switched circuits, DCI Wave provides dedicated physical photonic channels with deterministic, speed-of-light propagation latency.
      </P>

      <P>
        VISTA for DCI Wave monitors the physical optical layer directly — continuously auditing optical carrier availability, signal stability, round-trip delay, and automated optical protection switching.
      </P>

      <Callout variant="tip">
        Because DCI Wave operates at physical Layer 1 without packet encapsulation, VISTA tracks optical photonic parameters rather than packet-level counters. For packet-switched Ethernet interconnects, see <PageLink label="VISTA for Virtual Connection" onClick={() => onNavigate?.("vista-vc")} />.
      </Callout>

      {/* ── What Is DCI Wave ── */}
      <H2 id="what-is-wave">What Is DCI Wave?</H2>
      <P>
        Enterprises use DCI Wave for high-throughput, latency-critical connectivity between data center sites:
      </P>
      <UL>
        <LI><strong>Synchronous Storage Replication</strong>: Zero-jitter optical paths for storage area network (SAN) extension and active-active clustering.</LI>
        <LI><strong>Disaster Recovery (DR) Backbones</strong>: High-bandwidth bulk replication pipelines linking primary and failover facilities.</LI>
        <LI><strong>Deterministic Low Latency</strong>: Direct optical paths without intermediate switch queuing delay or packet buffering.</LI>
      </UL>

      {/* ── Optical Telemetry Pillars ── */}
      <H2 id="telemetry-pillars">Optical Layer 1 Telemetry Pillars</H2>
      <P>
        VISTA monitors four critical dimensions of physical optical wave health:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, margin: "18px 0" }}>
        <WaveCard
          icon="🛡️"
          title="Optical Availability (99.999%)"
          description="Monitors true photonic signal availability evaluated against Polarin's five-nines optical carrier SLA target."
        />
        <WaveCard
          icon="⏱️"
          title="Deterministic Latency RTD"
          description="Continuous Round Trip Delay measurement in milliseconds. Tracks physical fiber route consistency and propagation latency."
        />
        <WaveCard
          icon="⚡"
          title="Optical Link Flaps"
          description="Detects optical signal interruptions, loss of signal (LOS), or automatic protection switching (APS) events."
        />
        <WaveCard
          icon="🛠️"
          title="Correlated Incident Tickets"
          description="Maps planned DWDM core maintenance windows and support tickets directly onto circuit telemetry graphs."
        />
      </div>

      {/* ── Detailed Metrics ── */}
      <H2 id="optical-availability">Optical SLA & Availability (100.00%)</H2>
      <P>
        DCI Wave circuits are engineered for mission-critical resiliency. VISTA tracks uptime continuously, calculating the exact percentage of time the optical carrier signal remains locked and forwarding frames.
      </P>
      <UL>
        <LI><strong>Continuous Verification</strong>: Live availability metrics are calculated over 24-hour, 7-day, and 30-day windows.</LI>
        <LI><strong>SLA Auditing</strong>: Generate compliance audit reports directly via the <PageLink label="Reports Module" onClick={() => onNavigate?.("reports")} /> under the <em>DCI L1</em> category.</LI>
      </UL>

      <H2 id="latency-rtd">Ultra-Low Latency RTD (Round Trip Delay)</H2>
      <P>
        Round Trip Delay (RTD) on DCI Wave reflects pure optical transit time through fiber optic glass:
      </P>
      <UL>
        <LI><strong>Fixed Propagation Delay</strong>: Light travels through optical fiber at approximately 5 microseconds per kilometer (round trip ~10 µs/km). Latency RTD remains virtually flat under normal operation.</LI>
        <LI><strong>Protection Switch Detection</strong>: If an optical fiber path is cut and automatic protection switching (APS) routes traffic onto a secondary geographical path, VISTA instantly flags the change in baseline RTD.</LI>
      </UL>

      <H2 id="optical-flaps">Optical Flaps & Signal Health</H2>
      <P>
        An optical flap occurs when the optical carrier signal momentarily drops below the receiver's sensitivity threshold:
      </P>
      <UL>
        <LI><strong>Healthy Link Standard</strong>: Under optimal operating conditions, the 24-hour flap counter displays <code>0 flaps</code>.</LI>
        <LI><strong>Micro-Bends & Fiber Stress</strong>: Increasing flap counts warn of physical fiber bending, road construction vibrations along long-haul routes, or failing optical amplifiers (EDFA) before total signal collapse occurs.</LI>
      </UL>

      <H2 id="tickets-correlation">Maintenance Windows & Tickets</H2>
      <P>
        Unlike standalone monitoring tools that lack carrier context, VISTA integrates planned maintenance schedules directly into your circuit view:
      </P>
      <UL>
        <LI><strong>Maintenance Overlay</strong>: When Polarin or an underlying optical dark fiber provider performs scheduled nighttime core maintenance, notifications appear in the <strong>Tickets</strong> dimension.</LI>
        <LI><strong>Fast Incident Resolution</strong>: If unexpected optical degradation occurs, click <strong>Raise an Issue</strong> on the service detail page. All photonic diagnostic parameters are automatically attached to the NOC ticket.</LI>
      </UL>

      {/* ── Metrics Reference ── */}
      <H2 id="metrics-reference">DCI Wave Metrics Reference</H2>
      <FieldTable rows={[
        { field: "Availability (%)",        description: "Uptime percentage of the optical wavelength channel over the measurement window." },
        { field: "Latency RTD (ms)",         description: "Round Trip Delay in milliseconds measured across A-End and Z-End optical transponders." },
        { field: "Flaps Counter",            description: "Number of optical loss-of-signal (LOS) or carrier protection switching transitions." },
        { field: "Optical Power (Tx/Rx)",   description: "Photonic laser transmit and receive power levels in dBm." },
        { field: "Carrier Tickets",         description: "Mapped maintenance windows, planned network re-routes, and open support cases." },
      ]} />

      {/* ── Optical Troubleshooting ── */}
      <H2 id="troubleshooting">Optical Troubleshooting</H2>
      <UL>
        <LI><strong>Baseline Latency Shift</strong>: A permanent shift in Latency RTD indicates the optical core has switched over to a longer protection path. Check the Tickets panel to see if a fiber maintenance activity is underway.</LI>
        <LI><strong>Optical Signal Flapping</strong>: Contact the Polarin NOC immediately via the <em>Raise an Issue</em> button or refer to the <PageLink label="Escalation Matrix" onClick={() => onNavigate?.("escalation-matrix")} /> for 24/7 optical support.</LI>
      </UL>

      <Callout variant="tip">
        Learn how to order optical wavelength circuits in <PageLink label="DCI Overview" onClick={() => onNavigate?.("dci-overview")} /> and <PageLink label="Create a Data Centre Interconnect" onClick={() => onNavigate?.("dci-create")} />.
      </Callout>
    </ArticlePage>
  );
}

function WaveCard({ icon, title, description }: { icon: string; title: string; description: string }) {
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

