import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, Menu, X, Code2,
  ArrowRight, Sparkles,
  Copy, Check, AlertTriangle, Play, ChevronRight,
  Search, Clock, GitBranch,
} from "lucide-react";
import { NAV_GROUPS, ALL_NAV_ITEMS, findParentModule, type NavItem, type SubItem } from "./navData";
import { ALL_SUB_MODULES, findSubModule, type Endpoint } from "./apiData";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

const C = {
  teal: "#1c808d", navy: "#0a3954", bg: "#f8fafc",
  white: "#ffffff", border: "#e2e8f1", text: "#0a3954",
  muted: "#64748b", iconIdle: "#7e93b2", sectionLabel: "#90a2b9",
};

type Env = "staging" | "production";

// ── How-to-use tips by HTTP method ─────────────────────────────────────────

const USE_TIPS: Record<string, string[]> = {
  GET: [
    "Call with your `access-token` header — no request body needed.",
    "Use query parameters to filter, sort, or paginate results.",
    "The response includes a `data` field with the resource(s) and optional pagination metadata.",
    "Safe to retry — GET requests never modify server state.",
  ],
  POST: [
    "Send the required fields as a JSON object in the request body.",
    "Set `Content-Type: application/json` in your headers alongside `access-token`.",
    "A 200 response returns the newly created resource, including its assigned ID.",
    "Duplicate submissions may create duplicate records — validate before retrying.",
  ],
  PUT: [
    "Pass the resource's unique ID in the request URL path.",
    "Include all fields to update in the JSON body — omitted fields may be reset to defaults.",
    "Use PUT when you want to replace the entire resource with new values.",
    "A 200 response confirms the update with the new resource state.",
  ],
  PATCH: [
    "Send only the specific fields you want to change — other fields stay untouched.",
    "Set `Content-Type: application/json` alongside your `access-token` header.",
    "Preferred over PUT when making small, targeted changes to an existing resource.",
  ],
  DELETE: [
    "Pass the resource's unique ID in the URL path.",
    "This action is permanent — deleted resources cannot be recovered.",
    "A 200 response confirms the resource was successfully removed.",
    "Some resources cannot be deleted while they have active dependent services.",
  ],
};

// ── Portal search bar ──────────────────────────────────────────────────────

interface SearchResult { id: string; label: string; group: string; type: "submodule" | "endpoint" }

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  ALL_SUB_MODULES.forEach(sm => {
    const parent = findParentModule(sm.id);
    results.push({ id: sm.id, label: sm.label, group: parent?.label ?? "Modules", type: "submodule" });
    sm.endpoints.forEach(ep => {
      results.push({ id: sm.id, label: ep.name, group: `${parent?.label ?? ""} › ${sm.label}`, type: "endpoint" });
    });
  });
  return results;
}

const SEARCH_INDEX = buildSearchIndex();

