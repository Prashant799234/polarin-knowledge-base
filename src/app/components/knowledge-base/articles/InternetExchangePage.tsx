import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "before",     label: "Before You Start", level: 2 as const },
  { id: "steps",      label: "Join the Exchange", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const IX_FIELDS = [
  { field: "Service Name", description: "A unique, identifiable name for this Internet Exchange connection.", required: true },
  { field: "Port",         description: "The Polarin port this IX connection attaches to.", required: true },
  { field: "Bandwidth",    description: "The rate limit for peering traffic.", required: true },
  { field: "ASN",          description: "Your Autonomous System Number, used to peer with other exchange members.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function InternetExchangePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create an Internet Exchange Connection</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Products" color="#1a65fd" />
      </div>

      <P>
        <strong>Internet Exchange (IX)</strong> connects you to a shared peering fabric at a Polarin location, so
        you can exchange traffic directly with other networks present at that exchange — instead of routing
        through a transit provider.
      </P>

      <Callout variant="important">
        You need an active <PageLink label="Port" onClick={() => onNavigate("port-create")} /> at a location where Polarin offers Internet Exchange, and your own ASN to peer with.
      </Callout>

      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Confirm your chosen location has Internet Exchange available.</LI>
        <LI>Have your ASN and peering policy ready.</LI>
      </UL>

      <H2 id="steps">Join the Exchange</H2>
      <Steps>
        <Step num={1} title="Go to Services → Internet Exchange">
          From the left sidebar under <strong>Internet</strong>, select <strong>Internet Exchange</strong>, then click <strong>Create</strong>.
        </Step>
        <Step num={2} title="Fill in the connection details">
          <FieldTable rows={IX_FIELDS} />
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
