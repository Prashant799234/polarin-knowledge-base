import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "usecases",   label: "Why Peer Instead of Transit", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function InternetExchangeOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is Internet Exchange?</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="Products" color="#0aa6c2" />
      </div>

      <P>
        <strong>Internet Exchange (IX)</strong> connects your Port to Polarin's peering fabric — a shared point
        where many networks meet to exchange traffic directly with each other, instead of routing it through an
        upstream transit provider.
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
        <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> is for.
      </Callout>

      <P>
        Like every product on Polarin, IX attaches to a <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> — provision that first if you don't already have one at the location you need.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to join? <PageLink label="Set Up Internet Exchange" onClick={() => onNavigate("ix-create")} />.</LI>
        <LI>Need a private link instead? <PageLink label="What Is a Virtual Connection?" onClick={() => onNavigate("vc-overview")} />.</LI>
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