function PortalSearchBar({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 1
    ? SEARCH_INDEX.filter(r => {
        const h = `${r.label} ${r.group}`.toLowerCase();
        return query.toLowerCase().split(" ").every(w => h.includes(w));
      }).slice(0, 9)
    : [];

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pick(id: string) { onNavigate(id); setOpen(false); setQuery(""); }

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: open ? "#fff" : "#f8fafc",
        border: `1.5px solid ${open ? C.teal : C.border}`,
        borderRadius: 10, padding: "0 14px", height: 40,
        transition: "border-color 0.15s, background 0.15s",
        boxShadow: open ? `0 0 0 3px ${C.teal}18` : "none",
      }}>
        <Search size={15} color={open ? C.teal : C.iconIdle} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search endpoints, modules…"
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontFamily: FONT, fontSize: 13, color: C.navy,
          }}
        />
        <span style={{ fontFamily: FONT, fontSize: 11, color: C.muted, background: "#f0f4f8", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
          210 endpoints
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
              background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
              maxHeight: 340, overflowY: "auto",
            }}
          >
            {results.length === 0 && query.trim().length > 1 && (
              <div style={{ padding: "20px 16px", fontFamily: FONT, fontSize: 13, color: C.muted, textAlign: "center" }}>
                No results for "{query}"
              </div>
            )}
            {results.length === 0 && query.trim().length <= 1 && (
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Popular
                </div>
                {["auth-login","users-profile","ports-order","vista-port-metrics","billing-profiles"].map(id => {
                  const sm = findSubModule(id);
                  const par = findParentModule(id);
                  if (!sm) return null;
                  return (
                    <button key={id} onClick={() => pick(id)} style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "9px 8px", background: "none", border: "none", cursor: "pointer", borderRadius: 8, textAlign: "left",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                      <Clock size={13} color={C.iconIdle} />
                      <div>
                        <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 600, color: C.navy }}>{sm.label}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{par?.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {results.length > 0 && results.map((r, i) => (
              <button key={i} onClick={() => pick(r.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: r.type === "submodule" ? "#f0f9fa" : "#f8fafc",
                  border: `1px solid ${r.type === "submodule" ? C.teal + "30" : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {r.type === "submodule"
                    ? <GitBranch size={13} color={C.teal} />
                    : <span style={{ fontFamily: FONT_J, fontSize: 9, fontWeight: 800, color: C.muted }}>EP</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 600, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>{r.group}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ENV_URLS: Record<Env, string> = {
  staging: "https://uat-api-polarin.lightstorm.in",
  production: "https://api-polarin.lightstorm.in",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function methodColor(m: string) {
  switch (m) {
    case "GET":    return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
    case "POST":   return { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
    case "PUT":    return { bg: "#fffbeb", text: "#b45309", border: "#fde68a" };
    case "PATCH":  return { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" };
    case "DELETE": return { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" };
    default:       return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f1" };
  }
}

function crudColor(c: string) {
  switch (c) {
    case "C": return { bg: "#f0fdf4", text: "#15803d" };
    case "R": return { bg: "#eff6ff", text: "#1d4ed8" };
    case "U": return { bg: "#fffbeb", text: "#b45309" };
    case "D": return { bg: "#fff1f2", text: "#be123c" };
    default:  return { bg: "#f8fafc", text: "#64748b" };
  }
}

function crudLabel(c: string) {
  return { C: "CREATE", R: "READ", U: "UPDATE", D: "DELETE" }[c] ?? c;
}

// ── NavButton (exact KB replica) ──────────────────────────────────────────

interface NavButtonProps {
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  isActive: boolean;
  isParentActive?: boolean;
  badge?: string;
  external?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  indent?: boolean;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, isActive, isParentActive, badge, external, hasChildren, isOpen, indent, onClick }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center",
        width: "100%", boxSizing: "border-box",
        paddingLeft: indent ? 48 : 24,
        paddingRight: 16,
        paddingTop: indent ? 10 : 12,
        paddingBottom: indent ? 10 : 12,
        marginRight: 8,
        background: isActive
          ? C.white
          : hovered ? "rgba(28,128,141,0.04)" : "transparent",
        border: "none",
        borderRadius: isActive ? "0 16px 16px 0" : "0 8px 8px 0",
        boxShadow: isActive
          ? "0 2px 12px rgba(28,128,141,0.10), 0 1px 3px rgba(0,0,0,0.06)"
          : "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s, box-shadow 0.15s",
        gap: 10,
        position: "relative",
      }}
    >
      {Icon && (
        <Icon
          size={indent ? 15 : 17}
          color={isActive || isParentActive ? C.teal : C.iconIdle}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      )}
      <span style={{
        fontFamily: FONT_J,
        fontSize: indent ? 13 : 14,
        fontWeight: isActive ? 700 : (isParentActive ? 600 : 500),
        color: isActive ? C.teal : (isParentActive ? C.navy : C.text),
        flex: 1,
        lineHeight: 1.3,
        letterSpacing: "0.005em",
      }}>
        {label}
      </span>
      {badge && (
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          background: "linear-gradient(135deg,#1c808d 0%,#0a3954 100%)",
          color: "#fff", borderRadius: 20,
          padding: "1px 7px", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.03em",
        }}>
          <Sparkles size={9} /> {badge}
        </span>
      )}
      {external && <ExternalLink size={12} color={C.iconIdle} />}
      {hasChildren && (
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <ChevronDown size={14} color={isParentActive ? C.teal : C.iconIdle} />
        </motion.span>
      )}
    </motion.button>
  );
}

// ── Version selector ──────────────────────────────────────────────────────────

interface VersionInfo {
  v: string;
  status: "latest" | "deprecated" | "sunset";
  released: string;
  retireBy?: string;
  note: string;
}

const VERSIONS: VersionInfo[] = [
  {
    v: "v1.0", status: "latest", released: "Jan 2025",
    note: "Current stable version. All new integrations should target v1.0.",
  },
  {
    v: "v0.9", status: "deprecated", released: "Jun 2024", retireBy: "Jun 2026",
    note: "Pagination updated — `limit` replaced by `pageSize`. Migrate before retire date.",
  },
  {
    v: "v0.8", status: "sunset", released: "Jan 2024", retireBy: "Jan 2025",
    note: "No longer served. Requests return 410 Gone. Upgrade to v1.0 immediately.",
  },
];

const VERSION_STATUS: Record<VersionInfo["status"], { label: string; color: string; bg: string; border: string }> = {
  latest:     { label: "Current",    color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  deprecated: { label: "Deprecated", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  sunset:     { label: "Sunset",     color: "#be123c", bg: "#fff1f2", border: "#fecdd3" },
};

function VersionSelector({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = VERSIONS.find(v => v.v === selected) ?? VERSIONS[0];
  const st = VERSION_STATUS[current.status];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: FONT_J, fontSize: 11, fontWeight: 700,
          color: st.color, background: st.bg, border: `1px solid ${st.border}`,
          borderRadius: 20, padding: "4px 10px 4px 8px", cursor: "pointer",
        }}
      >
        <GitBranch size={11} />
        {current.v} · {st.label}
        <ChevronDown size={11} style={{ marginLeft: 2, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 200,
              background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden", minWidth: 300,
            }}
          >
            {VERSIONS.map((vi, i) => {
              const s = VERSION_STATUS[vi.status];
              const isSelected = vi.v === selected;
              return (
                <button
                  key={vi.v}
                  onClick={() => { onChange(vi.v); setOpen(false); }}
                  style={{
                    display: "flex", flexDirection: "column", gap: 4,
                    width: "100%", padding: "12px 16px", textAlign: "left",
                    background: isSelected ? "#f8fafc" : "transparent",
                    border: "none", cursor: "pointer",
                    borderBottom: i < VERSIONS.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.background = isSelected ? "#f8fafc" : "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: FONT_J, fontSize: 12, fontWeight: 800, color: s.color,
                      background: s.bg, border: `1px solid ${s.border}`,
                      borderRadius: 6, padding: "2px 8px",
                    }}>{vi.v}</span>
                    <span style={{
                      fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: s.color,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>{s.label}</span>
                    {isSelected && <Check size={12} color={C.teal} style={{ marginLeft: "auto" }} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                    <span style={{ fontFamily: FONT, fontSize: 11, color: C.muted }}>Released {vi.released}</span>
                    {vi.retireBy && (
                      <span style={{ fontFamily: FONT, fontSize: 11, color: s.color, fontWeight: 600 }}>
                        {vi.status === "sunset" ? "Retired" : "Retires"} {vi.retireBy}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: FONT, fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.55 }}>{vi.note}</p>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Endpoint card (Megaport-style two-column) ────────────────────────────────

function exampleResponse(ep: Endpoint): string {
  if (ep.method === "DELETE")
    return '{\n  "success": true,\n  "message": "Deleted successfully."\n}';
  if (ep.crud === "C")
    return '{\n  "success": true,\n  "data": {\n    "id": "res_abc123",\n    "status": "active"\n  },\n  "message": "Created successfully."\n}';
  if (ep.crud === "U")
    return '{\n  "success": true,\n  "message": "Updated successfully."\n}';
  return '{\n  "success": true,\n  "data": [\n    { "id": "item_001", "name": "..." }\n  ],\n  "total": 1,\n  "page": 1\n}';
}

function buildCurl(ep: Endpoint, baseUrl: string, body: string, paramValues: Record<string, string>): string {
  const needsBody = ["POST","PUT","PATCH"].includes(ep.method);
  const path = ep.path ?? "/api/...";
  let url = `${baseUrl}${path}`;
  if (ep.params) {
    const qs = ep.params
      .filter(p => p.in === "query")
      .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name] ?? p.example ?? "")}`)
      .join("&");
    if (qs) url += `?${qs}`;
  }
  const token = (ep.params ? (paramValues["access-token"] ?? "YOUR_TOKEN_HERE") : "YOUR_TOKEN_HERE");
  const lines = [
    `curl -X ${ep.method} \\`,
    `  "${url}" \\`,
    `  -H "access-token: ${token}"`,
  ];
  if (needsBody) {
    lines[lines.length - 1] += " \\";
    lines.push(`  -H "Content-Type: application/json" \\`);
    lines.push(`  -d '${body.trim() || "{}"}'`);
  }
  return lines.join("\n");
}

const RESP_CODES = [
  { code: "200", label: "OK",           color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  { code: "401", label: "Unauthorized", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { code: "403", label: "Forbidden",    color: "#be123c", bg: "#fff1f2", border: "#fecdd3" },
  { code: "404", label: "Not Found",    color: "#64748b", bg: "#f8fafc", border: "#e2e8f1" },
];

function EndpointCard({ ep, env, defaultOpen = false, forceOpen = false }: { ep: Endpoint; env: Env; defaultOpen?: boolean; forceOpen?: boolean }) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [open, setOpen]         = useState(defaultOpen || forceOpen);
  const [tryOpen, setTryOpen]   = useState(false);
  const [body, setBody]         = useState("{\n  \n}");
  const [liveResp, setLiveResp] = useState<{ status: number; data: string } | null>(null);
  const [loading, setLoading]   = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>(() => {
    if (!ep.params) return {};
    return Object.fromEntries(ep.params.map(p => [p.name, p.example ?? ""]));
  });

  const baseUrl   = ENV_URLS[env];
  const mc        = methodColor(ep.method);
  const cc        = crudColor(ep.crud);
  const needsBody = ["POST","PUT","PATCH"].includes(ep.method);
  const curlStr   = buildCurl(ep, baseUrl, body, paramValues);
  const exResp    = ep.responseExample ?? exampleResponse(ep);

  function setParam(name: string, value: string) {
    setParamValues(prev => ({ ...prev, [name]: value }));
  }

  async function execute() {
    setLoading(true); setLiveResp(null);
    try {
      const token = paramValues["access-token"] ?? "YOUR_TOKEN_HERE";
      const headers: Record<string,string> = {
        "access-token": token,
        ...(needsBody ? { "Content-Type": "application/json" } : {}),
      };
      const path = ep.path ?? "/api/...";
      let url = `${baseUrl}${path}`;
      if (ep.params) {
        const qs = ep.params
          .filter(p => p.in === "query")
          .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name] ?? "")}`)
          .join("&");
        if (qs) url += `?${qs}`;
      }
      const opts: RequestInit = { method: ep.method, headers };
      if (needsBody && body.trim()) opts.body = body.trim();
      const res = await fetch(url, opts);
      let data = "";
      try { data = JSON.stringify(await res.json(), null, 2); } catch { data = await res.text(); }
      setLiveResp({ status: res.status, data });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setLiveResp({ status: 0, data: `Network error: ${msg}\n\nCORS may be blocking this. Use the curl command instead.` });
    } finally { setLoading(false); }
  }

  function copyCurlFn() {
    navigator.clipboard.writeText(curlStr);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  }

  return (
    <div style={{
      border: `1px solid ${open ? C.teal + "40" : C.border}`,
      borderRadius: 14, overflow: "hidden", background: C.white,
      boxShadow: open ? "0 6px 28px rgba(28,128,141,0.10)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}>

      {/* ── Collapsed header ── */}
      <button
        onClick={() => { if (!forceOpen) setOpen(v => !v); }}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "15px 18px",
          background: open ? "#fafffe" : "transparent",
          border: "none", cursor: forceOpen ? "default" : "pointer", textAlign: "left",
          borderBottom: open ? `1px solid ${C.border}` : "none",
        }}
      >
        <span style={{
          fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
          color: mc.text, background: mc.bg, border: `1px solid ${mc.border}`,
          borderRadius: 5, padding: "3px 9px", letterSpacing: "0.04em", flexShrink: 0,
        }}>{ep.method}</span>
        <span style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 600, color: C.navy, flex: 1 }}>
          {ep.name}
        </span>
        <span style={{
          fontFamily: FONT_J, fontSize: 10, fontWeight: 700,
          color: cc.text, background: cc.bg, borderRadius: 4,
          padding: "2px 7px", flexShrink: 0,
        }}>{crudLabel(ep.crud)}</span>
        {!forceOpen && (
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} style={{ display: "flex", flexShrink: 0 }}>
            <ChevronDown size={15} color={C.iconIdle} />
          </motion.span>
        )}
      </button>

      {/* ── Expanded two-column body ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "stretch", minHeight: 0 }}>

              {/* LEFT: Documentation */}
              <div style={{ flex: isMobile ? "none" : "0 0 52%", padding: isMobile ? "20px 18px" : "24px 28px", borderRight: isMobile ? "none" : `1px solid ${C.border}`, borderBottom: isMobile ? `1px solid ${C.border}` : "none" }}>

                {/* Description */}
                <p style={{ fontFamily: FONT, fontSize: 14, color: "#374151", margin: "0 0 22px", lineHeight: 1.85 }}>
                  {ep.desc}
                </p>

                {/* PARAMETERS — swagger-sourced when available, generic headers fallback otherwise */}
                {ep.params ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                      Parameters
                    </div>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "150px 58px 52px 1fr", background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                        {["Name", "In", "Type", "Description"].map(h => (
                          <div key={h} style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, padding: "7px 10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
                        ))}
                      </div>
                      {ep.params.map((p, pi) => (
                        <div key={pi} style={{
                          display: "grid", gridTemplateColumns: "150px 58px 52px 1fr",
                          borderBottom: pi < ep.params!.length - 1 ? `1px solid ${C.border}` : "none",
                          background: pi % 2 === 0 ? "#fff" : "#fafbfc",
                        }}>
                          <div style={{ padding: "10px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
                            <code style={{ fontFamily: "monospace", fontSize: 12, color: C.teal, fontWeight: 600 }}>{p.name}</code>
                            {p.required && <span style={{ fontFamily: FONT_J, fontSize: 9, fontWeight: 800, color: "#be123c", letterSpacing: "0.05em" }}>★ required</span>}
                          </div>
                          <div style={{ padding: "10px 8px", display: "flex", alignItems: "flex-start" }}>
                            <span style={{
                              fontFamily: FONT_J, fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
                              color: p.in === "header" ? "#7c3aed" : C.teal,
                              background: p.in === "header" ? "#faf5ff" : "#f0f9fa",
                              border: `1px solid ${p.in === "header" ? "#e9d5ff" : "#ccedf0"}`,
                              borderRadius: 4, padding: "2px 6px",
                            }}>{p.in}</span>
                          </div>
                          <div style={{ padding: "10px 8px", display: "flex", alignItems: "flex-start" }}>
                            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{p.type}</span>
                          </div>
                          <div style={{ padding: "10px 10px" }}>
                            <p style={{ fontFamily: FONT, fontSize: 12, color: "#374151", margin: "0 0 3px", lineHeight: 1.6 }}>{p.description}</p>
                            {p.example && <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>e.g. {p.example}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Headers</div>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.6fr 2fr", background: "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                        {["Name","Required","Description"].map(h => (
                          <div key={h} style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, padding: "7px 12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.6fr 2fr", borderBottom: needsBody ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.teal, padding: "9px 12px" }}>access-token</div>
                        <div style={{ fontFamily: FONT, fontSize: 12, color: "#15803d", fontWeight: 600, padding: "9px 12px" }}>Yes</div>
                        <div style={{ fontFamily: FONT, fontSize: 12, color: "#475569", padding: "9px 12px" }}>JWT from POST /api/login</div>
                      </div>
                      {needsBody && (
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.6fr 2fr" }}>
                          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.teal, padding: "9px 12px" }}>Content-Type</div>
                          <div style={{ fontFamily: FONT, fontSize: 12, color: "#15803d", fontWeight: 600, padding: "9px 12px" }}>Yes</div>
                          <div style={{ fontFamily: FONT, fontSize: 12, color: "#475569", padding: "9px 12px" }}>application/json</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* HOW TO USE */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                    How to use
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {(USE_TIPS[ep.method] ?? USE_TIPS.GET).map((tip, ti) => (
                      <li key={ti} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.teal, flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontFamily: FONT, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                          {tip.split(/`([^`]+)`/).map((part, pi) =>
                            pi % 2 === 0
                              ? part
                              : <code key={pi} style={{ fontFamily: "monospace", fontSize: 12, background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>{part}</code>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* REQUEST URL */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    Request URL
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                    background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px",
                  }}>
                    <span style={{
                      fontFamily: FONT_J, fontSize: 10, fontWeight: 800,
                      color: mc.text, background: mc.bg, border: `1px solid ${mc.border}`,
                      borderRadius: 4, padding: "2px 8px", flexShrink: 0,
                    }}>{ep.method}</span>
                    <code style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b", wordBreak: "break-all" }}>
                      {baseUrl}<span style={{ color: C.navy, fontWeight: 600 }}>{ep.path ?? "/api/..."}</span>
                    </code>
                  </div>
                </div>

                {/* RESPONSE CODES */}
                <div>
                  <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    Response Codes
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {RESP_CODES.map(r => (
                      <div key={r.code} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: r.bg, border: `1px solid ${r.border}`,
                        borderRadius: 7, padding: "5px 12px",
                      }}>
                        <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 800, color: r.color }}>{r.code}</span>
                        <span style={{ fontFamily: FONT, fontSize: 11, color: r.color }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Dark code panels */}
              <div style={{ flex: 1, background: "#0d1f2d", padding: isMobile ? "20px 16px" : "24px 22px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Example Request */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Example Request
                    </span>
                    <button
                      onClick={copyCurlFn}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                        padding: "4px 10px", cursor: "pointer",
                        fontFamily: FONT_J, fontSize: 11, fontWeight: 600,
                        color: copiedCurl ? "#4ade80" : "#94a3b8",
                      }}
                    >
                      {copiedCurl ? <Check size={11} /> : <Copy size={11} />}
                      {copiedCurl ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 10, letterSpacing: "0.05em" }}>curl</div>
                    <pre style={{ fontFamily: "monospace", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.8,
                      color: "#e2e8f0",
                    }}>{curlStr.split("\n").map((line, i) => {
                      if (line.includes("-H")) {
                        return <span key={i}>{line.replace(/(-H ")([^"]+)(")/, (_, a, h, c) => `${a}`)}<span style={{ color: "#7dd3fc" }}>{line.replace(/.*-H "([^"]+)".*/, "$1")}</span>{line.includes("\\") ? " \\" : ""}{"\n"}</span>;
                      }
                      if (line.includes("curl")) return <span key={i}><span style={{ color: "#93c5fd" }}>curl</span>{line.slice(4)}{"\n"}</span>;
                      if (line.includes("-d")) return <span key={i}>{line.slice(0, line.indexOf("-d"))}<span style={{ color: "#86efac" }}>{line.slice(line.indexOf("-d"))}</span>{"\n"}</span>;
                      return <span key={i}>{line}{"\n"}</span>;
                    })}</pre>
                  </div>
                </div>

                {/* Try it out */}
                <div>
                  {!tryOpen ? (
                    <button
                      onClick={() => setTryOpen(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: "rgba(28,128,141,0.18)", border: "1px solid rgba(28,128,141,0.35)",
                        borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                        fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#4fd1c7",
                        width: "100%", justifyContent: "center",
                      }}
                    >
                      <Play size={13} /> Try it out
                    </button>
                  ) : (
                    <div>
                      {/* Per-parameter form fields */}
                      {ep.params && ep.params.filter(p => p.in !== "body").length > 0 && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Parameters
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {ep.params.filter(p => p.in !== "body").map(p => (
                              <div key={p.name}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{p.name}</span>
                                  <span style={{
                                    fontSize: 10, fontWeight: 700, fontFamily: FONT_J,
                                    padding: "1px 6px", borderRadius: 4,
                                    background: p.in === "header" ? "rgba(168,85,247,0.18)" : p.in === "path" ? "rgba(245,158,11,0.18)" : "rgba(28,128,141,0.18)",
                                    color: p.in === "header" ? "#c084fc" : p.in === "path" ? "#fbbf24" : "#4fd1c7",
                                    border: `1px solid ${p.in === "header" ? "rgba(168,85,247,0.25)" : p.in === "path" ? "rgba(245,158,11,0.25)" : "rgba(28,128,141,0.3)"}`,
                                  }}>{p.in}</span>
                                  {p.required && (
                                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: FONT_J, color: "#f87171" }}>required</span>
                                  )}
                                </div>
                                <input
                                  type={p.name.toLowerCase().includes("token") || p.name.toLowerCase().includes("password") || p.name.toLowerCase().includes("secret") ? "password" : "text"}
                                  value={paramValues[p.name] ?? ""}
                                  onChange={e => setParam(p.name, e.target.value)}
                                  placeholder={p.example ?? p.description}
                                  style={{
                                    width: "100%", boxSizing: "border-box",
                                    fontFamily: "monospace", fontSize: 12,
                                    padding: "8px 12px", outline: "none",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 7, color: "#e2e8f0",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Body textarea for POST/PUT/PATCH — fallback when no structured params */}
                      {needsBody && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Request Body (JSON)
                          </div>
                          <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={4}
                            style={{
                              width: "100%", boxSizing: "border-box",
                              fontFamily: "monospace", fontSize: 12,
                              padding: "10px 12px", resize: "vertical", outline: "none",
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: 8, color: "#e2e8f0",
                            }}
                          />
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={execute}
                          disabled={loading}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            background: loading ? "rgba(100,116,139,0.3)" : "linear-gradient(135deg,#1c808d,#0a3954)",
                            border: "none", borderRadius: 8, padding: "10px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: "#fff",
                          }}
                        >
                          <Play size={13} /> {loading ? "Sending…" : "Send Request"}
                        </button>
                        <button
                          onClick={() => { setTryOpen(false); setLiveResp(null); }}
                          style={{
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: "#94a3b8",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response panel */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {liveResp ? "Response" : "Example Response"}
                    </span>
                    <span style={{
                      fontFamily: FONT_J, fontSize: 11, fontWeight: 800, borderRadius: 6, padding: "3px 9px",
                      color: liveResp
                        ? (liveResp.status >= 200 && liveResp.status < 300 ? "#4ade80" : "#f87171")
                        : "#4ade80",
                      background: "rgba(255,255,255,0.06)",
                    }}>
                      {liveResp
                        ? (liveResp.status === 0 ? "ERROR" : `${liveResp.status} ${liveResp.status >= 200 && liveResp.status < 300 ? "OK" : "ERROR"}`)
                        : "200 OK"}
                    </span>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "14px 16px", maxHeight: 240, overflowY: "auto",
                  }}>
                    <div style={{ fontFamily: FONT_J, fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 10, letterSpacing: "0.05em" }}>json</div>
                    <pre style={{ fontFamily: "monospace", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7,
                      color: liveResp && liveResp.status === 0 ? "#fca5a5" : "#86efac",
                    }}>
                      {liveResp ? liveResp.data : exResp}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SubModule page ──────────────────────────────────────────────────────────

function SubModulePage({ subModuleId, env }: { subModuleId: string; env: Env }) {
  const subMod = findSubModule(subModuleId);
  const parent = findParentModule(subModuleId);
  const [selectedVersion, setSelectedVersion] = useState("v1.0");
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  if (!subMod) {
    return (
      <div style={{ padding: "40px 48px" }}>
        <p style={{ fontFamily: FONT, color: C.muted }}>Sub-module not found.</p>
      </div>
    );
  }

  const single = subMod.endpoints.length === 1;
  const versionInfo = VERSIONS.find(v => v.v === selectedVersion) ?? VERSIONS[0];
  const versionSt   = VERSION_STATUS[versionInfo.status];

  return (
    <div style={{ padding: isMobile ? "24px 18px 40px" : "40px 48px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {parent && (
              <span style={{ fontFamily: FONT, fontSize: 13, color: C.muted }}>{parent.label}</span>
            )}
          </div>
          <h1 style={{ fontFamily: FONT_J, fontSize: 28, fontWeight: 800, color: C.navy, margin: "0 0 12px", letterSpacing: "-0.4px" }}>
            {subMod.label}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.muted,
              background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 6,
              padding: "3px 10px",
            }}>
              {subMod.endpoints.length} endpoint{subMod.endpoints.length !== 1 ? "s" : ""}
            </span>
            <span style={{
              fontFamily: "monospace", fontSize: 12, color: C.teal,
              background: "#f0f9fa", border: `1px solid ${C.teal}30`,
              borderRadius: 6, padding: "3px 10px",
            }}>
              {ENV_URLS[env]}
            </span>
            <VersionSelector selected={selectedVersion} onChange={setSelectedVersion} />
          </div>
        </div>
      </div>

      {/* Version warning banner */}
      <AnimatePresence>
        {versionInfo.status !== "latest" && (
          <motion.div
            key={selectedVersion}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              background: versionSt.bg, border: `1px solid ${versionSt.border}`,
              borderRadius: 12, padding: "14px 18px", marginBottom: 28,
            }}
          >
            <AlertTriangle size={16} color={versionSt.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: versionSt.color, margin: "0 0 4px" }}>
                {versionInfo.status === "sunset"
                  ? `${versionInfo.v} is sunset — requests return 410 Gone`
                  : `${versionInfo.v} is deprecated — retire by ${versionInfo.retireBy}`}
              </p>
              <p style={{ fontFamily: FONT, fontSize: 13, color: versionSt.color, margin: 0, lineHeight: 1.6 }}>
                {versionInfo.note}{" "}
                <button
                  onClick={() => setSelectedVersion("v1.0")}
                  style={{
                    fontFamily: FONT_J, fontWeight: 700, fontSize: 13,
                    color: versionSt.color, background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline", padding: 0,
                  }}
                >
                  Switch to v1.0 (Current)
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subMod.endpoints.map((ep, i) => (
          <EndpointCard key={`${subModuleId}-${i}`} ep={ep} env={env} defaultOpen={i === 0} forceOpen={single} />
        ))}
      </div>
    </div>
  );
}

// ── Overview page ───────────────────────────────────────────────────────────

// ── Static pages ─────────────────────────────────────────────────────────────

function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "40px 48px 56px" }}>
      <h1 style={{ fontFamily: FONT_J, fontSize: 28, fontWeight: 800, color: C.navy, margin: "0 0 24px", letterSpacing: "-0.4px" }}>
        {title}
      </h1>
      {children}
    </div>
  );
}

// ── Env warning modal ────────────────────────────────────────────────────────

function EnvWarningModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "rgba(10,57,84,0.45)", backdropFilter: "blur(4px)" }} />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative", zIndex: 1,
          background: "#fff", borderRadius: 20,
          padding: "32px", width: 440, maxWidth: "calc(100vw - 48px)",
          boxShadow: "0 24px 64px rgba(10,57,84,0.22)",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg,#fff7ed 0%,#fff1f2 100%)",
          border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <AlertTriangle size={22} color="#d97706" />
        </div>
        <h2 style={{ fontFamily: FONT_J, fontSize: 20, fontWeight: 800, color: C.navy, margin: "0 0 12px" }}>
          Switch to Production?
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 20px", lineHeight: 1.7 }}>
          You're about to switch to the Production environment. All API calls will affect live services.
        </p>
        <ul style={{ fontFamily: FONT, fontSize: 14, color: "#64748b", margin: "0 0 24px", paddingLeft: 20, lineHeight: 2 }}>
          <li>Affects live customer services</li>
          <li>May trigger billing events</li>
          <li>Some operations are irreversible</li>
        </ul>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, fontFamily: FONT_J, fontSize: 14, fontWeight: 700,
              background: "#f8fafc", border: `1px solid ${C.border}`, color: C.navy,
              borderRadius: 10, padding: "11px", cursor: "pointer",
            }}
          >
            Stay in Staging
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, fontFamily: FONT_J, fontSize: 14, fontWeight: 700,
              background: "linear-gradient(135deg,#dc2626 0%,#9f1239 100%)",
              border: "none", color: "#fff",
              borderRadius: 10, padding: "11px", cursor: "pointer",
            }}
          >
            Switch to Production
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Env switcher ─────────────────────────────────────────────────────────────

function EnvSwitcher({ env, onChange }: { env: Env; onChange: (e: Env) => void }) {
  const [open, setOpen] = useState(false);
  const [pendingProd, setPendingProd] = useState(false);

  function handleSelect(e: Env) {
    setOpen(false);
    if (e === "production" && env !== "production") { setPendingProd(true); return; }
    onChange(e);
  }

  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />}
      <div style={{ position: "relative", zIndex: 95 }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: env === "production" ? "linear-gradient(135deg,#dc2626 0%,#9f1239 100%)" : "linear-gradient(135deg,#16a34a 0%,#15803d 100%)",
            border: "none", color: "#fff", borderRadius: 20,
            padding: "6px 14px 6px 10px", cursor: "pointer",
            fontFamily: FONT_J, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.04em",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
          {env === "staging" ? "STAGING" : "PRODUCTION"}
          <ChevronDown size={12} style={{ marginLeft: 2 }} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "#fff", border: `1px solid ${C.border}`,
                borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                overflow: "hidden", minWidth: 200,
              }}
            >
              {(["staging", "production"] as Env[]).map(e => (
                <button
                  key={e}
                  onClick={() => handleSelect(e)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "12px 16px",
                    background: env === e ? "#f0f9fa" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: e === "staging" ? "#16a34a" : "#dc2626",
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {e}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, marginTop: 1 }}>
                      {e === "staging" ? "uat-api-polarin.lightstorm.in" : "api-polarin.lightstorm.in"}
                    </div>
                  </div>
                  {env === e && <Check size={14} color={C.teal} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {pendingProd && (
        <EnvWarningModal
          onCancel={() => setPendingProd(false)}
          onConfirm={() => { onChange("production"); setPendingProd(false); }}
        />
      )}
    </>
  );
}

// ── Auth guide ────────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div style={{ position: "relative", marginBottom: 24 }}>
      <div style={{
        background: "#0d1f2d", borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.03)",
        }}>
          <span style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {lang}
          </span>
          <button
            onClick={copy}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
              padding: "4px 10px", cursor: "pointer",
              fontFamily: FONT_J, fontSize: 11, fontWeight: 600,
              color: copied ? "#4ade80" : "#94a3b8",
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre style={{
          fontFamily: "monospace", fontSize: 13, color: "#e2e8f0",
          margin: 0, padding: "18px 20px", overflowX: "auto", lineHeight: 1.7,
          whiteSpace: "pre",
        }}>
          <code dangerouslySetInnerHTML={{ __html: code
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/(#[^\n]*)/g, '<span style="color:#64748b">$1</span>')
            .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#86efac">$1</span>')
            .replace(/\b(curl|POST|GET|PUT|DELETE|-X|-H|-d|Authorization|Content-Type|access-token)\b/g,
              '<span style="color:#7dd3fc">$1</span>')
          }} />
        </pre>
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#1c808d,#0a3954)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: "#fff",
    }}>
      {n}
    </div>
  );
}

