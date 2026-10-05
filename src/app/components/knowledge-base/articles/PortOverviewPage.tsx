import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
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
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Core Product" color="#0f766e" />
      </ArticleMeta>

      <P>
        A <strong>Port</strong> is the physical cable running from your equipment into Polarin's network, at a
        data centre of your choosing. It's what most other Port-based services need before they can exist — a{" "}
        <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> or a{" "}
        <PageLink label="DCI Layer 2" onClick={() => onNavigate("dci-layer2-create")} /> link attaches to a Port
        you've already provisioned. A <PageLink label="Virtual Router" onClick={() => onNavigate("vr-overview")} />{" "}
        is the one exception — it's deployed directly at a location, with no Port required underneath it.
      </P>

      <P>
        On its own, a Port doesn't do much — it's a foundation, not a destination. What makes it useful is what
        you build on top of it.
      </P>

      {/* ── Use cases ── */}
      <H2 id="usecases">What You Build on a Port</H2>
      <UL>
        <LI><strong>Data centre to data centre</strong> — attach a <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> or a <PageLink label="DCI Layer 2" onClick={() => onNavigate("dci-layer2-create")} /> link between two of your Ports to link two sites together at high bandwidth, without leasing dark fibre yourself.</LI>
        <LI><strong>Data centre to cloud</strong> — attach a <PageLink label="DC to Cloud connection" onClick={() => onNavigate("dc-to-cloud-create")} /> from your Port straight into AWS, Azure, GCP, or Oracle, bypassing the public internet entirely.</LI>
        <LI><strong>Site-to-site interconnection at scale</strong> — a <PageLink label="DCI Layer 2" onClick={() => onNavigate("dci-layer2-create")} /> service also attaches to a Port, for Ethernet links purpose-built for replication and DR traffic. (DCI Wave is the one DCI type that connects whole data centre sites instead — no Port needed.)</LI>
      </UL>

      <Callout variant="tip">
        Think of a Port as the socket — Virtual Connection and DCI Layer 2 are what you plug into it. Virtual
        Router and DCI Wave are the two products on Polarin that <em>don't</em> need one.
      </Callout>

      {/* ── Speeds ── */}
      <H2 id="speeds">Choosing a Speed</H2>
      <P>Ports come in three bandwidth tiers. Pick based on your combined bandwidth need across everything you'll run over it — only the tiers your chosen data centre actually has capacity for will be selectable when you order:</P>
      <UL>
        <LI><strong>1 Gbps</strong> — small workloads, a single low-bandwidth connection, or dev/test environments.</LI>
        <LI><strong>10 Gbps</strong> — the common choice for a production Virtual Connection serving moderate traffic.</LI>
        <LI><strong>100 Gbps</strong> — high-throughput workloads, or when several services will share the same Port.</LI>
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
