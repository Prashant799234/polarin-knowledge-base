import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "prerequisites",  label: "Before You Begin",    level: 2 as const },
  { id: "port-selection", label: "1. Port Selection",   level: 2 as const },
  { id: "configure",      label: "2. Configure Connection", level: 2 as const },
  { id: "add-ons",        label: "3. Add Ons",          level: 2 as const },
  { id: "checkout",       label: "4. Checkout",         level: 2 as const },
  { id: "lifecycle",      label: "After You Order",     level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const CONFIGURE_FIELDS = [
  { field: "Virtual Connection Name", description: "Must be unique across your organisation. Alphanumeric characters and hyphens only.", required: true },
  { field: "MACSec Encryption", description: "A toggle. When on, enables transparent tunnelling of encrypted traffic between your A-End and Z-End. Encryption and key management remain your responsibility at both ends — Polarin only carries the encrypted traffic.", required: false },
  { field: "Advanced Settings → Select VLAN Type", description: "Tagged (default — a single VLAN ID is assigned; only traffic carrying that VLAN ID passes through, and you can keep using the same physical ports for other connections), Untagged, or Trunk.", required: false },
  { field: "VLAN ID (Optional)", description: "Only shown for a Tagged connection. Leave blank and Polarin auto-allocates the next available ID — the form shows live suggestions (e.g. 453, 364) if you want to pick one yourself.", required: false },
  { field: "DCI Lite", description: "A toggle for a lighter-weight connection class suited to non-critical applications like SAP or email services.", required: false },
  { field: "Rate Limit", description: "The bandwidth for this connection.", required: true },
  { field: "Subscription Term", description: "Short Term (1–11 months) or Long Term (12–60 months, \"Better savings\"). No PAYG — Layer 2 provisions over physical cross-connects.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateDCILayer2Page({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a DCI Layer 2 Connection</H1>
      <ArticleMeta>
        <ReadTime minutes={7} />
        <Dot />
        <Tag label="Data Centre Interconnect" color="#0f766e" />
        <Tag label="Layer 2" color="#1c808d" />
      </ArticleMeta>

      <P>
        <strong>DCI Layer 2</strong> is an Ethernet-based interconnect between two of your ports — it's the
        form of <PageLink label="Data Centre Interconnect" onClick={() => onNavigate("dci-overview")} /> most
        teams reach for, since it rides on infrastructure you've likely already provisioned. For the optical,
        Layer-1 alternative built for the highest, most predictable throughput, see{" "}
        <PageLink label="Create a DCI Wave Connection" onClick={() => onNavigate("dci-wave-create")} />.
      </P>

      <H2 id="prerequisites">Before You Begin</H2>
      <Callout variant="important">
        You need an active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> already
        provisioned at <strong>both</strong> the A-End and Z-End locations before starting this wizard — DCI
        Layer 2 connects two existing ports, it doesn't create them.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="port-selection">1. Port Selection</H2>
      <P>
        From <strong>Services</strong>, create a new <strong>DCI Layer 2</strong> connection. The wizard's
        progress trail shows four steps: <strong>Port Selection → Configure Connection → Add Ons → Checkout</strong>.
      </P>
      <P>
        Select the <strong>A-End Port</strong> and <strong>Z-End Port</strong> from searchable lists of your
        existing ports. The diagram on the left updates live to show both ends and the link between them, along
        with a live availability percentage for the path.
      </P>

      {/* ── Step 2 ── */}
      <H2 id="configure">2. Configure Connection</H2>
      <FieldTable rows={CONFIGURE_FIELDS} />
      <DocImage
        src="/screenshots/dci-layer2/01-configure-connection.jpg"
        alt="Configure Connection step for DCI Layer 2 showing MACSec, Advanced Settings, VLAN Type, and DCI Lite"
        caption="MACSec Encryption, the Advanced Settings VLAN controls (Tagged / Untagged / Trunk), and DCI Lite"
      />

      {/* ── Step 3 ── */}
      <H2 id="add-ons">3. Add Ons</H2>
      <P>
        <strong>Cross Connect</strong> can be added at each end ("Managed by Lightstorm"), and{" "}
        <strong>VISTA</strong> — Standard (free) or Premium — layers on real-time monitoring, traffic analytics,
        and alerting across the connection.
      </P>
      <DocImage
        src="/screenshots/dci-layer2/02-add-ons.jpg"
        alt="VISTA Standard and Premium add-on comparison for DCI Layer 2"
        caption="VISTA's full Premium feature list, expanded inline"
      />
      <P>
        See <PageLink label="VISTA for Virtual Connection" onClick={() => onNavigate("vista-vc")} /> — DCI
        Layer 2 telemetry is covered under the same VISTA package as Virtual Connection.
      </P>

      {/* ── Step 4 ── */}
      <H2 id="checkout">4. Checkout</H2>
      <P>
        Review the <strong>Order Summary</strong>: it lists the A-End port and Z-End port separately — each
        with its <strong>own billing profile</strong> — followed by the Connection Details (name, bandwidth,
        term) with a third billing profile for the connection itself, plus VISTA if you added it.
      </P>
      <DocImage
        src="/screenshots/dci-layer2/03-checkout.jpg"
        alt="DCI Layer 2 checkout screen with per-end billing profiles"
        caption="Separate billing profiles for A-End, Z-End, and the connection — values blurred here for privacy"
      />
      <P>Click <strong>Create DCI Layer 2</strong> to place the order.</P>

      {/* ── Lifecycle ── */}
      <H2 id="lifecycle">After You Order</H2>
      <P>
        Track progress from the service's <strong>Track Order</strong> tab. Because Layer 2 rides over ports you
        already own, there's no new physical build — it typically moves from{" "}
        <strong>Order Details Validated</strong> to <strong>Configured</strong> to <strong>Live</strong> faster
        than a service that needs a new cross connect arranged.
      </P>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Need higher, dedicated optical bandwidth instead? <PageLink label="Create a DCI Wave Connection" onClick={() => onNavigate("dci-wave-create")} />.</LI>
        <LI>Understand the shared service page: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
