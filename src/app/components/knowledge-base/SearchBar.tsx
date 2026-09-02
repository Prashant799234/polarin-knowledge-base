import { useState, useEffect, useRef } from "react";
import { Search, Clock, FileText, X } from "lucide-react";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface SearchResult {
  id: string;
  label: string;
  group: string;
  description?: string;
}

const ALL_PAGES: SearchResult[] = [
  { id: "welcome",          label: "Welcome",                            group: "Home",                       description: "Polarin Docs home and quick start links" },
  { id: "release-notes",   label: "Release Notes",                      group: "Home",                       description: "Latest platform updates and changes" },
  { id: "about-polarin",   label: "About Polarin",                      group: "Get Started",                description: "What Polarin is and how the platform works" },
  { id: "services-offered", label: "Services Offered",                  group: "Get Started",                description: "Overview of all services available on Polarin" },
  { id: "create-account",  label: "Create a Polarin Account",           group: "Get Started",                description: "Sign up, verify email and set your password" },
  { id: "complete-profile", label: "Complete Organisation Profile",      group: "Get Started",                description: "Set up org details and authorised signatory" },
  { id: "org-kyc",         label: "KYC Document Requirements",          group: "Get Started",                description: "Proof of identity documents for Indian and global entities" },
  { id: "org-settings",    label: "Organisation Settings",              group: "Get Started",                description: "Manage organisation-wide settings and preferences" },
  { id: "invite-members",  label: "Invite Team Members",                group: "Get Started",                description: "Add colleagues with role-based access" },
  { id: "locations",       label: "Locations",                          group: "Services",                   description: "Global data centre locations and available products" },
  { id: "cloud-aws",       label: "AWS Direct Connect",                 group: "Services · Cloud Connect",   description: "Connect to Amazon Web Services via Direct Connect" },
  { id: "cloud-azure",     label: "Azure ExpressRoute",                 group: "Services · Cloud Connect",   description: "Connect to Microsoft Azure via ExpressRoute" },
  { id: "cloud-gcp",       label: "Google Cloud Interconnect",          group: "Services · Cloud Connect",   description: "Connect to Google Cloud Platform" },
  { id: "dci-create",      label: "Create DCI Service",                 group: "Services · DCI",             description: "Provision a data centre interconnect service" },
  { id: "dci-manage",      label: "Manage DCI",                         group: "Services · DCI",             description: "Monitor and configure DCI services" },
  { id: "port-create",     label: "Create a Port",                      group: "Services · Port",            description: "Order a physical port on the Polarin network" },
  { id: "port-status",     label: "Understand Port Status",             group: "Services · Port",            description: "Design, Ordered, Live, Failed — what each status means" },
  { id: "port-lag",        label: "Create a Link Aggregation Group",    group: "Services · Port",            description: "Bundle ports for higher throughput with LACP" },
  { id: "vr-create",       label: "Create a Virtual Router",            group: "Services · Virtual Router",  description: "L3 gateway for routing between clouds and data centres" },
  { id: "vr-status",       label: "Understand Virtual Router Status",   group: "Services · Virtual Router",  description: "Provisioning states from Design to Live" },
  { id: "spog-dashboard",  label: "SPOG Dashboard Overview",            group: "Manage Services",            description: "Single pane of glass for all services" },
  { id: "spog-analytics",  label: "SPOG Analytics",                     group: "Manage Services",            description: "Traffic analytics and insights" },
  { id: "billing-invoices", label: "Invoices",                          group: "Manage Services · Billing",  description: "Download and manage billing invoices" },
  { id: "billing-payment", label: "Payment Methods",                    group: "Manage Services · Billing",  description: "Manage credit cards and payment options" },
  { id: "sub-plans",       label: "Plans & Pricing",                    group: "Manage Services",            description: "Subscription plans and pricing details" },
  { id: "sub-usage",       label: "Usage Reports",                      group: "Manage Services",            description: "Detailed usage analytics and reports" },
  { id: "activity-logs",   label: "Activity Log",                       group: "Manage Services",            description: "Audit trail of all platform events with severity levels" },
  { id: "contact-support", label: "Contact Support",                    group: "Help & Support",             description: "Reach the Polarin support team" },
  { id: "my-tickets",      label: "My Tickets",                         group: "Help & Support",             description: "View and manage your open support tickets" },
  { id: "create-ticket",   label: "Create Ticket",                      group: "Help & Support",             description: "Open a new support request" },
  { id: "escalation-matrix", label: "Escalation Matrix",               group: "Help & Support",             description: "Contact hierarchy for issue escalation" },
  { id: "feedback",        label: "Feedback & Suggestions",             group: "Help & Support",             description: "Share product feedback and feature requests" },
];

function searchPages(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/);
  return ALL_PAGES.filter(p => {
    const hay = `${p.label} ${p.group} ${p.description ?? ""}`.toLowerCase();
    return words.every(w => hay.includes(w));
  }).slice(0, 8);
}

const LS_KEY = "polarin-docs-recent-searches";

function loadRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); }
  catch { return []; }
}

function saveRecentSearch(q: string) {
  const existing = loadRecentSearches().filter(s => s !== q);
  localStorage.setItem(LS_KEY, JSON.stringify([q, ...existing].slice(0, 5)));
}

interface SearchBarProps {
  onNavigate: (id: string) => void;
  recentPageIds: string[];
}

