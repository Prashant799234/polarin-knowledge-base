import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "before",     label: "Before You Start",   level: 2 as const },
  { id: "steps",      label: "Create the Connection", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const CONNECT_FIELDS = [
  { field: "Connection Name", description: "A unique, identifiable name for this connection.", required: true },
  { field: "A-End Port",      description: "The Polarin port this connection originates from.", required: true },
  { field: "Z-End",           description: "The cloud provider and region you're connecting to (AWS, Azure, or GCP).", required: true },
  { field: "Bandwidth",       description: "The rate limit for this connection, e.g. 50 Mbps, 100 Mbps, 1 Gbps.", required: true },
  { field: "Subscription Term", description: "How long this connection is provisioned for.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CloudConnectPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Cloud Connect Service</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Products" color="#00b345" />
      </div>

      <P>
        <strong>Cloud Connect</strong> gives you a private, direct link into a cloud provider — bypassing the
        public internet for lower latency and more predictable performance than a standard VPN.
      </P>

      <Callout variant="important">
        You need a <PageLink label="Port" onClick={() => onNavigate("port-create")} /> already provisioned at the location you want to connect from — Cloud Connect attaches to an existing port, it doesn't create one.
      </Callout>

      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Have an active <strong>Port</strong> at the data centre closest to your cloud provider's region.</LI>
        <LI>Know which cloud provider and region you're connecting to.</LI>
        <LI>Decide the bandwidth you need — you can typically resize later, but starting close to your real need avoids early re-provisioning.</LI>
      </UL>

      <H2 id="steps">Create the Connection</H2>
      <Steps>
        <Step num={1} title="Go to Services → Cloud Connect">
          From the left sidebar under <strong>Services</strong>, select <strong>Cloud Connect</strong>, then click <strong>Create</strong>.
        </Step>
        <Step num={2} title="Fill in the connection details">
          <FieldTable rows={CONNECT_FIELDS} />
        </Step>
        <Step num={3} title="Review and place the order">
          Check the connection summary and pricing, accept the terms, and submit. The service starts in <strong>Design</strong> status.
        </Step>
      </Steps>

      <P>
        Once live, billing only starts when the connection actually goes live — see <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} /> for what each stage means.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Understand the service page itself: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
        <LI>Something not working as expected? <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
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
