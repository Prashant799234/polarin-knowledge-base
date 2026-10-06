import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "prerequisites",  label: "Before You Begin",      level: 2 as const },
  { id: "models",         label: "Choose a Peering Model", level: 2 as const },
  { id: "steps",          label: "Join the Exchange",      level: 2 as const },
  { id: "after",          label: "After You Order",        level: 2 as const },
  { id: "verify",         label: "Verifying Your Session",  level: 2 as const },
  { id: "troubleshoot",   label: "Troubleshooting",         level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const IX_FIELDS = [
  { field: "Service Name", description: "A unique, identifiable name for this Internet Exchange connection.", required: true },
  { field: "Port",         description: "The Polarin port this IX connection attaches to.", required: true },
  { field: "Bandwidth",    description: "The rate limit for peering traffic.", required: true },
  { field: "ASN",          description: "Your public Autonomous System Number — the identifier other networks use to recognise and peer with you over BGP.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function InternetExchangePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Set Up Internet Exchange</H1>
      <ArticleMeta>
        <ReadTime minutes={7} />
        <Dot />
        <Tag label="Internet Exchange" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Internet Exchange (IX)</strong> connects you to a shared peering fabric at a Polarin location, so
        you can exchange traffic directly with other networks present at that exchange over BGP — instead of
        routing it through a transit provider. Not sure IX is what you need? See{" "}
        <PageLink label="What Is Internet Exchange?" onClick={() => onNavigate("ix-overview")} /> first.
      </P>

      {/* ── Prerequisites ── */}
      <H2 id="prerequisites">Before You Begin</H2>
      <UL>
        <LI>An active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> at a location where Polarin offers Internet Exchange.</LI>
        <LI>Your own public <strong>ASN</strong> — IX peering only works between networks that each run their own autonomous system; you can't peer using someone else's.</LI>
        <LI>The IP prefixes you plan to announce, registered against your ASN in a routing registry (IRR). Most peers' route filters silently drop anything that isn't registered, so this is worth doing before you join, not after.</LI>
      </UL>

      {/* ── Peering models ── */}
      <H2 id="models">Choose a Peering Model</H2>
      <P>Decide this before you configure anything — it shapes how your side needs to be set up:</P>
      <UL>
        <LI><strong>Multilateral (route-server) peering</strong> — a single BGP session to the exchange's route server exchanges routes with every other member on it. The fastest way to pick up broad reach, and where most networks start.</LI>
        <LI><strong>Bilateral peering</strong> — a direct BGP session to one specific network, negotiated one-to-one. Reach for this with a peer who doesn't use the route server, or when you want fine control over exactly what you exchange with that one network.</LI>
      </UL>
      <Callout variant="tip">
        You're not locked into one — most established networks run route-server peering for breadth, plus a
        handful of bilateral sessions for specific peers worth negotiating directly.
      </Callout>

      {/* ── Steps ── */}
      <H2 id="steps">Join the Exchange</H2>
      <Steps>
        <Step num={1} title="Go to Services → Internet Exchange">
          From the left sidebar under <strong>Internet Exchange</strong>, click <strong>Create</strong>.
        </Step>
        <Step num={2} title="Fill in the connection details">
          <FieldTable rows={IX_FIELDS} />
        </Step>
        <Step num={3} title="Review and place the order">
          Check the summary and pricing, accept the terms, and submit.
        </Step>
      </Steps>

      {/* ── After ordering ── */}
      <H2 id="after">After You Order</H2>
      <P>
        Your IX connection follows the same lifecycle every Polarin service does — <strong>Design → Deployment
        in Progress → Live</strong> — see{" "}
        <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} /> for what
        each stage means. Once it's Live, the physical and logical path to the exchange is up — you still need
        to configure and bring up the BGP session itself from your side (below) before you're actually
        exchanging routes with anyone.
      </P>

      {/* ── Verification ── */}
      <H2 id="verify">Verifying Your Session</H2>
      <P>Once you've configured BGP on your router, confirm the session is actually working:</P>
      <UL>
        <LI>Check BGP session state on your own router — it should read <strong>Established</strong>, not stuck in Idle, Connect, or Active.</LI>
        <LI>Confirm you're both sending and receiving prefixes — an Established session with zero received routes usually means a filter somewhere is rejecting everything.</LI>
        <LI>If the exchange offers a <strong>looking glass</strong> tool, use it to see what the route server or a specific peer actually sees from you — the fastest way to confirm your announcements look right from the outside.</LI>
      </UL>

      {/* ── Troubleshooting ── */}
      <H2 id="troubleshoot">Troubleshooting</H2>
      <UL>
        <LI><strong>Session won't come up at all</strong> — double-check the peer IP and your ASN are entered correctly on both sides, and that any BGP MD5 password matches exactly if one's in use.</LI>
        <LI><strong>Session is Established but no routes received</strong> — your prefixes are likely missing from the routing registry (IRR) the route server or peer filters against. Register them and wait for the filter to refresh.</LI>
        <LI><strong>Session flaps repeatedly</strong> — check for a BGP hold-timer mismatch between your router and the other side, or an underlying link issue on the Port carrying the connection.</LI>
        <LI>Still stuck? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} /> with your ASN and the peer or route server you're trying to reach.</LI>
      </UL>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Understand the service page itself: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
        <LI>Track what each status means: <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
