import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "types",      label: "Wave vs Layer 2",   level: 2 as const },
  { id: "usecases",   label: "What It's For",      level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function DCIOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is Data Centre Interconnect?</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Data Centre Interconnect" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Data Centre Interconnect (DCI)</strong> links two or more of your own data centre sites
        together at high bandwidth — purpose-built for the kind of steady, heavy traffic that replication and
        disaster recovery generate, which a general-purpose{" "}
        <PageLink label="Cloud Connect" onClick={() => onNavigate("vc-overview")} /> isn't optimised for.
      </P>

      {/* ── Types ── */}
      <H2 id="types">Wave vs Layer 2</H2>
      <UL>
        <LI><strong>DCI Wave</strong> — an optical (Layer 1) connection carrying dedicated wavelength capacity between two entire data centre <em>sites</em>, not two ports. The highest bandwidth option, built to order.</LI>
        <LI><strong>DCI Layer 2</strong> — an Ethernet connection between two <PageLink label="Ports" onClick={() => onNavigate("port-overview")} /> you already own. Simpler to consume for most applications, and faster to provision since it reuses infrastructure you already have.</LI>
      </UL>

      {/* ── Use cases ── */}
      <H2 id="usecases">What It's For</H2>
      <UL>
        <LI><strong>Storage replication</strong> — keep data synchronised between a primary and secondary site with the bandwidth and consistency replication needs.</LI>
        <LI><strong>Disaster recovery</strong> — maintain a standby site that can take over quickly, connected with enough capacity to stay genuinely in sync.</LI>
        <LI><strong>Extending a network across sites</strong> — treat two or more data centres as one extended Layer 2 domain rather than separate networks.</LI>
      </UL>

      <Callout variant="tip">
        Just need to reach a single cloud provider, or link two sites for general connectivity rather than
        heavy replication traffic? A <PageLink label="Cloud Connect" onClick={() => onNavigate("vc-overview")} /> is usually the simpler, cheaper fit — reach for DCI when the workload specifically demands it.
      </Callout>

      <P>
        DCI Layer 2 attaches to a <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> at each end, so you'll need one already provisioned at both sites. DCI Wave is the exception — it connects two data centre sites directly, with no Port involved on either end.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to set one up? <PageLink label="Create a Data Centre Interconnect" onClick={() => onNavigate("dci-create")} />.</LI>
        <LI>Not sure DCI is the right fit? <PageLink label="What Is Cloud Connect?" onClick={() => onNavigate("vc-overview")} /> covers the simpler alternative.</LI>
      </UL>
    </ArticlePage>
  );
}
