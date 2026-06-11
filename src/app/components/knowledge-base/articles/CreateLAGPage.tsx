import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "what-is-lag",    label: "What is a LAG?",     level: 2 as const },
  { id: "prerequisites",  label: "Before You Begin",   level: 2 as const },
  { id: "create-lag",     label: "Create the Port",    level: 2 as const },
  { id: "configure-lag",  label: "Configure LAG",      level: 2 as const },
  { id: "checkout",       label: "Checkout & Order",   level: 2 as const },
  { id: "next-steps",     label: "Next Steps" },
];

const LAG_FIELDS = [
  { field: "Port Name",         description: "A unique name for the LAG. Use something descriptive like 'LAG-NYC-Primary'.", required: true },
  { field: "Port Speed",        description: "The speed of each individual port in the LAG. Options: 1GE, 10GE, 100GE. All ports in a LAG must have the same speed.", required: true },
  { field: "Subscription Term", description: "Duration of the LAG subscription. Applies to all member ports.", required: true },
  { field: "LACP On Port",      description: "Toggle to enable Link Aggregation Control Protocol (LACP). Must be enabled to configure a LAG. Your device must also support IEEE 802.3ad LACP.", required: true },
  { field: "Number of Ports",   description: "The number of physical ports to bundle into the LAG. Minimum 2, maximum 8 ports per LAG.", required: true },
];

const CHECKOUT_FIELDS = [
  { field: "Billing Profile",  description: "Select or create a billing profile. The price shown in 'You Pay' reflects the total for all ports in the LAG.", required: true },
  { field: "Port Details",     description: "Review the combined order summary — location, speed × number of ports, subscription term, and price estimate.", required: false },
];

