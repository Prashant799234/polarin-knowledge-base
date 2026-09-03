import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "tabs",       label: "The Three Tabs",     level: 2 as const },
  { id: "actions",    label: "Actions on This Page", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const TABS = [
  { name: "Overview",           description: "The service's rate limit, A-End and Z-End connection points, and (once billing starts) subscription dates and term." },
  { name: "Subscription",       description: "Plan, term, renewal, and subscription-specific details for this service." },
  { name: "Invoices & Payments", description: "Every invoice generated against this specific service." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ServiceDetailPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understanding the Service Detail Page</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Service Management" color="#1c808d" />
      </div>

      <P>
        Every service you provision — a Port, a Cloud Connect link, a Virtual Router, a DCI connection — opens
        into the <strong>same kind of detail page</strong>. Once you know how to read one, you know how to read
        all of them.
      </P>

      <P>
        Open it from the <strong>Services</strong> list on the left, or by selecting the service from any list
        showing your services. The header always shows the service's name, its current status badge (see{" "}
        <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} />), when it was created, and its unique Service ID — click the copy icon next to the ID to copy it, useful when raising a ticket about that specific service.
      </P>

      {/* ── Tabs ── */}
      <H2 id="tabs">The Three Tabs</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0" }}>
        {TABS.map((t) => (
          <div key={t.name} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <div>
              <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#0a3954", margin: "0 0 4px" }}>{t.name}</p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.65 }}>{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      <P>
        On the <strong>Overview</strong> tab specifically, look for the <strong>Rate Limit</strong> banner (your
        provisioned bandwidth) and, below it, the <strong>A-End</strong> and <strong>Z-End</strong> — the two
        points this service connects. For a Port, that's just one end; for a connection like Cloud Connect or
        DCI, both ends are shown side by side.
      </P>

      <Callout variant="info">
        Until a service actually goes live, you'll see a note that <strong>subscription billing hasn't started
        yet</strong> — dates and charges only apply once the connection is live, not from when you placed the
        order.
      </Callout>

      {/* ── Actions ── */}
      <H2 id="actions">Actions on This Page</H2>
      <UL>
        <LI><strong>Edit</strong> — change the service's configuration where still permitted for its current status.</LI>
        <LI><strong>Raise a Ticket</strong> — opens a ticket pre-linked to this specific service, so support has the right context immediately. See <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
        <LI>The <strong>⋮</strong> menu next to Edit holds less common actions specific to that service type.</LI>
      </UL>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Not sure what a status badge means? <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} />.</LI>
        <LI>Haven't created this service yet? Find its ordering guide under <strong>Products</strong> in the sidebar.</LI>
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
