import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",         label: "Overview" },
  { id: "empty-state",      label: "Before Your First Invoice", level: 2 as const },
  { id: "invoices-list",    label: "The Invoices List",        level: 2 as const },
  { id: "search-filter",    label: "Search & Date Filter",     level: 2 as const },
  { id: "downloading",      label: "Downloading an Invoice",   level: 2 as const },
  { id: "field-reference",  label: "Field Reference" },
  { id: "next-steps",       label: "Next Steps" },
];

const INVOICE_FIELDS = [
  { field: "Invoice No",             description: "The unique invoice number, formatted like a short reference code (e.g. 26-27LTCKAP01004).", required: false },
  { field: "Invoice Date",           description: "When the invoice was generated, shown as a full timestamp with timezone offset.", required: false },
  { field: "Invoice Total Amount",   description: "The total billed amount in your billing currency. Sortable — click the column header to toggle ascending/descending.", required: false },
  { field: "PO Number",              description: "The purchase order reference for that invoice, if your organisation issues one. Sortable.", required: false },
  { field: "Billing Profile",        description: "The billing profile the invoice was issued against, shown by its internal ID. Filterable via the funnel icon in the column header.", required: false },
  { field: "Actions",                description: "A download icon that saves the invoice as a PDF.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function BillingInvoicesPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Invoices</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Billing" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Invoices</strong> lives in the top navigation bar alongside Dashboard, Services, Settings, and
        Help — not under Settings like most other billing screens. It lists every invoice generated for your
        organisation, with search, date filtering, and one-click PDF downloads.
      </P>

      {/* ── Empty state ── */}
      <H2 id="empty-state">Before Your First Invoice</H2>
      <P>
        If nothing has been billed yet, the page shows an empty state instead of a table:
      </P>
      <DocImage
        src="/screenshots/billing/01-invoices-empty.jpg"
        alt="Invoices page empty state showing 'No Invoice Generated Yet!'"
        caption="No invoices yet — the table is replaced with this message until your first one is generated."
      />
      <P>
        Invoices are generated once your{" "}
        <PageLink label="Billing Cycle" onClick={() => onNavigate("billing-overview")} /> runs its first cycle
        against a <strong>Live</strong> service — see{" "}
        <PageLink label="Invoice Lifecycle" onClick={() => onNavigate("billing-overview")} /> for how that
        timing works.
      </P>

      {/* ── Invoices list ── */}
      <H2 id="invoices-list">The Invoices List</H2>
      <P>Once invoices exist, the page lists them in a table:</P>
      <DocImage
        src="/screenshots/billing/02-invoices-list.jpg"
        alt="Invoices list with Invoice No, Invoice Date, Invoice Total Amount, PO Number, Billing Profile, and Actions columns"
        caption="Customer and billing profile details blurred here for privacy."
      />
      <UL>
        <LI><strong>Invoice No</strong> and <strong>Invoice Date</strong> identify and timestamp the invoice — dates currently display as a raw timestamp rather than a formatted date.</LI>
        <LI><strong>Invoice Total Amount</strong> and <strong>PO Number</strong> are both sortable — click the arrows in either column header to reorder the list.</LI>
        <LI><strong>Billing Profile</strong> can be filtered via the funnel icon in its column header, useful if your organisation bills against more than one{" "}
          <PageLink label="Billing Profile" onClick={() => onNavigate("billing-profile")} />.</LI>
      </UL>

      {/* ── Search & filter ── */}
      <H2 id="search-filter">Search & Date Filter</H2>
      <UL>
        <LI><strong>Search by Invoice ID</strong> — type or paste an invoice number to jump straight to it.</LI>
        <LI><strong>Start Date / End Date</strong> — click either field to open a dual-month calendar. Pick a start day, then an end day; the range between them highlights automatically. The swap icon between the two fields flips start and end.</LI>
      </UL>
      <DocImage
        src="/screenshots/billing/03-invoices-date-filter.jpg"
        alt="Date range calendar picker open over the invoices list, showing a selected range from October 1 to November 29"
        caption="Apply stays disabled until both a start and end date are picked."
      />
      <Callout variant="info">
        <strong>Apply</strong> only lights up once a full range is selected — picking just a start date isn't enough to filter.
      </Callout>

      {/* ── Downloading ── */}
      <H2 id="downloading">Downloading an Invoice</H2>
      <P>
        Click the download icon in the <strong>Actions</strong> column to save that invoice as a PDF. The file
        downloads with a long, system-generated filename rather than the invoice number.
      </P>
      <Callout variant="warning">
        If your browser reports something like <em>"Insecure download blocked"</em> instead of saving the file,
        try again or use a different browser — this is a browser-side download-security check, not a sign that
        anything is wrong with your invoice. If it keeps happening, raise it via{" "}
        <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.
      </Callout>

      {/* ── Field reference ── */}
      <H2 id="field-reference">Field Reference</H2>
      <FieldTable rows={INVOICE_FIELDS} />

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Understand how invoices are generated: <PageLink label="Billing Overview" onClick={() => onNavigate("billing-overview")} />.</LI>
        <LI>Manage the legal entity and tax details invoices are issued against: <PageLink label="Billing Profile" onClick={() => onNavigate("billing-profile")} />.</LI>
        <LI>Set whether your organisation requires a Purchase Order on every order: <PageLink label="Organisation Settings" onClick={() => onNavigate("org-settings")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
