import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Products" color="#fd5900" />
      </div>

      <P>
        <strong>Data Centre Interconnect (DCI)</strong> links two or more of your own data centre sites
        together at high bandwidth — purpose-built for the kind of steady, heavy traffic that replication and
        disaster recovery generate, which a general-purpose{" "}
        <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> isn't optimised for.
      </P>

      {/* ── Types ── */}
      <H2 id="types">Wave vs Layer 2</H2>
      <UL>
        <LI><strong>DCI Wave</strong> — an optical-layer connection carrying raw wavelength capacity between sites. The highest bandwidth option, with the least protocol overhead.</LI>
        <LI><strong>DCI Layer 2</strong> — an Ethernet-based connection between sites. Simpler to consume for most applications, at a wider range of bandwidths.</LI>
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
        heavy replication traffic? A <PageLink label="Virtual Connection" onClick={() => onNavigate("vc-overview")} /> is usually the simpler, cheaper fit — reach for DCI when the workload specifically demands it.
      </Callout>

      <P>
        Like every product on Polarin, DCI attaches to a <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> at each end — you'll need one already provisioned at both sites.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to set one up? <PageLink label="Create a Data Centre Interconnect" onClick={() => onNavigate("dci-create")} />.</LI>
        <LI>Not sure DCI is the right fit? <PageLink label="What Is a Virtual Connection?" onClick={() => onNavigate("vc-overview")} /> covers the simpler alternative.</LI>
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
