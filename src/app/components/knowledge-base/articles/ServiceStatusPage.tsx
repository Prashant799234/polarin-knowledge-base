import { ArticlePage, H1, H2, P, UL, LI, Callout, FlowDiagram, PageLink, DocImage, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import { FileEdit, ClipboardCheck, CheckCircle2 } from "lucide-react";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "lifecycle",  label: "The Status Lifecycle", level: 2 as const },
  { id: "problem",    label: "Problem States",       level: 2 as const },
  { id: "per-product", label: "Product-Specific Detail", level: 2 as const },
];

interface StatusInfo {
  label: string;
  color: string;
  bg: string;
  description: string;
}

const PROBLEM_STATES: StatusInfo[] = [
  { label: "Down",   color: "#ea580c", bg: "#fff7ed", description: "A previously live service has lost connectivity. Check the physical layer first (cross-connects, cabling) before assuming a Polarin-side issue." },
  { label: "Setup Incomplete", color: "#b45309", bg: "#fff7ed", description: "Shown alongside Design when the order wizard was started but never submitted. Nothing is provisioned or billed — open the service and finish Checkout." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ServiceStatusPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understanding Service Status</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Service Management" color="#0f766e" />
      </ArticleMeta>

      <P>
        Every product on Polarin — Port, Virtual Router, Virtual Connection, DCI, Internet Exchange — shares the
        <strong> same six statuses</strong>, exactly as they appear in any service list's own{" "}
        <strong>Advance Filter</strong> panel: Live, Down, Design, Deployment in Progress, Configured, and
        Deleted. Knowing this one list means you can read the status of any service at a glance, regardless of
        which product it is.
      </P>
      <DocImage
        src="/screenshots/services/06-advance-filter.jpg"
        alt="Advance Filter panel showing the full real status list: Live, Down, Design, Deployment in Progress, Configured, Deleted"
        caption="The exact six statuses, straight from the product's own filter panel"
      />

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">The Status Lifecycle</H2>

      <FlowDiagram
        stages={[
          { title: "Design",  items: [{ icon: <FileEdit size={16} />, label: "Started, not ordered" }] },
          { title: "Deployment in Progress", items: [{ icon: <ClipboardCheck size={16} />, label: "Order placed, provisioning" }] },
          { title: "Live",    items: [{ icon: <CheckCircle2 size={16} />, label: "Active, traffic ready" }] },
        ]}
      />

      <UL>
        <LI><strong>Design</strong> — you've started the service but haven't placed the order yet. Nothing is provisioned, and nothing is billed. A <strong>Setup Incomplete</strong> tag next to it just means the wizard was never finished — open the service and pick up from Checkout.</LI>
        <LI><strong>Deployment in Progress</strong> — the order is submitted and provisioning is underway. Track exactly where it's at on the service's <PageLink label="Track Order" onClick={() => onNavigate("service-detail")} /> tab. If your organisation issues Purchase Orders, a <strong>Purchase Order Required</strong> step appears here too, with a deadline — provisioning won't continue past it until PO details are added. For a Port specifically, this stage is followed by its own <strong>Ready to Patch</strong> step while Lightstorm arranges the physical cross-connect.</LI>
        <LI><strong>Configured</strong> — specific to Virtual Router: provisioning has completed and configuration is applied, but final activation is still in progress.</LI>
        <LI><strong>Live</strong> — the service is fully active. Billing starts here, not when you placed the order.</LI>
        <LI><strong>Down</strong> — a previously live service has lost connectivity. Check the physical layer first (cross-connects, cabling) before assuming a Polarin-side issue.</LI>
        <LI><strong>Deleted</strong> — the service has been decommissioned and moved to Archived Services.</LI>
      </UL>

      <Callout variant="tip">
        These are exactly the statuses you can filter by from any service list's <strong>Advance Filter</strong> panel — useful when you need to find, say, every service still in Deployment in Progress across your whole account.
      </Callout>

      {/* ── Problem states ── */}
      <H2 id="problem">Problem States</H2>
      <P>Outside the normal lifecycle, two states signal something needs attention:</P>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {PROBLEM_STATES.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
              color: s.color, fontFamily: FONT_J, fontWeight: 800, fontSize: 12,
              background: "#fff", border: `1px solid ${s.color}40`, borderRadius: 20, padding: "3px 10px",
            }}>
              {s.label}
            </span>
            <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.6 }}>{s.description}</p>
          </div>
        ))}
      </div>

      <P>
        Either state unresolved after checking the basics? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} /> with the service ID — it's on every service's detail page, next to its name.
      </P>

      {/* ── Per-product detail ── */}
      <H2 id="per-product">Product-Specific Detail</H2>
      <P>
        The lifecycle above applies everywhere, but a couple of products have extra nuance worth knowing in
        full:
      </P>
      <UL>
        <LI><PageLink label="Understand Port Status" onClick={() => onNavigate("port-status")} /> — the exact sequence a Port order goes through, including "Ready to Patch."</LI>
        <LI><PageLink label="Understand Virtual Router Status" onClick={() => onNavigate("vr-status")} /> — provisioning states specific to Virtual Router.</LI>
      </UL>
    </ArticlePage>
  );
}

