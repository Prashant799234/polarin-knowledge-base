import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "importance",          label: "Why Billing Profiles Matter",     level: 2 as const },
  { id: "viewing-profiles",    label: "Viewing Your Billing Profiles",   level: 2 as const },
  { id: "add-profile-flow",    label: "Step-by-Step: Adding a Profile" },
  { id: "step-1-details",      label: "Step 1: Tax & Business Details",  level: 2 as const },
  { id: "step-2-contact",      label: "Step 2: Primary Billing Contact", level: 2 as const },
  { id: "field-reference",     label: "Field Reference Table" },
  { id: "managing-profiles",   label: "Managing & Editing Profiles" },
  { id: "faq",                 label: "Frequently Asked Questions" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function BillingProfilePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Billing Profile</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Finance & Admin" color="#0d9488" />
      </div>

      <P>
        A <strong>Billing Profile</strong> in Polarin connects your legal entity, official tax identification (such as GSTIN in India or regional tax registration numbers globally), registered office address, and designated billing contact to your network services.
      </P>

      <P>
        Every service you provision on Polarin — whether it is a physical Port, Cloud Connect Virtual Connection, Virtual Router, or Data Centre Interconnect — must be attached to a verified Billing Profile so invoices and tax compliance documents are accurately issued.
      </P>

      <Callout variant="tip">
        Organisations with multiple operating branches or operating across state lines can register multiple Billing Profiles. When ordering a connection, you can choose which state or legal entity will be billed.
      </Callout>

      {/* ── Why Billing Profiles Matter ── */}
      <H2 id="importance">Why Billing Profiles Matter</H2>
      <P>
        Polarin provides on-demand enterprise networking infrastructure. Setting up your Billing Profile correctly ensures:
      </P>
      <UL>
        <LI><strong>Instant Tax Compliance</strong>: Automatic verification of your GST number against official government tax registries eliminates manual document review delays.</LI>
        <LI><strong>Input Tax Credit (ITC) Protection</strong>: Accurate legal entity names and state-specific GSTINs ensure your finance department can claim eligible tax credits seamlessly.</LI>
        <LI><strong>Direct Invoice Delivery</strong>: Monthly invoices, dynamic bandwidth usage summaries, and credit memos are dispatched automatically to your designated billing team.</LI>
      </UL>

      {/* ── Viewing Profiles ── */}
      <H2 id="viewing-profiles">Viewing Your Billing Profiles</H2>
      <P>
        To access your billing profiles, click <strong>Settings</strong> from the top navigation bar, then select <strong>Billing Profile</strong> from the left sidebar under the <em>ORGANISATION</em> section.
      </P>

      <DocImage
        src="/screenshots/billing/01-billing-profiles-list.jpg"
        alt="Polarin Billing Profiles List View"
        caption="Billing Profiles Dashboard: (1) Add Billing Profile CTA, (2) Search & state/country filters, (3) Registered billing entity cards showing tax ID and status."
      />

      <P>
        The main screen presents all billing entities registered to your organisation:
      </P>
      <UL>
        <LI><strong>Badge 1 — + Add Billing Profile</strong>: Opens the step-by-step setup drawer to register a new legal entity or state tax profile.</LI>
        <LI><strong>Badge 2 — Search & Filters</strong>: Quickly locate existing billing profiles by typing the legal company name or GST number, or filter by Country and State.</LI>
        <LI><strong>Badge 3 — Profile Cards</strong>: Displays legal entity name, operating country, registered state, verified GST/Tax registration number, active status tag (such as <em>In Use</em>), and an instant link to download uploaded certificates.</LI>
      </UL>

      {/* ── Add Profile Flow ── */}
      <H2 id="add-profile-flow">Step-by-Step: Adding a New Billing Profile</H2>
      <P>
        Adding a billing profile is a two-step guided workflow with automated verification. Follow the steps below:
      </P>

      <H3 id="step-1-details">Step 1: Tax & Business Details Verification</H3>
      <P>
        Click the <strong>+ Add Billing Profile</strong> button in the upper-right corner of the screen.
      </P>

      <DocImage
        src="/screenshots/billing/02-billing-add-step1-details.jpg"
        alt="Step 1 - Billing Details and GST Verification"
        caption="Step 1: (1) Instant GST verification checkmark, (2) Auto-procured business name & address, (3) Preferred billing currency, (4) Document attachment, (5) Next button."
      />

      <Steps>
        <Step num={1} title="Select Country">
          Choose the country where your legal entity is incorporated (e.g., <strong>India</strong>, <strong>United States</strong>, or regional APAC/EMEA countries).
        </Step>
        <Step num={2} title="Enter GST / Tax Registration Number & Verify">
          Type your official 15-digit GSTIN (or country tax identifier) and click <strong>Verify</strong>.
          Polarin instantly validates the number against the central tax database. A green checkmark reading <em>GST Number verified</em> appears (<strong>Badge 1</strong>).
        </Step>
        <Step num={3} title="Review Auto-Procured Business Details">
          Upon verification, Polarin automatically extracts and populates your official registered data (<strong>Badge 2</strong>):
          <UL>
            <LI><strong>Legal Entity Name</strong>: Official company name registered with the tax authority.</LI>
            <LI><strong>State / Province</strong>: State code and jurisdiction (e.g., Maharashtra, Karnataka).</LI>
            <LI><strong>City & Postal Code</strong>: Registered city and PIN/postal code.</LI>
            <LI><strong>Registered Address</strong>: Official headquarters or local branch premise address.</LI>
          </UL>
        </Step>
        <Step num={4} title="Choose Billing Currency">
          Select your organisation's preferred billing currency (<strong>Badge 3</strong>). Available options include <strong>INR</strong> (Indian Rupee) and <strong>USD</strong> (United States Dollar).
        </Step>
        <Step num={5} title="Upload Tax Registration / GST Certificate">
          Upload a clear copy of your GST registration certificate or regional tax exemption certificate in PDF, JPG, or PNG format (up to 10 MB) via the upload box (<strong>Badge 4</strong>).
        </Step>
        <Step num={6} title="Proceed to Contact Details">
          Click <strong>Next - Billing Contact →</strong> (<strong>Badge 5</strong>) to proceed to the contact details step.
        </Step>
      </Steps>

      {/* ── Step 2 Contact ── */}
      <H3 id="step-2-contact">Step 2: Primary Billing Contact</H3>
      <P>
        In Step 2, designate the primary contact officer responsible for invoice payments, accounts payable, and billing notices.
      </P>

      <DocImage
        src="/screenshots/billing/03-billing-add-step2-contact.jpg"
        alt="Step 2 - Billing Contact Details"
        caption="Step 2: (1) Billing contact name, (2) Invoice delivery email address, (3) Phone number with country code, (4) Workflow step progress."
      />

      <Steps>
        <Step num={1} title="Enter Billing Contact Name">
          Enter the full name of the finance representative, accounts payable manager, or commercial owner (<strong>Badge 1</strong>).
        </Step>
        <Step num={2} title="Enter Invoicing Email Address">
          Specify the corporate email address where recurring monthly invoices, dynamic add-on charges, and payment receipts must be sent (<strong>Badge 2</strong>).
          <Callout variant="tip">
            We recommend using a centralized accounts payable distribution list (e.g., <code>ap@company.com</code> or <code>finance@company.com</code>) so your team receives billing alerts without disruption.
          </Callout>
        </Step>
        <Step num={3} title="Enter Contact Phone Number">
          Provide a valid direct phone number including country code (e.g., <code>+91</code>) for billing queries and urgent credit communications (<strong>Badge 3</strong>).
        </Step>
        <Step num={4} title="Save & Activate Profile">
          Click <strong>Save</strong>. The billing profile is instantly created, verified, and ready to be linked to new and active services.
        </Step>
      </Steps>

      {/* ── Field Reference Table ── */}
      <H2 id="field-reference">Field Reference Table</H2>
      <FieldTable rows={[
        { field: "Country",                description: "The country where the legal business entity is registered.",                                required: true  },
        { field: "GST / Tax Number",       description: "Official tax registration identifier validated live with government tax authorities.",      required: true  },
        { field: "Legal Entity Name",      description: "Auto-procured from tax registry upon successful validation of the tax number.",             required: true  },
        { field: "State / Province",       description: "State or province jurisdiction associated with the registered tax entity.",                 required: true  },
        { field: "City & Postal Code",     description: "City and PIN/postal code of the registered tax address.",                                   required: true  },
        { field: "Registered Address",     description: "Official business premise address printed on generated tax invoices.",                      required: true  },
        { field: "Billing Currency",       description: "Currency for recurring billing and rate limits (INR or USD).",                              required: true  },
        { field: "Tax Certificate",        description: "Official certificate document (PDF, PNG, JPG, max 10 MB) verifying tax registration status.", required: true },
        { field: "Billing Contact Name",   description: "Name of the commercial or accounts payable contact.",                                       required: true  },
        { field: "Email Address",          description: "Primary email address receiving tax invoices, credit receipts, and billing notifications.", required: true  },
        { field: "Phone Number",           description: "Direct contact telephone number with international dialing prefix.",                         required: true  },
      ]} />

      {/* ── Managing Profiles ── */}
      <H2 id="managing-profiles">Managing & Editing Billing Profiles</H2>
      <P>
        From the main Billing Profile dashboard, you can perform administrative actions on each profile:
      </P>
      <UL>
        <LI><strong>Download Certificate</strong>: Click the <em>Download GST Certificate</em> link on any card to view or save the uploaded tax document.</LI>
        <LI><strong>Edit Billing Contact</strong>: Update email addresses and phone numbers as personnel responsibilities change without altering tax registration details.</LI>
        <LI><strong>Check In-Use Status</strong>: Profiles currently attached to active Ports or Virtual Connections display an <em>In Use</em> tag to prevent accidental deletion.</LI>
      </UL>

      {/* ── FAQ ── */}
      <H2 id="faq">Frequently Asked Questions</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "16px 0" }}>
        <FAQItem
          question="What happens if GST verification fails during setup?"
          answer="Check that the 15-digit GSTIN is entered accurately without spaces or hyphens. If the tax portal is temporarily unavailable, double-check your active GST status on the GSTN portal or reach out to Polarin Support."
        />
        <FAQItem
          question="Can our organisation have different billing profiles for different regions?"
          answer="Yes. Polarin fully supports multi-state GST and international legal entities. You can create distinct profiles for each state branch (e.g., Maharashtra, Karnataka, Tamil Nadu) or international subsidiary, and select the relevant profile during service provisioning."
        />
        <FAQItem
          question="Can I change the Billing Profile on a live service?"
          answer="Yes. System Admins and Finance Admins can modify the assigned Billing Profile from the Service Detail page under the Subscription tab, provided the new billing profile has been verified."
        />
      </div>
    </ArticlePage>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px" }}>
      <p style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 700, color: "#0a3954", margin: "0 0 6px" }}>{question}</p>
      <p style={{ fontFamily: FONT, fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.65 }}>{answer}</p>
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
