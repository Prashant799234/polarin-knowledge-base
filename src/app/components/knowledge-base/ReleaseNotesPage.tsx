import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Wrench, Bug, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useWindowWidth } from "./useWindowWidth";
import { usePageTools } from "./ArticlePage";
import { CopyPageMenu } from "./CopyPageMenu";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Data ────────────────────────────────────────────────────────────────────

interface ReleaseItem { title: string; description: string }
interface VersionRelease {
  version: string; date: string; isLatest?: boolean;
  newFeatures: ReleaseItem[]; improvements: ReleaseItem[]; bugFixes: ReleaseItem[];
}
interface MonthData { month: string; releases: VersionRelease[] }
interface YearData { year: number; months: MonthData[] }

const ALL_RELEASE_DATA: YearData[] = [
  {
    year: 2025,
    months: [
      {
        month: "June",
        releases: [{
          version: "4.4", date: "June 15, 2025", isLatest: true,
          newFeatures: [
            { title: "Enhanced Wave Analytics Dashboard", description: "Introduced real-time performance monitoring with advanced visualization capabilities including network topology maps and traffic flow analysis." },
            { title: "Multi-Cloud Integration Hub", description: "Added seamless connectivity to AWS, Azure, and GCP from a unified interface with automated route optimization." },
            { title: "Advanced Security Policies", description: "New granular security rule engine with IP allowlisting, geo-restrictions, and DDoS protection profiles." },
            { title: "SPOG Custom Dashboards", description: "Users can now build and save personalized monitoring dashboards with drag-and-drop widget layout." },
          ],
          improvements: [
            { title: "Port Provisioning Speed", description: "Reduced average port provisioning time from 4 minutes to under 90 seconds." },
            { title: "Billing Invoice Generation", description: "Invoice PDF generation now supports GST pre-fill and IRN stamp placement with improved accuracy." },
            { title: "DCI Service Detail Page", description: "Redesigned service detail page with clearer bandwidth utilization graphs and SLA status badges." },
            { title: "API Response Times", description: "Optimized core API endpoints — average response time reduced by 35% under peak load." },
          ],
          bugFixes: [
            { title: "Virtual Router BGP Session Drop", description: "Fixed an intermittent issue causing BGP sessions to reset during high-traffic periods." },
            { title: "Subscription Renewal Notification", description: "Fixed duplicate renewal emails being sent to organization admins." },
            { title: "Cloud Connect AWS Region Selector", description: "Corrected a UI bug where the ap-southeast-2 region was not selectable in Cloud Connect wizard." },
            { title: "Support Ticket Attachment Upload", description: "Resolved a file-size validation error that incorrectly rejected valid attachments under 10 MB." },
          ],
        }],
      },
      {
        month: "May",
        releases: [
          {
            version: "4.3", date: "May 20, 2025",
            newFeatures: [
              { title: "Automated Failover for Virtual Router", description: "Introduced automatic path switching on link failure with sub-second detection and switchover." },
              { title: "Team Role-Based Access Control", description: "New RBAC framework with four built-in roles: Owner, Admin, Operator, and Viewer." },
              { title: "Service Health Alerts", description: "Real-time alerts via email and SMS for service degradation events across all connected ports." },
              { title: "Bulk Port Order Workflow", description: "Streamlined ordering flow supporting up to 50 ports in a single provisioning request." },
            ],
            improvements: [
              { title: "Organisation Profile KYC Flow", description: "Reduced KYC submission steps from 7 to 4 with document auto-detection." },
              { title: "Invite Team Members Email", description: "Invitation emails now include a direct one-click onboarding link valid for 7 days." },
              { title: "Locations Map Performance", description: "Global PoP map now loads 60% faster with lazy-loaded location markers." },
              { title: "Billing Subscription UI", description: "Subscription plan comparison table redesigned for clarity with feature diff highlighting." },
            ],
            bugFixes: [
              { title: "Cloud Connect Bandwidth Calculation", description: "Fixed incorrect bandwidth utilization display when multiple VLANs share a port." },
              { title: "Escalation Matrix PDF Export", description: "Resolved formatting issue in exported PDFs on macOS Safari." },
              { title: "DCI Order Status Polling", description: "Fixed a race condition causing order status to remain stuck at Pending Activation." },
              { title: "Session Timeout on Dashboard", description: "Corrected session refresh logic to prevent unexpected logouts after 15 minutes of inactivity." },
            ],
          },
          {
            version: "4.2", date: "May 1, 2025",
            newFeatures: [
              { title: "Wave Analytics Dashboard", description: "First release of the Wave Analytics module with optical layer performance metrics." },
              { title: "API Key Management", description: "New self-service API key generation with scoped permissions and expiry controls." },
              { title: "DCI Interconnect Wizard", description: "Step-by-step guided wizard for configuring Data Center Interconnect services." },
              { title: "Usage Reports Export", description: "Download bandwidth utilization and billing reports as CSV or Excel directly from the portal." },
            ],
            improvements: [
              { title: "Search & Filter on SPOG", description: "Added multi-criteria filtering (status, region, service type) to the SPOG service list." },
              { title: "Contact Support Form", description: "Support form now pre-fills the account number and affected service for faster ticket routing." },
              { title: "Port Detail Page Layout", description: "Reorganized port detail page with a tabbed layout separating configuration from monitoring." },
              { title: "Mobile Responsive Sidebar", description: "Navigation sidebar now collapses correctly on tablet and mobile viewports." },
            ],
            bugFixes: [
              { title: "Invoice Download 500 Error", description: "Fixed server-side error when generating invoices for accounts with more than 100 line items." },
              { title: "Virtual Router Config Save", description: "Resolved an issue where saving BGP configuration changes silently failed without notification." },
              { title: "Organisation Profile Logo Upload", description: "Fixed PNG transparency handling in organisation logo uploads." },
              { title: "Feedback Form Submit Loop", description: "Corrected a form submission bug causing the feedback page to reload without sending data." },
            ],
          },
        ],
      },
    ],
  },
  {
    year: 2024,
    months: [
      {
        month: "December",
        releases: [{
          version: "4.1", date: "December 18, 2024",
          newFeatures: [
            { title: "Polarin Mobile App Beta", description: "Launch of the iOS and Android beta app with service monitoring, alerts, and support ticket creation." },
            { title: "Network Topology Visualizer", description: "Interactive graph view of all connected services, ports, and routers within an organisation." },
            { title: "SLA Dashboard", description: "Dedicated SLA tracking view with uptime percentage, incident history, and credit calculation." },
          ],
          improvements: [
            { title: "Dashboard Load Time", description: "Reduced main dashboard initial load from 4.2s to 1.1s via server-side rendering improvements." },
            { title: "BGP Route Filtering UI", description: "Improved BGP route filter interface with prefix-list editor and community string validator." },
            { title: "Notification Preferences", description: "Users can now configure per-service alert thresholds and preferred notification channels." },
          ],
          bugFixes: [
            { title: "Port Status Refresh", description: "Fixed port status not updating in real-time after provisioning completion." },
            { title: "CSV Export Encoding", description: "Resolved UTF-8 encoding issue in usage report CSV exports on Windows Excel." },
          ],
        }],
      },
      {
        month: "September",
        releases: [{
          version: "4.0", date: "September 10, 2024",
          newFeatures: [
            { title: "Polarin 4.0 Platform Relaunch", description: "Complete UI/UX overhaul with the new Polarin design system — faster navigation, improved accessibility, and a unified component library." },
            { title: "Multi-Org Support", description: "Users can now belong to multiple organisations and switch between them without logging out." },
            { title: "GraphQL API v2", description: "New GraphQL endpoint for flexible data querying, replacing multiple REST calls for complex operations." },
          ],
          improvements: [
            { title: "Guided Onboarding Checklist", description: "New onboarding checklist for organisations completing their first service provisioning." },
            { title: "Dark Mode Support", description: "Platform-wide dark mode now available as a user preference in account settings." },
          ],
          bugFixes: [
            { title: "VLAN Tag Conflict Error", description: "Fixed false-positive VLAN tag conflict warnings during port configuration." },
            { title: "Organisation Switcher Lag", description: "Resolved 3–5s delay when switching between organisations on the same session." },
          ],
        }],
      },
      {
        month: "June",
        releases: [{
          version: "3.9", date: "June 5, 2024",
          newFeatures: [
            { title: "Route Policy Templates", description: "Pre-built BGP route policy templates for transit, peering, and customer route use cases." },
            { title: "Bandwidth Scheduler", description: "Schedule bandwidth upgrades and downgrades in advance with calendar-based provisioning." },
          ],
          improvements: [
            { title: "Port Order Lead Time Visibility", description: "Estimated provisioning lead time now shown during port ordering based on location capacity." },
            { title: "Invoice Line Item Detail", description: "Invoice PDFs now include per-service daily usage breakdown for audit purposes." },
          ],
          bugFixes: [
            { title: "Cloud Connect GCP Region Bug", description: "Fixed incorrect GCP region display in Cloud Connect service details." },
            { title: "Team Member Removal Delay", description: "Resolved a delay where removed team members retained portal access for up to 30 minutes." },
          ],
        }],
      },
      {
        month: "March",
        releases: [{
          version: "3.8", date: "March 20, 2024",
          newFeatures: [
            { title: "Automated Compliance Reports", description: "Generate SOC2 and ISO27001 compliance readiness reports directly from the portal." },
            { title: "Port Aggregation (LAG)", description: "Support for Link Aggregation Groups across multiple physical ports for increased bandwidth." },
          ],
          improvements: [
            { title: "Platform-Wide Search", description: "Search now indexes service names, ticket subjects, and invoice references." },
            { title: "Session Security", description: "Added IP-based session binding as an optional security enhancement in account settings." },
          ],
          bugFixes: [
            { title: "Billing Cycle Date Mismatch", description: "Fixed billing cycle start date incorrectly showing previous month for annual subscription plans." },
            { title: "Two-Factor Auth SMS Delay", description: "Resolved SMS OTP delivery delays for users in Southeast Asia region." },
          ],
        }],
      },
    ],
  },
  {
    year: 2023,
    months: [
      {
        month: "December",
        releases: [{
          version: "3.7", date: "December 12, 2023",
          newFeatures: [
            { title: "Dedicated Support Portal", description: "Launched a standalone support hub with ticket tracking, knowledge base search, and escalation matrix." },
            { title: "Port Utilization Alerts", description: "Configurable threshold alerts when port utilization exceeds defined percentages." },
          ],
          improvements: [
            { title: "Cloud Connect Provisioning", description: "AWS Direct Connect and Azure ExpressRoute provisioning time reduced by 40% with pre-validation checks." },
            { title: "User Audit Logs", description: "Admin users can now view a 90-day audit trail of all portal actions by team members." },
          ],
          bugFixes: [
            { title: "Invoice Regeneration Error", description: "Fixed 500 error when regenerating invoices for cancelled services." },
            { title: "Feedback Widget Overflow", description: "Corrected layout overflow in the feedback widget on screens narrower than 1024px." },
          ],
        }],
      },
      {
        month: "June",
        releases: [
          {
            version: "3.6", date: "June 22, 2023",
            newFeatures: [
              { title: "Virtual Router GA", description: "Virtual Router exits beta — now generally available with full SLA coverage and production support." },
              { title: "Custom DNS Zones", description: "Create and manage private DNS zones linked to Virtual Router instances." },
            ],
            improvements: [
              { title: "DCI Service Monitoring", description: "Added real-time latency and packet-loss monitoring for all DCI services on the SPOG dashboard." },
              { title: "KYC Document Validation", description: "Automated document format and resolution validation during KYC upload to reduce rejection rates." },
            ],
            bugFixes: [
              { title: "BGP Peer State Display", description: "Fixed BGP peer state showing Idle even when session was Established." },
              { title: "Team Invite Resend", description: "Resolved issue where resent invitations generated a duplicate user entry." },
            ],
          },
          {
            version: "3.5", date: "June 1, 2023",
            newFeatures: [
              { title: "Polarin Portal Launch", description: "Initial public release of the Polarin self-service portal with port ordering, DCI, and cloud connectivity." },
              { title: "SPOG Dashboard v1", description: "First version of the Single Pane of Glass (SPOG) service monitoring dashboard." },
            ],
            improvements: [],
            bugFixes: [],
          },
        ],
      },
    ],
  },
];

