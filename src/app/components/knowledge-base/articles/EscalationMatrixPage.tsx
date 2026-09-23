import { useState } from "react";
import type { ElementType, ReactNode } from "react";
import {
  ShieldAlert,
  Headphones,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Globe,
  Copy,
  Check,
  CheckCircle2,
  Ticket,
  ChevronRight,
  UserCheck,
  Building,
} from "lucide-react";
import {
  ArticlePage,
  H1,
  H2,
  H3,
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
  { id: "matrix-view", label: "Escalation Matrices", level: 2 as const },
  { id: "india-matrix", label: "India Escalation Matrix", level: 3 as const },
  { id: "apac-matrix", label: "APAC Escalation Matrix", level: 3 as const },
  { id: "toll-free", label: "Global Toll-Free Directory", level: 2 as const },
  { id: "severity-definitions", label: "Incident Severity Classification", level: 2 as const },
  { id: "escalation-checklist", label: "Before You Escalate", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface TollFreeContact {
  country: string;
  flag: string;
  number: string;
  telHref: string;
  type: string;
}

const APAC_TOLL_FREE: TollFreeContact[] = [
  { country: "India", flag: "🇮🇳", number: "+91-22 6931-5544", telHref: "tel:+912269315544", type: "Direct NOC Line" },
  { country: "USA (F,P)", flag: "🇺🇸", number: "18334779905", telHref: "tel:18334779905", type: "Toll Free" },
  { country: "Australia", flag: "🇦🇺", number: "1800965956", telHref: "tel:1800965956", type: "Toll Free" },
  { country: "Hong Kong", flag: "🇭🇰", number: "800902347", telHref: "tel:800902347", type: "Toll Free" },
  { country: "Singapore", flag: "🇸🇬", number: "8001016054", telHref: "tel:8001016054", type: "Toll Free" },
  { country: "Japan", flag: "🇯🇵", number: "006633815379", telHref: "tel:006633815379", type: "Toll Free" },
];

interface MatrixLevel {
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
  accentColor: string;
  badgeBg: string;
  scopeSummary: string;
}

const INDIA_LEVELS: MatrixLevel[] = [
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
    accentColor: "#0d9488",
    badgeBg: "#ccfbf1",
    scopeSummary: "Initial incident logging, diagnostic triage, ticket dispatch, and immediate link troubleshooting.",
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
    accentColor: "#2563eb",
    badgeBg: "#dbeafe",
    scopeSummary: "Direct team coordination, escalated engineer assignment, and incident bridge management.",
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
    accentColor: "#d97706",
    badgeBg: "#fef3c7",
    scopeSummary: "Senior network engineering escalation, upstream carrier interventions, and SLA recovery tracking.",
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
    accentColor: "#dc2626",
    badgeBg: "#fee2e2",
    scopeSummary: "Executive operational command, major outage governance, and comprehensive root cause analysis (RCA).",
  },
];

const APAC_LEVELS: MatrixLevel[] = [
  {
    level: 1,
    levelLabel: "Level 1",
    title: "Global Service Operation Desk (24X7)",
    serviceAffecting: "Immediate",
    nonServiceAffecting: "Immediate",
    contactName: "Global Service Operation Desk",
    role: "24X7 International Operations Desk",
    phone: "+91-22 6931-5544 (Toll-Free Options Below)",
    phoneRaw: "+912269315544",
    email: "GSODesk@lightstorm.net",
    accentColor: "#0d9488",
    badgeBg: "#ccfbf1",
    scopeSummary: "24×7 multi-region intake, international toll-free routing, ticket dispatch, and immediate link troubleshooting.",
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
    accentColor: "#2563eb",
    badgeBg: "#dbeafe",
    scopeSummary: "Cross-region incident coordination, engineer mobilization, and proactive customer communication.",
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
    accentColor: "#d97706",
    badgeBg: "#fef3c7",
    scopeSummary: "Subsea cable and regional interconnect escalations, carrier peering bridges, and SLA governance.",
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
    accentColor: "#dc2626",
    badgeBg: "#fee2e2",
    scopeSummary: "Regional operational command, infrastructure escalation, and end-to-end incident management.",
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
    accentColor: "#7c3aed",
    badgeBg: "#ede9fe",
    scopeSummary: "Executive leadership escalation, critical partnership intervention, and overarching service delivery oversight.",
  },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function EscalationMatrixPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<"india" | "apac" | "all">("india");
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
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Help & Support" color="#1c808d" />
        <Dot />
        <Tag label="NOC 24×7" color="#0284c7" />
        <Dot />
        <Tag label="India & APAC" color="#7c3aed" />
      </ArticleMeta>

      <P>
        Lightstorm and Polarin operate a proactive, 24×7 Global Service Operation Desk (GSOD) and Network
        Operations Centre (NOC) to ensure maximum availability across your hybrid cloud connections, ports,
        and data centre interconnects. When an incident requires elevated engineering attention or exceeds
        standard response milestones, use the <strong>NOC Escalation Matrix</strong> below to contact the
        appropriate management tier directly.
      </P>

      {/* ── Key Highlights Banner ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          margin: "20px 0 28px",
        }}
      >
        {[
          {
            icon: <Headphones size={22} color="#0d9488" />,
            title: "24×7 Level 1 Intake",
            desc: "Global Operations Desk is always on-duty with zero delay for both service and non-service affecting events.",
          },
          {
            icon: <Clock size={22} color="#2563eb" />,
            title: "Strict Time-Bound Triggers",
            desc: "Automated escalation windows based on incident duration and business impact.",
          },
          {
            icon: <Globe size={22} color="#7c3aed" />,
            title: "Dedicated Regional Paths",
            desc: "Tailored escalation channels for India domestic operations and APAC international footprints.",
          },
        ].map((c) => (
          <div
            key={c.title}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div style={{ marginBottom: 10 }}>{c.icon}</div>
            <div
              style={{
                fontFamily: FONT_J,
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              {c.title}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
              {c.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ── Interactive Tab Switcher ── */}
      <H2 id="matrix-view">Escalation Matrices</H2>
      <P>
        Select your operating region to view dedicated escalation hierarchy, SLA thresholds, and direct
        management contact numbers:
      </P>

      <div
        data-pdf-exclude="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#f1f5f9",
          padding: 6,
          borderRadius: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("india")}
          style={{
            fontFamily: FONT_J,
            fontSize: 14,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: activeTab === "india" ? "#FFFFFF" : "transparent",
            color: activeTab === "india" ? "#0f766e" : "#64748b",
            boxShadow: activeTab === "india" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <span>🇮🇳</span>
          <span>India Region</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 12,
              background: activeTab === "india" ? "#ccfbf1" : "#e2e8f0",
              color: activeTab === "india" ? "#0f766e" : "#64748b",
            }}
          >
            4 Levels
          </span>
        </button>

        <button
          onClick={() => setActiveTab("apac")}
          style={{
            fontFamily: FONT_J,
            fontSize: 14,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: activeTab === "apac" ? "#FFFFFF" : "transparent",
            color: activeTab === "apac" ? "#0f766e" : "#64748b",
            boxShadow: activeTab === "apac" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            display: "flex",
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
              padding: "2px 7px",
              borderRadius: 12,
              background: activeTab === "apac" ? "#ccfbf1" : "#e2e8f0",
              color: activeTab === "apac" ? "#0f766e" : "#64748b",
            }}
          >
            5 Levels
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          style={{
            fontFamily: FONT_J,
            fontSize: 14,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: activeTab === "all" ? "#FFFFFF" : "transparent",
            color: activeTab === "all" ? "#0f766e" : "#64748b",
            boxShadow: activeTab === "all" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <span>📋</span>
          <span>View Both Regions</span>
        </button>
      </div>

      {/* ── India Region Section ── */}
      <div
        className={`kb-matrix-region kb-region-india ${
          activeTab !== "india" && activeTab !== "all" ? "kb-region-hidden" : ""
        }`}
        style={{ marginBottom: 36 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: 8,
          }}
        >
          <H3 id="india-matrix">🇮🇳 India Escalation Matrix — Lightstorm NOC Services</H3>
          <span
            style={{
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#0f766e",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            Domestic Network & Interconnects
          </span>
        </div>

        <P>
          The India NOC escalation path covers domestic Point-of-Presence (PoP) locations, metro fiber rings,
          national cloud interconnects, and domestic data centre cross-connects across India:
        </P>

        {/* Stepper Level Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "20px 0 28px" }}>
          {INDIA_LEVELS.map((tier) => (
            <LevelCard
              key={tier.level}
              tier={tier}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* India Matrix Table View */}
        <P style={{ fontWeight: 600, color: "#334155", marginBottom: 10 }}>
          India Matrix Summary Table:
        </P>
        <MatrixTable levels={INDIA_LEVELS} />
      </div>

      {/* ── APAC Region Section ── */}
      <div
        className={`kb-matrix-region kb-region-apac ${
          activeTab !== "apac" && activeTab !== "all" ? "kb-region-hidden" : ""
        }`}
        style={{ marginBottom: 36, marginTop: activeTab === "all" ? 40 : 0 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: 8,
          }}
        >
          <H3 id="apac-matrix">🌏 APAC & Global Escalation Matrix — Lightstorm NOC Services</H3>
          <span
            style={{
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#2563eb",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            Cross-Border, Subsea & Regional Fabric
          </span>
        </div>

        <P>
          The APAC & Global escalation path covers international data centre connections, cross-border
          subsea routes, and multi-region cloud gateways across Singapore, Australia, Hong Kong, Japan,
          and international points of interconnection:
        </P>

        {/* Stepper Level Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "20px 0 28px" }}>
          {APAC_LEVELS.map((tier) => (
            <LevelCard
              key={tier.level}
              tier={tier}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* APAC Matrix Table View */}
        <P style={{ fontWeight: 600, color: "#334155", marginBottom: 10 }}>
          APAC Matrix Summary Table:
        </P>
        <MatrixTable levels={APAC_LEVELS} />
      </div>

      {/* ── APAC Toll-Free Directory ── */}
      <H2 id="toll-free">Global Toll-Free Directory (Level 1 Intake)</H2>
      <P>
        Customers across international regions can dial Level 1 Global Service Operation Desk free of
        charge using these dedicated country toll-free numbers:
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          margin: "18px 0 28px",
        }}
      >
        {APAC_TOLL_FREE.map((tf) => (
          <div
            key={tf.country}
            style={{
              background: "#FFFFFF",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{tf.flag}</span>
              <div>
                <div style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                  {tf.country}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b" }}>
                  {tf.type}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <a
                href={tf.telHref}
                style={{
                  fontFamily: FONT_J,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f766e",
                  background: "#f0fdfa",
                  padding: "6px 10px",
                  borderRadius: 6,
                  textDecoration: "none",
                  border: "1px solid #ccfbf1",
                }}
              >
                {tf.number}
              </a>
              <button
                onClick={() => handleCopy(tf.number, tf.country)}
                title="Copy phone number"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copiedKey === tf.country ? "#16a34a" : "#94a3b8",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {copiedKey === tf.country ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Severity Classification ── */}
      <H2 id="severity-definitions">Incident Severity Classification</H2>
      <P>
        Escalation timers are determined by whether an event is classified as <strong>Service Affecting</strong> or{" "}
        <strong>Non-Service Affecting</strong>:
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          margin: "20px 0 28px",
        }}
      >
        <div
          style={{
            background: "#fff5f5",
            border: "1.5px solid #fecaca",
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span
              style={{
                background: "#dc2626",
                color: "#FFFFFF",
                borderRadius: 8,
                padding: "4px 8px",
                fontFamily: FONT_J,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              CRITICAL / P1
            </span>
            <div style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 800, color: "#991b1b" }}>
              Service Affecting
            </div>
          </div>
          <P style={{ fontSize: 14, color: "#7f1d1d", margin: "0 0 12px", lineHeight: 1.5 }}>
            Direct customer traffic impairment, network outage, or hard link downtime:
          </P>
          <UL>
            <LI>Total physical port or Virtual Connection (VC) link failure</LI>
            <LI>BGP peering session dropped with no active backup route</LI>
            <LI>Packet loss exceeding 5% or sustained severe latency spike</LI>
            <LI>Loss of primary redundant path creating single-point-of-failure risk</LI>
          </UL>
          <div
            style={{
              marginTop: 14,
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "6px 12px",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            India: 1h → 2h → 3h | APAC: 2h → 4h → 6h → 8h
          </div>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span
              style={{
                background: "#2563eb",
                color: "#FFFFFF",
                borderRadius: 8,
                padding: "4px 8px",
                fontFamily: FONT_J,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              STANDARD / P2–P4
            </span>
            <div style={{ fontFamily: FONT_J, fontSize: 16, fontWeight: 800, color: "#1e40af" }}>
              Non-Service Affecting
            </div>
          </div>
          <P style={{ fontSize: 14, color: "#1e3a8a", margin: "0 0 12px", lineHeight: 1.5 }}>
            Operational, telemetry, administrative, or non-traffic-impacting inquiries:
          </P>
          <UL>
            <LI>Secondary redundant link flap where production traffic auto-failed over</LI>
            <LI>Portal access, user permission, or API token provisioning</LI>
            <LI>Bandwidth utilization reporting or VISTA metrics queries</LI>
            <LI>General configuration change requests and routine maintenance queries</LI>
          </UL>
          <div
            style={{
              marginTop: 14,
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#1d4ed8",
              background: "#dbeafe",
              padding: "6px 12px",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            India: 2h → 4h → 6h | APAC: 4h → 8h → 12h → 16h
          </div>
        </div>
      </div>

      {/* ── Before You Escalate Checklist ── */}
      <H2 id="escalation-checklist">Before You Escalate</H2>
      <P>
        To allow the NOC engineering leadership to act with maximum speed, please have the following
        key identifiers ready when placing an escalation call or sending an escalation email:
      </P>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "20px 24px",
          margin: "16px 0 24px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {[
            {
              label: "1. Incident / Ticket ID",
              desc: "Provide the active ticket reference (e.g. #INC-2026-0842) created with Level 1.",
            },
            {
              label: "2. Polarin Service ID",
              desc: "Affected Port ID (e.g. PORT-SIN-001) or Virtual Connection ID (e.g. VC-AWS-009).",
            },
            {
              label: "3. Location / Facility",
              desc: "Originating and terminating data centres or cloud regions involved in the path.",
            },
            {
              label: "4. Business Impact Summary",
              desc: "Observed telemetry (e.g. 100% loss, link down) and business customer impact.",
            },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontFamily: FONT_J,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f766e",
                  marginBottom: 3,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", lineHeight: 1.45 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Callout variant="tip">
        <strong>Fast-track tip:</strong> If an incident has just occurred, always log a ticket first with{" "}
        <strong>Level 1 Global Service Operation Desk</strong> (+91-22-69315544 or{" "}
        <a href="mailto:GSODesk@lightstorm.net" style={{ color: "#0f766e", fontWeight: 700 }}>
          GSODesk@lightstorm.net
        </a>
        ) or via <PageLink label="Create Ticket" onClick={() => onNavigate("create-ticket")} /> so that diagnostic
        monitoring scripts and test bridges trigger immediately.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>
          Log a new incident online: <PageLink label="Create a Ticket" onClick={() => onNavigate("create-ticket")} />.
        </LI>
        <LI>
          Track existing open support requests: <PageLink label="My Tickets" onClick={() => onNavigate("my-tickets")} />.
        </LI>
        <LI>
          Contact the support team directly: <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} />.
        </LI>
        <LI>
          Set up automated SLA threshold alerts: <PageLink label="Manage Alerts" onClick={() => onNavigate("manage-alerts")} />.
        </LI>
      </UL>
    </ArticlePage>
  );
}

// ── Level Card Component ──
function LevelCard({
  tier,
  copiedKey,
  onCopy,
}: {
  tier: MatrixLevel;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "18px 22px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.15s ease",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 800,
              color: tier.accentColor,
              background: tier.badgeBg,
              padding: "4px 10px",
              borderRadius: 8,
              letterSpacing: "0.02em",
            }}
          >
            {tier.levelLabel}
          </span>
          <span
            style={{
              fontFamily: FONT_J,
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {tier.title}
          </span>
        </div>

        {/* SLA Pills */}
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
              fontWeight: 700,
              color: "#b91c1c",
            }}
            title="Service Affecting SLA Escalation Trigger"
          >
            <Clock size={13} color="#dc2626" />
            <span>Service Affecting:</span>
            <span style={{ fontWeight: 800 }}>{tier.serviceAffecting}</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "3px 8px",
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 700,
              color: "#1d4ed8",
            }}
            title="Non-Service Affecting SLA Escalation Trigger"
          >
            <Clock size={13} color="#2563eb" />
            <span>Non-Service Affecting:</span>
            <span style={{ fontWeight: 800 }}>{tier.nonServiceAffecting}</span>
          </div>
        </div>
      </div>

      {/* Middle Details Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "10px 14px",
          background: "#f8fafc",
          borderRadius: 10,
        }}
      >
        <div>
          <div style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
            {tier.contactName}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b" }}>{tier.role}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Phone Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFFFFF",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "4px 8px",
            }}
          >
            <Phone size={14} color="#0f766e" style={{ marginRight: 6 }} />
            <a
              href={`tel:${tier.phoneRaw}`}
              style={{
                fontFamily: FONT_J,
                fontSize: 13,
                fontWeight: 700,
                color: "#0f766e",
                textDecoration: "none",
              }}
            >
              {tier.phone}
            </a>
            <button
              onClick={() => onCopy(tier.phone, `${tier.levelLabel}-phone`)}
              title="Copy phone"
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
              {copiedKey === `${tier.levelLabel}-phone` ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Email Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFFFFF",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "4px 8px",
            }}
          >
            <Mail size={14} color="#2563eb" style={{ marginRight: 6 }} />
            <a
              href={`mailto:${tier.email}`}
              style={{
                fontFamily: FONT_J,
                fontSize: 13,
                fontWeight: 700,
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              {tier.email}
            </a>
            <button
              onClick={() => onCopy(tier.email, `${tier.levelLabel}-email`)}
              title="Copy email"
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
              {copiedKey === `${tier.levelLabel}-email` ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Scope Footer */}
      <div style={{ fontFamily: FONT, fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
        <strong style={{ color: "#334155" }}>Escalation Scope:</strong> {tier.scopeSummary}
      </div>
    </div>
  );
}

// ── Summary Table Component ──
function MatrixTable({ levels }: { levels: MatrixLevel[] }) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: FONT,
          fontSize: 13,
          textAlign: "left",
          background: "#FFFFFF",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f8fafc",
              borderBottom: "1.5px solid #e2e8f0",
              color: "#475569",
              fontFamily: FONT_J,
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <th style={{ padding: "12px 14px", width: 90 }}>Level</th>
            <th style={{ padding: "12px 14px" }}>Service Affecting</th>
            <th style={{ padding: "12px 14px" }}>Non-Service Affecting</th>
            <th style={{ padding: "12px 14px" }}>Contact Person & Role</th>
            <th style={{ padding: "12px 14px" }}>Contact Channels</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((row, idx) => (
            <tr
              key={row.level}
              style={{
                borderBottom: idx === levels.length - 1 ? "none" : "1px solid #f1f5f9",
                background: idx % 2 === 0 ? "#FFFFFF" : "#fcfdfe",
              }}
            >
              <td style={{ padding: "12px 14px", fontWeight: 800, color: row.accentColor }}>
                <span
                  style={{
                    background: row.badgeBg,
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontFamily: FONT_J,
                  }}
                >
                  {row.levelLabel}
                </span>
              </td>
              <td style={{ padding: "12px 14px", fontWeight: 700, color: "#dc2626" }}>
                {row.serviceAffecting}
              </td>
              <td style={{ padding: "12px 14px", fontWeight: 700, color: "#2563eb" }}>
                {row.nonServiceAffecting}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{row.contactName}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{row.role}</div>
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <a
                    href={`tel:${row.phoneRaw}`}
                    style={{ color: "#0f766e", textDecoration: "none", fontWeight: 700 }}
                  >
                    📞 {row.phone}
                  </a>
                  <a
                    href={`mailto:${row.email}`}
                    style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
                  >
                    ✉️ {row.email}
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
