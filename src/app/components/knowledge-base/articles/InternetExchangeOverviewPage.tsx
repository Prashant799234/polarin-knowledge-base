import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, FieldTable, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "usecases",   label: "Why Peer Instead of Transit", level: 2 as const },
  { id: "models",     label: "Two Ways to Peer",            level: 2 as const },
  { id: "need",       label: "What You'll Need",            level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const MODEL_FIELDS = [
  { field: "Multilateral (route-server) peering", description: "One BGP session to the exchange's route server exchanges routes with every other participant who's also on it. Fastest way to pick up a lot of peers at once — the default most networks start with.", required: false },
  { field: "Bilateral peering", description: "A direct BGP session to one specific network, negotiated one-to-one. Use it for a peer who doesn't participate in the route server, or when you want to control exactly which routes you exchange with that one network.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function InternetExchangeOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is Internet Exchange?</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Internet Exchange" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Internet Exchange (IX)</strong> connects your Port to Polarin's peering fabric — a shared point
        where many networks meet to exchange traffic directly with each other over BGP, instead of routing it
        through an upstream transit provider.
      </P>

      <P>
        Join once, and you can peer with every other network on the exchange over that single connection —
        content providers, cloud on-ramps, ISPs — rather than negotiating and provisioning a separate link to
        each one.
      </P>

      {/* ── Use cases ── */}
      <H2 id="usecases">Why Peer Instead of Transit</H2>
      <UL>
        <LI><strong>Lower transit costs</strong> — traffic exchanged directly over IX doesn't run up your paid transit bill.</LI>
        <LI><strong>Lower latency</strong> — a direct hop to the destination network beats a multi-hop path through transit providers.</LI>
        <LI><strong>More resilience</strong> — peering gives you an additional path to reach popular destinations, reducing reliance on any single upstream provider.</LI>
      </UL>

      <Callout variant="tip">
        IX is about reaching other networks broadly through shared peering — if you need a dedicated, private
        link to one specific cloud or site instead, that's what a{" "}
        <PageLink label="Cloud Connect" onClick={() => onNavigate("vc-overview")} /> is for.
      </Callout>

      {/* ── Peering models ── */}
      <H2 id="models">Two Ways to Peer</H2>
      <P>Every Internet Exchange, Polarin's included, works one of two ways once you're connected:</P>
      <FieldTable rows={MODEL_FIELDS} />
      <P>
        Most networks run both at once: route-server peering for broad reach with minimal setup, plus a handful
        of bilateral sessions for specific peers that matter enough to negotiate directly.
      </P>

      {/* ── What you'll need ── */}
      <H2 id="need">What You'll Need</H2>
      <UL>
        <LI>A <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> already provisioned at a location where Polarin offers Internet Exchange.</LI>
        <LI>Your own public <strong>ASN (Autonomous System Number)</strong> — the identifier your network uses to speak BGP.</LI>
        <LI>The IP prefixes you intend to announce, registered against your ASN in a routing registry (IRR) so other networks' filters accept them.</LI>
      </UL>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to join? <PageLink label="Set Up Internet Exchange" onClick={() => onNavigate("ix-create")} />.</LI>
        <LI>Need a private link instead? <PageLink label="What Is Cloud Connect?" onClick={() => onNavigate("vc-overview")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
