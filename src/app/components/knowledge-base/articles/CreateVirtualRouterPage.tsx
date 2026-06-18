import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "prerequisites",  label: "Before You Begin",   level: 2 as const },
  { id: "create-vr",      label: "Create the Router",  level: 2 as const },
  { id: "router-details", label: "Router Details",     level: 2 as const },
  { id: "checkout",       label: "Checkout & Order",   level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const ROUTER_FIELDS = [
  {
    field: "Rate Limit",
    description: "Throughput cap for the virtual router in Mbps or Gbps. Toggle the unit between Mbps and Gbps as needed. This controls the maximum aggregate bandwidth across all connections on the router.",
    required: true,
  },
  {
    field: "ASN",
    description: "Autonomous System Number used for BGP peering. Must be a private ASN in the range 64512 – 65534.",
    required: true,
  },
  {
    field: "Router IP Address",
    description: "The router's private IP address. Valid ranges: 10.0.0.0 – 10.255.255.255, 172.16.0.0 – 172.31.255.255, 192.168.0.0 – 192.168.255.255. This address cannot be changed after the router is created.",
    required: true,
  },
  {
    field: "Subscription Term",
    description: "Duration of the virtual router subscription. A longer term typically reduces the monthly cost.",
    required: true,
  },
  {
    field: "Payment",
    description: "Upfront payment preference. Options: No Upfront, Partial Upfront, All Upfront. Affects the You Pay monthly amount.",
    required: true,
  },
];

const CHECKOUT_FIELDS = [
  {
    field: "Billing Profile",
    description: "Select an existing billing profile or create a new one via Add Billing Profile. Use the menu (⋯) to edit an existing profile.",
    required: true,
  },
  {
    field: "Router Details",
    description: "Summary of your virtual router order — location, rate limit, ASN, IP address, subscription term, and price estimate. Review carefully before confirming.",
    required: false,
  },
  {
    field: "MSA",
    description: "Review and accept the Polarin Master Services Agreement to proceed.",
    required: true,
  },
];

export function CreateVirtualRouterPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Virtual Router</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Services" color="#f97316" />
        <Tag label="Layer 3" color="#0ea5e9" />
      </div>

      <P>
        A <strong>Virtual Router</strong> is a Layer 3 solution that acts as a gateway and provides routing functions between different clouds and data centres. You can create a Virtual Router at any available Point of Presence (PoP) and then attach Layer 3 connections to clouds, data centres, and branch sites.
      </P>
      <P>
        Unlike a physical router, a Polarin Virtual Router is software-defined — provisioned on-demand, scalable by rate limit, and manageable entirely through the portal.
      </P>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, margin: "16px 0 24px",
      }}>
        {[
          { icon: "🌐", label: "Multi-cloud routing", detail: "Connect AWS, Azure, GCP through one router" },
          { icon: "⚡", label: "Scalable throughput", detail: "Set rate limit in Mbps or Gbps" },
          { icon: "🔒", label: "Private BGP", detail: "Uses private ASN range 64512–65534" },
          { icon: "📍", label: "Any PoP", detail: "Deploy at any available Polarin location" },
        ].map(item => (
          <div key={item.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#0a3954", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* ── Prerequisites ── */}
      <Callout variant="important" id="prerequisites">
        Before creating a Virtual Router, ensure your <strong>Organisation Profile</strong> is complete and KYC documents have been approved. You also need at least one provisioned <strong>Port</strong> at the target PoP to attach connections after the router is live.
      </Callout>

      {/* ── Create VR ── */}
      <H2 id="create-vr">Start Virtual Router Creation</H2>

      <Steps>
        <Step num={1} title="Sign in to Polarin">
          Go to <strong>polarin.lightstorm.net</strong> and sign in with your credentials.
        </Step>
        <Step num={2} title="Navigate to Services">
          From the left sidebar, click <strong>Services</strong>.
          <DocImage src="https://docs.polarin.lightstorm.net/menu_services_left_panel.svg" alt="Services in left panel" caption="Open the Services section from the left navigation." />
        </Step>
        <Step num={3} title="Open the creation menu">
          On the Services page, click <strong>+Create</strong> in the top-right area, then select <strong>Create a Virtual Router</strong> from the dropdown.
          <DocImage src="https://docs.polarin.lightstorm.net/select_service_vr.svg" alt="Select Create a Virtual Router" caption="Choose 'Create a Virtual Router' from the +Create dropdown." />
        </Step>
        <Step num={4} title="Select a location">
          In the <strong>Search Location</strong> field, search for or select your preferred data centre location. This will be the PoP where the virtual router is deployed.
          <DocImage src="https://docs.polarin.lightstorm.net/location_vr.svg" alt="Virtual Router location selection" caption="Select the PoP where you want to deploy the Virtual Router." />
        </Step>
        <Step num={5} title="Click Save & Next">
          Click <strong>Save &amp; Next</strong> to proceed to the <strong>Router Details</strong> section.
        </Step>
      </Steps>

      {/* ── Router details ── */}
      <H2 id="router-details">Configure Router Details</H2>
      <P>
        In the <strong>Router Details</strong> section, define the routing parameters for your virtual router. Take care with the IP address — it cannot be changed after the router is created.
      </P>

      <Steps>
        <Step num={1} title="Fill in router configuration">
          Complete the fields below:
          <FieldTable rows={ROUTER_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/router_details.svg" alt="Router Details configuration form" caption="Set rate limit, ASN, IP address, subscription term, and payment type." />
        </Step>
        <Step num={2} title="Review pricing">
          The <strong>Price Estimate</strong> and <strong>You Pay</strong> fields update automatically based on your rate limit, subscription term, and payment type selection.
        </Step>
        <Step num={3} title="Click Save & Next">
          Click <strong>Save &amp; Next</strong> to proceed to <strong>Checkout</strong>.
        </Step>
      </Steps>

      <Callout variant="warning">
        The <strong>Router IP Address</strong> is permanent. Once the virtual router is created, the IP address cannot be modified. Ensure the address fits your network addressing plan before placing the order.
      </Callout>

      {/* ── Checkout ── */}
      <H2 id="checkout">Checkout & Place Order</H2>

      <Steps>
        <Step num={1} title="Select a billing profile">
          In the <strong>Billing Profile</strong> section, select an existing profile or create a new one.
          <FieldTable rows={CHECKOUT_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/vr_billing.svg" alt="Virtual Router billing and checkout" caption="Review the router summary and accept the MSA before placing the order." />
        </Step>
        <Step num={2} title="Place the order">
          Click <strong>Order</strong> to confirm. A confirmation message appears and the router will show on the <strong>Services</strong> page. Click <strong>Back</strong> to revise any details.
        </Step>
      </Steps>

      <Callout variant="info">
        After ordering, monitor progress on the <strong>Services</strong> page. The router will move through provisioning states — see <strong>Understand Virtual Router Status</strong> for details on each stage.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>Once your Virtual Router is live, you can:</P>
      <UL>
        <LI>Add <strong>Layer 3 connections</strong> to clouds (AWS, Azure, GCP) and data centres through the router.</LI>
        <LI>Configure <strong>BGP peering</strong> using the ASN assigned during setup.</LI>
        <LI>Monitor routing traffic and session health from the <strong>SPOG dashboard</strong>.</LI>
        <LI>Adjust the <strong>rate limit</strong> up or down based on actual traffic demands.</LI>
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
