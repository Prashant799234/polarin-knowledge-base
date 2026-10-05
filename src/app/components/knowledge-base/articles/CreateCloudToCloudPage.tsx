import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "prerequisites",   label: "Before You Begin",        level: 2 as const },
  { id: "cloud-selection", label: "1. Cloud Selection",      level: 2 as const },
  { id: "select-vr",       label: "2. Select Virtual Router", level: 2 as const },
  { id: "configure",       label: "3. Configure Connection",  level: 2 as const },
  { id: "add-ons",         label: "4. Add Ons",               level: 2 as const },
  { id: "checkout",        label: "5. Checkout",              level: 2 as const },
  { id: "next-steps",      label: "Next Steps" },
];

const CLOUD_FIELDS = [
  { field: "Cloud Provider (A-End and Z-End)", description: "Pick one of GCP, AWS, Azure, or Oracle for each end — the two ends don't have to be the same provider.", required: true },
  { field: "Select Interconnect Location", description: "The data centre where Polarin peers with that cloud provider's network, shown with the provider's own interconnect/exchange name.", required: true },
  { field: "Pairing Key", description: "The key your cloud provider's console gives you for this interconnection, entered per end so Polarin can complete the peering handshake on its side.", required: true },
];

const CONFIGURE_FIELDS = [
  { field: "Connection Name", description: "Must be unique across your organisation. Alphanumeric characters and hyphens only.", required: true },
  { field: "Rate Limit", description: "The bandwidth for this connection, bounded by what the attached Virtual Router has available.", required: true },
  { field: "Subscription Term", description: "PAYG, Short Term (1–11 months), or Long Term (12–60 months, \"Better savings\").", required: true },
  { field: "Payment Options", description: "No Upfront, Partial Upfront (+5% discount), or All Upfront (+10% discount).", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateCloudToCloudPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Cloud to Cloud Connection</H1>
      <ArticleMeta>
        <ReadTime minutes={7} />
        <Dot />
        <Tag label="Virtual Connection" color="#0f766e" />
        <Tag label="Cloud" color="#1c808d" />
      </ArticleMeta>

      <P>
        A <strong>Cloud to Cloud</strong> connection links two cloud providers directly through the Polarin
        backbone — useful for multi-cloud replication, or routing between workloads that live in, say, AWS and
        GCP without that traffic ever touching the public internet. It's the only one of the six creation
        wizards that routes through a <strong>Virtual Router</strong> as a required middle step. Need a link
        between a data centre port and a single cloud instead? See{" "}
        <PageLink label="Create a DC to Cloud Connection" onClick={() => onNavigate("dc-to-cloud-create")} />.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        You need a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-create")} /> — existing or
        created inline during this wizard — plus a <strong>Pairing Key</strong> from each cloud provider's own
        console before you start.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="cloud-selection">1. Cloud Selection</H2>
      <P>
        From <strong>Services</strong>, create a new <strong>Cloud to Cloud</strong> connection. The wizard's
        progress trail shows five steps — the most of any creation flow on Polarin:{" "}
        <strong>Cloud Selection → Select Virtual Router → Configure Connection → Add Ons → Checkout</strong>.
      </P>
      <FieldTable rows={CLOUD_FIELDS} />
      <DocImage
        src="/screenshots/cloud-to-cloud/01-cloud-selection.jpg"
        alt="Cloud Selection step showing A-End and Z-End cloud provider pickers with interconnect location and pairing key"
        caption="Provider icon picker, interconnect location search, and Pairing Key — repeated for both A-End and Z-End"
      />

      {/* ── Step 2 ── */}
      <H2 id="select-vr">2. Select Virtual Router</H2>
      <P>
        Pick an existing Virtual Router from a searchable list (filterable by data centre, city, state, country,
        or provider) — each entry shows its status (Live or Design) and, for ones still in Design, its speed and
        remaining available capacity. Don't have a suitable one yet? Click{" "}
        <strong>Create New Virtual Router</strong> right from this step without leaving the wizard.
      </P>
      <DocImage
        src="/screenshots/cloud-to-cloud/02-select-virtual-router.jpg"
        alt="Select Virtual Router step with a searchable list of existing routers"
        caption="Existing Virtual Routers, with live status and capacity shown inline"
      />

      {/* ── Step 3 ── */}
      <H2 id="configure">3. Configure Connection</H2>
      <P>Same pattern as every other wizard's Configure step, applied here to the connection itself:</P>
      <FieldTable rows={CONFIGURE_FIELDS} />

      {/* ── Step 4 ── */}
      <H2 id="add-ons">4. Add Ons</H2>
      <P>
        <strong>VISTA</strong> — Standard (free) or Premium — for real-time monitoring and traffic analytics on
        the connection. See <PageLink label="VISTA for Virtual Connection" onClick={() => onNavigate("vista-vc")} />.
      </P>

      {/* ── Step 5 ── */}
      <H2 id="checkout">5. Checkout</H2>
      <P>
        Because a Cloud to Cloud connection is really two cloud legs riding over one Virtual Router, the Order
        Summary bills them separately: the <strong>Virtual Router</strong> itself (with its own billing profile),
        then <strong>Connection Details 1</strong> and <strong>Connection Details 2</strong> — one per leg —
        each with its own billing profile, plus VISTA if added, priced per circuit.
      </P>
      <DocImage
        src="/screenshots/cloud-to-cloud/03-checkout.jpg"
        alt="Cloud to Cloud checkout screen with Virtual Router and two Connection Details billing profiles"
        caption="Three separate billing profiles: the Virtual Router and each of the two connection legs — values blurred here for privacy"
      />
      <P>Click <strong>Create Connection</strong> to place the order.</P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Connecting a data centre to a single cloud instead? <PageLink label="Create a DC to Cloud Connection" onClick={() => onNavigate("dc-to-cloud-create")} />.</LI>
        <LI>Need a new Virtual Router first? <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} />.</LI>
        <LI>Understand the shared service page: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
