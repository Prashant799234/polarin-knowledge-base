import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "why-kyc",       label: "Why KYC?",                level: 2 as const },
  { id: "org-details",   label: "Organisation Details",    level: 2 as const },
  { id: "auth-sign",     label: "Authorised Signatory",    level: 2 as const },
  { id: "after-submit",  label: "After Submission" },
];

export function CompleteProfilePage({ onNavigate }: { onNavigate: (p: KBPage) => void }) {
  return (
    <ArticlePage
      toc={TOC}
      prev={{ label: "Create a Polarin Account",    pageId: "create-account" }}
      next={{ label: "KYC Document Requirements",   pageId: "org-kyc" }}
      related={[
        { label: "KYC Document Requirements", pageId: "org-kyc" },
        { label: "Invite Team Members",       pageId: "invite-members" },
        { label: "Create a Polarin Account",  pageId: "create-account" },
      ]}
      onNavigate={onNavigate}
    >
      <Breadcrumb items={["Home", "Get Started", "Organisation Profile", "Complete Organisation Profile"]} />

      <H1 id="overview">Complete Organisation Profile</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Required" color="#e11d48" />
      </div>

      <P>
        Before you can subscribe to any Polarin service, your organisation must pass a one-time KYC (Know Your Customer) verification. This involves submitting your legal entity details and authorised signatory information, which the Polarin team reviews before activating your account.
      </P>

      <H2 id="why-kyc">Why KYC?</H2>
      <P>
        Polarin is a carrier-grade platform handling real network infrastructure. KYC verification ensures that every organisation on the platform is legitimate, prevents fraud, and keeps the ecosystem secure for all users. The process is completed once — after approval, you can subscribe to services without re-verifying.
      </P>
      <Callout variant="important">
        Your organisation profile must be <strong>verified by the Polarin team</strong> before you can subscribe to any service. Completing this step early avoids delays when you're ready to provision connections.
      </Callout>

      <H2 id="org-details">Step 1 — Fill in Organisation Details</H2>
      <P>Navigate to <strong>Organisation → Profile</strong> in the left sidebar, then click <strong>Setup The Organisation Profile</strong>.</P>

      <DocImage src="https://docs.polarin.lightstorm.net/org.png" alt="Organisation Profile landing page" caption="Click 'Setup The Organisation Profile' to begin." />

      <P>In the <strong>Organisation Details</strong> section, complete the following fields:</P>

      <FieldTable rows={[
        { field: "Legal Entity",      description: "The registered legal name of your organisation.",                                                      required: true  },
        { field: "Phone Number",      description: "Select the country code from the dropdown and enter your organisation's contact number.",              required: true  },
        { field: "Organisation PAN",  description: "Your organisation's PAN number (applicable for Indian entities).",                                     required: true  },
        { field: "Proof of Identity", description: "Upload a document from the supported KYC list. Accepted formats: PNG, JPEG, PDF. Max size: 10 MB.",    required: true  },
      ]} />

      <DocImage src="https://docs.polarin.lightstorm.net/org_2.png" alt="Organisation Details form" caption="Fields marked with an asterisk (*) are mandatory." />

      <Callout variant="info">
        For the full list of accepted identity documents by entity type, see <button onClick={() => {}} style={{ background: "none", border: "none", color: "#1c808d", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 14 }}>KYC Document Requirements</button>.
      </Callout>

      <DocImage src="https://docs.polarin.lightstorm.net/org_3.png" alt="Proof of Identity upload" caption="After uploading, a preview of your document appears in the field." />

      <Steps>
        <Step num={1} title="Navigate to Organisation → Profile">
          From the left sidebar, select <strong>Organisation</strong>, then click <strong>Profile</strong>.
        </Step>
        <Step num={2} title="Click Setup The Organisation Profile">
          On the Complete Your Organisation Profile page, click the setup button to open the form.
        </Step>
        <Step num={3} title="Complete Organisation Details">
          Fill in your Legal Entity name, phone number, PAN, and upload your Proof of Identity document.
        </Step>
        <Step num={4} title="Click Save & Next">
          Save the organisation details section and proceed to the Authorised Signatory section.
        </Step>
      </Steps>

      <H2 id="auth-sign">Step 2 — Authorised Signatory</H2>
      <P>
        The authorised signatory is the person empowered to sign contracts on behalf of your organisation. Their details are required alongside a Letter of Authorisation.
      </P>

      <DocImage src="https://docs.polarin.lightstorm.net/org_4.png" alt="Authorised Signatory section" caption="Enter the signatory's name, email, and upload a Letter of Authorisation." />

      <FieldTable rows={[
        { field: "Name",                    description: "Full name of the authorised signatory.",                                                  required: true },
        { field: "Email",                   description: "Valid email address of the authorised signatory.",                                        required: true },
        { field: "Letter of Authorisation", description: "Official letter confirming this person's authority to act on behalf of the organisation.", required: true },
      ]} />

      <Steps>
        <Step num={5} title="Fill in Authorised Signatory details">
          Enter the signatory's name and email, then upload the Letter of Authorisation.
        </Step>
        <Step num={6} title="Click Submit">
          Submit the complete profile for review. You'll see a confirmation message on screen.
        </Step>
      </Steps>

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

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#cbd5e1", fontSize: 12 }}>›</span>}
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: i === items.length - 1 ? "#0a3954" : "#94a3b8", fontWeight: i === items.length - 1 ? 600 : 400 }}>{item}</span>
        </span>
      ))}
    </div>
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
