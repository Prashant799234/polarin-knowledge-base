import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "before",     label: "Before You Start",       level: 2 as const },
  { id: "steps",      label: "Create Your Ticket",     level: 2 as const },
  { id: "from-service", label: "Raising It From a Service", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const NON_TECHNICAL_CATEGORIES = [
  "Billing", "CAF / Order Form / PO", "Letter of Authorization",
  "Promo Code / Offers", "Provisioning", "Purchase Order", "Quote", "Others",
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateTicketPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Ticket</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
      </div>

      <P>
        Raise a ticket when something needs Polarin's team to look into it directly — a service issue, a billing
        question specific to your account, or anything self-serve documentation can't answer. The more detail
        you give up front, the faster it gets resolved.
      </P>

      <Callout variant="tip">
        Not sure this needs a ticket? Check <PageLink label="Get Support" onClick={() => onNavigate("ticket-overview")} /> first — most common
        questions are already answered in the Knowledge Base.
      </Callout>

      {/* ── Before you start ── */}
      <H2 id="before">Before You Start</H2>
      <UL>
        <LI>Make sure you're signed in — tickets are tied to your account so you (and your team) can track them.</LI>
        <LI>Know roughly which service is affected, if any — you can attach up to 4.</LI>
        <LI>Have any screenshots or files ready — you can attach one per submission, up to 10 MB.</LI>
      </UL>

      {/* ── Steps ── */}
      <H2 id="steps">Create Your Ticket</H2>

      <Steps>
        <Step num={1} title="Open Create a Ticket">
          Go to <strong>Help → Create a Ticket</strong> from the top navigation.
        </Step>
        <Step num={2} title="Select the affected service (optional)">
          Search and select up to 4 services this issue relates to. This step is optional — skip it for
          account or billing questions that aren't tied to a specific service.
          <DocImage src="/screenshots/create-ticket-select-services.png" alt="Selecting affected services when creating a ticket" caption="Search and select up to 4 affected services, or leave this blank." />
        </Step>
        <Step num={3} title="Choose an issue type and category">
          Pick <strong>Technical Issues</strong> (service functionality, performance, or connectivity problems)
          or <strong>Non-Technical Issues</strong> (account, billing, documentation, or general inquiries), then
          select the closest matching category.
          <DocImage src="/screenshots/create-ticket-select-issue-type.png" alt="Selecting issue type and category" caption="Non-Technical categories include Billing, CAF / Order Form / PO, Letter of Authorization, and more." />
          <P>For Non-Technical issues, the available categories are:</P>
          <UL>
            {NON_TECHNICAL_CATEGORIES.map((c) => <LI key={c}>{c}</LI>)}
          </UL>
        </Step>
        <Step num={4} title="Describe the issue and attach files">
          Write a clear description — what happened, when it started, and what you expected instead. Attach a
          screenshot or log file if it helps explain the issue.
        </Step>
        <Step num={5} title="Submit">
          Submit the ticket. It gets a <strong>Ticket ID</strong> right away, and shows up immediately in <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} />.
        </Step>
      </Steps>

      {/* ── From a service page ── */}
      <H2 id="from-service">Raising It From a Service</H2>
      <P>
        You don't always have to start from Help. Open any service's detail page — a Port, a Virtual Connection,
        a Virtual Router — and click <strong>Raise a Ticket</strong> right next to <strong>Edit</strong>. It's the faster path when
        you're already looking at the specific service having the issue.
      </P>
      <DocImage src="/screenshots/raise-ticket-from-service.png" alt="Raise a Ticket button on a service detail page" caption="Every service's own page has a direct Raise a Ticket shortcut." />

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Track your ticket's status and conversation in <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} />.</LI>
        <LI>Need a direct line instead? <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.</LI>
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
