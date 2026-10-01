import { ArticlePage, H1, H2, P, UL, LI, Callout, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "compare",    label: "DCI Wave vs. DCI Layer 2", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const COMPARE_FIELDS = [
  { field: "DCI Layer 2", description: "Ethernet connection between two of your existing Ports. Faster to provision since it reuses infrastructure you already have. Supports MACSec encryption, VLAN tagging (Tagged / Untagged / Trunk), and a lighter-weight \"DCI Lite\" class for non-critical apps.", required: false },
  { field: "DCI Wave", description: "Dedicated optical (Layer 1) wavelength circuits between two entire data centre sites — not ports. Built to order (~2 weeks setup), with Rate Limit tiers up to 400 Gbps, multiple circuits per order, and an optional Bit Error Rate Test before handover.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function DCICreatePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Data Centre Interconnect</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Data Centre Interconnect" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Data Centre Interconnect (DCI)</strong> links two of your sites together at high bandwidth —
        useful for replication, disaster recovery, or treating multiple sites as one extended network. On
        Polarin, it comes in two distinct forms with their own dedicated wizards. Not sure DCI is what you need
        at all? See <PageLink label="What Is Data Centre Interconnect?" onClick={() => onNavigate("dci-overview")} /> first.
      </P>

      <H2 id="compare">DCI Wave vs. DCI Layer 2</H2>
      <FieldTable rows={COMPARE_FIELDS} />
      <Callout variant="tip">
        Rule of thumb: if you already have ports at both ends and want an Ethernet link between them, use{" "}
        <strong>DCI Layer 2</strong>. If you need dedicated, very high-throughput optical capacity between two
        sites — and you're fine with a short, scheduled build-out — use <strong>DCI Wave</strong>.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI><PageLink label="Create a DCI Layer 2 Connection" onClick={() => onNavigate("dci-layer2-create")} /> — Ethernet, port-to-port.</LI>
        <LI><PageLink label="Create a DCI Wave Connection" onClick={() => onNavigate("dci-wave-create")} /> — optical, site-to-site.</LI>
        <LI>Already have a port at both ends? Confirm with <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
