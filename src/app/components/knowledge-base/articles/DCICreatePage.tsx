import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "before",     label: "Before You Start",      level: 2 as const },
  { id: "steps",      label: "Create the Interconnect", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const DCI_FIELDS = [
  { field: "Service Name",   description: "A unique, identifiable name for this interconnect.", required: true },
  { field: "A-End Port",     description: "The port at your first data centre location.", required: true },
  { field: "Z-End Port",     description: "The port at the second data centre location you're linking to.", required: true },
  { field: "Bandwidth",      description: "The rate limit for this link.", required: true },
  { field: "Subscription Term", description: "How long this interconnect is provisioned for.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function DCICreatePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Data Centre Interconnect</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Products" color="#fd5900" />
      </div>

      <P>
        <strong>Data Centre Interconnect (DCI)</strong> links two or more of your data centre sites together at
        high bandwidth — useful for replication, disaster recovery, or treating multiple sites as one extended
        network.
      </P>

      <Callout variant="important">
        You need an active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> at both the A-End and Z-End locations before creating a DCI service.
      </Callout>

      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Confirm both sites already have a provisioned Port.</LI>
        <LI>Decide the bandwidth needed to carry replication or inter-site traffic comfortably.</LI>
      </UL>

      <H2 id="steps">Create the Interconnect</H2>
      <Steps>
        <Step num={1} title="Go to Services → Global DCI">
          From the left sidebar, choose the DCI type you need — <strong>DCI Wave</strong> for optical-layer connections, or <strong>DCI Layer 2</strong> for Ethernet-based connections — then click <strong>Create</strong>.
        </Step>
        <Step num={2} title="Fill in the interconnect details">
          <FieldTable rows={DCI_FIELDS} />
        </Step>
        <Step num={3} title="Review and place the order">
          Check the summary and pricing, accept the terms, and submit. The service starts in <strong>Design</strong> status.
        </Step>
      </Steps>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Understand the service page itself: <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.</LI>
        <LI>Track what each status means: <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} />.</LI>
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
