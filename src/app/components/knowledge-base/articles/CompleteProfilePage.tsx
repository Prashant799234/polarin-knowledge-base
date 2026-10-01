import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "step-country",  label: "Step 1 — Select Your Country",    level: 2 as const },
  { id: "step-org",      label: "Step 2 — Organisation Details",   level: 2 as const },
  { id: "step-sign",     label: "Step 3 — Authorised Signatory",   level: 2 as const },
  { id: "step-review",   label: "Step 4 — Review & Submit",        level: 2 as const },
  { id: "after-submit",  label: "After Submission" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CompleteProfilePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Complete Organisation Profile</H1>
      <ArticleMeta>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Required" color="#e11d48" />
      </ArticleMeta>

      <P>
        Before you can subscribe to any Polarin service, your organisation must pass a one-time KYC (Know Your Customer) verification. It's a short, four-step wizard — select your country, fill in organisation details, add an authorised signatory, then review and submit — and the Polarin team reviews it before activating your account.
      </P>

      <Callout variant="important">
        Your organisation profile must be <strong>verified by the Polarin team</strong> before you can subscribe to any service. Completing this step early avoids delays when you're ready to provision connections.
      </Callout>

      {/* ── Step 1 ── */}
      <H2 id="step-country">Step 1 — Select Your Country</H2>
      <P>
        This is the first and most consequential choice in the whole wizard. The country you select here decides everything that follows: whether instant GST-based verification is available to you (India only, for now), and which document checklist the rest of the form will ask for.
      </P>
      <Callout variant="tip">
        Choose carefully — this should be the country your organisation is legally registered in, not necessarily where you personally are based.
      </Callout>

      {/* ── Step 2 ── */}
      <H2 id="step-org">Step 2 — Organisation Details</H2>
      <P>
        What this step asks for depends on the country you selected in Step 1:
      </P>
      <UL>
        <LI><strong>India</strong> — choose between <strong>GST Verification</strong> (recommended) and <strong>Manual Details</strong>. With GST Verification, enter your GSTIN and Polarin instantly fetches your legal name, address, and state from government records for you to review and confirm. Prefer not to use GST lookup? Switch to Manual Details and type in Company Name, Address, Postal Code, City, and State yourself.</LI>
        <LI><strong>Every other country</strong> — only Manual Details is available: Company Name, Address, Postal Code, City, and State/Province, entered directly.</LI>
      </UL>
      <P>
        Next, select your <strong>Legal Entity Type</strong> from the dropdown (Individual, Company, Partnership, LLP, and so on, depending on your country). As soon as you do, the form reveals exactly the supporting document you need to upload for that entity type — for example, selecting "Company" outside India surfaces an upload field for your Establishment Card or Company Registration Certificate.
      </P>
      <Callout variant="info">
        Not sure which document your country and entity type will ask for? See the full breakdown in <PageLink label="KYC Document Requirements" onClick={() => onNavigate("org-kyc")} /> before you start.
      </Callout>
      <P>
        Finally, answer <strong>"Does your organisation issue a Purchase Order for Invoicing?"</strong> This is a simple Yes/No that determines whether future invoices will expect a matching PO number.
      </P>

      <Steps>
        <Step num={1} title="Confirm your selected country">
          Shown at the top of the step — go back to Step 1 if it's wrong before continuing.
        </Step>
        <Step num={2} title="Verify via GST, or enter details manually">
          In India, use GST Verification for an instant auto-fill, or switch to Manual Details. Everywhere else, fill in your organisation address directly.
        </Step>
        <Step num={3} title="Select your Legal Entity Type">
          Choose the option matching your organisation's registered structure. The required document upload field appears immediately below.
        </Step>
        <Step num={4} title="Upload the requested document and answer the PO question">
          Attach the document shown for your entity type, then answer whether your organisation issues a Purchase Order for invoicing.
        </Step>
      </Steps>

      {/* ── Step 3 ── */}
      <H2 id="step-sign">Step 3 — Authorised Signatory</H2>
      <P>
        The authorised signatory is the person empowered to sign contracts on behalf of your organisation. This requirement is the same in every country and for every entity type.
      </P>

      <FieldTable rows={[
        { field: "Name",                              description: "Full name of the authorised signatory.",                                                 required: true  },
        { field: "Email",                              description: "Valid email address of the authorised signatory.",                                      required: true  },
        { field: "Phone Number",                       description: "With country code.",                                                                     required: false },
        { field: "Designation",                        description: "Their role or title at the organisation.",                                              required: false },
        { field: "Proof of Identity",                  description: "A government-issued ID for the authorised signatory.",                                   required: true  },
        { field: "Board Resolution / Power of Attorney", description: "Confirms this person's authority to act on behalf of the organisation.",                required: true  },
      ]} />

      <Steps>
        <Step num={5} title="Fill in Authorised Signatory details">
          Enter the signatory's name, email, and (optionally) phone number and designation.
        </Step>
        <Step num={6} title="Upload the two supporting documents">
          Attach the signatory's Proof of Identity and the Board Resolution or Power of Attorney, then continue.
        </Step>
      </Steps>

      {/* ── Step 4 ── */}
      <H2 id="step-review">Step 4 — Review & Submit</H2>
      <P>
        A final summary screen shows everything entered across the previous three steps. Check it over, then submit — this sends your profile to the Polarin team for review.
      </P>

      <H2 id="after-submit">After Submission</H2>
      <Callout variant="tip">
        Once submitted, you'll see an <strong>"Organisation profile submitted"</strong> confirmation banner. The Polarin team will review your documents, and you will be notified by email once your organisation is verified.
      </Callout>
      <P>What happens next:</P>
      <UL>
        <LI>The profile enters a <strong>pending review</strong> state — typically completed within 1–2 business days.</LI>
        <LI>You'll receive an email notification when the review is complete.</LI>
        <LI>Once approved, you can immediately subscribe to Polarin services such as virtual connections, cloud connect, and DCI.</LI>
      </UL>
    </ArticlePage>
  );
}
