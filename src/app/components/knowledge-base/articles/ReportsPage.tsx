import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "categories",          label: "Supported Service Categories", level: 2 as const },
  { id: "dashboard-walkthrough", label: "Reports Dashboard",          level: 2 as const },
  { id: "download-reports",    label: "Downloading On-Demand Reports" },
  { id: "schedule-reports",    label: "Scheduling Automated Reports" },
  { id: "schedule-modal-flow", label: "Configuring Schedule Settings", level: 2 as const },
  { id: "view-scheduled",      label: "Managing Active Schedules",    level: 2 as const },
  { id: "metrics-glossary",    label: "Telemetry & SLA Metrics Table" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function ReportsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Reports</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Operations & Telemetry" color="#0284c7" />
      </div>

      <P>
        The <strong>Reports</strong> module provides central reporting, telemetry analytics, and SLA compliance auditing across your Polarin networking infrastructure.
      </P>

      <P>
        Whether your engineering team needs an immediate CSV export of port traffic for bandwidth capacity planning or your operations team requires automated weekly SLA availability reports emailed to management, the Reports module handles both on-demand and recurring reporting workflows.
      </P>

      <Callout variant="tip">
        Reports can be scheduled to run automatically on a <strong>Daily</strong>, <strong>Weekly</strong>, or <strong>Monthly</strong> cadence, delivering fresh telemetry directly to your engineering mailing lists.
      </Callout>

      {/* ── Supported Categories ── */}
      <H2 id="categories">Supported Service Categories</H2>
      <P>
        Polarin organizes network reports into three dedicated product categories:
      </P>
      <UL>
        <LI>
          <strong>DCI L1 (Data Centre Interconnect)</strong>:
          Covers Layer 1 dark fiber and DWDM optical wave connections. Monitors optical circuit flaps, round-trip latency, incident tickets, and circuit availability percentages.
        </LI>
        <LI>
          <strong>Port</strong>:
          Covers physical cross-connect interfaces (1 Gbps, 10 Gbps, 100 Gbps). Reports on total ingress/egress data volume (<em>Traffic In and Out</em>) and raw packet counts (<em>Packets In and Out</em>).
        </LI>
        <LI>
          <strong>Virtual Connection (VC)</strong>:
          Covers Point-to-Point Layer 2/3 connections across Data Centre to Cloud, Cloud to Cloud, and Data Centre to Data Centre paths. Tracks latency, packet loss, jitter, and link status.
        </LI>
      </UL>

      {/* ── Dashboard Walkthrough ── */}
      <H2 id="dashboard-walkthrough">Reports Dashboard Walkthrough</H2>
      <P>
        To access the Reports module, click <strong>Settings</strong> from the top navigation bar, then select <strong>Reports</strong> from the left sidebar under <em>ORGANISATION</em>.
      </P>

      <DocImage
        src="/screenshots/reports/01-reports-main-dashboard.jpg"
        alt="Polarin Reports Main Dashboard"
        caption="Reports Dashboard: (1) Product category tabs, (2) Telemetry metric filter pills, (3) Download & Schedule actions, (4) Filtered telemetry data table."
      />

      <P>
        The dashboard includes the following key areas:
      </P>
      <UL>
        <LI><strong>Badge 1 — Service Category Tabs</strong>: Switch seamlessly between <em>DCI L1</em>, <em>Port</em>, and <em>Virtual Connection</em> reporting domains.</LI>
        <LI><strong>Badge 2 — Metric Filter Pills</strong>: Filter telemetry records by specific health dimensions, such as <em>Flaps</em>, <em>Latency</em>, <em>Tickets</em>, or <em>Availability</em>.</LI>
        <LI><strong>Badge 3 — Action Buttons</strong>: Click <strong>Download Report</strong> for an instant export, or click <strong>Schedule Report</strong> to set up automated recurring email delivery.</LI>
        <LI><strong>Badge 4 — Telemetry Data Table</strong>: Displays individual circuit records including Circuit Name, Service ID, telemetry measurement values, and exact timestamps.</LI>
      </UL>

      {/* ── Downloading On-Demand Reports ── */}
      <H2 id="download-reports">Downloading On-Demand Reports</H2>
      <P>
        Follow these steps to generate and download an immediate report:
      </P>

      <Steps>
        <Step num={1} title="Select Service Category">
          Click the tab corresponding to the product you want to inspect (e.g., <strong>DCI L1</strong> or <strong>Port</strong>).
        </Step>
        <Step num={2} title="Apply Metric & Date Filters">
          Select your target metric pill (such as <em>Latency</em> or <em>Availability</em>) and choose a time window (e.g., <em>Last 24 hours</em>, <em>Last 7 days</em>, or a custom date range).
        </Step>
        <Step num={3} title="Click Download Report">
          Click the <strong>Download Report</strong> button located in the upper-right corner.
        </Step>
        <Step num={4} title="Configure Export Parameters">
          In the drawer that opens, enter a report name, confirm the metric type, optionally filter to specific Service IDs, and choose your preferred file format (<strong>CSV</strong> or <strong>PDF</strong>).
        </Step>
        <Step num={5} title="Generate & Download">
          Click <strong>Download</strong>. The file is generated immediately and downloaded directly by your browser.
        </Step>
      </Steps>

      {/* ── Scheduling Automated Reports ── */}
      <H2 id="schedule-reports">Scheduling Automated Reports</H2>
      <P>
        You can configure Polarin to automatically run reports in the background and email them to stakeholders on a recurring schedule.
      </P>

      <H3 id="schedule-modal-flow">Configuring Schedule Settings</H3>
      <P>
        Click the <strong>Schedule Report</strong> button on the dashboard to open the scheduling drawer.
      </P>

      <DocImage
        src="/screenshots/reports/02-reports-schedule-modal.jpg"
        alt="Polarin Schedule Report Drawer"
        caption="Schedule Report Drawer: (1) Drawer header, (2) Report name & type, (3) Service scope selection, (4) Date range & repeat frequency, (5) Email delivery time & Schedule CTA."
      />

      <Steps>
        <Step num={1} title="Name Your Report & Select Metric Type">
          In the drawer header (<strong>Badge 1</strong>), enter a distinctive title for your report (e.g., <em>Weekly Executive SLA Report</em>) and select the metric category from the <strong>Report Type</strong> dropdown (<strong>Badge 2</strong>).
        </Step>
        <Step num={2} title="Define Service Scope (Optional)">
          By default, the report aggregates all services in the chosen category. To restrict reporting to critical production circuits, select specific <strong>Service IDs</strong> from the multi-select dropdown (<strong>Badge 3</strong>).
        </Step>
        <Step num={3} title="Set Date Range & Repeat Cadence">
          Choose a start date and optional end date. In the <strong>Repeat</strong> dropdown (<strong>Badge 4</strong>), choose the cadence:
          <UL>
            <LI><strong>Daily</strong>: Dispatches every morning covering the previous 24 hours.</LI>
            <LI><strong>Weekly</strong>: Dispatches every Monday covering the preceding week.</LI>
            <LI><strong>Monthly</strong>: Dispatches on the 1st of every calendar month covering the previous month.</LI>
          </UL>
        </Step>
        <Step num={4} title="Set Delivery Time & Email Schedule">
          Specify the delivery time (e.g., <code>12:00 AM</code> or <code>08:00 AM +05:30</code>) when the email dispatch should trigger. Enter email addresses or distribution lists to receive the report.
        </Step>
        <Step num={5} title="Confirm & Schedule">
          Click the <strong>Schedule</strong> button (<strong>Badge 5</strong>). The recurring report is activated immediately.
        </Step>
      </Steps>

      {/* ── Managing Scheduled Reports ── */}
      <H2 id="view-scheduled">Managing Active Schedules</H2>
      <P>
        To inspect or modify recurring schedules, click the <strong>View Scheduled Reports</strong> link next to the Schedule Report button on the dashboard.
      </P>
      <UL>
        <LI><strong>Review Frequencies</strong>: View all active automated reports along with their delivery times, recipients, and attached metrics.</LI>
        <LI><strong>Edit Delivery Lists</strong>: Add or remove email addresses as team responsibilities change.</LI>
        <LI><strong>Pause or Delete</strong>: Deactivate automated schedules that are no longer needed without affecting past report history.</LI>
      </UL>

      {/* ── Metrics Glossary ── */}
      <H2 id="metrics-glossary">Telemetry & SLA Metrics Reference</H2>
      <FieldTable rows={[
        { field: "Availability (%)",        description: "Percentage of time the circuit maintained active frame forwarding during the measurement window. Evaluated against the 99.99% Polarin SLA target." },
        { field: "Latency RTD (ms)",         description: "Round Trip Delay measured in milliseconds across originating and terminating port endpoints. Essential for latency-sensitive applications." },
        { field: "Flaps",                   description: "Count of physical link up/down transitions. A non-zero flap count indicates physical layer instability, optical attenuation, or fiber disturbances." },
        { field: "Traffic In & Out (Mbps)",  description: "Total ingress and egress throughput transmitted through the interface, sampled at granular 15-minute or 4-hour intervals." },
        { field: "Packets In & Out",        description: "Raw count of Ethernet frames processed by the port hardware. Useful for packet size distribution and traffic burst analysis." },
        { field: "Tickets",                 description: "Support tickets and maintenance notifications mapped against the circuit during the reporting period." },
      ]} />

      <Callout variant="info">
        For live, real-time performance graphs and dynamic bandwidth adjustment on individual connections, visit <PageLink label="VISTA Performance Monitoring" onClick={() => onNavigate?.("vista-overview")} />.
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
