import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "prerequisites",   label: "Before You Begin",        level: 2 as const },
  { id: "dc-selection",    label: "1. Data Center Selection", level: 2 as const },
  { id: "configure",       label: "2. Configure Connection",  level: 2 as const },
  { id: "add-ons",         label: "3. Add Ons",               level: 2 as const },
  { id: "checkout",        label: "4. Checkout",              level: 2 as const },
  { id: "lifecycle",       label: "After You Order",          level: 2 as const },
  { id: "next-steps",      label: "Next Steps" },
];

const CONFIGURE_FIELDS = [
  { field: "Connection Name", description: "Must be unique across your organisation. Alphanumeric characters and hyphens only.", required: true },
  { field: "Rate Limit", description: "10 Gbps, 100 Gbps, or 400 Gbps. Wave circuits are built to order, so each available tier is flagged \"Available — setup will take ~2 weeks\" rather than provisioning instantly.", required: true },
  { field: "Number of Circuits", description: "×1 through ×8 — the number of discrete physical circuits at your chosen Rate Limit (e.g. ×3 on a 100 Gbps Rate Limit gives three separate 100 Gbps circuits, shown as 300Gbps of combined capacity).", required: true },
  { field: "Subscription Term", description: "Short Term (1–11 months) or Long Term (12–60 months, \"Better savings\"). No PAYG — Wave is optical infrastructure built out per order.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateDCIWavePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a DCI Wave Connection</H1>
      <ArticleMeta>
        <ReadTime minutes={7} />
        <Dot />
        <Tag label="Data Centre Interconnect" color="#0f766e" />
        <Tag label="Layer 1 · Optical" color="#1c808d" />
      </ArticleMeta>

      <P>
        <strong>DCI Wave</strong> is Polarin's optical, Layer 1 form of{" "}
        <PageLink label="Data Centre Interconnect" onClick={() => onNavigate("dci-overview")} /> — dedicated
        wavelength circuits between two entire data centre sites, built for the highest and most predictable
        throughput. You may notice the wizard header itself reads{" "}
        <em>"Create Data Center Interconnect Layer 1"</em> — Layer 1 is Wave's internal engineering name for the
        same product. If you want an Ethernet connection between two ports you already have instead, see{" "}
        <PageLink label="Create a DCI Layer 2 Connection" onClick={() => onNavigate("dci-layer2-create")} />.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        Unlike Port, Virtual Router, or DCI Layer 2, DCI Wave connects two <strong>data centre sites</strong>
        directly — not two ports you provision separately beforehand. Because it's built to order, allow roughly
        <strong> two weeks</strong> for setup once you place the order.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="dc-selection">1. Data Center Selection</H2>
      <P>
        From <strong>Services</strong>, create a new <strong>DCI Wave</strong> connection. The wizard's progress
        trail shows four steps: <strong>Data Center Selection → Configure Connection → Add Ons → Checkout</strong>.
      </P>
      <P>
        Search for your <strong>A-End Data Center</strong> and <strong>Z-End Data Center</strong> by name, city,
        state, country, or provider — the country filter shows a live count of available sites per country.
        Can't find your facility? There's a <strong>"Request to add it"</strong> link right in the picker.
      </P>
      <DocImage
        src="/screenshots/dci-wave/01-data-center-selection.jpg"
        alt="Data Center Selection step for DCI Wave with country-filtered search"
        caption="Data centre search, filterable by country, with a live availability badge on the diagram once both ends are picked"
      />

      {/* ── Step 2 ── */}
      <H2 id="configure">2. Configure Connection</H2>
      <FieldTable rows={CONFIGURE_FIELDS} />
      <DocImage
        src="/screenshots/dci-wave/02-configure-connection.jpg"
        alt="Configure Connection step for DCI Wave showing Rate Limit tiers and Number of Circuits"
        caption="Rate Limit tiers (10 / 100 / 400 Gbps) and the Number of Circuits multiplier"
      />
      <Callout variant="tip">
        Number of Circuits and Rate Limit multiply together: ×1 on a 10 Gbps Rate Limit is a single 10 Gbps
        circuit; ×8 on the same tier is eight separate 10 Gbps circuits (shown as 80Gbps of combined capacity) —
        useful for redundancy across physically distinct paths, not just raw throughput.
      </Callout>

      {/* ── Step 3 ── */}
      <H2 id="add-ons">3. Add Ons</H2>
      <P>DCI Wave's Add Ons step is the richest of the six creation wizards:</P>
      <UL>
        <LI><strong>Cross Connect</strong> — available for both the A-End and Z-End independently, each "Managed by Lightstorm." A notice on this step flags that cross connect charges are subject to feasibility, and may change if the feasibility scope does.</LI>
        <LI><strong>VISTA</strong> — Standard (free) or Premium (₹5,000/month per circuit), for real-time monitoring and traffic analytics on the circuit.</LI>
        <LI><strong>Bit Error Rate Test (BERT)</strong> — unique to Wave. <strong>24 Hours</strong> is included by default at no extra cost; <strong>48 Hours</strong> is a paid upgrade, billed per circuit, for more rigorous testing. Either way, Polarin runs the test before handover and guarantees a full retest if any criteria aren't met.</LI>
      </UL>
      <DocImage
        src="/screenshots/dci-wave/04-add-ons-bert.jpg"
        alt="Add Ons step showing VISTA Standard/Premium and the Bit Error Rate Test 24 Hour / 48 Hour options"
        caption="VISTA and Bit Error Rate Test — expanding Benefits shows exactly what the test verifies"
      />
      <P>
        See <PageLink label="VISTA for DCI Wave" onClick={() => onNavigate("vista-dci-wave")} /> for what the
        optical-layer telemetry (latency RTD, optical flaps, 99.999% SLA availability) actually tracks.
      </P>

      {/* ── Step 4 ── */}
      <H2 id="checkout">4. Checkout</H2>
      <P>
        The Order Summary carries <strong>three separate billing profiles</strong> — one each for the A-End,
        the Z-End, and VISTA — since each piece can be billed to a different entity in your organisation. Cross
        Connect, where added, is nested under its end's details and billed against that same end's profile.
      </P>
      <DocImage
        src="/screenshots/dci-wave/03-checkout.jpg"
        alt="DCI Wave checkout screen with three billing profiles and Cross Connect line items"
        caption="A-End, Z-End, and VISTA each carry their own billing profile — values blurred here for privacy"
      />
      <P>Click <strong>Create DCI Wave</strong> to place the order.</P>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">After You Order</H2>
      <P>
        Track progress from the service's <strong>Track Order</strong> tab: <strong>Order Details Validated</strong>{" "}
        → <strong>Deployment in Progress</strong> → <strong>Configured</strong>, with LOA generation and
        patch-in steps visible along the way if you ordered Cross Connect. Expect the full cycle to track close
        to the ~2 week estimate shown during Rate Limit selection.
      </P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Need an Ethernet link over existing ports instead? <PageLink label="Create a DCI Layer 2 Connection" onClick={() => onNavigate("dci-layer2-create")} />.</LI>
        <LI>Understand the shared service page: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
