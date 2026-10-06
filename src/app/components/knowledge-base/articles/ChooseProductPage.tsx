import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, FieldTable, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "decision",   label: "Which Product Do I Need?", level: 2 as const },
  { id: "need-port",  label: "Do I Need a Port First?",  level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const DECISION_FIELDS = [
  { field: "Port", description: "You have equipment at (or access to) a data centre and need a physical cable into Polarin's network. Everything Port-based builds on top of this.", required: false },
  { field: "Virtual Router", description: "You need real Layer 3 routing logic between multiple clouds, data centres, or partner networks — not just one link, but several managed from one place. No Port required.", required: false },
  { field: "Cloud Connect — DC to DC", description: "You own ports at two Polarin data centres and want a private, point-to-point link between them.", required: false },
  { field: "Cloud Connect — DC to Cloud", description: "You own a port and want to reach a single cloud provider (AWS, GCP, Azure, Oracle) directly, bypassing the public internet.", required: false },
  { field: "Cloud Connect — Cloud to Cloud", description: "You need two cloud providers linked to each other, with no port on either end — routed through a Virtual Router instead.", required: false },
  { field: "DCI Layer 2", description: "You own ports at two sites and need an Ethernet link purpose-built for steady, heavy traffic — replication or disaster recovery — rather than general connectivity.", required: false },
  { field: "DCI Wave", description: "You need dedicated, very high-throughput optical capacity between two entire data centre sites (not ports), and can accept a short, scheduled build-out.", required: false },
  { field: "Internet Exchange", description: "You want to peer directly with other networks at a Polarin location instead of paying a transit provider for that traffic.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ChooseProductPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Choosing the Right Product</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Get Started" color="#0f766e" />
      </ArticleMeta>

      <P>
        Polarin has six ways to order connectivity, across four product families. If you already know which one
        you need, jump straight to its creation guide from the sidebar. If not, this page is the fast way to find
        the right starting point before you read the detailed guide for it.
      </P>

      <H2 id="decision">Which Product Do I Need?</H2>
      <FieldTable rows={DECISION_FIELDS} />

      <Callout variant="tip">
        Rule of thumb: if you're connecting more than two things, or need routing decisions made between them, it's
        a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-overview")} /> question. If you're
        linking exactly two things together, it's a{" "}
        <PageLink label="Cloud Connect" onClick={() => onNavigate("vc-overview")} /> or{" "}
        <PageLink label="Data Centre Interconnect" onClick={() => onNavigate("dci-overview")} /> question — and
        DCI is for when that link specifically needs to carry heavy, steady replication-grade traffic rather than
        general-purpose connectivity.
      </Callout>

      <H2 id="need-port">Do I Need a Port First?</H2>
      <P>
        Most products on Polarin attach to a <PageLink label="Port" onClick={() => onNavigate("port-overview")} />{" "}
        you've already provisioned — but two don't:
      </P>
      <UL>
        <LI><strong>Virtual Router</strong> is software-defined and deployed directly at a location — no Port needed underneath it.</LI>
        <LI><strong>DCI Wave</strong> connects two entire data centre sites directly — also no Port needed.</LI>
        <LI><strong>Cloud to Cloud</strong> needs a Virtual Router instead of a Port on either end.</LI>
      </UL>
      <P>
        Everything else — DCI Layer 2, DC to DC, DC to Cloud, and Internet Exchange — needs a Port already live at
        the Polarin end before you start.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Need a Port first? <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
        <LI>Ready for routing logic? <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} />.</LI>
        <LI>Linking two sites or a cloud? <PageLink label="Create a DC to DC Connection" onClick={() => onNavigate("cloud-connect")} />.</LI>
        <LI>Need high-bandwidth site interconnect? <PageLink label="Create a Data Centre Interconnect" onClick={() => onNavigate("dci-create")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
