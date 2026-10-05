import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "usecases",   label: "When You Need One", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function VirtualRouterOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is a Virtual Router?</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Core Product" color="#0f766e" />
      </ArticleMeta>

      <P>
        A <strong>Virtual Router</strong> is a software-based Layer 3 router that sits on Polarin's network,
        giving you real routing logic between multiple clouds, data centres, and partner networks — without
        buying, racking, or maintaining physical routing hardware yourself.
      </P>

      <P>
        A single <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> only ever links two points together. A Virtual Router is what you reach for once
        you need more than that — multiple endpoints, route-based traffic decisions, and one place to manage all
        of it.
      </P>

      {/* ── Use cases ── */}
      <H2 id="usecases">When You Need One</H2>
      <UL>
        <LI><strong>Multi-cloud connectivity</strong> — route between AWS, Azure, and GCP from a single logical router, instead of managing separate point-to-point links for each.</LI>
        <LI><strong>Hub-and-spoke architectures</strong> — connect several data centres or offices through one central routing point rather than a full mesh of individual connections.</LI>
        <LI><strong>Traffic engineering</strong> — apply route preferences and policies across your connections instead of relying on whatever path a simple connection happens to take.</LI>
      </UL>

      <Callout variant="tip">
        Still just connecting two points, like one data centre to one cloud region? A plain{" "}
        <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> is simpler and usually all you need — reach for a Virtual Router when the topology genuinely needs routing logic.
      </Callout>

      <P>
        Unlike a Virtual Connection or DCI Layer 2, a Virtual Router doesn't attach to an existing{" "}
        <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> — it's software-defined, deployed
        directly at the data centre location you choose. No pre-provisioned Port is required before you start.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to provision one? <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} />.</LI>
        <LI>Already have one? <PageLink label="Understand Virtual Router Status" onClick={() => onNavigate("vr-status")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
