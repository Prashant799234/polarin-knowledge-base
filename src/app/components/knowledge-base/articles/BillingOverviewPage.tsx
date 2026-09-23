import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "core-pillars",        label: "Billing Architecture",      level: 2 as const },
  { id: "metering-models",     label: "How Metering Works",        level: 2 as const },
  { id: "invoicing-lifecycle", label: "Invoice Lifecycle",         level: 2 as const },
  { id: "quick-navigation",    label: "Explore Billing Features" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function BillingOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Billing Overview</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Billing & Finance" color="#0d9488" />
      </div>

      <P>
        Polarin provides transparent, flexible enterprise billing for cloud connectivity and optical networking. Whether you provision predictable fixed monthly circuits or dynamically burst capacity using temporary rate limit add-ons, your costs are tracked in real time.
      </P>

      <Callout variant="tip">
        All billing activities are tied to your verified legal entities. Before ordering services, ensure you have configured at least one <PageLink label="Billing Profile" onClick={() => onNavigate?.("billing-profile")} /> with valid tax registration details.
      </Callout>

      {/* ── Architecture ── */}
      <H2 id="core-pillars">Billing Architecture</H2>
      <P>Polarin billing is built around three foundational pillars:</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, margin: "20px 0" }}>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>1. Billing Profiles</p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Binds legal entities, GSTIN/tax identification numbers, registered business addresses, and primary billing notification contacts to network services.
          </p>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>2. Real-Time Metering</p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Accurately tracks active circuit durations, baseline contracted bandwidth, and temporary rate limit upgrade bursts second-by-second.
          </p>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>3. Central Invoicing</p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Consolidates recurring subscriptions and dynamic usage into itemized monthly tax invoices, complete with downloadable PDF copies and payment receipts.
          </p>
        </div>
      </div>

      {/* ── Metering ── */}
      <H2 id="metering-models">How Metering Works</H2>
      <P>Polarin supports two complementary pricing models designed for modern enterprise connectivity:</P>
      <UL>
        <LI>
          <strong>Fixed Base Subscriptions</strong>:
          Physical Ports and baseline Virtual Connections are billed on a predictable monthly recurring subscription (e.g., a 10 Gbps port or 1 Gbps base VC rate limit). Billing commences only once the circuit transitions to <em>Live</em> status.
        </LI>
        <LI>
          <strong>Dynamic Temporary Add-ons</strong>:
          Need extra bandwidth for unexpected workload spikes, database replication, or seasonal traffic? Scale up your Effective Rate Limit directly via VISTA or the Service Detail page. Temporary add-on bandwidth is metered on an hourly basis and prorated onto your monthly bill.
        </LI>
      </UL>

      <Callout variant="important">
        Subscription charges apply only when your service status is <strong>Live</strong>. While your connection is in <em>Design</em> or <em>Ordered</em> provisioning stages, no billing charges accrue.
      </Callout>

      {/* ── Lifecycle ── */}
      <H2 id="invoicing-lifecycle">Invoice Lifecycle</H2>
      <P>Invoicing follows a predictable monthly schedule:</P>
      <UL>
        <LI><strong>Billing Cycle</strong>: Invoices are generated at the end of each calendar month covering active subscriptions and prorated add-ons.</LI>
        <LI><strong>Direct Delivery</strong>: Generated invoices are emailed automatically to the designated billing contact registered on your Billing Profile.</LI>
        <LI><strong>Portal Access</strong>: Admins and finance users can view, filter, and download historical invoices at any time from the <strong>Invoices</strong> section in the top navigation.</LI>
        <LI><strong>Tax Credits</strong>: Each invoice contains a state-compliant GST breakdown (CGST, SGST, IGST) ensuring seamless Input Tax Credit (ITC) reconciliation.</LI>
      </UL>

      {/* ── Quick Navigation ── */}
      <H2 id="quick-navigation">Explore Billing Features</H2>
      <UL>
        <LI>Learn how to add and verify legal entity tax profiles: <PageLink label="Billing Profile Guide" onClick={() => onNavigate?.("billing-profile")} />.</LI>
        <LI>Learn how dynamic rate limits and bandwidth scaling affect billing: <PageLink label="VISTA Performance & Rate Limits" onClick={() => onNavigate?.("vista-overview")} />.</LI>
        <LI>Review organization profile and authorized signatory requirements: <PageLink label="Organisation Settings" onClick={() => onNavigate?.("org-settings")} />.</LI>
      </UL>
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