export function SearchBar({ onNavigate, recentPageIds }: SearchBarProps) {
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef   = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results        = query.trim() ? searchPages(query) : [];
  const recentArticles = recentPageIds
    .map(id => ALL_PAGES.find(p => p.id === id))
    .filter(Boolean) as SearchResult[];

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside → close
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) setRecentSearches(loadRecentSearches());
  }, [open]);

  const handleSelect = (id: string) => {
    if (query.trim()) saveRecentSearch(query.trim());
    setOpen(false);
    setQuery("");
    setActiveIdx(-1);
    onNavigate(id);
  };

  const listItems = query.trim() ? results : [];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, listItems.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && activeIdx >= 0 && listItems[activeIdx]) handleSelect(listItems[activeIdx].id);
    if (e.key === "Escape") { setOpen(false); setQuery(""); inputRef.current?.blur(); }
  };

  const hasDropdownContent = open && (
    query.trim()
      ? true
      : recentSearches.length > 0 || recentArticles.length > 0
  );

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      {/* ── Search input ── */}
      <div
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          height: 38, padding: "0 14px",
          background: open ? "#fff" : "#f4f6f9",
          border: `1.5px solid ${open ? "#1c808d" : "#dde3ec"}`,
          borderRadius: hasDropdownContent ? "10px 10px 0 0" : 10,
          boxShadow: open ? "0 0 0 3px rgba(28,128,141,0.08)" : "none",
          cursor: "text",
          transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        }}
      >
        <Search size={15} color={open ? "#1c808d" : "#94a3b8"} style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search docs..."
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: FONT, fontSize: 14, color: "#0a3954",
            minWidth: 0,
          }}
        />
        {query ? (
          <button
            onClick={e => { e.stopPropagation(); setQuery(""); setActiveIdx(-1); inputRef.current?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2, borderRadius: 4, flexShrink: 0 }}
          >
            <X size={13} />
          </button>
        ) : !open ? (
          <kbd style={{
            fontFamily: FONT, fontSize: 11, color: "#94a3b8",
            background: "#eef0f4", border: "1px solid #dde3ec",
            borderRadius: 5, padding: "2px 7px", flexShrink: 0,
            letterSpacing: "0.02em",
          }}>
            ⌘K
          </kbd>
        ) : null}
      </div>

      {/* ── Dropdown ── */}
      {hasDropdownContent && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 300,
          background: "#fff",
          border: "1.5px solid #1c808d", borderTop: "1px solid #e9edf2",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 12px 36px rgba(10,57,84,0.14)",
          overflow: "hidden",
        }}>

          {/* Empty state (no query typed) */}
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <>
                  <SectionHeader>Recent searches</SectionHeader>
                  {recentSearches.map(s => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setActiveIdx(-1); inputRef.current?.focus(); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 14px", background: "none", border: "none",
                        cursor: "pointer", textAlign: "left",
                        borderLeft: "2.5px solid transparent",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                    >
                      <Clock size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT, fontSize: 14, color: "#4b5563" }}>{s}</span>
                    </button>
                  ))}
                  {recentArticles.length > 0 && (
                    <div style={{ height: 1, background: "#f0f2f5", margin: "4px 0" }} />
                  )}
                </>
              )}
              {recentArticles.length > 0 && (
                <>
                  <SectionHeader>Recently viewed</SectionHeader>
                  {recentArticles.map(p => (
                    <ResultRow key={p.id} result={p} active={false} onSelect={handleSelect} />
                  ))}
                </>
              )}
            </>
          )}

          {/* Results */}
          {query.trim() && (
            results.length > 0 ? (
              <>
                <SectionHeader>
                  {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                </SectionHeader>
                {results.map((r, i) => (
                  <ResultRow key={r.id} result={r} active={activeIdx === i} onSelect={handleSelect} />
                ))}
              </>
            ) : (
              <div style={{ padding: "28px 16px", textAlign: "center", fontFamily: FONT, fontSize: 13, color: "#94a3b8" }}>
                No results for <strong style={{ color: "#0a3954" }}>&ldquo;{query}&rdquo;</strong>
              </div>
            )
          )}

          {/* Keyboard hints */}
          <div style={{
            padding: "8px 16px", borderTop: "1px solid #f0f2f5",
            display: "flex", gap: 16, alignItems: "center",
            fontFamily: FONT, fontSize: 11, color: "#b0b9c8",
          }}>
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: "10px 14px 5px",
      fontFamily: FONT_J, fontSize: 10, fontWeight: 700,
      color: "#b0b9c8", textTransform: "uppercase", letterSpacing: "0.09em",
    }}>
      {children}
    </div>
  );
}

interface ResultRowProps {
  result: SearchResult;
  active: boolean;
  onSelect: (id: string) => void;
}

function ResultRow({ result, active, onSelect }: ResultRowProps) {
  return (
    <button
      onClick={() => onSelect(result.id)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        background: active ? "#f0fdfa" : "none",
        border: "none", cursor: "pointer", textAlign: "left",
        borderLeft: `2.5px solid ${active ? "#1c808d" : "transparent"}`,
        transition: "background 0.1s",
        boxSizing: "border-box",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "none"; }}
    >
      <FileText size={14} color={active ? "#1c808d" : "#94a3b8"} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: FONT_J, fontSize: 13, fontWeight: 600,
          color: active ? "#1c808d" : "#0a3954",
          margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {result.label}
        </p>
        {result.description && (
          <p style={{
            fontFamily: FONT, fontSize: 12, color: "#94a3b8",
            margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {result.description}
          </p>
        )}
      </div>
      <span style={{
        fontFamily: FONT, fontSize: 11, color: "#7e93b2", flexShrink: 0,
        background: "#f4f6f9", padding: "2px 9px", borderRadius: 20,
        border: "1px solid #e2e8f1", whiteSpace: "nowrap",
      }}>
        {result.group}
      </span>
    </button>
  );
}