export function CreateLAGPage() {
  return (
    <ArticlePage toc={TOC}>
      <Breadcrumb items={["Home", "Services", "Port", "Create a Link Aggregation Group"]} />

      <H1 id="overview">Create a Link Aggregation Group</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Services" color="#f97316" />
        <Tag label="Advanced" color="#6366f1" />
      </div>

      <P>
        A <strong>Link Aggregation Group (LAG)</strong> bundles multiple physical ports into a single logical connection, giving you higher aggregate bandwidth and built-in redundancy. If one port in the LAG fails, traffic automatically redistributes across the remaining ports.
      </P>

      {/* ── What is LAG ── */}
      <H2 id="what-is-lag">What is a LAG?</H2>
      <P>
        LAG (also known as port channel or IEEE 802.3ad link aggregation) combines 2–8 physical ports into one logical interface using the <strong>Link Aggregation Control Protocol (LACP)</strong>. The result is:
      </P>
      <UL>
        <LI><strong>Higher bandwidth</strong> — aggregate speeds of multiple ports (e.g., 4 × 10GE = 40Gbps).</LI>
        <LI><strong>Built-in redundancy</strong> — traffic fails over to surviving ports if one goes down.</LI>
        <LI><strong>Load balancing</strong> — LACP distributes traffic across member ports automatically.</LI>
      </UL>

      <div style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        border: "1px solid #bae6fd", borderRadius: 12, padding: "18px 24px", margin: "16px 0",
        display: "flex", alignItems: "flex-start", gap: 16,
      }}>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#0369a1", margin: "0 0 4px" }}>LAG capacity</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#0c4a6e", margin: 0, lineHeight: 1.6 }}>
            Maximum <strong>8 ports</strong> per LAG. All member ports must be at the same location and the same speed. Mixing 1GE and 10GE in a single LAG is not supported.
          </p>
        </div>
      </div>

      {/* ── Prerequisites ── */}
      <H2 id="prerequisites">Before You Begin</H2>
      <UL>
        <LI>Your <strong>Organisation Profile</strong> must be complete and KYC documents approved.</LI>
        <LI>Your edge device must support <strong>IEEE 802.3ad LACP</strong>.</LI>
        <LI>Decide how many ports you want in the LAG — you configure this during port creation, not after.</LI>
      </UL>
      <Callout variant="important">
        LACP must be enabled at the time of port creation. You cannot convert a standalone port into a LAG after it has been ordered. Plan your LAG size before placing the order.
      </Callout>

      {/* ── Create the port ── */}
      <H2 id="create-lag">Start Port Creation</H2>
      <P>
        A LAG is created through the same <strong>Create Port</strong> wizard — LACP is enabled in the configure step.
      </P>

      <Steps>
        <Step num={1} title="Sign in to Polarin">
          Go to <strong>polarin.lightstorm.net</strong> and sign in with your credentials.
        </Step>
        <Step num={2} title="Navigate to Services">
          Click <strong>Services</strong> in the left sidebar.
          <DocImage src="https://docs.polarin.lightstorm.net/menu_services_left_panel.svg" alt="Services in left panel" caption="Open the Services section from the left navigation." />
        </Step>
        <Step num={3} title="Start port creation">
          <strong>New user:</strong> Click <strong>Create</strong> in the Port tile on the All Services page.
          <DocImage src="https://docs.polarin.lightstorm.net/start_with_product_port.svg" alt="Port tile — new user" caption="New users see the product tiles on the All Services page." />
          <strong>Existing user:</strong> Click <strong>+Create</strong> → <strong>Create a Port</strong>.
          <DocImage src="https://docs.polarin.lightstorm.net/select_service_port.svg" alt="Create a Port from +Create" caption="Existing users can create a port from the +Create button." />
        </Step>
        <Step num={4} title="Select a location">
          In the <strong>Search Location</strong> field, choose the data centre where you want to deploy the LAG.
          <DocImage src="https://docs.polarin.lightstorm.net/create_port_step1.svg" alt="Select location for port" caption="All ports in a LAG must be at the same physical location." />
        </Step>
        <Step num={5} title="Click Save & Next">
          Click <strong>Save &amp; Next</strong> to proceed to the <strong>Configure Port</strong> section.
        </Step>
      </Steps>

      {/* ── Configure LAG ── */}
      <H2 id="configure-lag">Configure the LAG</H2>
      <P>
        In the <strong>Configure Port</strong> section, you enable LACP and set the number of member ports.
      </P>

      <Steps>
        <Step num={1} title="Fill in port and LAG details">
          Complete all fields — pay close attention to the <strong>LACP On Port</strong> toggle and <strong>Number of Ports</strong>:
          <FieldTable rows={LAG_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/create_port_step2_lag.svg" alt="Configure Port with LACP enabled" caption="Enable LACP On Port and set the number of member ports for your LAG." />
        </Step>
        <Step num={2} title="Review the price estimate">
          The <strong>Price Estimate</strong> and <strong>You Pay</strong> fields update automatically based on the port speed, subscription term, and the number of ports in the LAG.
        </Step>
        <Step num={3} title="Click Save & Next">
          Click <strong>Save &amp; Next</strong> to proceed to <strong>Checkout</strong>.
        </Step>
      </Steps>

      <Callout variant="tip">
        The total cost for a LAG is the per-port price multiplied by the number of ports. A 4 × 10GE LAG costs the same as ordering four individual 10GE ports.
      </Callout>

      {/* ── Checkout ── */}
      <H2 id="checkout">Checkout & Place Order</H2>

      <Steps>
        <Step num={1} title="Select a billing profile">
          In the <strong>Billing Profile</strong> section, pick an existing profile or click <strong>Add Billing Profile</strong> to create one.
          <FieldTable rows={CHECKOUT_FIELDS} />
          <DocImage src="https://docs.polarin.lightstorm.net/create_port_checkout.svg" alt="LAG checkout screen" caption="Review your LAG order details and billing profile before ordering." />
        </Step>
        <Step num={2} title="Place the order">
          Click <strong>Order</strong> to confirm. A confirmation message appears on screen. The LAG will appear on the Services page where you can track its status.
        </Step>
      </Steps>

      <Callout variant="info">
        Once ordered, your LAG will progress through the standard port provisioning states. See <strong>Understand Port Status</strong> for a full breakdown of each stage.
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>With your LAG live, you can:</P>
      <UL>
        <LI>Create a <strong>Virtual Connection</strong> over the LAG for carrier-grade L2/L3 services.</LI>
        <LI>Monitor per-port traffic and health from the <strong>SPOG dashboard</strong>.</LI>
        <LI>Review billing by subscription term from <strong>Billing &amp; Usage</strong>.</LI>
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