const ALL_YEARS = ALL_RELEASE_DATA.map((d) => d.year);

// ── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownProps {
  label: string; value: string; options: string[];
  onChange: (val: string) => void; width?: number;
}

function CustomDropdown({ label, value, options, onChange, width = 110 }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#90a2b9", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
            background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 12,
            cursor: "pointer", fontFamily: FONT, fontWeight: 500, fontSize: 14,
            color: "#0a3954", transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0a3954"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f1"; }}
        >
          <span style={{ width, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", lineHeight: "24px" }}>
            {value}
          </span>
          <ChevronDown
            size={18} color="#90a2b9"
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          />
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
            background: "#ffffff", border: "1px solid #e2e8f1", borderRadius: 12,
            boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 4px 16px rgba(96,97,112,0.16)",
            overflow: "hidden", minWidth: "100%",
          }}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  width: "100%", display: "block", padding: "10px 16px", textAlign: "left",
                  fontFamily: FONT, fontWeight: opt === value ? 700 : 500, fontSize: 14,
                  lineHeight: "22px", color: opt === value ? "#1c808d" : "#0a3954",
                  background: opt === value ? "#f0fdfa" : "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { if (opt !== value) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Accordion ────────────────────────────────────────────────────────

type SectionType = "newFeatures" | "improvements" | "bugFixes";

