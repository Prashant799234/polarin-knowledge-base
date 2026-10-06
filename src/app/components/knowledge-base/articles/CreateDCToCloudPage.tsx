import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "prerequisites", label: "Before You Begin",    level: 2 as const },
  { id: "end-selection", label: "1. End Selection",    level: 2 as const },
  { id: "configure",     label: "2. Configure Connection", level: 2 as const },
  { id: "add-ons",       label: "3. Add Ons",          level: 2 as const },
  { id: "checkout",      label: "4. Checkout",         level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

const CONFIGURE_FIELDS = [
  { field: "Virtual Connection Name", description: "Must be unique across your organisation. Alphanumeric characters and hyphens only.", required: true },
  { field: "Select Rate Limit", description: "Pick from a list of bandwidth tiers up to your A-End port's available capacity — the dropdown shows exactly how much headroom that port has left.", required: true },
  { field: "Subscription Term", description: "PAYG, Short Term (1–11 months), or Long Term (12–60 months, \"Better savings\").", required: true },
  { field: "Payment Options", description: "No Upfront, Partial Upfront (+5% discount), or All Upfront (+10% discount).", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateDCToCloudPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a DC to Cloud Connection</H1>
      <ArticleMeta>
        <ReadTime minutes={6} />
        <Dot />
        <Tag label="Cloud Connect" color="#0f766e" />
        <Tag label="Cloud" color="#1c808d" />
      </ArticleMeta>

      <P>
        A <strong>DC to Cloud</strong> connection links a port you already have at a Polarin data centre
        directly to a single cloud provider — AWS, GCP, Azure, or Oracle — bypassing the public internet. It's
        the simplest cloud-facing wizard on Polarin: four steps, no Virtual Router required. Connecting two
        clouds to each other instead? See{" "}
        <PageLink label="Create a Cloud to Cloud Connection" onClick={() => onNavigate("cloud-to-cloud-create")} />.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        You need an active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> with spare
        capacity before starting — DC to Cloud attaches to an existing port, it doesn't create one.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="end-selection">1. End Selection</H2>
      <P>
        From <strong>Services</strong>, create a new <strong>DC to Cloud</strong> connection. The wizard's
        progress trail shows four steps: <strong>End Selection → Configure Connection → Add Ons → Checkout</strong>.
      </P>
      <P>
        Pick your <strong>A-End Port</strong> from a searchable list of your existing ports — each row shows its
        status, remaining available capacity, and data centre. No suitable port yet? Click{" "}
        <strong>Create New Port</strong> right from this step. Then pick the <strong>Z-End Cloud Provider</strong>{" "}
        and search for the interconnect location where Polarin peers with it.
      </P>
      <DocImage
        src="/screenshots/dc-to-cloud/01-end-selection.jpg"
        alt="End Selection step showing A-End Port list and Z-End Cloud Provider"
        caption="A-End Port search — each entry shows live status and available capacity"
      />

      {/* ── Step 2 ── */}
      <H2 id="configure">2. Configure Connection</H2>
      <FieldTable rows={CONFIGURE_FIELDS} />
      <DocImage
        src="/screenshots/dc-to-cloud/02-configure-connection.jpg"
        alt="Configure Connection step with rate limit dropdown bounded by available port capacity"
        caption="The Rate Limit dropdown is capped by the A-End port's remaining capacity"
      />

      {/* ── Step 3 ── */}
      <H2 id="add-ons">3. Add Ons</H2>
      <P>
        <strong>VISTA</strong> — Standard (free) or Premium — for real-time monitoring and traffic analytics on
        the connection. See <PageLink label="VISTA for Cloud Connect" onClick={() => onNavigate("vista-vc")} />.
      </P>

      {/* ── Step 4 ── */}
      <H2 id="checkout">4. Checkout</H2>
      <P>
        Review the <strong>Order Summary</strong>: the A-End port's details, then the Connection Details (name,
        rate limit, term) with its own billing profile, plus VISTA if added.
      </P>
      <DocImage
        src="/screenshots/dc-to-cloud/03-checkout.jpg"
        alt="DC to Cloud checkout screen with A-End port details and connection billing profile"
        caption="Order Summary — billing profile value blurred here for privacy"
      />
      <P>Click <strong>Create Connection</strong> to place the order.</P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Need two clouds linked to each other instead? <PageLink label="Create a Cloud to Cloud Connection" onClick={() => onNavigate("cloud-to-cloud-create")} />.</LI>
        <LI>Don't have a port yet? <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
        <LI>Understand the shared service page: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
