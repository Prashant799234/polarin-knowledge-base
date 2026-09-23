import { ArticlePage, H1, H2, P, UL, LI, Callout, FieldTable, DocImage, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "org-details", label: "Organization Details",         level: 2 as const },
  { id: "po-settings", label: "PO Settings",                  level: 2 as const },
  { id: "signatory",   label: "Authorised Signatory Details",  level: 2 as const },
  { id: "terms",       label: "Terms & Conditions",            level: 2 as const },
  { id: "next-steps",  label: "Next Steps" },
];

const ORG_FIELDS = [
  { field: "Country Registered In", description: "Where your organisation is legally registered.", required: true },
  { field: "Company Name",          description: "Your organisation's registered legal name.",       required: true },
  { field: "Address",               description: "State/Province, City, and Postal Code.",            required: true },
  { field: "Legal Entity Type",     description: "Individual, Partnership, LLP, Private/Public Limited, or Trust/Society.", required: true },
  { field: "Proof of Identity",     description: "The KYC document for your entity type — see requirements below.", required: true },
];

const SIGNATORY_FIELDS = [
  { field: "Name",             description: "Full name of the person authorised to sign contracts for your organisation.", required: true },
  { field: "Email ID",         description: "Their contact email.", required: true },
  { field: "Phone Number",     description: "With country code.", required: false },
  { field: "Designation",      description: "Their role or title at the organisation.", required: false },
  { field: "Department",       description: "Optional.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function OrgSettingsPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Organisation Settings</H1>
      <ArticleMeta>
        <ReadTime minutes={6} />
        <Dot />
        <Tag label="Organisation" color="#0f766e" />
      </ArticleMeta>

      <P>
        Once your organisation clears verification, its profile lives here — a permanent, editable record
        rather than the one-time setup wizard you filled out in{" "}
        <PageLink label="Complete Your Profile" onClick={() => onNavigate("complete-profile")} />. A{" "}
        <strong>Verified</strong> badge confirms your account is fully approved and can deploy services
        globally. <strong>①</strong> below is the sidebar of four sub-sections; <strong>②</strong> is the
        content for whichever one is selected.
      </P>
      <DocImage
        src="/screenshots/org-settings/01-org-details.jpg"
        alt="Organisation Profile page with Organization Details tab selected"
        caption="① The four sub-sections — ② Organization Details fields (values blurred here for privacy)"
      />

      {/* ── Organization Details ── */}
      <H2 id="org-details">Organization Details</H2>
      <FieldTable rows={ORG_FIELDS} />
      <P>
        Click <strong>Edit</strong> to update these. You have two ways to fill in your address:
      </P>
      <UL>
        <LI><strong>GST Verification (Recommended)</strong> — enter your GSTIN and Polarin instantly auto-fills your Company Name, Address, State/Province, City, and Postal Code from it.</LI>
        <LI><strong>Manual Details</strong> — type everything in yourself, if you'd rather not use GST lookup or don't have one.</LI>
      </UL>
      <Callout variant="important">
        Updating any of this sends your profile <strong>back for re-approval</strong> — you won't be able to
        place new orders until it's re-approved. Existing services and orders are unaffected in the meantime.
      </Callout>
      <P>
        Not sure which document your entity type needs? See{" "}
        <PageLink label="KYC Document Requirements" onClick={() => onNavigate("org-kyc")} />.
      </P>

      {/* ── PO Settings ── */}
      <H2 id="po-settings">PO Settings</H2>
      <P>
        A simple Yes/No: does your organisation issue a <strong>Purchase Order</strong> for invoicing? If yes,
        every invoice will expect a matching PO — see how that plays out during ordering in{" "}
        <PageLink label="Understanding the Service Detail Page" onClick={() => onNavigate("service-detail")} />.
      </P>
      <Callout variant="tip">
        Changing this setting only applies to <strong>new</strong> purchases — anything already ordered keeps
        running under whatever PO setting was active when it was placed.
      </Callout>

      {/* ── Authorised Signatory ── */}
      <H2 id="signatory">Authorised Signatory Details</H2>
      <P>
        The person empowered to sign contracts on your organisation's behalf. This is the same signatory
        collected during initial setup — update it here any time their details change. <strong>①</strong>{" "}
        below is the read-only PO Settings summary, and <strong>②</strong> the Authorised Signatory card
        beneath it.
      </P>
      <DocImage
        src="/screenshots/org-settings/02-po-signatory.jpg"
        alt="PO Settings and Authorised Signatory Details sections"
        caption="① PO Settings — ② Authorised Signatory Details (name and email blurred here for privacy)"
      />
      <P>
        Clicking <strong>Edit</strong> opens the update form: <strong>①</strong> is the contact fields — Name,
        Email ID, Phone Number, and optional Department — and <strong>②</strong> is where you attach two
        supporting documents.
      </P>
      <DocImage
        src="/screenshots/org-settings/03-signatory-drawer.jpg"
        alt="Update Authorised Signatory Details drawer with contact fields and document uploads"
        caption="① Contact fields (blurred here) — ② Supporting Documents upload zones"
      />
      <FieldTable rows={SIGNATORY_FIELDS} />
      <P>The two supporting documents:</P>
      <UL>
        <LI><strong>Proof of Identity of Authorised Signatory</strong></LI>
        <LI><strong>Board Resolution (Power of Attorney)</strong> confirming their authority to sign</LI>
      </UL>
      <P>Both accept PDF, JPG, or PNG, up to 5.0 MB each.</P>

      {/* ── Terms & Conditions ── */}
      <H2 id="terms">Terms &amp; Conditions</H2>
      <P>
        Shows whether you've accepted Polarin's terms, how (typically <strong>Accepted Online</strong>), and
        exactly when — down to the minute. The accepted documents themselves, the Polarin Terms &amp;
        Conditions and the Polarin Service Schedule, are both available to download from here at any time.
      </P>
      <DocImage
        src="/screenshots/org-settings/04-terms.jpg"
        alt="Terms and Conditions section showing accepted status and documents"
        caption="① Accepted status, when it was accepted, and both accepted documents"
      />

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Haven't completed initial setup yet? <PageLink label="Complete Your Profile" onClick={() => onNavigate("complete-profile")} />.</LI>
        <LI>Managing who's on your account instead? <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.</LI>
        <LI>Looking for billing specifically? <PageLink label="Invoices" onClick={() => onNavigate("billing-invoices")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