const SECTION_CONFIG: Record<SectionType, { label: string; iconBg: string; icon: React.ReactNode }> = {
  newFeatures:  { label: "New Features",  iconBg: "#00a63e", icon: <Plus  size={20} color="white" strokeWidth={2.5} /> },
  improvements: { label: "Improvements",  iconBg: "#165dfb", icon: <Wrench size={20} color="white" strokeWidth={2} /> },
  bugFixes:     { label: "Bug Fixes",     iconBg: "#e7000b", icon: <Bug   size={20} color="white" strokeWidth={2} /> },
};

function SectionAccordion({ sectionKey, versionKey, items, openSections, toggleSection }: {
  sectionKey: SectionType; versionKey: string; items: ReleaseItem[];
  openSections: Set<string>; toggleSection: (k: string) => void;
}) {
  const key = `${versionKey}-${sectionKey}`;
  const isOpen = openSections.has(key);
  const { label, iconBg, icon } = SECTION_CONFIG[sectionKey];

  return (
    <div style={{ border: "1px solid #e2e8f1", borderRadius: 16, overflow: "hidden" }}>
      <button
        onClick={() => toggleSection(key)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16, padding: 24,
          background: "#ffffff", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, lineHeight: "24px", color: "#0a3954", whiteSpace: "nowrap" }}>
            {label}
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0a3954", background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap" }}>
            {items.length} Updates
          </span>
        </div>
        {isOpen
          ? <ChevronUp size={24} color="#90a2b9" style={{ flexShrink: 0 }} />
          : <ChevronDown size={24} color="#90a2b9" style={{ flexShrink: 0 }} />}
      </button>
      {isOpen && (
        <div style={{ background: "#f8fafc", padding: "16px 24px 24px" }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, i) => (
              <li key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: "22px", color: "#0a3954" }}>
                <strong style={{ fontWeight: 700 }}>{item.title}</strong>
                {" — "}
                <span style={{ fontWeight: 400 }}>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Version Card ─────────────────────────────────────────────────────────────

function VersionCard({ release, versionKey, openSections, toggleSection }: {
  release: VersionRelease; versionKey: string;
  openSections: Set<string>; toggleSection: (k: string) => void;
}) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f1", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 24, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            Version {release.version}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={16} color="#90a2b9" />
            <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#90a2b9" }}>
              Released {release.date}
            </span>
          </div>
        </div>
        {release.isLatest && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 16, background: "#dcfce7", border: "1px solid #b9f8cf", fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#008236", flexShrink: 0 }}>
            ✦ Latest
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(["newFeatures", "improvements", "bugFixes"] as SectionType[]).map((sk) =>
          release[sk].length > 0 ? (
            <SectionAccordion
              key={sk} sectionKey={sk} versionKey={versionKey}
              items={release[sk]} openSections={openSections} toggleSection={toggleSection}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ReleaseNotesPage() {
  const tools = usePageTools();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<string>("June");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["2025-June-4.4-newFeatures", "2025-June-4.4-improvements", "2025-June-4.4-bugFixes"])
  );

  const suppressObserver = useRef(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Stable refs to selected state — avoid stale closures inside observer
  const selectedYearRef = useRef(selectedYear);
  const selectedMonthRef = useRef(selectedMonth);
  useEffect(() => { selectedYearRef.current = selectedYear; }, [selectedYear]);
  useEffect(() => { selectedMonthRef.current = selectedMonth; }, [selectedMonth]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Month dropdown options reflect the currently visible year
  const yearData = ALL_RELEASE_DATA.find((d) => d.year === selectedYear);
  const monthOptions = ["All", ...(yearData?.months.map((m) => m.month) ?? [])];

  // Wire up IntersectionObserver once — all sections are in DOM from the start
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const el = visible[0].target as HTMLElement;
        const month = el.dataset.month ?? "";
        const year = Number(el.dataset.year ?? 0);
        if (year && year !== selectedYearRef.current) {
          setSelectedYear(year);
          setSelectedMonth(month);
        } else if (month && month !== selectedMonthRef.current) {
          setSelectedMonth(month);
        }
      },
      { root, threshold: 0.05, rootMargin: "0px 0px -55% 0px" }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []); // all sections are static — no need to re-observe

  const setSectionRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) sectionRefs.current.set(key, el);
      else sectionRefs.current.delete(key);
    },
    []
  );

  const handleYearChange = (val: string) => {
    const year = Number(val);
    suppressObserver.current = true;
    setSelectedYear(year);
    const firstMonth = ALL_RELEASE_DATA.find((d) => d.year === year)?.months[0]?.month ?? "All";
    setSelectedMonth(firstMonth);
    const el = sectionRefs.current.get(`year-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => { suppressObserver.current = false; }, 800);
  };

  const handleMonthChange = (val: string) => {
    suppressObserver.current = true;
    setSelectedMonth(val);
    const key = val === "All" ? `year-${selectedYear}` : `${selectedYear}-${val}`;
    const el = sectionRefs.current.get(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => { suppressObserver.current = false; }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* ── Filter bar — sits above the scroll area, always visible ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 16 : 32,
          padding: isMobile ? "14px 16px" : "18px 32px",
          borderBottom: "1px solid #e2e8f1",
          background: "#ffffff",
          flexWrap: "wrap",
        }}
      >
        <CustomDropdown
          label="Year:"
          value={String(selectedYear)}
          options={ALL_YEARS.map(String)}
          onChange={handleYearChange}
          width={50}
        />
        <CustomDropdown
          label="Month:"
          value={selectedMonth}
          options={monthOptions}
          onChange={handleMonthChange}
          width={90}
        />
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={contentRef}
        style={{ flex: 1, overflowY: "auto", padding: isMobile ? "24px 16px 40px" : "32px 32px 60px" }}
      >
        {/* Page header */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#effcfd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
              <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
                Release Notes
              </h1>
              {tools && <CopyPageMenu contentRef={tools.contentRef} pageTitle={tools.pageTitle} pageId={tools.pageId} />}
            </div>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "#7e93b2" }}>
              Stay up to date with the latest features, improvements, and bug fixes.
            </p>
          </div>
        </div>

        {/* All years in continuous scroll */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {ALL_RELEASE_DATA.map(({ year, months }, yi) => (
            <div key={year} style={{ marginBottom: 48 }}>
              {/* Year divider — also serves as jump target */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current.set(`year-${year}`, el);
                  else sectionRefs.current.delete(`year-${year}`);
                }}
                style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, marginTop: yi > 0 ? 8 : 0 }}
              >
                <div style={{ height: 1, flex: 1, background: "#e2e8f1" }} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 13, color: "#90a2b9", letterSpacing: "0.08em", userSelect: "none" }}>
                  {year}
                </span>
                <div style={{ height: 1, flex: 1, background: "#e2e8f1" }} />
              </div>

              {/* Month sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                {months.map((monthData) => (
                  <div
                    key={monthData.month}
                    ref={setSectionRef(`${year}-${monthData.month}`)}
                    data-month={monthData.month}
                    data-year={year}
                  >
                    <p style={{ margin: "0 0 16px", fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#90a2b9" }}>
                      {monthData.month}, {year}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {monthData.releases.map((release) => (
                        <VersionCard
                          key={release.version}
                          release={release}
                          versionKey={`${year}-${monthData.month}-${release.version}`}
                          openSections={openSections}
                          toggleSection={toggleSection}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
