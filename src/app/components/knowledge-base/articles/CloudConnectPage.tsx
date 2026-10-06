import { ArticlePage, H1, H2, P, UL, LI, Callout, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "prerequisites", label: "Before You Begin", level: 2 as const },
  { id: "steps",         label: "How It Works",     level: 2 as const },
  { id: "compare",       label: "Not What You Need?", level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

const COMPARE_FIELDS = [
  { field: "DC to DC", description: "A private link between two of your own ports at different Polarin data centres. This page.", required: false },
  { field: "DC to Cloud", description: "A port you own linked directly to a single cloud provider (AWS, GCP, Azure, or Oracle).", required: false },
  { field: "Cloud to Cloud", description: "Two cloud providers linked to each other through a Virtual Router — no port required at either end.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CloudConnectPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a DC to DC Connection</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Cloud Connect" color="#0f766e" />
      </ArticleMeta>

      <P>
        A <strong>DC to DC</strong> connection links two of your own ports at different Polarin data centres —
        a private, point-to-point Virtual Connection that bypasses the public internet for lower latency and
        more predictable performance than a VPN. Not sure a Virtual Connection is the right product at all? See{" "}
        <PageLink label="What Is a Virtual Connection?" onClick={() => onNavigate("vc-overview")} /> first.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        You need an active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> at both ends
        before starting — a Virtual Connection attaches to existing ports, it doesn't create them.
      </Callout>

      <H2 id="steps">How It Works</H2>
      <P>
        It follows the same wizard pattern as the other Cloud Connect flows: select your{" "}
        <strong>A-End Port</strong> and <strong>Z-End Port</strong>, configure a name, rate limit, and
        subscription term, add VISTA if you want telemetry, then check out against a billing profile.
      </P>
      <Callout variant="tip">
        If what you actually need is very high, dedicated bandwidth between two sites rather than a standard
        point-to-point link, compare this against{" "}
        <PageLink label="Create a DCI Layer 2 Connection" onClick={() => onNavigate("dci-layer2-create")} /> and{" "}
        <PageLink label="Create a DCI Wave Connection" onClick={() => onNavigate("dci-wave-create")} /> — DC to
        DC and DCI Layer 2 both connect two ports, but DCI is purpose-built for steady, heavy replication
        traffic rather than general-purpose connectivity.
      </Callout>

      <H2 id="compare">Not What You Need?</H2>
      <P>Cloud Connect covers three distinct wizards depending on what's on each end:</P>
      <FieldTable rows={COMPARE_FIELDS} />
      <UL>
        <LI><PageLink label="Create a DC to Cloud Connection" onClick={() => onNavigate("dc-to-cloud-create")} /> — one port, one cloud provider.</LI>
        <LI><PageLink label="Create a Cloud to Cloud Connection" onClick={() => onNavigate("cloud-to-cloud-create")} /> — two cloud providers via a Virtual Router.</LI>
      </UL>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Understand the shared service page: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
        <LI>Something not working as expected? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
