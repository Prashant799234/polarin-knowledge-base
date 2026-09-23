import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "how-to-access",       label: "Accessing VISTA",            level: 2 as const },
  { id: "traffic-analytics",   label: "Interactive Traffic Analytics" },
  { id: "graph-view",          label: "Traffic Graph View",         level: 2 as const },
  { id: "table-view",          label: "Numeric Table View",         level: 2 as const },
  { id: "rate-limit-scaling",  label: "Effective Rate Limit & Scaling" },
  { id: "health-kpis",         label: "Real-Time Health KPIs",      level: 2 as const },
  { id: "circuit-topology",    label: "A-End & Z-End Topology",     level: 2 as const },
  { id: "tiers",               label: "VISTA Free vs Premium" },
  { id: "troubleshooting",     label: "Troubleshooting 'No Data Found'" },
];

const TIERS = [
  { name: "VISTA Free (Included)", detail: "10,000 API telemetry calls per day per circuit, 30-day historical data retention, and real-time portal monitoring included automatically with every service." },
  { name: "VISTA Premium", detail: "50,000 API calls per day per circuit, 180-day historical telemetry retention, custom webhooks, and automated anomaly detection. Contact your account manager to activate." },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function VistaOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">VISTA</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Telemetry & Performance" color="#7c3aed" />
      </div>

      <P>
        <strong>VISTA</strong> is Polarin's real-time network observability and telemetry engine. Built directly into every active service, VISTA provides second-by-second visibility into bandwidth utilisation, optical health, link flaps, round-trip latency, and SLA compliance.
      </P>

      <P>
        Unlike legacy carrier networks where bandwidth monitoring requires third-party SNMP polling or waiting for monthly bill summaries, VISTA lets you view live ingress/egress graphs, audit raw numeric telemetry logs, and dynamically scale your effective bandwidth up or down with a single click.
      </P>

      <Callout variant="tip">
        VISTA monitoring is enabled automatically the moment your service becomes <strong>Live</strong> — no agents, probes, or manual sensor installations are required.
      </Callout>

      {/* ── How to Access ── */}
      <H2 id="how-to-access">Accessing VISTA in the Portal</H2>
      <P>
        VISTA is integrated directly into the <strong>Service Detail</strong> view of your circuits:
      </P>
      <Steps>
        <Step num={1} title="Navigate to Services">
          From the top navigation bar, click <strong>Services</strong>, then select your service category (e.g., <strong>Port</strong>, <strong>Virtual Connection</strong>, or <strong>Data Centre Interconnect</strong>).
        </Step>
        <Step num={2} title="Select an Active Connection">
          Click on any connection with a <em>Live</em> status tag (e.g., <code>PPOBOM...</code> or <code>PVCBLR...</code>).
        </Step>
        <Step num={3} title="Click the Performance Tab">
          On the service header, switch from <em>Overview</em> to the <strong>Performance</strong> tab to open the VISTA analytics dashboard.
        </Step>
      </Steps>

      {/* ── Traffic Analytics ── */}
      <H2 id="traffic-analytics">Interactive Traffic Analytics</H2>
      <P>
        The primary section of VISTA displays bidirectional throughput passing through your circuit. You can toggle between a graphical time-series curve and a raw numeric data table.
      </P>

      <H3 id="graph-view">1. Traffic Graph View</H3>
      <DocImage
        src="/screenshots/vista/01-vista-traffic-graph.jpg"
        alt="VISTA Traffic Graph View"
        caption="VISTA Traffic Graph: (1) Service header & Performance tab, (2) Time interval filter, (3) Bidirectional throughput chart, (4) Ingress/Egress legend."
      />

      <P>
        Understanding the time-series chart:
      </P>
      <UL>
        <LI>
          <strong>Badge 1 — Service Context</strong>: Shows the unique Service ID (e.g. <code>PPOBOM1302588</code>), provisioned interface speed (e.g. 1 Gbps or 10 Gbps), operating data centre location (e.g. <em>Equinix MB1</em>), and quick actions (<em>+ Add Connection</em>, <em>Raise an Issue</em>).
        </LI>
        <LI>
          <strong>Badge 2 — Granular Time Windows</strong>: Filter telemetry across predefined intervals (<em>Last 24 hours</em>, <em>Last 7 days</em>, <em>Last 30 days</em>, or custom windows) with 15-minute or 4-hour aggregation buckets.
        </LI>
        <LI>
          <strong>Badge 3 — Ingress vs Egress Curves</strong>: Displays throughput measured in Mbps/Gbps. Hovering over any point reveals the exact timestamp and bandwidth rate.
        </LI>
        <LI>
          <strong>Badge 4 — Visual Key</strong>:
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#a855f7", display: "inline-block" }} />
            <strong>Purple</strong> = Traffic Out (Egress)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 14 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#06b6d4", display: "inline-block" }} />
            <strong>Cyan / Blue</strong> = Traffic In (Ingress)
          </span>
        </LI>
      </UL>

      <H3 id="table-view">2. Numeric Table View</H3>
      <P>
        Need exact numeric records for capacity audits or compliance reporting? Click the <strong>Table View</strong> toggle icon in the chart controls.
      </P>

      <DocImage
        src="/screenshots/vista/02-vista-traffic-table.jpg"
        alt="VISTA Numeric Table View"
        caption="VISTA Table View: (1) Granular interval with last update timestamp, (2) Time-stamped telemetry rows (Time, Traffic Out Mbps, Traffic In Mbps)."
      />

      <P>
        The table provides discrete timestamped records for each 15-minute interval (<strong>Badge 2</strong>), displaying exact throughput in megabits per second. This makes it effortless to audit peak traffic bursts or compare throughput against SLA commitments.
      </P>

      {/* ── Rate Limit Scaling ── */}
      <H2 id="rate-limit-scaling">Effective Rate Limit & Dynamic Bandwidth Scaling</H2>
      <P>
        One of Polarin's most powerful capabilities is on-demand bandwidth scaling without physical recabling or service downtime.
      </P>

      <DocImage
        src="/screenshots/vista/03-vista-telemetry-rate-limit.jpg"
        alt="VISTA Effective Rate Limit and Health KPIs"
        caption="VISTA Telemetry & Controls: (1) Effective Rate Limit with Base + Temp Add-on, (2) Performance KPIs (Flaps, Latency, Availability 100%), (3) End-to-End A-End to Z-End port topology."
      />

      <P>
        Under the <strong>EFFECTIVE RATE LIMIT</strong> card (<strong>Badge 1</strong>), VISTA displays your connection's active throughput ceiling:
      </P>
      <UL>
        <LI>
          <strong>Base Rate Limit</strong>: Your contracted monthly baseline bandwidth (e.g. <code>1 Mbps @ ₹3,617.50/mo</code>). Click <strong>Upgrade</strong> to permanently adjust your baseline subscription.
        </LI>
        <LI>
          <strong>Temp Add-on</strong>: On-demand burst bandwidth added dynamically (e.g. <code>+22 Mbps</code>). Click <strong>Edit</strong> to scale temporary capacity up or down to handle seasonal workloads, backups, or migrations.
        </LI>
        <LI>
          <strong>Total Effective Bandwidth</strong>: The combined active rate limit enforced on the circuit (e.g. <code>23 Mbps</code>). Changes apply in seconds without tearing down BGP peering or dropping packets.
        </LI>
      </UL>

      {/* ── Health KPIs ── */}
      <H2 id="health-kpis">Real-Time Health KPIs</H2>
      <P>
        Directly beneath the rate limit card, VISTA monitors critical physical and optical health indicators over the trailing 24-hour window (<strong>Badge 2</strong>):
      </P>
      <FieldTable rows={[
        { field: "Flaps",                   description: "Count of physical link up/down transitions over the last 24 hours. A healthy link consistently shows 0 flaps." },
        { field: "Latency RTD (ms)",         description: "Current round-trip propagation delay across endpoints. Sudden spikes highlight intermediate route congestion or fiber reroutes." },
        { field: "Availability (%)",        description: "Uptime percentage of the connection evaluated against Polarin's 99.99% SLA commitment (e.g., 100.00%)." },
        { field: "Last Update",             description: "Live timestamp showing when the telemetry collector last pulled metrics from the hardware switch." },
      ]} />

      {/* ── Circuit Topology ── */}
      <H2 id="circuit-topology">A-End & Z-End Circuit Topology</H2>
      <P>
        Every point-to-point connection is anchored between two physical termination endpoints (<strong>Badge 3</strong>):
      </P>
      <UL>
        <LI>
          <strong>A-END - PORT</strong>: The originating data centre facility and physical switch interface (e.g. <em>NTT Bengaluru DC3, Bidarahalli Hobli</em>).
        </LI>
        <LI>
          <strong>Z-END - PORT</strong>: The destination data centre facility and termination interface (e.g. <em>STT GDC Chennai DC1, VSB Sivananda Salai</em>).
        </LI>
        <LI>
          Click <strong>View Details</strong> under either endpoint to inspect cross-connect identifiers, patch panel assignments, and port optics.
        </LI>
      </UL>

      {/* ── Tiers ── */}
      <H2 id="tiers">VISTA Free vs Premium</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {TIERS.map((t) => (
          <div key={t.name} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 18px" }}>
            <div>
              <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0a3954", margin: "0 0 4px" }}>{t.name}</p>
              <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.65 }}>{t.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshooting">Troubleshooting 'No Data Found'</H2>
      <P>
        If your VISTA performance graph displays <em>"No Data Found"</em>:
      </P>
      <UL>
        <LI>
          <strong>Service Status is Not Yet Live</strong>: Telemetry collection begins once the circuit status transitions to <em>Live</em>. While in <em>Design</em> or <em>Ordered</em> stages, no metrics exist.
        </LI>
        <LI>
          <strong>No Active Customer Traffic</strong>: If your customer-premises equipment (CPE) or cross-connect has not yet transmitted IP packets over the link, throughput shows zero.
        </LI>
        <LI>
          <strong>Selected Time Range Has No Samples</strong>: Verify that your date range filter aligns with the period when your services were active.
        </LI>
      </UL>

      <Callout variant="info">
        Want to receive automated alerts when latency crosses a threshold or flaps occur? Configure automated alert rules in <PageLink label="Manage Alerts" onClick={() => onNavigate?.("manage-alerts")} />.
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
