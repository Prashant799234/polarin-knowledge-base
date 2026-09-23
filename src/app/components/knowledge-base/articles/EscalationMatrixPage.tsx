import { useState } from "react";
import {
  Phone,
  Mail,
  Clock,
  Globe,
  Copy,
  Check,
  Headphones,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ArticlePage,
  H1,
  H2,
  P,
  UL,
  LI,
  Callout,
  PageLink,
  ArticleMeta,
  Tag,
  Dot,
  ReadTime,
} from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "escalation-matrix", label: "Escalation Matrix", level: 2 as const },
  { id: "severity-definitions", label: "Severity Classification", level: 2 as const },
  { id: "before-escalating", label: "Before You Escalate", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface TollFreeItem {
  country: string;
  flag: string;
  number: string;
  telHref: string;
}

const APAC_TOLL_FREE: TollFreeItem[] = [
  { country: "India", flag: "🇮🇳", number: "+91-22 6931-5544", telHref: "tel:+912269315544" },
  { country: "USA (F,P)", flag: "🇺🇸", number: "18334779905", telHref: "tel:18334779905" },
  { country: "Australia", flag: "🇦🇺", number: "1800965956", telHref: "tel:1800965956" },
  { country: "Hong Kong", flag: "🇭🇰", number: "800902347", telHref: "tel:800902347" },
  { country: "Singapore", flag: "🇸🇬", number: "8001016054", telHref: "tel:8001016054" },
  { country: "Japan", flag: "🇯🇵", number: "006633815379", telHref: "tel:006633815379" },
];

interface LevelInfo {
  level: number;
  levelLabel: string;
  title: string;
  serviceAffecting: string;
  nonServiceAffecting: string;
  contactName: string;
  role: string;
  phone: string;
  phoneRaw: string;
  email: string;
  badgeBg: string;
  badgeColor: string;
  scope: string;
  tollFree?: TollFreeItem[];
}

const INDIA_LEVELS: LevelInfo[] = [
  {
    level: 1,
    levelLabel: "Level 1",
    title: "Global Service Operation Desk (24X7)",
    serviceAffecting: "Immediate",
    nonServiceAffecting: "Immediate",
    contactName: "Global Service Operation Desk",
    role: "24X7 First-Touch Operations Desk",
    phone: "+91-22-69315544",
    phoneRaw: "+912269315544",
    email: "GSODesk@lightstorm.net",
    badgeBg: "#ccfbf1",
    badgeColor: "#0f766e",
    scope: "First-touch triage, incident logging, ticket creation, and initial diagnostics.",
  },
  {
    level: 2,
    levelLabel: "Level 2",
    title: "Operations Desk Manager",
    serviceAffecting: "1 Hour",
    nonServiceAffecting: "2 Hours",
    contactName: "Harshal Karekar",
    role: "Global Service Operations Desk Manager",
    phone: "+91 93211 49838",
    phoneRaw: "+919321149838",
    email: "harshal.karekar@lightstorm.in",
    badgeBg: "#dbeafe",
    badgeColor: "#1d4ed8",
    scope: "Engineer dispatch, bridge management, and active team coordination.",
  },
  {
    level: 3,
    levelLabel: "Level 3",
    title: "Deputy NOC Head",
    serviceAffecting: "2 Hours",
    nonServiceAffecting: "4 Hours",
    contactName: "Amol Jagtap",
    role: "Deputy NOC Head",
    phone: "+91 88281 08212",
    phoneRaw: "+918828108212",
    email: "amol.jagtap@lightstorm.in",
    badgeBg: "#fef3c7",
    badgeColor: "#b45309",
    scope: "Senior engineering escalation, upstream provider coordination, and SLA recovery.",
  },
  {
    level: 4,
    levelLabel: "Level 4",
    title: "NOC Head",
    serviceAffecting: "3 Hours",
    nonServiceAffecting: "6 Hours",
    contactName: "Suraj Thakur",
    role: "NOC Head",
    phone: "+91 91581 08999",
    phoneRaw: "+919158108999",
    email: "suraj.thakur@lightstorm.in",
    badgeBg: "#fee2e2",
    badgeColor: "#b91c1c",
    scope: "Executive incident governance, major outage escalations, and RCA delivery.",
  },
];

const APAC_LEVELS: LevelInfo[] = [
  {
    level: 1,
    levelLabel: "Level 1",
    title: "Global Service Operation Desk (24X7)",
    serviceAffecting: "Immediate",
    nonServiceAffecting: "Immediate",
    contactName: "Global Service Operation Desk",
    role: "24X7 International Operations Desk",
    phone: "+91-22 6931-5544",
    phoneRaw: "+912269315544",
    email: "GSODesk@lightstorm.net",
    badgeBg: "#ccfbf1",
    badgeColor: "#0f766e",
    scope: "24×7 multi-region triage, international toll-free intake, and initial diagnostics.",
    tollFree: APAC_TOLL_FREE,
  },
  {
    level: 2,
    levelLabel: "Level 2",
    title: "Operations Desk Manager",
    serviceAffecting: "2 Hours",
    nonServiceAffecting: "4 Hours",
    contactName: "Harshal Y. Karekar",
    role: "Global Service Operations Desk Manager",
    phone: "+91 93211 49838",
    phoneRaw: "+919321149838",
    email: "harshal.karekar@lightstorm.in",
    badgeBg: "#dbeafe",
    badgeColor: "#1d4ed8",
    scope: "Regional incident coordination, cross-border bridge dispatch, and status updates.",
  },
  {
    level: 3,
    levelLabel: "Level 3",
    title: "Deputy NOC Head",
    serviceAffecting: "4 Hours",
    nonServiceAffecting: "8 Hours",
    contactName: "Amol Jagtap",
    role: "Deputy NOC Head",
    phone: "+91 88281 08212",
    phoneRaw: "+918828108212",
    email: "amol.jagtap@lightstorm.in",
    badgeBg: "#fef3c7",
    badgeColor: "#b45309",
    scope: "Subsea cable partner escalations, regional carrier bridges, and SLA oversight.",
  },
  {
    level: 4,
    levelLabel: "Level 4",
    title: "NOC Head",
    serviceAffecting: "6 Hours",
    nonServiceAffecting: "12 Hours",
    contactName: "Suraj Thakur",
    role: "NOC Head",
    phone: "+91 91581 08999",
    phoneRaw: "+919158108999",
    email: "suraj.thakur@lightstorm.in",
    badgeBg: "#fee2e2",
    badgeColor: "#b91c1c",
    scope: "Regional operational command, infrastructure escalation, and major incident resolution.",
  },
  {
    level: 5,
    levelLabel: "Level 5",
    title: "Chief Technology & Operations Officer (APAC)",
    serviceAffecting: "8 Hours",
    nonServiceAffecting: "16 Hours",
    contactName: "Vinay V",
    role: "Chief Technology, Planning and Operations Officer, APAC",
    phone: "+65 9824 7010",
    phoneRaw: "+6598247010",
    email: "vinay.v@lightstorm.net",
    badgeBg: "#ede9fe",
    badgeColor: "#6d28d9",
    scope: "Executive leadership escalation, critical partnership intervention, and overarching service delivery oversight.",
  },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function EscalationMatrixPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<"india" | "apac">("india");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">NOC Escalation Matrix</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
        <Dot />
        <Tag label="NOC 24×7" color="#0284c7" />
      </ArticleMeta>

      <P>
        Lightstorm and Polarin operate a proactive 24×7 Network Operations Centre (NOC) and Global
        Service Operation Desk (GSOD). When an incident requires senior engineering escalation or exceeds
        standard response milestones, use the matrix below to reach the designated leadership tier directly.
      </P>

      {/* ── Sticky Region Switcher Bar ── */}
      <div
        className="kb-matrix-sticky-header"
        data-pdf-exclude="true"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          padding: "12px 0",
          margin: "16px 0 20px 0",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Clean 2-tab segmented control */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#f1f5f9",
            padding: 4,
            borderRadius: 10,
            gap: 4,
          }}
        >
          <button
            onClick={() => setActiveTab("india")}
            style={{
              fontFamily: FONT_J,
              fontSize: 14,
              fontWeight: 700,
              padding: "7px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: activeTab === "india" ? "#FFFFFF" : "transparent",
              color: activeTab === "india" ? "#0f766e" : "#64748b",
              boxShadow: activeTab === "india" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease",
            }}
          >
            <span>🇮🇳</span>
            <span>India</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: 10,
                background: activeTab === "india" ? "#ccfbf1" : "#e2e8f0",
                color: activeTab === "india" ? "#0f766e" : "#64748b",
              }}
            >
              4 Tiers
            </span>
          </button>

          <button
            onClick={() => setActiveTab("apac")}
            style={{
              fontFamily: FONT_J,
              fontSize: 14,
              fontWeight: 700,
              padding: "7px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: activeTab === "apac" ? "#FFFFFF" : "transparent",
              color: activeTab === "apac" ? "#0f766e" : "#64748b",
              boxShadow: activeTab === "apac" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease",
            }}
          >
            <span>🌏</span>
            <span>APAC & Global</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: 10,
                background: activeTab === "apac" ? "#ccfbf1" : "#e2e8f0",
                color: activeTab === "apac" ? "#0f766e" : "#64748b",
              }}
            >
              5 Tiers
            </span>
          </button>
        </div>

        {/* Region Subtitle Indicator */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488" }} />
          <span>
            {activeTab === "india"
              ? "Showing Domestic Network (Levels 1 to 4)"
              : "Showing Cross-Border & Subsea Fabric (Levels 1 to 5)"}
          </span>
        </div>
      </div>

      <H2 id="escalation-matrix">
        {activeTab === "india" ? "India Escalation Path" : "APAC & Global Escalation Path"}
      </H2>

      {/* ── India Region (rendered on web if selected, always rendered in print/PDF) ── */}
      <div
        className={`kb-matrix-region kb-region-india ${
          activeTab !== "india" ? "kb-region-hidden" : ""
        }`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "16px 0 28px" }}>
          {INDIA_LEVELS.map((tier) => (
            <CleanLevelCard
              key={tier.level}
              tier={tier}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* ── APAC Region (rendered on web if selected, always rendered in print/PDF) ── */}
      <div
        className={`kb-matrix-region kb-region-apac ${
          activeTab !== "apac" ? "kb-region-hidden" : ""
        }`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "16px 0 28px" }}>
          {APAC_LEVELS.map((tier) => (
            <CleanLevelCard
              key={tier.level}
              tier={tier}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* ── Severity Classification ── */}
      <H2 id="severity-definitions">Incident Severity Classification</H2>
      <P>
        Escalation countdowns are measured from initial ticket logging based on whether an incident is
        classified as <strong>Service Affecting</strong> or <strong>Non-Service Affecting</strong>:
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          margin: "18px 0 28px",
        }}
      >
        {/* Service Affecting */}
        <div
          style={{
            background: "#fff8f8",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                background: "#dc2626",
                color: "#FFFFFF",
                borderRadius: 6,
                padding: "2px 7px",
                fontFamily: FONT_J,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              CRITICAL / P1
            </span>
            <div style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: "#991b1b" }}>
              Service Affecting
            </div>
          </div>
          <P style={{ fontSize: 13, color: "#7f1d1d", margin: "0 0 10px", lineHeight: 1.5 }}>
            Direct customer traffic downtime, hard circuit failure, or active packet drop:
          </P>
          <UL>
            <LI>Total physical port or Virtual Connection link down</LI>
            <LI>BGP peering dropped with no redundant route</LI>
            <LI>Sustained packet loss (&gt;5%) or severe latency breach</LI>
            <LI>Failure of primary route on a protected path</LI>
          </UL>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT_J,
              fontSize: 11,
              fontWeight: 700,
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "4px 8px",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            Trigger intervals: 1h–3h (India) · 2h–8h (APAC)
          </div>
        </div>

        {/* Non-Service Affecting */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: 12,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span
              style={{
                background: "#334155",
                color: "#FFFFFF",
                borderRadius: 6,
                padding: "2px 7px",
                fontFamily: FONT_J,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              STANDARD / P2–P4
            </span>
            <div style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Non-Service Affecting
            </div>
          </div>
          <P style={{ fontSize: 13, color: "#334155", margin: "0 0 10px", lineHeight: 1.5 }}>
            Operational, reporting, or non-traffic-impacting inquiries:
          </P>
          <UL>
            <LI>Secondary standby link flap (active traffic unaffected)</LI>
            <LI>Portal account access, API tokens, or user permissions</LI>
            <LI>Telemetry graphs, usage reports, or audit inquiries</LI>
            <LI>Scheduled maintenance queries and configuration requests</LI>
          </UL>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT_J,
              fontSize: 11,
              fontWeight: 700,
              color: "#334155",
              background: "#e2e8f0",
              padding: "4px 8px",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            Trigger intervals: 2h–6h (India) · 4h–16h (APAC)
          </div>
        </div>
      </div>

      {/* ── Before You Escalate ── */}
      <H2 id="before-escalating">Before You Escalate</H2>
      <P>
        To ensure our engineering teams can respond immediately, please keep the following identifiers
        ready:
      </P>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "16px 20px",
          margin: "14px 0 24px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { label: "1. Incident / Ticket ID", desc: "Active ticket reference (e.g. #INC-XXXXXX) logged with Level 1." },
            { label: "2. Polarin Service ID", desc: "Port ID (PORT-SIN-001) or Virtual Connection ID (VC-AWS-009)." },
            { label: "3. Location Details", desc: "Originating and terminating data centres or cloud PoP regions." },
            { label: "4. Observed Impact", desc: "Telemetry details (loss, latency, flap frequency) and affected services." },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#0f766e", marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", lineHeight: 1.45 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Callout variant="tip">
        Always open a ticket first with <strong>Level 1 GSOD</strong> (+91-22-69315544 or{" "}
        <a href="mailto:GSODesk@lightstorm.net" style={{ color: "#0f766e", fontWeight: 700 }}>
          GSODesk@lightstorm.net
        </a>
        ) or via <PageLink label="Create Ticket" onClick={() => onNavigate("create-ticket")} /> so that diagnostic test
        bridges and timestamped telemetry logs are initiated immediately.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>
          Log a support ticket: <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.
        </LI>
        <LI>
          Track active tickets: <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} />.
        </LI>
        <LI>
          Direct support options: <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.
        </LI>
        <LI>
          Configure proactive SLA alerts: <PageLink label="Manage Alerts" onClick={() => onNavigate("manage-alerts")} />.
        </LI>
      </UL>
    </ArticlePage>
  );
}

// ── Clean Level Card Component (Minimalist, Spacious, Actionable) ──
function CleanLevelCard({
  tier,
  copiedKey,
  onCopy,
}: {
  tier: LevelInfo;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const [showTollFree, setShowTollFree] = useState(false);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      {/* Top Header Row: Level + Title + SLA Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 800,
              color: tier.badgeColor,
              background: tier.badgeBg,
              padding: "3px 9px",
              borderRadius: 6,
            }}
          >
            {tier.levelLabel}
          </span>
          <span style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {tier.title}
          </span>
        </div>

        {/* Dual SLA Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              padding: "3px 8px",
              fontFamily: FONT_J,
              fontSize: 12,
              color: "#b91c1c",
            }}
          >
            <Clock size={12} color="#dc2626" />
            <span>Service Affecting:</span>
            <strong style={{ fontWeight: 800 }}>{tier.serviceAffecting}</strong>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "3px 8px",
              fontFamily: FONT_J,
              fontSize: 12,
              color: "#334155",
            }}
          >
            <Clock size={12} color="#64748b" />
            <span>Non-Service Affecting:</span>
            <strong style={{ fontWeight: 800 }}>{tier.nonServiceAffecting}</strong>
          </div>
        </div>
      </div>

      {/* Middle: Contact Name, Role & Scope */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 4,
        }}
      >
        <div>
          <div style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            {tier.contactName}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {tier.role} · <span style={{ color: "#475569" }}>{tier.scope}</span>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Phone Button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              padding: "4px 8px",
            }}
          >
            <Phone size={13} color="#15803d" style={{ marginRight: 6 }} />
            <a
              href={`tel:${tier.phoneRaw}`}
              style={{
                fontFamily: FONT_J,
                fontSize: 12,
                fontWeight: 700,
                color: "#15803d",
                textDecoration: "none",
              }}
            >
              {tier.phone}
            </a>
            <button
              onClick={() => onCopy(tier.phone, `${tier.levelLabel}-phone`)}
              title="Copy phone number"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: copiedKey === `${tier.levelLabel}-phone` ? "#16a34a" : "#94a3b8",
                padding: "0 0 0 6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {copiedKey === `${tier.levelLabel}-phone` ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>

          {/* Email Button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "4px 8px",
            }}
          >
            <Mail size={13} color="#1d4ed8" style={{ marginRight: 6 }} />
            <a
              href={`mailto:${tier.email}`}
              style={{
                fontFamily: FONT_J,
                fontSize: 12,
                fontWeight: 700,
                color: "#1d4ed8",
                textDecoration: "none",
              }}
            >
              {tier.email}
            </a>
            <button
              onClick={() => onCopy(tier.email, `${tier.levelLabel}-email`)}
              title="Copy email address"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: copiedKey === `${tier.levelLabel}-email` ? "#16a34a" : "#94a3b8",
                padding: "0 0 0 6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {copiedKey === `${tier.levelLabel}-email` ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Level 1 Toll-Free Numbers (If applicable) */}
      {tier.tollFree && (
        <div style={{ marginTop: 2, borderTop: "1px dashed #e2e8f0", paddingTop: 10 }}>
          <button
            onClick={() => setShowTollFree(!showTollFree)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#0f766e",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
          >
            <Globe size={14} color="#0f766e" />
            <span>
              {showTollFree
                ? "Hide International Toll-Free Numbers"
                : "View International Toll-Free Numbers (USA, Australia, HK, Singapore, Japan)"}
            </span>
            {showTollFree ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTollFree && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 8,
                marginTop: 10,
              }}
            >
              {tier.tollFree.map((tf) => (
                <div
                  key={tf.country}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "6px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{tf.flag}</span>
                    <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                      {tf.country}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <a
                      href={tf.telHref}
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f766e",
                        textDecoration: "none",
                      }}
                    >
                      {tf.number}
                    </a>
                    <button
                      onClick={() => onCopy(tf.number, tf.country)}
                      title="Copy"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: copiedKey === tf.country ? "#16a34a" : "#94a3b8",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copiedKey === tf.country ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
