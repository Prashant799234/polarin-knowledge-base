import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "prerequisites",   label: "Before You Begin",   level: 2 as const },
  { id: "router-location", label: "1. Router Location", level: 2 as const },
  { id: "configure-router",label: "2. Configure Router",level: 2 as const },
  { id: "checkout",        label: "3. Checkout",        level: 2 as const },
  { id: "lifecycle",       label: "After You Order",    level: 2 as const },
  { id: "next-steps",      label: "Next Steps" },
];

const CONFIGURE_FIELDS = [
  { field: "Router Name", description: "A name for this router. Must be unique across your organisation — alphanumeric characters and hyphens only.", required: true },
  { field: "Subscription Term", description: "PAYG (Pay as you Go, no fixed term), Short Term (1–11 months), or Long Term (12–60 months, flagged \"Better savings\"). Unlike a Port, a Virtual Router is software-defined, so PAYG is available.", required: true },
  { field: "Payment Options", description: "No Upfront (pay monthly), Partial Upfront (50% now + 50% spread monthly, +5% discount), or All Upfront (pay the full term now, +10% discount).", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateVirtualRouterPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Virtual Router</H1>
      <ArticleMeta>
        <ReadTime minutes={6} />
        <Dot />
        <Tag label="Core Product" color="#0f766e" />
        <Tag label="Layer 3" color="#1c808d" />
      </ArticleMeta>

      <P>
        A <strong>Virtual Router</strong> is Polarin's software-defined Layer 3 gateway — it routes traffic
        between clouds, data centres, and other connections without you deploying any physical hardware. Of the
        six creation wizards on Polarin, this is the simplest: just three steps, and the quickest to provision
        since there's no physical infrastructure to wait on. Not sure a Virtual Router is what you need? See{" "}
        <PageLink label="What Is a Virtual Router?" onClick={() => onNavigate("vr-overview")} /> first.
      </P>

      <Callout variant="important">
        Your <strong>Organisation Profile</strong> must be verified before you can order a Virtual Router. See{" "}
        <PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} /> if
        you haven't done that yet.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="router-location">1. Router Location</H2>
      <P>
        From <strong>Services</strong>, click <strong>Create</strong> next to Virtual Router. The wizard's
        progress trail shows three steps: <strong>Router Location → Configure Router → Checkout</strong>.
      </P>
      <P>
        Search for and select the data centre where you want the router deployed — the list is filterable by
        country, with a live count of available locations per country. This becomes the router's Point of
        Presence (PoP); connections you attach later route through it from here.
      </P>

      {/* ── Step 2 ── */}
      <H2 id="configure-router">2. Configure Router</H2>
      <FieldTable rows={CONFIGURE_FIELDS} />
      <DocImage
        src="/screenshots/virtual-router/01-configure-router.jpg"
        alt="Configure Router step showing Router Name, Subscription Term, and Payment Options"
        caption="Subscription Term includes PAYG — the only one of the six creation wizards where that's true by default alongside Short/Long Term"
      />

      {/* ── Step 3 ── */}
      <H2 id="checkout">3. Checkout</H2>
      <P>
        Pick a <strong>Billing Cycle</strong> (Monthly, Quarterly, or Half Yearly), optionally switch on{" "}
        <strong>Purchase Order</strong> if you want to attach a PO number, then review the{" "}
        <strong>Order Summary</strong> and choose a <strong>Billing Profile</strong>.
      </P>
      <DocImage
        src="/screenshots/virtual-router/02-checkout.jpg"
        alt="Virtual Router checkout screen with billing cycle, purchase order toggle, and order summary"
        caption="Order Summary restates the router's location, name, and term — billing profile value blurred here for privacy"
      />
      <P>Click <strong>Create Virtual Router</strong> to place the order.</P>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">After You Order</H2>
      <P>
        Because a Virtual Router has no physical build-out, it moves through its lifecycle faster than a Port
        or DCI service. Track it from the service's <strong>Track Order</strong> tab:
      </P>
      <UL>
        <LI><strong>Order Details Validated</strong> — your order information has been reviewed.</LI>
        <LI><strong>Deployment in Progress</strong> — the router instance is being provisioned.</LI>
        <LI><strong>Configured</strong> — base configuration is applied.</LI>
        <LI><strong>Router goes Live</strong> — ready to attach connections.</LI>
      </UL>
      <Callout variant="info">
        For a full breakdown of every provisioning state, see{" "}
        <PageLink label="Understand Virtual Router Status" onClick={() => onNavigate("vr-status")} />.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>Once your Virtual Router is live, it's ready to act as the hub for other connections:</P>
      <UL>
        <LI>Attach a cloud-to-cloud link to it: <PageLink label="Create a Cloud to Cloud Connection" onClick={() => onNavigate("cloud-to-cloud-create")} /> — it's selected as a required step in that wizard.</LI>
        <LI>Pair it with a port for L3 reach: <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} />.</LI>
        <LI>Monitor it: see <PageLink label="Alerts & Notifications" onClick={() => onNavigate("notifications")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
