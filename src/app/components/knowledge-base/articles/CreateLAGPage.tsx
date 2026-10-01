import { ArticlePage, H1, H2, P, UL, LI, Callout, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "what-is-lag",    label: "What is a LAG?",      level: 2 as const },
  { id: "prerequisites",  label: "Before You Begin",    level: 2 as const },
  { id: "enable-lag",     label: "Enable LAG on a Port", level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const LAG_FIELDS = [
  { field: "LAG (Link Aggregation Group)", description: "A toggle inside the Configure Port step. Off by default — switch it on to turn this port order into a LAG.", required: true },
  { field: "Member Count & Bandwidth", description: "Once LAG is on, pick from ×1 through ×8 tiles. Each tile is both the number of physical ports bundled and the resulting aggregate bandwidth at the per-port speed you picked (e.g. ×4 on a 1 Gbps port = a 4 Gbps LAG across 4 ports).", required: true },
  { field: "Port Bandwidth", description: "Set once, before the LAG toggle — all member ports in the LAG share this same speed (1, 10, or 100 Gbps).", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateLAGPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Link Aggregation Group</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Core Product" color="#0f766e" />
        <Tag label="Advanced" color="#6366f1" />
      </ArticleMeta>

      <P>
        A <strong>Link Aggregation Group (LAG)</strong> bundles multiple physical ports into a single logical
        connection, giving you higher aggregate bandwidth and built-in redundancy — if one member port fails,
        traffic redistributes across the rest. On Polarin, LAG isn't a separate product with its own wizard:
        it's a toggle inside the{" "}
        <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} /> flow itself.
      </P>

      {/* ── What is LAG ── */}
      <H2 id="what-is-lag">What is a LAG?</H2>
      <P>
        LAG (also known as port channel, or IEEE 802.3ad link aggregation) combines up to 8 physical ports into
        one logical interface. The result is:
      </P>
      <UL>
        <LI><strong>Higher bandwidth</strong> — aggregate speeds across multiple ports (e.g. ×4 on a 10 Gbps port gives a 40 Gbps LAG).</LI>
        <LI><strong>Built-in redundancy</strong> — traffic fails over to surviving ports if one goes down.</LI>
      </UL>

      {/* ── Prerequisites ── */}
      <H2 id="prerequisites">Before You Begin</H2>
      <UL>
        <LI>Your <strong>Organisation Profile</strong> must be verified.</LI>
        <LI>Your edge device must support <strong>IEEE 802.3ad LACP</strong> to actually use the bundled link.</LI>
        <LI>Decide how many member ports you want up front — all of them share the same bandwidth tier and the same physical location.</LI>
      </UL>
      <Callout variant="important">
        The LAG toggle is only available while configuring a port, not after it's already been ordered. Decide
        on your LAG size before you reach the Configure Port step.
      </Callout>

      {/* ── Enable LAG ── */}
      <H2 id="enable-lag">Enable LAG on a Port</H2>
      <P>
        Start a port order exactly as described in{" "}
        <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />: choose a location, then on
        the <strong>Configure Port</strong> step, pick the port's name and bandwidth as usual. Below that sits
        the <strong>LAG (Link Aggregation Group)</strong> toggle — switch it on and a row of ×1–×8 tiles appears.
      </P>
      <FieldTable rows={LAG_FIELDS} />
      <P>
        Everything after that — Add Ons (Cross Connect, VISTA), Subscription Term, Payment Options, and
        Checkout — works exactly the same as a standalone port order. The only difference is the price, which
        scales with the number of member ports.
      </P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Not sure if you need a LAG at all? Start from <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
        <LI>Track the LAG through provisioning the same way as any port: <PageLink label="Understand Port Status" onClick={() => onNavigate("port-status")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
