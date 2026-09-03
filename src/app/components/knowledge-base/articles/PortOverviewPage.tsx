import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",  label: "Overview" },
  { id: "usecases",  label: "What You Build on a Port", level: 2 as const },
  { id: "speeds",    label: "Choosing a Speed",         level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function PortOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is a Port?</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Products" color="#1a65fd" />
      </div>

      <P>
        A <strong>Port</strong> is the physical cable running from your equipment into Polarin's network, at a
        data centre of your choosing. It's the one thing every other Polarin service needs before it can exist
        — nothing routes, connects, or peers without a Port underneath it first.
      </P>

      <P>
        On its own, a Port doesn't do much — it's a foundation, not a destination. What makes it useful is what
        you build on top of it.
      </P>

      {/* ── Use cases ── */}
      <H2 id="usecases">What You Build on a Port</H2>
      <UL>
        <LI><strong>Data centre to data centre</strong> — attach a <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> between two of your Ports to link two sites together at high bandwidth, without leasing dark fibre yourself.</LI>
        <LI><strong>Data centre to cloud</strong> — attach a Virtual Connection from your Port straight into AWS, Azure, or GCP, bypassing the public internet entirely.</LI>
        <LI><strong>Routing between multiple endpoints</strong> — attach a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-overview")} /> to your Port when you need real L3 routing logic between clouds and sites, not just a single point-to-point link.</LI>
        <LI><strong>Site-to-site interconnection at scale</strong> — a <PageLink label="Data Centre Interconnect" onClick={() => onNavigate("dci-overview")} /> service also attaches to a Port, for high-bandwidth links purpose-built for replication and DR traffic.</LI>
      </UL>

      <Callout variant="tip">
        Think of a Port as the socket — Virtual Connection, Virtual Router, and DCI are what you plug into it.
      </Callout>

      {/* ── Speeds ── */}
      <H2 id="speeds">Choosing a Speed</H2>
      <P>Ports come in three speeds. Pick based on your combined bandwidth need across everything you'll run over it:</P>
      <UL>
        <LI><strong>1GE</strong> — small workloads, a single low-bandwidth connection, or dev/test environments.</LI>
        <LI><strong>10GE</strong> — the common choice for a production Virtual Connection or a Virtual Router serving moderate traffic.</LI>
        <LI><strong>100GE</strong> — high-throughput workloads, or when several services will share the same Port.</LI>
      </UL>
      <P>
        Need more than one Port's worth of bandwidth at a single location? Bundle multiple Ports into a{" "}
        <PageLink label="Link Aggregation Group" onClick={() => onNavigate("port-lag")} /> instead of over-provisioning a single Port.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to provision one? <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
        <LI>Already have one? <PageLink label="Understand Port Status" onClick={() => onNavigate("port-status")} />.</LI>
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
