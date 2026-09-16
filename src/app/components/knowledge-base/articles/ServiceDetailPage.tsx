import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "tabs",       label: "The Tabs",            level: 2 as const },
  { id: "track-order", label: "Track Order",        level: 2 as const },
  { id: "overview-tab", label: "The Overview Tab",  level: 2 as const },
  { id: "billing-tabs", label: "Subscription & Invoices", level: 2 as const },
  { id: "filtering",  label: "Finding a Service",   level: 2 as const },
  { id: "actions",    label: "Actions on This Page", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

const TABS = [
  { name: "Track Order",         description: "Only shown while a service is still being provisioned — a step-by-step timeline from order validation through to going live." },
  { name: "Overview",            description: "The service's rate limit, any add-ons, its A-End and Z-End connection points, and (once billing starts) subscription and PO details." },
  { name: "Connections",         description: "Port only — every service currently running over that Port, plus a shortcut to add another." },
  { name: "Subscription",        description: "Plan, term, renewal, and subscription-specific details for this service." },
  { name: "Invoices & Payments", description: "This month's estimated charge, when the next invoice generates, and a full cost breakdown." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ServiceDetailPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Understanding the Service Detail Page</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={7} />
        <Dot />
        <Tag label="Service Management" color="#1c808d" />
      </div>

      <P>
        Every service you provision — a Port, a Virtual Connection, a Virtual Router, a DCI connection — opens
        into the <strong>same kind of detail page</strong>. Once you know how to read one, you know how to read
        all of them.
      </P>

      <P>
        Open it from the <strong>Services</strong> list on the left, or by selecting the service from any list
        showing your services. The header always shows the service's name, its current status badge (see{" "}
        <PageLink label="Understanding Service Status" onClick={() => onNavigate("service-status")} />), when it was created, and its unique Service ID — click the copy icon next to the ID to copy it, useful when raising a ticket about that specific service.
      </P>

      {/* ── Tabs ── */}
      <H2 id="tabs">The Tabs</H2>
      <P>
        Not every service shows every tab — which ones appear depends on the product and its current status:
      </P>
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
        <strong>①</strong> below is the header row you'll see on almost every service — status, created date,{" "}
        <strong>Raise a Ticket</strong>, and <strong>Edit</strong> (or, for a Port, <strong>Add Connection</strong>{" "}
        instead). <strong>②</strong> is the tab bar itself, right underneath.
      </P>
      <DocImage
        src="/screenshots/services/01-tabs-actions.jpg"
        alt="Service detail page header actions and tab bar"
        caption="① Header actions (Raise a Ticket, Edit) — ② the tab bar"
      />

      {/* ── Track Order ── */}
      <H2 id="track-order">Track Order</H2>
      <P>While a service is still being provisioned, its detail page opens straight to a timeline like this one:</P>
      <DocImage
        src="/screenshots/services/05-track-order.jpg"
        alt="Track Order tab showing the provisioning timeline for a Port"
        caption="① The tab bar with Track Order active — ② Purchase Order Required step — ③ Cross Connect in process"
      />
      <UL>
        <LI><strong>Order Details Validated</strong> — your order information has been reviewed and approved.</LI>
        <LI><strong>Purchase Order Required ②</strong> — appears only if your organisation issues POs for invoicing (see <PageLink label="Organisation Settings" onClick={() => onNavigate("org-settings")} />). Provide it before the stated deadline via <strong>Update PO Details</strong>, or provisioning stalls here.</LI>
        <LI><strong>Deployed</strong> — provisioning is complete and the resource is operational.</LI>
        <LI><strong>Ready to Patch</strong> — for a Port specifically, Lightstorm is arranging the physical cross-connect at the data centre, shown as <strong>Cross Connect ③</strong> with an "In process" badge.</LI>
        <LI><strong>Live</strong> — the final step. Once reached, the Track Order tab disappears and Overview becomes the default.</LI>
      </UL>
      <Callout variant="tip">
        Each completed step shows the exact date and time it happened — useful context to have ready if you end
        up raising a ticket about a delay.
      </Callout>

      {/* ── Overview tab ── */}
      <H2 id="overview-tab">The Overview Tab</H2>
      <P>
        <strong>①</strong> is the <strong>Rate Limit</strong> banner — your provisioned bandwidth. If a temporary
        bandwidth add-on is active, it shows alongside as its own line (as <strong>Temp Add-on</strong> below),
        editable or removable independently of the base rate.
      </P>
      <DocImage
        src="/screenshots/services/03-rate-limit-addon.jpg"
        alt="Effective Rate Limit banner with a temporary bandwidth add-on"
        caption="① Tab bar with Track Order still present — ② Effective Rate Limit, split into base rate and a Temp Add-on"
      />
      <P>
        Below that, the <strong>A-End</strong> and <strong>Z-End</strong> cards (<strong>②</strong> below) show
        the two points this service connects. For a Port, that's just one end; for a Virtual Connection or DCI,
        both ends are shown side by side. <strong>③</strong> is <strong>Subscription Details</strong>, which
        fills in once billing starts.
      </P>
      <DocImage
        src="/screenshots/services/02-overview-detail.jpg"
        alt="Service Overview tab with rate limit, A-End/Z-End, and subscription details"
        caption="① Rate Limit — ② A-End / Z-End connection points — ③ Subscription Details"
      />
      <Callout variant="info">
        Until a service actually goes live, you'll see a note that <strong>subscription billing hasn't started
        yet</strong> — dates and charges only apply once the connection is live, not from when you placed the
        order.
      </Callout>
      <P>
        Further down, <strong>PO Details</strong> shows your Purchase Order number and dates if your
        organisation uses them — editable inline via its own <strong>Update</strong> link.
      </P>

      {/* ── Subscription & Invoices ── */}
      <H2 id="billing-tabs">Subscription &amp; Invoices</H2>
      <P>
        The <strong>Invoices &amp; Payments</strong> tab breaks down exactly what this service will cost:
      </P>
      <DocImage
        src="/screenshots/services/04-invoices.jpg"
        alt="Invoices and Payments tab with cost breakdown"
        caption="① Estimated total for this month — ② next invoice date — ③ line-by-line breakdown (base + VISTA)"
      />
      <UL>
        <LI><strong>Estimated This Month ①</strong> — base rate plus any add-ons, combined into one number.</LI>
        <LI><strong>Invoice generation date ②</strong> — exactly when the next invoice will be raised.</LI>
        <LI><strong>Current Invoice Amount Breakdown ③</strong> — the base connection charge, plus any VISTA monitoring tier attached to it, itemised separately.</LI>
        <LI><strong>Estimated Monthly, One-time Upfront, and Add-ons Monthly</strong> — shown as three separate totals underneath, so nothing is bundled together unexpectedly.</LI>
      </UL>

      {/* ── Finding a service ── */}
      <H2 id="filtering">Finding a Service</H2>
      <P>
        Every service list has a search box plus quick filter chips for <strong>Live</strong> and{" "}
        <strong>Down</strong>. For anything more specific, <strong>Advance Filter</strong> opens a full panel:
      </P>
      <DocImage
        src="/screenshots/services/06-advance-filter.jpg"
        alt="Advance Filter panel with status and term options"
        caption="① Filter by any status — ② filter by subscription term, from PAYG to 60 months"
      />
      <P>
        Beyond Status and Term, it also filters by <strong>Subscription</strong> (Active/Terminated) and a{" "}
        <strong>Created Date Range</strong> — useful for finding, say, everything ordered last quarter that's
        still sitting in Design.
      </P>

      {/* ── Actions ── */}
      <H2 id="actions">Actions on This Page</H2>
      <UL>
        <LI><strong>Edit</strong> — change the service's configuration where still permitted for its current status.</LI>
        <LI><strong>Raise a Ticket</strong> — opens a ticket pre-linked to this specific service, so support has the right context immediately. See <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.</LI>
        <LI><strong>Add Connection</strong> — Port only, from the Connections tab, to attach another service to that Port without leaving the page.</LI>
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
