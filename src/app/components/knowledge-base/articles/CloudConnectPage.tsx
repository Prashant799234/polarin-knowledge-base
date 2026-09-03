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
  { field: "Z-End",           description: "The other end of the connection — a second Port for DC to DC, a cloud provider region for DC to Cloud, or another cloud for Cloud to Cloud.", required: true },
  { field: "Bandwidth",       description: "The rate limit for this connection, e.g. 50 Mbps, 100 Mbps, 1 Gbps.", required: true },
  { field: "Subscription Term", description: "How long this connection is provisioned for.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CloudConnectPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Virtual Connection</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Products" color="#00b345" />
      </div>

      <P>
        A <strong>Virtual Connection</strong> gives you a private, point-to-point link — DC to DC, DC to Cloud,
        or Cloud to Cloud — bypassing the public internet for lower latency and more predictable performance
        than a standard VPN. Not sure which type fits your case? See{" "}
        <PageLink label="What Is a Virtual Connection?" onClick={() => onNavigate("vc-overview")} /> first.
      </P>

      <Callout variant="important">
        You need a <PageLink label="Port" onClick={() => onNavigate("port-create")} /> already provisioned at the location you want to connect from — a Virtual Connection attaches to an existing port, it doesn't create one.
      </Callout>

      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Have an active <strong>Port</strong> at the data centre where this connection will originate.</LI>
        <LI>Know which type you need — DC to DC, DC to Cloud, or Cloud to Cloud — and what's on the other end.</LI>
        <LI>Decide the bandwidth you need — you can typically resize later, but starting close to your real need avoids early re-provisioning.</LI>
      </UL>

      <H2 id="steps">Create the Connection</H2>
      <Steps>
        <Step num={1} title="Go to Services → Virtual Connection">
          From the left sidebar under <strong>Services</strong>, select <strong>Virtual Connection</strong>, then click <strong>Create</strong>.
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
