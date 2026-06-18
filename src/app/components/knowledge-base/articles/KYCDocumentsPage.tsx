import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, KYCTable } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "indian",        label: "Indian Entities",         level: 2 as const },
  { id: "global",        label: "Global Entities",         level: 2 as const },
  { id: "loa",           label: "Letter of Authorisation", level: 2 as const },
  { id: "file-rules",    label: "File Requirements" },
];

const INDIAN_ROWS = [
  { entity: "Individual",               docs: "Aadhaar Card or Voter Identity Card" },
  { entity: "Partnership (Registered)", docs: "Attested copy of registered deed by a public notary + Aadhaar Card or Voter Identity Card of the authorised identity partner" },
  { entity: "Partnership LLP",          docs: "Certificate of Incorporation" },
  { entity: "Private Limited Company",  docs: "Certificate of Incorporation" },
  { entity: "Public Limited Company",   docs: "Certificate of Incorporation" },
  { entity: "Trust / Society",          docs: "Registration Certificate" },
];

export function KYCDocumentsPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">KYC Document Requirements</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Reference" color="#7c3aed" />
      </div>

      <P>
        All organisations must submit KYC (Know Your Customer) documents before they can subscribe to Polarin services. This one-time process lets the Polarin team verify your organisation's identity and ensures the platform remains secure and compliant.
      </P>
      <P>
        Two documents are required from every organisation:
      </P>
      <UL>
        <LI><strong>Proof of Identity &amp; Address</strong> — varies by entity type (see tables below)</LI>
        <LI><strong>Letter of Authorisation</strong> — confirms who is authorised to sign contracts on behalf of your organisation</LI>
      </UL>

      <Callout variant="important">
        Submit accurate documents to avoid delays. Incorrect or mismatched documents are the most common reason for verification rejections.
      </Callout>

      {/* ── Indian entities ── */}
      <H2 id="indian">Proof of Identity — Indian Entities</H2>
      <P>If your organisation is registered in India, use the document corresponding to your entity type:</P>
      <KYCTable rows={INDIAN_ROWS} />

      <Callout variant="info">
        For <strong>registered partnerships</strong>, both the notarised deed and a government-issued ID of the authorised partner are required. Submitting only one will result in an incomplete KYC.
      </Callout>

      {/* ── Global entities ── */}
      <H2 id="global">Proof of Identity — Global Entities</H2>
      <P>
        For organisations without a registered Indian entity, Polarin accepts a single document:
      </P>
      <div style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        border: "1px solid #bae6fd",
        borderRadius: 12,
        padding: "20px 24px",
        margin: "16px 0",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <span style={{ fontSize: 32 }}>🌐</span>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#0369a1", margin: "0 0 4px" }}>Certificate of Incorporation</p>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#0c4a6e", margin: 0, lineHeight: 1.6 }}>
            Accepted as both proof of identity and proof of address for all international organisations.
          </p>
        </div>
      </div>

      {/* ── Letter of Authorisation ── */}
      <H2 id="loa">Letter of Authorisation</H2>
      <P>
        Every organisation — Indian or global — must provide a <strong>Letter of Authorisation (LoA)</strong> for the authorised signatory. This document:
      </P>
      <UL>
        <LI>Identifies the individual authorised to represent and sign on behalf of the organisation</LI>
        <LI>Must be on company letterhead (for incorporated entities)</LI>
        <LI>Must be signed by a director or equivalent authority</LI>
      </UL>
      <Callout variant="tip">
        The LoA can be a company-issued letter or a board resolution — either is acceptable as long as it clearly names the authorised signatory and is duly signed.
      </Callout>

      {/* ── File requirements ── */}
      <H2 id="file-rules">File Requirements</H2>
      <P>All uploaded documents must meet the following criteria:</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "16px 0" }}>
        {[
          { icon: "📄", label: "Accepted Formats", value: "PNG, JPEG, PDF" },
          { icon: "📦", label: "Max File Size", value: "10 MB per file" },
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
        Blurry scans, expired documents, or files over 10 MB will cause your KYC submission to fail. Re-upload a clear, valid copy if this happens.
      </Callout>
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
