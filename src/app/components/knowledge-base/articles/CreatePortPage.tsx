import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "prerequisites",  label: "Before You Begin",   level: 2 as const },
  { id: "new-user",       label: "New User Setup",     level: 2 as const },
  { id: "existing-user",  label: "Existing User",      level: 2 as const },
  { id: "configure-port", label: "Configure Port",     level: 2 as const },
  { id: "checkout",       label: "Checkout & Order",   level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const PORT_FIELDS = [
  { field: "Port Name",        description: "A unique, identifiable name for this port. Use a descriptive name if you plan on having more than one port.", required: true },
  { field: "Port Speed",       description: "Physical interface speed. Available options: 1GE, 10GE, and 100GE. Ensure your equipment can interface with the selected speed.", required: true },
  { field: "Subscription Term",description: "Duration of your port subscription. Select the term that best matches your deployment needs.", required: true },
  { field: "Payment",          description: "Upfront payment preference. Options: No Upfront, Partial Upfront, or All Upfront. Affects the monthly price displayed in You Pay.", required: true },
];

const CHECKOUT_FIELDS = [
  { field: "Billing Profile",  description: "Select an existing billing profile. Click Add Billing Profile to create one, or use the menu to edit an existing profile.", required: true },
  { field: "Port Details",     description: "A summary of your port order — location, speed, subscription term, and price estimate. Verify all details before ordering.", required: false },
  { field: "MSA",              description: "Review and accept the Polarin Master Services Agreement before placing the order.", required: true },
];

export function CreatePortPage() {
  return (
    <ArticlePage toc={TOC}>
      <Breadcrumb items={["Home", "Services", "Port", "Create a Port"]} />

      <H1 id="overview">Create a Port</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Services" color="#f97316" />
      </div>

      <P>
        A <strong>Port</strong> is the physical point of connection between your organisation's network and the Polarin network. Every traffic path in Polarin originates from a port — you will need to deploy one at each location where you want to direct traffic.
      </P>
      <P>
        Ports are available in three speeds — 1GE, 10GE, and 100GE — and can optionally be grouped into a Link Aggregation Group (LAG) for higher bandwidth and redundancy.
      </P>

      <Callout variant="important" id="prerequisites">
        Before creating a port, ensure your <strong>Organisation Profile</strong> is complete and <strong>KYC documents</strong> have been submitted and approved. Ports cannot be ordered without a verified organisation.
      </Callout>

      {/* ── New user flow ── */}
      <H2 id="new-user">Creating a Port — New User</H2>
      <P>
        If this is your first time on the Services page, you will see the <strong>All Services</strong> onboarding screen with product tiles.
      </P>

      <Steps>
        <Step num={1} title="Sign in to Polarin">
          Go to <strong>polarin.lightstorm.net</strong> and sign in with your credentials.
        </Step>
        <Step num={2} title="Navigate to Services">
          From the left sidebar, click <strong>Services</strong>.
          <DocImage src="https://docs.polarin.lightstorm.net/menu_services_left_panel.svg" alt="Services menu in left panel" caption="Select Services from the left navigation panel." />
        </Step>
        <Step num={3} title="Start port creation">
          In the <strong>All Services</strong> page, locate the <strong>Port</strong> tile and click <strong>Create</strong>.
          <DocImage src="https://docs.polarin.lightstorm.net/start_with_product_port.svg" alt="Port tile on All Services page" caption="Click Create inside the Port tile to begin." />
        </Step>
      </Steps>

      {/* ── Existing user flow ── */}
      <H2 id="existing-user">Creating a Port — Existing User</H2>
      <P>
        If you already have services provisioned, use the <strong>+Create</strong> button to add a new port.
      </P>

      <Steps>
        <Step num={1} title="Sign in and go to Services">
          Sign in to Polarin and click <strong>Services</strong> in the left sidebar.
        </Step>
        <Step num={2} title="Click +Create">
          On the Services page, click <strong>+Create</strong> in the top-right area, then select <strong>Create a Port</strong> from the dropdown.
          <DocImage src="https://docs.polarin.lightstorm.net/select_service_port.svg" alt="Create a Port from the +Create dropdown" caption="Select 'Create a Port' from the +Create dropdown." />
        </Step>
      </Steps>

      {/* ── Configure port ── */}
      <H2 id="configure-port">Configure Your Port</H2>
      <P>
        Both flows lead to the <strong>Create Port</strong> wizard. Follow the steps below.
      </P>

      <Steps>
        <Step num={1} title="Select a location">
          In the <strong>Search Location</strong> field, search for or select your preferred data centre location from the list.
          <DocImage src="https://docs.polarin.lightstorm.net/create_port_step1.svg" alt="Port location selection" caption="Choose the data centre where you want to deploy the port." />
        </Step>
        <Step num={2} title="Click Next">
          Click <strong>Next</strong> to proceed to the <strong>Configure Port</strong> section.
        </Step>
        <Step num={3} title="Fill in the port details">
          Complete the following fields:
          <FieldTable rows={PORT_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/create__port_step2.svg" alt="Configure Port form" caption="Set the port name, speed, subscription term, and payment type." />
        </Step>
        <Step num={4} title="Click Next">
          Click <strong>Next</strong> to proceed to <strong>Checkout</strong>.
        </Step>
      </Steps>

      {/* ── Checkout ── */}
      <H2 id="checkout">Checkout & Place Order</H2>

      <Steps>
        <Step num={1} title="Review checkout details">
          In the <strong>Checkout</strong> section, complete the following:
          <FieldTable rows={CHECKOUT_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/port_checkout.svg" alt="Port checkout screen" caption="Review your port order and billing details before placing the order." />
        </Step>
        <Step num={2} title="Place the order">
          Click <strong>Order</strong> to confirm. A confirmation message will appear on screen. Click <strong>Back</strong> if you need to make any changes first.
        </Step>
      </Steps>

      <Callout variant="info">
        After ordering, you can monitor the deployment progress on the <strong>Services</strong> page. See <strong>Understand Port Status</strong> for a full breakdown of what each status means.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>Once your port is live, you can:</P>
      <UL>
        <LI>Create a <strong>Link Aggregation Group (LAG)</strong> to bundle ports for higher throughput.</LI>
        <LI>Set up a <strong>Virtual Connection</strong> over your port.</LI>
        <LI>Attach a <strong>Virtual Router</strong> for advanced routing configurations.</LI>
        <LI>Monitor port health and utilisation from the <strong>SPOG dashboard</strong>.</LI>
      </UL>
    </ArticlePage>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#cbd5e1", fontSize: 12 }}>›</span>}
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: i === items.length - 1 ? "#0a3954" : "#94a3b8", fontWeight: i === items.length - 1 ? 600 : 400 }}>{item}</span>
        </span>
      ))}
    </div>
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
