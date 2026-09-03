import { ArticlePage, H1, H2, P, UL, LI, Callout, FlowDiagram, PageLink } from "../ArticlePage";
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
  { label: "Failed", color: "#dc2626", bg: "#fef2f2", description: "Provisioning couldn't complete — usually inventory or configuration related. Check the service detail page for a reason, or raise a ticket." },
  { label: "Down",   color: "#ea580c", bg: "#fff7ed", description: "A previously live service has lost connectivity. Check the physical layer first (cross-connects, cabling) before assuming a Polarin-side issue." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ServiceStatusPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understanding Service Status</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Service Management" color="#1c808d" />
      </div>

      <P>
        Every product on Polarin — Port, Virtual Router, Cloud Connect, DCI, Internet Exchange — moves through
        the <strong>same three-stage lifecycle</strong> from order to live traffic. Knowing this one pattern
        means you can read the status of any service at a glance, regardless of which product it is.
      </P>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">The Status Lifecycle</H2>

      <FlowDiagram
        stages={[
          { title: "Design",  items: [{ icon: <FileEdit size={16} />, label: "Configured, not ordered" }] },
          { title: "Ordered", items: [{ icon: <ClipboardCheck size={16} />, label: "Order submitted" }] },
          { title: "Live",    items: [{ icon: <CheckCircle2 size={16} />, label: "Active, traffic ready" }] },
        ]}
      />

      <UL>
        <LI><strong>Design</strong> — you've configured the service but haven't placed the order yet. Nothing is provisioned, and nothing is billed.</LI>
        <LI><strong>Ordered</strong> — the order is submitted and provisioning is underway. How long this takes depends on the product and location.</LI>
        <LI><strong>Live</strong> — the service is fully active. Billing starts here, not when you placed the order.</LI>
      </UL>

      <Callout variant="tip">
        A service sitting in <strong>Design</strong> with a "Setup Incomplete" warning just means the order
        hasn't been placed yet — finish and submit it from the service's own detail page.
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

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