function AuthGuide({ env }: { env: Env }) {
  const baseUrl = ENV_URLS[env];

  return (
    <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg,#f0f9fa,#e6f7f8)",
          border: "1px solid #ccedf0", borderRadius: 20,
          padding: "5px 14px", marginBottom: 16,
        }}>
          <Sparkles size={13} color={C.teal} />
          <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: "0.04em" }}>
            AUTHENTICATION GUIDE
          </span>
        </div>
        <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
          How authentication works
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.8, maxWidth: 620 }}>
          Polarin uses <strong style={{ color: C.navy }}>JWT (JSON Web Tokens)</strong> for API authentication. Every request to a protected endpoint must include a short-lived <em>access token</em> in the request header. Here's everything you need to know.
        </p>
      </div>

      {/* Token types */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: FONT_J, fontSize: 19, fontWeight: 800, color: C.navy, margin: "0 0 20px", letterSpacing: "-0.3px" }}>
          Token types
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            {
              name: "access-token",
              lifetime: "Short-lived (typically 15–60 min)",
              use: "Sent with every API request. Proves who you are.",
              color: C.teal,
              bg: "#f0f9fa",
              border: "#ccedf0",
            },
            {
              name: "refresh-token",
              lifetime: "Long-lived (days)",
              use: "Used only to obtain a new access-token when it expires. Never send this with regular API calls.",
              color: "#7c3aed",
              bg: "#faf5ff",
              border: "#e9d5ff",
            },
          ].map(t => (
            <div key={t.name} style={{
              background: t.bg, border: `1px solid ${t.border}`,
              borderRadius: 14, padding: "20px 22px",
            }}>
              <code style={{
                fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                color: t.color, background: "rgba(255,255,255,0.7)",
                padding: "3px 8px", borderRadius: 6,
                display: "inline-block", marginBottom: 10,
              }}>
                {t.name}
              </code>
              <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                {t.lifetime}
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.65 }}>
                {t.use}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-step */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: FONT_J, fontSize: 19, fontWeight: 800, color: C.navy, margin: "0 0 28px", letterSpacing: "-0.3px" }}>
          Step-by-step walkthrough
        </h2>

        {/* Step 1 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 36 }}>
          <StepBadge n={1} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: C.navy, margin: "4px 0 8px" }}>
              Log in to get your tokens
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              Call <code style={{ background: "#f0f9fa", padding: "1px 6px", borderRadius: 4, color: C.teal }}>POST /api/login</code> with your credentials. On success you receive both tokens.
            </p>
            <CodeBlock lang="bash" code={`curl -X POST ${baseUrl}/api/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "you@company.com",
    "password": "yourpassword"
  }'`} />
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              The response JSON will contain your tokens:
            </p>
            <CodeBlock lang="json" code={`{
  "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh-token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresIn": 3600,
  "user": { "id": "usr_123", "email": "you@company.com" }
}`} />
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 36 }}>
          <StepBadge n={2} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: C.navy, margin: "4px 0 8px" }}>
              Include the access token in every request
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              Pass the <code style={{ background: "#f0f9fa", padding: "1px 6px", borderRadius: 4, color: C.teal }}>access-token</code> as a request header — not as <code style={{ background: "#f8fafc", padding: "1px 6px", borderRadius: 4, color: "#64748b" }}>Bearer</code> in Authorization, but as its own named header.
            </p>
            <CodeBlock lang="bash" code={`curl -X GET ${baseUrl}/api/user/profile \\
  -H "access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`} />
            <div style={{
              background: "#fffbeb", border: "1px solid #fde68a",
              borderRadius: 10, padding: "14px 18px", marginTop: 4,
            }}>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.65 }}>
                <strong>Note:</strong> The header name is <code style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>access-token</code> (lowercase, hyphenated) — not <code style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>Authorization</code>. Using the wrong header name will result in a 401 Unauthorized response.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 36 }}>
          <StepBadge n={3} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: C.navy, margin: "4px 0 8px" }}>
              Refresh your access token before it expires
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              When the API returns <code style={{ background: "#fff1f2", padding: "1px 6px", borderRadius: 4, color: "#be123c" }}>401 Unauthorized</code>, your access token has expired. Use the refresh token to silently get a new one — without asking the user to log in again.
            </p>
            <CodeBlock lang="bash" code={`curl -X POST ${baseUrl}/api/token/refresh \\
  -H "Content-Type: application/json" \\
  -d '{
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
  }'`} />
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              You'll receive a new access token. Replace the old one in your storage and retry the original request.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          <StepBadge n={4} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: C.navy, margin: "4px 0 8px" }}>
              Log out to invalidate tokens
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 14px", lineHeight: 1.7 }}>
              Always log out explicitly when done — this blacklists the access token server-side and deletes the refresh token, preventing reuse even if the JWT hasn't expired yet.
            </p>
            <CodeBlock lang="bash" code={`curl -X POST ${baseUrl}/api/logout \\
  -H "access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`} />
          </div>
        </div>
      </section>

      {/* Token lifecycle diagram */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: FONT_J, fontSize: 19, fontWeight: 800, color: C.navy, margin: "0 0 20px", letterSpacing: "-0.3px" }}>
          Token lifecycle
        </h2>
        <div style={{
          background: "#fff", border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "28px 32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {[
            { step: "POST /api/login", arrow: "Access Token + Refresh Token", color: "#16a34a" },
            { step: "Every API request", arrow: "Header: access-token: <JWT>", color: C.teal },
            { step: "Token expires → 401", arrow: "POST /api/token/refresh with refresh-token", color: "#d97706" },
            { step: "New access token", arrow: "Retry original request", color: C.teal },
            { step: "POST /api/logout", arrow: "Both tokens invalidated", color: "#dc2626" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i < 4 ? 14 : 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: row.color + "18", border: `1.5px solid ${row.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_J, fontSize: 11, fontWeight: 800, color: row.color,
              }}>
                {i + 1}
              </div>
              <code style={{
                fontFamily: "monospace", fontSize: 12, color: C.navy,
                background: "#f8fafc", border: `1px solid ${C.border}`,
                borderRadius: 6, padding: "4px 10px", flexShrink: 0, whiteSpace: "nowrap",
              }}>
                {row.step}
              </code>
              <ChevronRight size={14} color={row.color} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                {row.arrow}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MFA */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: FONT_J, fontSize: 19, fontWeight: 800, color: C.navy, margin: "0 0 16px", letterSpacing: "-0.3px" }}>
          Multi-factor authentication (MFA)
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, margin: "0 0 16px", lineHeight: 1.8 }}>
          If MFA is enabled for your account, the login response will indicate MFA is required. You must complete the MFA step before a full access token is issued.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { method: "TOTP", desc: "Time-based one-time password from an authenticator app (Google Authenticator, Authy, etc.). Validate with POST /api/mfa/totp/validate." },
            { method: "Email OTP", desc: "One-time code sent to your registered email address. Validate with POST /api/mfa/validate with method=EMAIL." },
          ].map(m => (
            <div key={m.method} style={{
              background: "#faf5ff", border: "1px solid #e9d5ff",
              borderRadius: 12, padding: "18px 20px",
            }}>
              <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: "#7c3aed", marginBottom: 8 }}>
                {m.method}
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.65 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Common errors */}
      <section>
        <h2 style={{ fontFamily: FONT_J, fontSize: 19, fontWeight: 800, color: C.navy, margin: "0 0 16px", letterSpacing: "-0.3px" }}>
          Common errors
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { code: "401 Unauthorized", reason: "access-token is missing, expired, or malformed.", fix: "Refresh your token using POST /api/token/refresh then retry." },
            { code: "401 — Account locked", reason: "5 consecutive failed login attempts.", fix: "Wait for the lockout period to expire or contact support." },
            { code: "403 Forbidden", reason: "Token is valid but your role doesn't have permission for this action.", fix: "Check your assigned role. Contact your org admin to update permissions." },
            { code: "401 — Password expired", reason: "Password is older than 90 days (detected via /api/token/check-expiry).", fix: "Call POST /api/password/change to set a new password." },
          ].map(e => (
            <div key={e.code} style={{
              background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "16px 20px",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <code style={{
                fontFamily: "monospace", fontSize: 12, fontWeight: 700,
                color: "#be123c", background: "#fff1f2",
                border: "1px solid #fecdd3", borderRadius: 6,
                padding: "3px 8px", flexShrink: 0, whiteSpace: "nowrap",
              }}>
                {e.code}
              </code>
              <div>
                <p style={{ fontFamily: FONT, fontSize: 13, color: C.navy, margin: "0 0 4px", lineHeight: 1.5 }}>
                  {e.reason}
                </p>
                <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: "#15803d" }}>Fix:</strong> {e.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// ── FAQ page ──────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: React.ReactNode;
  category: string;
}

function FaqPage({ navigateTo }: { navigateTo: (id: string) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  const faqs: FaqItem[] = [
    // ── Authentication & Access ───────────────────────────────────────────────
    {
      category: "Authentication & Access",
      q: "How do I get an access token?",
      a: (
        <>
          Call <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/login</code> with your email and password. On success the response returns an <strong>access-token</strong> (short-lived, used on every API call) and a <strong>refresh-token</strong> (long-lived, used only to obtain new access tokens). Contact your Polarin account manager for production credentials.{" "}
          <button onClick={() => navigateTo("authentication-guide")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See the Authentication Guide</button>.
        </>
      ),
    },
    {
      category: "Authentication & Access",
      q: "Which header do I use to pass my token?",
      a: (
        <>
          Use <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>access-token: &lt;your-token&gt;</code> — a custom named header, <em>not</em> the standard <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", padding: "1px 6px", borderRadius: 4, color: "#64748b" }}>Authorization: Bearer</code> pattern. Sending the token under the wrong header name returns <strong>401 Unauthorized</strong> even when the token itself is valid.
        </>
      ),
    },
    {
      category: "Authentication & Access",
      q: "My access token expired — what do I do?",
      a: (
        <>
          When you receive a <strong>401 Unauthorized</strong> response, call <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/token/refresh</code> with your refresh token in the request body. You'll receive a fresh access token. Replace it in your storage and replay the original request. If the refresh token has also expired, the user must log in again.
        </>
      ),
    },
    {
      category: "Authentication & Access",
      q: "How does Multi-Factor Authentication (MFA) work with the API?",
      a: (
        <>
          If MFA is enabled for your account, the login response will indicate that an MFA step is required before a full access token is issued. You must validate a TOTP code (via <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/mfa/totp/validate</code>) or an Email OTP (via <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/mfa/validate</code> with <code>method=EMAIL</code>) before proceeding.
        </>
      ),
    },
    {
      category: "Authentication & Access",
      q: "My account is locked — how do I unlock it?",
      a: "After 5 consecutive failed login attempts, the account is locked automatically. Wait for the lockout period to expire, or raise a support ticket to have the lockout cleared by a Polarin administrator.",
    },
    {
      category: "Authentication & Access",
      q: "How often does my password expire?",
      a: (
        <>
          Passwords expire after <strong>90 days</strong>. You can check whether your password has expired by calling <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/token/check-expiry</code>. To change an expired password use <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/password/change</code>.
        </>
      ),
    },

    // ── Environments & Testing ────────────────────────────────────────────────
    {
      category: "Environments & Testing",
      q: "What is the difference between Staging and Production?",
      a: (
        <>
          <strong>Staging</strong> (<code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0fdf4", color: "#16a34a", padding: "1px 7px", borderRadius: 4 }}>uat-api-polarin.lightstorm.in</code>) is a safe sandbox for development and testing — no real services are provisioned and you are never billed. <strong>Production</strong> (<code style={{ fontFamily: "monospace", fontSize: 13, background: "#fff1f2", color: "#dc2626", padding: "1px 7px", borderRadius: 4 }}>api-polarin.lightstorm.in</code>) operates on live services and all operations — including orders, MACD, and deletions — are real and billable. Always validate in Staging before targeting Production.{" "}
          <button onClick={() => navigateTo("environments")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See the Environments guide</button>.
        </>
      ),
    },
    {
      category: "Environments & Testing",
      q: "Is the Staging environment reset? Will I lose my test data?",
      a: "Yes. The Staging environment is reset every 24 hours to stay aligned with production data structures. Do not rely on test data persisting across days. Any resources or orders created in Staging are automatically cleared on reset.",
    },
    {
      category: "Environments & Testing",
      q: "How do I switch environments in this portal?",
      a: "Use the environment pill (labelled STAGING or PRODUCTION) in the top-right corner of the portal header. Switching to Production shows a confirmation prompt reminding you that live services and billing are affected. All cURL examples and base URLs in endpoint cards update automatically.",
    },

    // ── Errors & Troubleshooting ──────────────────────────────────────────────
    {
      category: "Errors & Troubleshooting",
      q: "Why am I getting 401 Unauthorized?",
      a: (
        <ul style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>The <code style={{ fontFamily: "monospace", background: "#f8fafc", padding: "1px 5px", borderRadius: 4 }}>access-token</code> header is missing from the request.</li>
          <li>The token has expired — refresh it using <code style={{ fontFamily: "monospace", background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>POST /api/token/refresh</code>.</li>
          <li>The token is being passed under the wrong header name (e.g. <code style={{ fontFamily: "monospace", background: "#f8fafc", padding: "1px 5px", borderRadius: 4 }}>Authorization</code> instead of <code style={{ fontFamily: "monospace", background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>access-token</code>).</li>
          <li>Your password has expired — change it via <code style={{ fontFamily: "monospace", background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>POST /api/password/change</code>.</li>
        </ul>
      ),
    },
    {
      category: "Errors & Troubleshooting",
      q: "Why am I getting 403 Forbidden?",
      a: "A 403 means your token is valid but your assigned role does not have permission for the action you're attempting. Check your role with your organisation administrator. If you believe the permission should be granted, ask your admin to update your role.",
    },
    {
      category: "Errors & Troubleshooting",
      q: "The SNMP endpoints are returning 503 — is there an outage?",
      a: (
        <>
          No. The SNMP endpoints under VISTA were <strong>suspended in v0.8</strong> and remain unavailable with no restoration date set. Any integration calling these will receive a 503 response. Remove or gate these calls in your code until a restoration announcement is made.{" "}
          <button onClick={() => navigateTo("api-alerts")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See API Alerts</button>.
        </>
      ),
    },
    {
      category: "Errors & Troubleshooting",
      q: "I'm getting 410 Gone on some endpoints — what does that mean?",
      a: (
        <>
          A 410 response means you're calling an endpoint on an <strong>API version that has been sunset</strong>. Version v0.8 was retired in January 2025 and no longer accepts requests. Upgrade your integration to v1.0 immediately.{" "}
          <button onClick={() => navigateTo("release-notes")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See Release Notes</button>.
        </>
      ),
    },
    {
      category: "Errors & Troubleshooting",
      q: "I'm getting 429 Too Many Requests — what should I do?",
      a: (
        <>
          You've exceeded the rate limit for your request type. Back off and retry after the value in the <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", padding: "1px 6px", borderRadius: 4, color: "#64748b" }}>Retry-After</code> response header. Use exponential back-off for automated retries. GET endpoints are limited to <strong>120 requests/min</strong>; write endpoints to <strong>30 requests/min</strong>.{" "}
          <button onClick={() => navigateTo("rate-limits")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See Rate Limits</button>.
        </>
      ),
    },

    // ── API & Versioning ──────────────────────────────────────────────────────
    {
      category: "API & Versioning",
      q: "What changed between v0.9 and v1.0?",
      a: (
        <ul style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Breaking:</strong> The <code style={{ fontFamily: "monospace", background: "#f8fafc", padding: "1px 5px", borderRadius: 4 }}>limit</code> query parameter on all list endpoints was removed — use <code style={{ fontFamily: "monospace", background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>pageSize</code> instead.</li>
          <li><strong>Breaking:</strong> Subscriptions MACD Pricing now requires a <code style={{ fontFamily: "monospace", background: "#f8fafc", padding: "1px 5px", borderRadius: 4 }}>version</code> field in the request body (missing → 422).</li>
          <li><strong>New:</strong> VISTA Performance Metrics, Virtual Appliance full suite, and full CRUD for several modules.</li>
          <li><strong>Deprecated:</strong> Legacy <code style={{ fontFamily: "monospace", background: "#f8fafc", padding: "1px 5px", borderRadius: 4 }}>/api/auth/token</code> endpoint — use <code style={{ fontFamily: "monospace", background: "#f0f9fa", color: C.teal, padding: "1px 5px", borderRadius: 4 }}>POST /api/token/refresh</code>.</li>
        </ul>
      ),
    },
    {
      category: "API & Versioning",
      q: "I'm still using /api/auth/token for token refresh — is that okay?",
      a: (
        <>
          It still works in v1.0, but it's <strong>deprecated</strong> and will be removed in v1.1 (estimated Q3 2026). You'll see an <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", padding: "1px 6px", borderRadius: 4, color: "#64748b" }}>X-Deprecation: true</code> header on responses. Migrate to <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>POST /api/token/refresh</code> now to avoid a breaking change on your integration.{" "}
          <button onClick={() => navigateTo("api-alerts")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See API Alerts</button>.
        </>
      ),
    },
    {
      category: "API & Versioning",
      q: "How does pagination work across list endpoints?",
      a: (
        <>
          All list endpoints in v1.0 use <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>pageSize</code> and <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>page</code> as query parameters. The <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>total</code> field in every list response tells you the total record count so you can calculate the number of pages. Note: the old <code style={{ fontFamily: "monospace", fontSize: 13, background: "#fff1f2", color: "#be123c", padding: "1px 6px", borderRadius: 4 }}>limit</code> parameter was removed in v1.0 and will return an error if supplied.
        </>
      ),
    },
    {
      category: "API & Versioning",
      q: "What response format does every endpoint return?",
      a: (
        <>
          Every response is a JSON object with a top-level <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>success</code> boolean. On success the resource lives in <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>data</code>. On failure an <code style={{ fontFamily: "monospace", fontSize: 13, background: "#fff1f2", color: "#be123c", padding: "1px 6px", borderRadius: 4 }}>error</code> object carries a machine-readable <code>code</code> and a human-readable <code>message</code>.{" "}
          <button onClick={() => navigateTo("responses")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>See the full Responses reference</button>.
        </>
      ),
    },

    // ── Modules & Features ────────────────────────────────────────────────────
    {
      category: "Modules & Features",
      q: "How do I retrieve performance metrics for a circuit?",
      a: (
        <>
          Use the <strong>VISTA – Performance Metrics</strong> module. It covers Port Optical Power, CRC Errors, Connection Traffic, Packet Loss, Latency, SLA Availability, and Flap Events — all via GET requests with <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>circuitId</code>, <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>startDate</code>, and <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", color: C.teal, padding: "1px 7px", borderRadius: 4 }}>endDate</code> query parameters. All timestamps are in UTC and use the format <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", padding: "1px 6px", borderRadius: 4 }}>yyyy-MM-dd HH:mm:ss</code>.{" "}
          <button onClick={() => navigateTo("vista-port-metrics")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open VISTA Port Metrics</button>.
        </>
      ),
    },
    {
      category: "Modules & Features",
      q: "How do I place a port or service order via the API?",
      a: (
        <>
          Use the <strong>Service Orders – Ports</strong> module for port ordering, LAG, BGP, LOA, cross-connect, and deletion workflows. For Virtual Router orders use <strong>Service Orders – Virtual Router</strong>, and for connections use <strong>Service Orders – Connections</strong>. Always validate the order payload in Staging before submitting to Production — service orders are irreversible once accepted.{" "}
          <button onClick={() => navigateTo("ports-order")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open Port Order</button>.
        </>
      ),
    },
    {
      category: "Modules & Features",
      q: "Can I track the status of an order after placing it?",
      a: (
        <>
          Yes. The <strong>Track Order</strong> module exposes a Dashboard, Timeline, Port Detail, VC Detail, and Service History endpoint. Use these to poll order progress and surface status updates in your own system.{" "}
          <button onClick={() => navigateTo("track-dashboard")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open Track Order</button>.
        </>
      ),
    },
    {
      category: "Modules & Features",
      q: "How do I raise or manage support tickets via the API?",
      a: (
        <>
          Use the <strong>Help & Support</strong> module. It includes endpoints for creating tickets, adding communications to a thread, submitting feedback ratings, and retrieving MTTR reports.{" "}
          <button onClick={() => navigateTo("support-tickets")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open Tickets</button>.
        </>
      ),
    },
    {
      category: "Modules & Features",
      q: "How do I set up scheduled performance or billing reports?",
      a: (
        <>
          Use the <strong>Notifications – Scheduled Reports</strong> endpoint to configure and retrieve automated report schedules for your organisation.{" "}
          <button onClick={() => navigateTo("notif-reports")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open Scheduled Reports</button>.
        </>
      ),
    },
  ];

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: 0 }}>
          Answers to the most common questions about the Polarin API — authentication, environments, errors, versioning, and specific modules.
        </p>
      </div>

      {/* Category groups */}
      {categories.map(cat => {
        const items = faqs.filter(f => f.category === cat);
        const startIndex = faqs.findIndex(f => f.category === cat);
        return (
          <section key={cat} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: FONT_J, fontSize: 12, fontWeight: 700,
              color: C.sectionLabel, letterSpacing: "0.08em",
              textTransform: "uppercase", margin: "0 0 12px",
            }}>
              {cat}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((faq, localIdx) => {
                const globalIdx = startIndex + localIdx;
                const isOpen = openIndex === globalIdx;
                return (
                  <div
                    key={globalIdx}
                    style={{
                      background: "#fff",
                      border: `1px solid ${isOpen ? C.teal + "50" : C.border}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      transition: "border-color 0.15s",
                      boxShadow: isOpen ? `0 0 0 3px ${C.teal}10` : "none",
                    }}
                  >
                    <button
                      onClick={() => toggle(globalIdx)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "16px 20px",
                        background: isOpen ? "linear-gradient(135deg, #f0f9fa 0%, #f8fafc 100%)" : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        transition: "background 0.15s",
                      }}
                    >
                      <span style={{
                        fontFamily: FONT_J, fontSize: 14, fontWeight: isOpen ? 700 : 600,
                        color: isOpen ? C.navy : "#334155",
                        flex: 1, paddingRight: 16, lineHeight: 1.4,
                      }}>
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                      >
                        <ChevronDown size={16} color={isOpen ? C.teal : C.iconIdle} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{
                            padding: "0 20px 18px",
                            borderTop: `1px solid ${C.teal}20`,
                            paddingTop: 14,
                          }}>
                            <div style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
                              {typeof faq.a === "string" ? faq.a : faq.a}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Footer callout */}
      <div style={{
        background: "linear-gradient(135deg, #f0f9fa 0%, #f8fafc 100%)",
        border: `1px solid ${C.teal}30`,
        borderRadius: 14, padding: "22px 26px",
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,#1c808d,#0a3954)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ArrowRight size={16} color="#fff" />
        </div>
        <div>
          <p style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>
            Still have questions?
          </p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.7 }}>
            Browse the module reference in the sidebar for endpoint-level detail, or raise a ticket via the{" "}
            <button onClick={() => navigateTo("support-tickets")} style={{ fontFamily: FONT, fontSize: 13, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
              Help & Support
            </button>{" "}
            API to reach the Polarin team.
          </p>
        </div>
      </div>

    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DeveloperPortal() {
  const [activeId, setActiveId] = useState("quick-start");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["mod-authentication"]));
  const [env, setEnv] = useState<Env>("staging");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  function navigateTo(id: string) {
    setActiveId(id);
    setMobileOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    // Auto-expand parent if navigating to a child
    const parent = findParentModule(id);
    if (parent) setExpandedIds(s => new Set([...s, parent.id]));
  }

  function toggleExpand(id: string) {
    setExpandedIds(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function handleNavClick(item: NavItem) {
    if (item.children?.length) {
      toggleExpand(item.id);
      // Navigate to first child automatically
      if (!expandedIds.has(item.id) && item.children[0]) {
        navigateTo(item.children[0].id);
      }
      return;
    }
    navigateTo(item.id);
  }

  function handleSubClick(sub: SubItem) {
    navigateTo(sub.id);
  }

  function renderContent() {

    // ── Introduction ─────────────────────────────────────────────────────────
    if (activeId === "quick-start") return (
      <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 36, fontWeight: 900, color: C.navy, margin: "0 0 28px", letterSpacing: "-0.6px" }}>
          Polarin API Documentation
        </h1>

        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.9, margin: "0 0 20px" }}>
          Polarin offers a public API that gives you complete programmatic control over all the services available through the Polarin portal. You can use this API to automate service provisioning, manage network resources, integrate billing and subscriptions into your own systems, and build self-serve workflows — without manual steps in the UI.
        </p>

        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.9, margin: "0 0 20px" }}>
          The Polarin API is built on REST principles. It has predictable, resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes to indicate the outcome of every call. All timestamps are ISO 8601 in UTC.
        </p>

        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.9, margin: "0 0 40px" }}>
          In addition to this reference, you can find environment setup guides, authentication walkthroughs, and response format documentation in the <strong style={{ color: C.navy }}>Get Started</strong> section of this portal.
        </p>

        {/* Environments inline */}
        <h2 style={{ fontFamily: FONT_J, fontSize: 20, fontWeight: 800, color: C.navy, margin: "0 0 16px", letterSpacing: "-0.3px" }}>Environments</h2>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 16px" }}>
          There are two server environments you can target using different base URLs:
        </p>
        <ul style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 2, margin: "0 0 16px", paddingLeft: 24 }}>
          <li>
            <code style={{ fontFamily: "monospace", fontSize: 13, color: C.teal, background: "#f0f9fa", border: `1px solid ${C.teal}25`, borderRadius: 5, padding: "1px 7px" }}>
              https://uat-api-polarin.lightstorm.in
            </code>
            {" "}— this is the <strong style={{ color: "#16a34a" }}>Staging</strong> environment. Designed for development and integration testing. No real services are provisioned and you will not be billed for any activity.
          </li>
          <li style={{ marginTop: 10 }}>
            <code style={{ fontFamily: "monospace", fontSize: 13, color: "#dc2626", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 5, padding: "1px 7px" }}>
              https://api-polarin.lightstorm.in
            </code>
            {" "}— this is the <strong style={{ color: "#dc2626" }}>Production</strong> environment. All operations affect live services. You will be liable for any services ordered or modified here.
          </li>
        </ul>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 40px" }}>
          Use the environment switcher in the top-right of this portal to toggle API examples and the base URL between Staging and Production. See the <button onClick={() => navigateTo("environments")} style={{ fontFamily: FONT, fontSize: 15, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Environments</button> guide for full details on what each environment supports.
        </p>

        {/* Format */}
        <h2 style={{ fontFamily: FONT_J, fontSize: 20, fontWeight: 800, color: C.navy, margin: "0 0 16px", letterSpacing: "-0.3px" }}>Request and response format</h2>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 16px" }}>
          All write requests (POST, PUT, PATCH) must include a <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 5, padding: "1px 6px", color: C.navy }}>Content-Type: application/json</code> header alongside the <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", border: `1px solid ${C.teal}25`, borderRadius: 5, padding: "1px 6px", color: C.teal }}>access-token</code> authentication header.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 16px" }}>
          Every response is a JSON object with a consistent envelope. A <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 5, padding: "1px 6px", color: C.navy }}>success</code> boolean tells you immediately whether the call succeeded. The resource or list lives in <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", border: `1px solid ${C.teal}25`, borderRadius: 5, padding: "1px 6px", color: C.teal }}>data</code>, and errors are described in an <code style={{ fontFamily: "monospace", fontSize: 13, background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 5, padding: "1px 6px", color: "#be123c" }}>error</code> object. See the <button onClick={() => navigateTo("responses")} style={{ fontFamily: FONT, fontSize: 15, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Responses</button> page for the full response schema and HTTP status code reference.
        </p>

        {/* Authentication */}
        <h2 style={{ fontFamily: FONT_J, fontSize: 20, fontWeight: 800, color: C.navy, margin: "40px 0 16px", letterSpacing: "-0.3px" }}>Authentication</h2>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 16px" }}>
          Polarin uses JWT-based authentication. Log in with your credentials to receive a short-lived <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", border: `1px solid ${C.teal}25`, borderRadius: 5, padding: "1px 6px", color: C.teal }}>access-token</code> and a long-lived <code style={{ fontFamily: "monospace", fontSize: 13, background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 5, padding: "1px 6px", color: "#7c3aed" }}>refresh-token</code>. Pass the access token as a named header in every subsequent request — not in an Authorization header, but as its own <code style={{ fontFamily: "monospace", fontSize: 13, background: "#f0f9fa", border: `1px solid ${C.teal}25`, borderRadius: 5, padding: "1px 6px", color: C.teal }}>access-token</code> key.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#475569", lineHeight: 1.85, margin: "0 0 0" }}>
          When the access token expires you'll receive a <code style={{ fontFamily: "monospace", fontSize: 13, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 5, padding: "1px 6px", color: "#b45309" }}>401 Unauthorized</code> response. Use the refresh token to silently obtain a new access token without asking the user to log in again. See the <button onClick={() => navigateTo("authentication-guide")} style={{ fontFamily: FONT, fontSize: 15, color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Authentication Guide</button> for the complete token lifecycle, MFA setup, and common errors.
        </p>
      </div>
    );

    if (activeId === "authentication-guide") return <AuthGuide env={env} />;

    // ── Environments ─────────────────────────────────────────────────────────
    if (activeId === "environments") return (
      <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Environments</h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: "0 0 32px" }}>
          Polarin provides two server environments accessed via different base URLs. Use the environment switcher in the portal header to toggle cURL examples between them.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
          {/* Staging */}
          <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: "#166534" }}>Staging</span>
              <code style={{ fontFamily: "monospace", fontSize: 12, color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 6, padding: "2px 8px", marginLeft: 4 }}>https://uat-api-polarin.lightstorm.in</code>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ul style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 2, margin: 0, paddingLeft: 20 }}>
                <li>Safe sandbox for development, integration testing, and automation trials.</li>
                <li>No real services are provisioned and <strong style={{ color: C.navy }}>you will never be billed</strong> for activity here.</li>
                <li>API responses mirror production but all resources are isolated to the test environment.</li>
                <li>The staging environment is <strong style={{ color: C.navy }}>reset every 24 hours</strong> to keep it aligned with production data structures.</li>
                <li>Use this environment for all pre-production work and CI/CD pipelines.</li>
              </ul>
            </div>
          </div>

          {/* Production */}
          <div style={{ background: "#fff", border: "1px solid #fecdd3", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: "#fff1f2", borderBottom: "1px solid #fecdd3", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#dc2626" }} />
              <span style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: "#9f1239" }}>Production</span>
              <code style={{ fontFamily: "monospace", fontSize: 12, color: "#dc2626", background: "#ffe4e6", border: "1px solid #fecdd3", borderRadius: 6, padding: "2px 8px", marginLeft: 4 }}>https://api-polarin.lightstorm.in</code>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ul style={{ fontFamily: FONT, fontSize: 14, color: "#475569", lineHeight: 2, margin: 0, paddingLeft: 20 }}>
                <li>Live environment. All requests directly affect active network services.</li>
                <li><strong style={{ color: "#9f1239" }}>You will be liable for any services ordered or modified in this environment.</strong></li>
                <li>Service provisioning, MACD operations, and deletions are <strong style={{ color: C.navy }}>irreversible</strong> once submitted.</li>
                <li>Always validate your request payload in staging before targeting production.</li>
                <li>Contact your Polarin account manager to obtain production credentials.</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 22px" }}>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.75 }}>
            <strong style={{ color: C.navy }}>Switching environments:</strong> Use the environment pill in the top-right of the portal header to toggle between Staging and Production. Switching to Production displays a confirmation prompt reminding you that live services and billing are affected.
          </p>
        </div>
      </div>
    );

    // ── Responses ────────────────────────────────────────────────────────────
    if (activeId === "responses") return (
      <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Responses</h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: "0 0 36px" }}>
          Every Polarin API response is a JSON object. The top-level shape is consistent across all endpoints — a <code style={{ fontFamily: "monospace", fontSize: 14, background: "#f0f9fa", color: C.teal, padding: "1px 6px", borderRadius: 4 }}>success</code> flag tells you immediately whether the call succeeded, and the payload lives in <code style={{ fontFamily: "monospace", fontSize: 14, background: "#f0f9fa", color: C.teal, padding: "1px 6px", borderRadius: 4 }}>data</code>.
        </p>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: FONT_J, fontSize: 18, fontWeight: 800, color: C.navy, margin: "0 0 16px" }}>Success response</h2>
          <CodeBlock lang="json" code={`{\n  "success": true,\n  "data": { ... },          // resource or array of resources\n  "message": "OK",\n  "total": 42,              // list endpoints only\n  "page": 1                 // list endpoints only\n}`} />
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: FONT_J, fontSize: 18, fontWeight: 800, color: C.navy, margin: "0 0 16px" }}>Error response</h2>
          <CodeBlock lang="json" code={`{\n  "success": false,\n  "error": {\n    "code": "UNAUTHORIZED",\n    "message": "Access token is missing or expired."\n  }\n}`} />
        </section>

        <section>
          <h2 style={{ fontFamily: FONT_J, fontSize: 18, fontWeight: 800, color: C.navy, margin: "0 0 18px" }}>HTTP status codes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            {[
              { code: "200", label: "OK",                    color: "#15803d", bg: "#f0fdf4", desc: "Request succeeded. Resource or list returned in data." },
              { code: "201", label: "Created",               color: "#15803d", bg: "#f0fdf4", desc: "Resource created. New resource returned in data." },
              { code: "400", label: "Bad Request",           color: "#b45309", bg: "#fffbeb", desc: "Request is malformed or missing required fields. Fix the payload and retry." },
              { code: "401", label: "Unauthorized",          color: "#b45309", bg: "#fffbeb", desc: "access-token is missing, expired, or invalid. Refresh and retry." },
              { code: "403", label: "Forbidden",             color: "#be123c", bg: "#fff1f2", desc: "Token is valid but your role doesn't have permission for this action." },
              { code: "404", label: "Not Found",             color: "#64748b", bg: "#f8fafc", desc: "The resource ID in the URL does not exist or has been deleted." },
              { code: "409", label: "Conflict",              color: "#b45309", bg: "#fffbeb", desc: "A resource with the same unique identifier already exists." },
              { code: "410", label: "Gone",                  color: "#be123c", bg: "#fff1f2", desc: "This API version has been sunset and no longer accepts requests." },
              { code: "422", label: "Unprocessable Entity",  color: "#b45309", bg: "#fffbeb", desc: "Validation passed but the operation cannot proceed (e.g., service already active)." },
              { code: "429", label: "Too Many Requests",     color: "#b45309", bg: "#fffbeb", desc: "Rate limit exceeded. Back off and retry after the Retry-After header value." },
              { code: "500", label: "Internal Server Error", color: "#be123c", bg: "#fff1f2", desc: "Unexpected server error. Retry once; if it persists, raise a support ticket." },
            ].map((row, i, arr) => (
              <div key={row.code} style={{
                display: "grid", gridTemplateColumns: "90px 160px 1fr",
                alignItems: "center", gap: 16, padding: "14px 20px",
                background: i % 2 === 0 ? "#fff" : "#fafbfc",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                  color: row.color, background: row.bg,
                  border: `1px solid ${row.color}40`,
                  borderRadius: 6, padding: "3px 8px", textAlign: "center",
                }}>{row.code}</span>
                <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: row.color }}>{row.label}</span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.55 }}>{row.desc}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    );

    // ── Release Notes ────────────────────────────────────────────────────────
    if (activeId === "release-notes") {
      const rnTags: Record<string, { color: string; bg: string; border: string }> = {
        "New API":         { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
        "Deprecated":      { color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
        "Suspended":       { color: "#be123c", bg: "#fff1f2", border: "#fecdd3" },
        "Breaking Change": { color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
        "Restored":        { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
      };
      const releases = [
        {
          version: "v1.0",
          date: "January 2025",
          status: "latest" as const,
          entries: [
            { tag: "New API", module: "VISTA – Performance Metrics", text: "Port Metrics, VC Metrics, SLA, Latency, and Flap Events endpoints released. Real-time performance data now available programmatically." },
            { tag: "New API", module: "Virtual Appliance", text: "Full CRUD suite for VA lifecycle management including SKU, Images, Image Config, and Bandwidth MACD." },
            { tag: "Breaking Change", module: "Subscriptions", text: "MACD Pricing endpoint now requires a version field in the request body. Requests without it return 422." },
            { tag: "Deprecated", module: "Authentication", text: "Legacy /api/auth/token endpoint deprecated — use /api/token/refresh going forward. Will be sunset in v1.1." },
          ],
        },
        {
          version: "v0.9",
          date: "June 2024",
          status: "deprecated" as const,
          entries: [
            { tag: "New API", module: "Notifications", text: "Scheduled Reports API added — configure and retrieve automated performance and billing report schedules." },
            { tag: "New API", module: "Help & Support", text: "Ticket management suite released: create tickets, add communications, submit feedback, and track MTTR." },
            { tag: "Breaking Change", module: "All list endpoints", text: "`limit` query parameter replaced by `pageSize`. Both were accepted temporarily but `limit` is now rejected." },
            { tag: "Deprecated", module: "Organization Profile", text: "/api/org/disable endpoint deprecated in favour of /api/org/status. Will be sunset in v1.0." },
          ],
        },
        {
          version: "v0.8",
          date: "January 2024",
          status: "sunset" as const,
          entries: [
            { tag: "New API", module: "Service Orders – Ports", text: "Initial release of Port Order, Qualification, LAG, BGP, LOA, Cross Connect, and Delete endpoints." },
            { tag: "New API", module: "Track Order", text: "Dashboard, Timeline, Port Detail, VC Detail, and Service History endpoints released." },
            { tag: "Suspended", module: "SNMP (VISTA)", text: "SNMP polling endpoint suspended pending infrastructure readiness. No timeline for restoration." },
          ],
        },
      ];

      return (
        <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
          <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Release Notes</h1>
          <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: "0 0 40px" }}>
            Tracks new APIs, version changes, deprecations, and suspensions. Breaking changes are flagged to allow timely migration planning.
          </p>

          {releases.map((rel) => {
            const vst = VERSION_STATUS[rel.status];
            return (
              <div key={rel.version} style={{ marginBottom: 44 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={{
                    fontFamily: FONT_J, fontSize: 14, fontWeight: 800,
                    color: vst.color, background: vst.bg, border: `1px solid ${vst.border}`,
                    borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <GitBranch size={11} /> {rel.version} · {vst.label}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 13, color: C.muted }}>{rel.date}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {rel.entries.map((e, i) => {
                    const t = rnTags[e.tag];
                    return (
                      <div key={i} style={{
                        background: "#fff", border: `1px solid ${C.border}`,
                        borderRadius: 12, padding: "14px 18px",
                        display: "flex", gap: 14, alignItems: "flex-start",
                      }}>
                        <div style={{ paddingTop: 2, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start", flexShrink: 0 }}>
                          <span style={{
                            fontFamily: FONT_J, fontSize: 10, fontWeight: 800,
                            color: t.color, background: t.bg, border: `1px solid ${t.border}`,
                            borderRadius: 6, padding: "2px 8px", letterSpacing: "0.04em", whiteSpace: "nowrap",
                          }}>{e.tag}</span>
                        </div>
                        <div>
                          <div style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 4 }}>{e.module}</div>
                          <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.65 }}>{e.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // ── API Alerts ───────────────────────────────────────────────────────────
    if (activeId === "api-alerts") {
      const alerts = [
        {
          severity: "critical" as const,
          title: "Action required: SNMP endpoints suspended",
          module: "VISTA – SNMP",
          detail: "SNMP polling endpoints (GET /api/vista/snmp/*) were suspended in v0.8 and remain unavailable. Any integration relying on these will receive 503. Remove or gate these calls in your code until restoration is announced.",
          action: "Remove SNMP calls from your integration or add a fallback check for 503 responses.",
          deadline: "Ongoing — no restoration date set",
          added: "Jan 2024",
        },
        {
          severity: "warning" as const,
          title: "Deprecation notice: /api/auth/token endpoint",
          module: "Authentication",
          detail: "The legacy /api/auth/token token-refresh endpoint is deprecated as of v1.0. It still works but will return a deprecation warning header (X-Deprecation: true). It will be removed in v1.1.",
          action: "Migrate to POST /api/token/refresh before the v1.1 release. See the Authentication Guide for the updated flow.",
          deadline: "Sunset in v1.1 (estimated Q3 2026)",
          added: "Jan 2025",
        },
      ];
      const sevColor: Record<string, { color: string; bg: string; border: string; label: string }> = {
        critical: { color: "#be123c", bg: "#fff1f2", border: "#fecdd3", label: "Critical" },
        warning:  { color: "#b45309", bg: "#fffbeb", border: "#fde68a", label: "Warning" },
        info:     { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd", label: "Info" },
      };

      return (
        <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: "-0.5px" }}>API Alerts</h1>
            <span style={{
              fontFamily: FONT_J, fontSize: 11, fontWeight: 800,
              color: "#be123c", background: "#fff1f2", border: "1px solid #fecdd3",
              borderRadius: 20, padding: "3px 10px",
            }}>{alerts.length} Active</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: "0 0 36px" }}>
            Alerts notify you of APIs that require immediate action — suspended endpoints, upcoming sunsets, or breaking changes that will affect live integrations.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {alerts.map((a, i) => {
              const s = sevColor[a.severity];
              return (
                <div key={i} style={{
                  background: "#fff", border: `1.5px solid ${s.border}`,
                  borderRadius: 16, overflow: "hidden",
                }}>
                  <div style={{
                    background: s.bg, borderBottom: `1px solid ${s.border}`,
                    padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <AlertTriangle size={15} color={s.color} />
                    <span style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: s.color, flex: 1 }}>{a.title}</span>
                    <span style={{
                      fontFamily: FONT_J, fontSize: 10, fontWeight: 800,
                      color: s.color, background: "rgba(255,255,255,0.6)",
                      border: `1px solid ${s.border}`, borderRadius: 6, padding: "2px 8px",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>{s.label}</span>
                  </div>
                  <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>Affected:</span>
                      <span style={{
                        fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: C.teal,
                        background: "#f0f9fa", border: `1px solid ${C.teal}30`,
                        borderRadius: 6, padding: "2px 8px",
                      }}>{a.module}</span>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: C.muted, marginLeft: "auto" }}>Added {a.added}</span>
                    </div>
                    <p style={{ fontFamily: FONT, fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.7 }}>{a.detail}</p>
                    <div style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
                      <span style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 800, color: C.navy, display: "block", marginBottom: 4 }}>REQUIRED ACTION</span>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", margin: "0 0 6px", lineHeight: 1.65 }}>{a.action}</p>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: s.color, fontWeight: 600 }}>Deadline: {a.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ── Rate Limits ──────────────────────────────────────────────────────────
    if (activeId === "rate-limits") return (
      <div style={{ padding: "40px 48px 72px", maxWidth: 820 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 30, fontWeight: 800, color: C.navy, margin: "0 0 8px", letterSpacing: "-0.5px" }}>Rate Limits</h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, lineHeight: 1.8, margin: "0 0 32px" }}>
          Polarin enforces rate limits to maintain platform stability across all integrations.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { scope: "Login / Authentication", limit: "5 failed attempts", window: "Per account", note: "After 5 consecutive failures, the account is locked. Contact support to unlock." },
            { scope: "Token refresh",           limit: "30 requests",       window: "Per minute",   note: "Exceeding this returns 429. Back off exponentially." },
            { scope: "Read endpoints (GET)",    limit: "120 requests",      window: "Per minute",   note: "Applies per API key. Pagination is preferred over repeated polling." },
            { scope: "Write endpoints (POST/PUT/PATCH/DELETE)", limit: "30 requests", window: "Per minute", note: "Service-order endpoints count separately from standard writes." },
          ].map((row, i) => (
            <div key={i} style={{
              background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
              padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 120px 110px",
              gap: 16, alignItems: "start",
            }}>
              <div>
                <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{row.scope}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{row.note}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 800, color: C.teal }}>{row.limit}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontFamily: FONT, fontSize: 12, color: "#475569",
                  background: "#f8fafc", border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: "2px 8px",
                }}>{row.window}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.7, marginTop: 24 }}>
          If your integration requires higher limits, contact your Polarin account manager. Enterprise agreements include custom rate limit tiers.
        </p>
      </div>
    );

    // ── FAQ ──────────────────────────────────────────────────────────────────
    if (activeId === "faq") return <FaqPage navigateTo={navigateTo} />;

    // Try to render as sub-module
    return <SubModulePage subModuleId={activeId} env={env} />;
  }

  const isParentActive = (item: NavItem) =>
    item.children?.some(c => c.id === activeId) ?? false;

  const sidebarContent = (
    <nav style={{ flex: 1, minHeight: 0, paddingTop: 8, paddingBottom: 24, overflowY: "auto" }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && (
            <div style={{ height: 1, background: C.border, margin: "6px 0" }} />
          )}
          {group.title && (
            <div style={{
              padding: "8px 24px 4px",
              fontFamily: FONT_J, fontSize: 11, fontWeight: 400,
              color: C.sectionLabel, letterSpacing: "0.08em",
              textTransform: "uppercase", lineHeight: "32px",
              userSelect: "none",
            }}>
              {group.title}
            </div>
          )}
          {group.items.map(item => {
            const parentActive = isParentActive(item);
            const isActive = activeId === item.id;
            const isOpen = expandedIds.has(item.id);
            return (
              <div key={item.id}>
                <NavButton
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                  isParentActive={parentActive}
                  badge={item.badge}
                  external={item.external}
                  hasChildren={!!(item.children?.length)}
                  isOpen={isOpen}
                  indent={false}
                  onClick={() => handleNavClick(item)}
                />
                <AnimatePresence>
                  {item.children && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {item.children.map(sub => (
                        <NavButton
                          key={sub.id}
                          label={sub.label}
                          isActive={activeId === sub.id}
                          indent={true}
                          onClick={() => handleSubClick(sub)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden", fontFamily: FONT }}>

      {/* ── Header ── */}
      <header style={{
        height: 64, flexShrink: 0, zIndex: 50, position: "relative",
        background: C.white, borderBottom: `0.5px solid ${C.border}`,
        display: "flex", alignItems: "center",
      }}>
        {/* Logo */}
        <div style={{
          width: isMobile ? "auto" : 260,
          minWidth: isMobile ? 0 : 260,
          flexShrink: 0, height: "100%",
          display: "flex", alignItems: "center",
          padding: isMobile ? "0 12px 0 16px" : "0 16px 0 24px",
        }}>
          <img src="/polarin-logo.png" alt="Polarin Developer Portal" style={{ height: 47, width: "auto", display: "block" }} />
        </div>

        {/* Search — hidden on mobile */}
        {!isMobile && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 24px" }}>
            <div style={{ width: 520, maxWidth: "100%" }}>
              <PortalSearchBar onNavigate={navigateTo} />
            </div>
          </div>
        )}
        {isMobile && <div style={{ flex: 1 }} />}

        {/* Right controls */}
        <div style={{ paddingRight: isMobile ? 12 : 24, flexShrink: 0, display: "flex", alignItems: "center", gap: isMobile ? 8 : 10 }}>
          <EnvSwitcher env={env} onChange={setEnv} />
          {!isMobile && (
            <a
              href="/"
              style={{
                fontFamily: FONT_J, fontSize: 12, fontWeight: 600, color: "#4b6b8a",
                textDecoration: "none", padding: "6px 14px",
                border: "1px solid #c8d4e0", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 5,
                background: "transparent", whiteSpace: "nowrap",
              }}
            >
              <ArrowRight size={12} style={{ transform: "rotate(180deg)" }} /> Knowledge Base
            </a>
          )}
          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: mobileOpen ? "#f0f9fa" : "none",
                border: `1px solid ${mobileOpen ? C.teal + "40" : "transparent"}`,
                borderRadius: 8, cursor: "pointer", padding: 8,
              }}
            >
              {mobileOpen ? <X size={20} color={C.navy} /> : <Menu size={20} color={C.navy} />}
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <aside style={{
            width: 260, minWidth: 260,
            display: "flex", flexDirection: "column",
            background: "transparent",
            overflowY: "hidden",
            flexShrink: 0,
          }}>
            {sidebarContent}
          </aside>
        )}

        {/* Content */}
        <main
          ref={contentRef}
          style={{ flex: 1, overflowY: "auto", background: C.bg, padding: isMobile ? "12px" : "20px 24px" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{
                background: "#fff",
                borderRadius: isMobile ? 12 : 16,
                border: `1px solid ${C.border}`,
                boxShadow: "0 1px 6px rgba(10,57,84,0.05)",
                minHeight: "calc(100% - 0px)",
                overflow: "hidden",
              }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile sidebar drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", inset: 0, top: 64,
                background: "rgba(10,57,84,0.35)",
                backdropFilter: "blur(2px)",
                zIndex: 199,
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={{
                position: "fixed", top: 64, left: 0, bottom: 0, width: 280,
                background: C.white,
                zIndex: 200, overflowY: "hidden", display: "flex", flexDirection: "column",
              }}
            >
              {/* Search inside drawer on mobile */}
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                <PortalSearchBar onNavigate={(id) => { navigateTo(id); setMobileOpen(false); }} />
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
