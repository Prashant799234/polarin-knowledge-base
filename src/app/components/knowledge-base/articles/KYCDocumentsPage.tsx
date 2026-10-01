import { ArticlePage, H1, H2, P, UL, LI, Callout, KYCTable, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "how-it-works",  label: "How Requirements Are Determined", level: 2 as const },
  { id: "india",         label: "India",                           level: 2 as const },
  { id: "apac",          label: "APAC",                             level: 2 as const },
  { id: "uae",           label: "UAE",                              level: 2 as const },
  { id: "signatory",     label: "Authorised Signatory",            level: 2 as const },
  { id: "file-rules",    label: "File Requirements" },
];

const INDIA_ROWS = [
  { entity: "Individual",               docs: "Aadhaar Card or Voter Identity Card" },
  { entity: "Partnership (Registered)", docs: "Attested copy of the registered partnership deed, plus the Aadhaar Card or Voter Identity Card of the authorised partner" },
  { entity: "LLP",                      docs: "Certificate of Incorporation" },
  { entity: "Private Limited Company",  docs: "Certificate of Incorporation" },
  { entity: "Public Limited Company",   docs: "Certificate of Incorporation" },
  { entity: "Trust / Society",          docs: "Registration Certificate" },
];

const APAC_ROWS = [
  { entity: "Individual", docs: "National ID or Passport" },
  { entity: "Company",    docs: "Any one of: Establishment Card, National ID/Passport of a director, or Company Registration Certificate" },
];

const UAE_ROWS = [
  { entity: "Individual", docs: "National ID or Passport" },
  { entity: "Company",    docs: "Trade License or Establishment Card" },
];

export function KYCDocumentsPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">KYC Document Requirements</H1>
      <ArticleMeta>
        <ReadTime minutes={5} />
        <Dot />
        <Tag label="Reference" color="#7c3aed" />
      </ArticleMeta>

      <P>
        Every organisation completes a one-time KYC (Know Your Customer) check before it can subscribe to Polarin services. Rather than handing you one long, generic checklist, the platform works out exactly which document (or documents) apply to <em>your</em> organisation based on two things you select during setup — nothing more, nothing irrelevant.
      </P>

      <Callout variant="important">
        Submit accurate, current documents to avoid delays. Mismatched or expired documents are the most common reason a KYC submission gets sent back for correction.
      </Callout>

      {/* ── How it works ── */}
      <H2 id="how-it-works">How Requirements Are Determined</H2>
      <P>
        Two choices you make while completing your organisation profile shape your entire KYC checklist:
      </P>
      <UL>
        <LI><strong>Your country</strong> — this decides which <em>verification path</em> is available to you. India offers an instant, GST-based path in addition to manual entry; every other supported country uses manual entry only. It also decides which <em>document set</em> applies — India, APAC, and UAE each have their own list (see below).</LI>
        <LI><strong>Your legal entity type</strong> — within your country's document set, this narrows things down to the specific document (or short list of acceptable alternatives) that applies to an organisation structured the way yours is. An Individual and a Private Limited Company registered in the same country are asked for completely different things.</LI>
      </UL>
      <P>
        In practice, this means you only ever see the fields and upload prompts that actually apply to you — selecting your country hides every other region's requirements, and selecting your entity type then reveals only the matching document field.
      </P>

      <Callout variant="tip">
        Registered in India? Use <strong>GST Verification</strong> during setup instead of typing your details in manually. Enter your GSTIN and Polarin instantly fetches your legal name, address, and state from government records — you just review and confirm (or edit) them. The same verified details are also reused to auto-create your Billing Profile with INR as the default currency, saving you from re-entering the same information twice.
      </Callout>

      {/* ── India ── */}
      <H2 id="india">India</H2>
      <P>
        India is the only region with two ways to verify: <strong>GST Verification</strong> (recommended) auto-fills your organisation's address details from your GSTIN, while <strong>Manual Details</strong> lets you type everything in yourself if you'd rather not use GST lookup or don't have one. Either way, you'll still select your Legal Entity Type, and the correct document for that entity type below is required:
      </P>
      <KYCTable rows={INDIA_ROWS} />
      <Callout variant="info">
        For a <strong>registered partnership</strong>, both the notarised deed and a government-issued ID of the authorised partner are required — submitting only one results in an incomplete KYC.
      </Callout>

      {/* ── APAC ── */}
      <H2 id="apac">APAC</H2>
      <P>
        For organisations registered elsewhere in Asia Pacific, Polarin uses manual detail entry — there's no GST-equivalent government lookup available in these markets yet. Select your Legal Entity Type and provide the matching document:
      </P>
      <KYCTable rows={APAC_ROWS} />
      <P>
        For a Company, any one of the three listed documents is accepted — you don't need to provide all of them.
      </P>

      {/* ── UAE ── */}
      <H2 id="uae">UAE</H2>
      <P>
        UAE organisations also use manual detail entry. Select your Legal Entity Type and provide the matching document:
      </P>
      <KYCTable rows={UAE_ROWS} />

      {/* ── Authorised Signatory ── */}
      <H2 id="signatory">Authorised Signatory — All Regions</H2>
      <P>
        No matter which country or entity type your organisation falls under, one requirement never changes: every organisation must designate an <strong>Authorised Signatory</strong> — the person empowered to sign contracts on its behalf. This always requires two documents together:
      </P>
      <UL>
        <LI><strong>Proof of Identity of the Authorised Signatory</strong> — a government-issued ID for that individual</LI>
        <LI><strong>Board Resolution or Power of Attorney</strong> — confirming their authority to act for the organisation, signed by a director or equivalent authority</LI>
      </UL>
      <Callout variant="tip">
        If you verified via GST, your authorised signatory's details are also reused as your default billing contact — one more field you don't have to fill in twice.
      </Callout>

      {/* ── File requirements ── */}
      <H2 id="file-rules">File Requirements</H2>
      <P>All uploaded documents — for organisation verification and for the authorised signatory — must meet the following criteria:</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "16px 0" }}>
        {[
          { icon: "📄", label: "Accepted Formats", value: "PDF, JPG, PNG" },
          { icon: "📦", label: "Max File Size", value: "5 MB per file" },
          { icon: "🔍", label: "Readability", value: "Clear, unblurred scans" },
          { icon: "✅", label: "Validity", value: "Valid & not expired" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#0a3954" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <Callout variant="warning">
        Blurry scans, expired documents, or files over 5 MB will cause your KYC submission to fail. Re-upload a clear, valid copy if this happens.
      </Callout>
    </ArticlePage>
  );
}
