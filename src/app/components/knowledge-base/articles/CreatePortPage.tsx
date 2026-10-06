import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "prerequisites",  label: "Before You Begin",      level: 2 as const },
  { id: "start",          label: "Start the Wizard",      level: 2 as const },
  { id: "port-location",  label: "1. Port Location",      level: 2 as const },
  { id: "configure-port", label: "2. Configure Port",     level: 2 as const },
  { id: "add-ons",        label: "3. Add Ons",            level: 2 as const },
  { id: "checkout",       label: "4. Checkout",           level: 2 as const },
  { id: "lifecycle",      label: "After You Order",       level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const CONFIGURE_FIELDS = [
  { field: "Port Name", description: "A name for this port. Must be unique across your organisation — alphanumeric characters and hyphens only.", required: true },
  { field: "Port Bandwidth", description: "1 Gbps, 10 Gbps, or 100 Gbps. Only the tiers the selected data centre actually has capacity for are selectable — the rest are shown greyed out and marked \"Not Available\".", required: true },
  { field: "LAG (Link Aggregation Group)", description: "A toggle, off by default. Switch it on to bundle 2–8 physical ports into one logical link for higher aggregate bandwidth and redundancy — see Create a Link Aggregation Group for the full picture.", required: false },
  { field: "Subscription Term", description: "Short Term (pick anywhere from 1–11 months) or Long Term (12–60 months, flagged \"Better savings\"). There's no pay‑as‑you‑go option for a Port — it's physical infrastructure, so a term is always required.", required: true },
  { field: "Payment Options", description: "No Upfront (pay monthly), Partial Upfront (50% now + 50% spread monthly, +5% discount), or All Upfront (pay the full term now, +10% discount).", required: true },
];

const CHECKOUT_FIELDS = [
  { field: "Billing Cycle", description: "How often invoices are raised for this port: Monthly, Quarterly (every 3 months), or Half Yearly (every 6 months). This only controls invoice frequency, not the subscription term itself.", required: true },
  { field: "Purchase Order (Optional)", description: "Off by default if your organisation hasn't marked POs as mandatory in Organisation Settings. Switch it on to attach a PO number — billing will otherwise be generated from your signed order form.", required: false },
  { field: "Billing Profile", description: "Which of your billing entities this port is billed to. Pick an existing one from the dropdown or click Add Billing Profile to create one without leaving the wizard.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreatePortPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Port</H1>
      <ArticleMeta>
        <ReadTime minutes={8} />
        <Dot />
        <Tag label="Core Product" color="#0f766e" />
      </ArticleMeta>

      <P>
        A <strong>Port</strong> is the physical point of connection between your equipment and the Polarin
        network at one of our data centre locations. It's the foundation almost everything else builds on —
        a <PageLink label="Cloud Connect" onClick={() => onNavigate("vc-overview")} />, a{" "}
        <PageLink label="Data Centre Interconnect" onClick={() => onNavigate("dci-overview")} />, and a{" "}
        <PageLink label="DC to Cloud connection" onClick={() => onNavigate("dc-to-cloud-create")} /> all
        attach to a Port you've already created. Not sure if a Port is what you need first? See{" "}
        <PageLink label="What Is a Port?" onClick={() => onNavigate("port-overview")} />.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        Your <strong>Organisation Profile</strong> must be verified before you can order a Port. If you haven't
        completed that yet, start at{" "}
        <PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} />.
      </Callout>

      <H2 id="start">Start the Wizard</H2>
      <P>
        From <strong>Services</strong>, click <strong>Create</strong> next to Port (or <strong>+Create</strong> →{" "}
        <strong>Create a Port</strong> if you already have services). The wizard runs through four steps shown
        as a progress trail at the top: <strong>Port Location → Configure Port → Add Ons → Checkout</strong>.
      </P>

      {/* ── Step 1 ── */}
      <H2 id="port-location">1. Port Location</H2>
      <P>
        Search for and select the data centre where you want the port physically provisioned — by data centre
        name, city, state, country, or provider. This choice is permanent and determines which bandwidth tiers
        are available in the next step, since it depends on actual capacity at that facility.
      </P>

      {/* ── Step 2 ── */}
      <H2 id="configure-port">2. Configure Port</H2>
      <P>
        This is where most of the decisions happen. Give the port a name, pick its bandwidth, optionally turn
        it into a LAG, and choose how you want to pay for it.
      </P>
      <FieldTable rows={CONFIGURE_FIELDS} />
      <DocImage
        src="/screenshots/ports/01-configure-port.jpg"
        alt="Configure Port step showing Port Bandwidth, LAG toggle, Subscription Term, and Payment Options"
        caption="Port Bandwidth tiles, the LAG toggle with its ×1–×8 port multiplier, Subscription Term, and Payment Options"
      />
      <P>
        Turning <strong>LAG</strong> on reveals a row of ×1 through ×8 tiles — each one is both the number of
        physical ports bundled together <em>and</em> the resulting aggregate bandwidth at your chosen per-port
        speed (so ×4 on a 1 Gbps port gives you a 4 Gbps LAG across 4 physical ports). This is the same LAG
        your device needs to run <strong>IEEE 802.3ad LACP</strong> to use — see{" "}
        <PageLink label="Create a Link Aggregation Group" onClick={() => onNavigate("port-lag")} /> for the full
        detail on member-port rules.
      </P>

      {/* ── Step 3 ── */}
      <H2 id="add-ons">3. Add Ons</H2>
      <P>
        Two optional add-ons can attach to a Port at order time:
      </P>
      <UL>
        <LI>
          <strong>Cross Connect</strong> — "Let Lightstorm set up your physical cross connect" (badged Faster
          delivery / End-to-end managed). Choose <strong>I have the LOA file</strong> and upload your Letter of
          Authorization (PDF, JPG, or PNG, up to 5 MB), or <strong>I will enter the details manually</strong> if
          you'd rather arrange it yourself at your data centre operator. It's billed as part of the port's own
          billing profile — no separate line item to manage.
        </LI>
        <LI>
          <strong>VISTA</strong> — Polarin's network intelligence add-on. For a Port, the <strong>VISTA Premium
          package is included by default at no extra cost</strong> — there's no separate Standard/Premium choice
          to make here. Click <strong>View Benefits</strong> to expand the full feature list. See{" "}
          <PageLink label="VISTA for Port" onClick={() => onNavigate("vista-port")} /> for what each metric
          actually shows you.
        </LI>
      </UL>
      <DocImage
        src="/screenshots/ports/02-add-ons.jpg"
        alt="Add Ons step with Cross Connect LOA upload and VISTA included by default"
        caption="Cross Connect's LOA upload, and VISTA Premium included free with every port"
      />

      {/* ── Step 4 ── */}
      <H2 id="checkout">4. Checkout</H2>
      <FieldTable rows={CHECKOUT_FIELDS} />
      <DocImage
        src="/screenshots/ports/03-checkout.jpg"
        alt="Checkout screen with Billing Cycle, Purchase Order toggle, and Order Summary"
        caption="Order Summary shows the port, its billing profile, and the Cross Connect add-on — billing profile values blurred here for privacy"
      />
      <P>
        Review the <strong>Order Summary</strong> — it restates the port's location, name, bandwidth, and term
        next to whichever billing profile you've selected — then click <strong>Create Port</strong>.
      </P>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">After You Order</H2>
      <P>
        Your new port appears on the Services list immediately with a <strong>Deployment in Progress</strong>{" "}
        badge. Open it and go to the <strong>Track Order</strong> tab to watch it move through four milestones:
      </P>
      <UL>
        <LI><strong>Order Details Validated</strong> — your order information has been reviewed.</LI>
        <LI><strong>Deployment in Progress</strong> — Polarin is setting up the physical infrastructure.</LI>
        <LI><strong>Ready to Patch</strong> — the port is physically ready; if you ordered a Cross Connect, this is when it gets patched in.</LI>
        <LI><strong>Port goes Live</strong> — traffic can now flow.</LI>
      </UL>
      <DocImage
        src="/screenshots/ports/04-service-lifecycle.jpg"
        alt="Service detail page Track Order tab showing the port lifecycle milestones"
        caption="The Track Order tab — timestamps confirm exactly when each milestone was reached (name blurred here for privacy)"
      />
      <Callout variant="info">
        For what each status badge means across every product, see{" "}
        <PageLink label="Understand Port Status" onClick={() => onNavigate("port-status")} /> and the shared{" "}
        <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} /> reference.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>Once your port is live, you can attach almost anything to it:</P>
      <UL>
        <LI>Bundle more ports into it: <PageLink label="Create a Link Aggregation Group" onClick={() => onNavigate("port-lag")} />.</LI>
        <LI>Link it to another site: <PageLink label="Create a DCI Layer 2 Connection" onClick={() => onNavigate("dci-layer2-create")} /> or <PageLink label="Create a DCI Wave Connection" onClick={() => onNavigate("dci-wave-create")} />.</LI>
        <LI>Reach a cloud provider directly: <PageLink label="Create a DC to Cloud Connection" onClick={() => onNavigate("dc-to-cloud-create")} />.</LI>
        <LI>Add routing on top: <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
