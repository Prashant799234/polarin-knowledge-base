import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "step-country",  label: "Step 1 — Select Country",    level: 2 as const },
  { id: "step-org",      label: "Step 2 — Organization Details",   level: 2 as const },
  { id: "step-sign",     label: "Step 3 — Authorised Signatory",   level: 2 as const },
  { id: "step-review",   label: "Step 4 — Terms & Conditions",     level: 2 as const },
  { id: "after-submit",  label: "After Submission" },
];

const SIGNATORY_FIELDS = [
  { field: "Name",        description: "Full name of the person authorised to sign contracts for your organisation.", required: true },
  { field: "Email ID",    description: "Their contact email.", required: true },
  { field: "Phone Number",description: "Select the country code, then enter the number — the form validates length against the country selected.", required: true },
  { field: "Department (Optional)", description: "Their department within the organisation.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CompleteProfilePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Complete Organisation Profile</H1>
      <ArticleMeta>
        <ReadTime minutes={6} />
        <Dot />
        <Tag label="Required" color="#e11d48" />
      </ArticleMeta>

      <P>
        Right after your first sign-in, Polarin shows a <strong>"Why complete your organization profile?"</strong>{" "}
        screen: two reasons — <strong>Access all services</strong> (you cannot order or manage anything without
        this) and <strong>One-time setup</strong> (do it once, it covers every future order) — plus a note that it
        only takes a couple of minutes and your progress saves automatically.
      </P>
      <DocImage
        src="/screenshots/complete-profile/01-why-complete.jpg"
        alt="Why complete your organization profile screen with Access all services and One-time setup benefits"
        caption="Name blurred here for privacy"
      />
      <P>
        Click <strong>Complete Organization Profile</strong> to start the four-step wizard. If you click{" "}
        <strong>Skip for now → Explore Polarin</strong> instead, a confirmation screen spells out exactly what
        you'll be giving up until you come back and finish it:
      </P>
      <DocImage
        src="/screenshots/complete-profile/02-skip-warning.jpg"
        alt="Skip Organization Profile Setup confirmation listing what you lose access to"
        caption="Without a completed profile you can't order services, access service management features, or get priority support"
      />
      <Callout variant="tip">
        Skipping isn't permanent — the prompt itself says you can finish setup <strong>anytime from your
        dashboard</strong>. There's no penalty for coming back to it later.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="step-country">Step 1 — Select Country</H2>
      <P>
        Search or scroll a flag-by-flag country list and pick where your organisation is <strong>legally
        registered</strong> — not necessarily where you personally sit. This is the most consequential choice in
        the wizard: it decides whether instant GST-based verification is available (India only, for now) and
        exactly which document checklist Step 2 asks for.
      </P>
      <DocImage
        src="/screenshots/complete-profile/03-select-country.jpg"
        alt="Select Country step with searchable, flag-labelled country list"
        caption="Countries are grouped alphabetically with a live search box above the list"
      />

      {/* ── Step 2 ── */}
      <H2 id="step-org">Step 2 — Organization Details</H2>
      <P>
        What this step asks for depends on your Step 1 country. For India, you choose between two tabs:
      </P>
      <UL>
        <LI><strong>GST Verification (Recommended)</strong> — enter a GSTIN (format hint: <em>22AAAAA0000A1Z5</em>) and click <strong>Verify</strong>; Polarin auto-fills your Company Name and address from it.</LI>
        <LI><strong>Manual Details</strong> — type in Company Name, Address, City, State/Province, and Postal Code yourself.</LI>
      </UL>
      <DocImage
        src="/screenshots/complete-profile/04-org-details.jpg"
        alt="Organization Details step showing GST Verification and Manual Details tabs"
        caption="GST Verification is recommended — Manual Details is always available as a fallback"
      />
      <P>
        Below the address, pick your <strong>Legal Entity Type</strong> (Individual, Partnership, LLP, Private
        Limited, and so on). The form immediately reveals the exact supporting document that entity type needs —
        for example, <strong>Individual</strong> asks for an <strong>Aadhaar / Voter ID</strong> upload. Not sure
        which document your country and entity type will need? See{" "}
        <PageLink label="KYC Document Requirements" onClick={() => onNavigate("org-kyc")} /> before you start.
      </P>
      <DocImage
        src="/screenshots/complete-profile/05-legal-entity.jpg"
        alt="Legal Entity Type dropdown with the resulting document upload requirement"
        caption="Selecting a Legal Entity Type immediately reveals the document it requires — uploaded file name blurred here"
      />
      <P>
        Finally, answer <strong>"Does your organization issue a Purchase Order for Invoicing?"</strong> — Yes
        ("My organisation issues a PO for every Invoice") or No ("My organisation does not Issue a PO"). This
        sets the PO behaviour you'll see later in every checkout across Polarin.
      </P>

      {/* ── Step 3 ── */}
      <H2 id="step-sign">Step 3 — Authorised Signatory</H2>
      <P>
        The authorised signatory is the person empowered to sign contracts on your organisation's behalf — same
        requirement regardless of country or entity type.
      </P>
      <FieldTable rows={SIGNATORY_FIELDS} />
      <DocImage
        src="/screenshots/complete-profile/06-signatory.jpg"
        alt="Authorised Signatory step with contact fields and document upload"
        caption="Name, Email ID, and the phone autofill suggestion blurred here for privacy"
      />
      <P>Two supporting documents go with it, each as its own drag-and-drop upload (PDF, JPG, or PNG, up to 5.0 MB):</P>
      <UL>
        <LI><strong>Proof of Identity</strong> of the authorised signatory.</LI>
        <LI><strong>Board Resolution (Power of Attorney)</strong> confirming their authority to sign.</LI>
      </UL>

      {/* ── Step 4 ── */}
      <H2 id="step-review">Step 4 — Terms &amp; Conditions</H2>
      <P>
        This is a one-time acceptance for your whole organisation — accept it here and you won't need to accept
        terms again on individual orders. Polarin Terms &amp; Conditions and the Polarin Service Schedule are
        both linked for review before you choose. Three options are available:
      </P>
      <UL>
        <LI><strong>I accept the Terms and Conditions</strong> (Recommended) — review and accept the Polarin Terms &amp; Conditions and Service Schedule shared here.</LI>
        <LI><strong>I have an existing agreement with Lightstorm</strong> — if you already have a pre-existing agreement in place, Polarin's legal team will contact you to finalise any addendum if required.</LI>
        <LI><strong>I want to review agreement offline</strong> — choose this to review the documents with your legal team and discuss offline first.</LI>
      </UL>
      <DocImage
        src="/screenshots/complete-profile/07-terms.jpg"
        alt="Terms and Conditions step with three acceptance options"
        caption="The signed document is stored permanently on your organisation profile once accepted"
      />
      <P>Click <strong>Submit for Review</strong> to finish.</P>

      <H2 id="after-submit">After Submission</H2>
      <P>
        Your dashboard immediately shows an <strong>"Organization Profile Under Review"</strong> banner — "Your
        profile has been submitted and is currently being reviewed. We'll notify you once the verification is
        complete. This typically takes 24–48 hours." — with a <strong>Check Details</strong> link if you want to
        see what was submitted.
      </P>
      <DocImage
        src="/screenshots/complete-profile/08-under-review.jpg"
        alt="Dashboard showing the Organization Profile Under Review banner"
        caption="Name and avatar blurred here for privacy"
      />
      <P>What happens next:</P>
      <UL>
        <LI>The profile enters <strong>pending review</strong> — typically 24–48 business hours.</LI>
        <LI>You'll receive an email notification once review is complete.</LI>
        <LI>Once approved, you can immediately order services — a <PageLink label="Port" onClick={() => onNavigate("port-create")} />, a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-create")} />, or any Virtual Connection or DCI product.</LI>
      </UL>
      <Callout variant="info">
        Once approved, every detail submitted here becomes editable (and re-reviewable) from{" "}
        <PageLink label="Organisation Settings" onClick={() => onNavigate("org-settings")} />.
      </Callout>
    </ArticlePage>
  );
}
