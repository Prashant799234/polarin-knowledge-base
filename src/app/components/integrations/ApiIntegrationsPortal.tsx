import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Info,
  KeyRound,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import {
  ApiKey,
  ActivityItem,
  ActivityType,
  Env,
  Role,
  MODULES,
  ROLES,
  uid,
  makeSeedKeys,
  makeSeedActivity,
} from "./apiIntegrationsData";

const ENV_URLS: Record<Env, string> = {
  staging: "https://uat-api-polarin.lightstorm.in",
  production: "https://api-polarin.lightstorm.in",
};

type Section = "api-keys" | "requests";
type ToastMsg = { id: string; type: "success" | "info" | "alert"; msg: string };
type Confirm = { title: string; msg: string; label: string; onYes: () => void };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */

export function ApiIntegrationsPortal() {
  const [section, setSection] = useState<Section>("api-keys");

  const [env, setEnv]           = useState<Env>("production");
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const [pendingEnv, setPendingEnv]   = useState<Env | null>(null);

  const [keys, setKeys]         = useState<ApiKey[]>(makeSeedKeys());
  const [activity]              = useState<ActivityItem[]>(makeSeedActivity());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirm, setConfirm]   = useState<Confirm | null>(null);

  const [gName, setGName]     = useState("");
  const [gRole, setGRole]     = useState<Role>("Developer");
  const [gExpiry, setGExpiry] = useState(1440);

  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  function toast(type: ToastMsg["type"], msg: string) {
    const id = uid();
    setToasts(t => [...t, { id, type, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }

  function toggleReveal(id: string) {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function copyKey(k: ApiKey) {
    navigator.clipboard.writeText(k.key);
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  function generateKey() {
    if (!gName.trim()) { toast("alert", "Enter a name for the key"); return; }
    const newKey: ApiKey = {
      id: `k${uid()}`,
      name: gName.trim(),
      role: gRole,
      key: `pk_${env === "production" ? "live" : "test"}_${uid()}${uid()}`,
      addedBy: "abram.qureshi@lightstorm.in",
      env,
      createdAt: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      expiryMinutes: gExpiry,
    };
    setKeys(prev => [newKey, ...prev]);
    setGName(""); setGRole("Developer"); setGExpiry(1440);
    toast("success", `API key "${newKey.name}" generated for ${cap(env)}`);
  }

  function regenerateKey(k: ApiKey) {
    setConfirm({
      title: "Regenerate this API key?",
      msg: `The current secret for <b>${k.name}</b> will stop working immediately. Anything using the old key must be updated.`,
      label: "Regenerate",
      onYes: () => {
        setKeys(prev => prev.map(x => x.id === k.id ? { ...x, key: `pk_${x.env === "production" ? "live" : "test"}_${uid()}${uid()}` } : x));
        toast("success", `"${k.name}" regenerated`);
      },
    });
  }

  function revokeKey(k: ApiKey) {
    setConfirm({
      title: "Revoke this API key?",
      msg: `<b>${k.name}</b> will stop working immediately. Any integration using this key will fail.`,
      label: "Revoke",
      onYes: () => { setKeys(prev => prev.filter(x => x.id !== k.id)); toast("info", "API key revoked"); },
    });
  }

  function requestEnvSwitch(target: Env) {
    setEnvMenuOpen(false);
    if (target === env) return;
    setPendingEnv(target);
  }

  const envKeys = useMemo(() => keys.filter(k => k.env === env), [keys, env]);

  return (
    <div className="ap-root">
      {/* ── Top nav ── */}
      <nav className="ap-nav">
        <div className="ap-nav-logo">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="10" cy="14" r="5" fill="#0B2A3A"/>
            <circle cx="30" cy="10" r="4" fill="#0E7E8E"/>
            <circle cx="26" cy="29" r="5.5" fill="#0B2A3A"/>
            <circle cx="9"  cy="31" r="3.4" fill="#E63950"/>
            <path d="M13 15L25 27M14 13L27 11M28 14L27 25" stroke="#0B2A3A" strokeWidth="1.6" opacity=".5"/>
          </svg>
          <div className="ap-logo-text">
            <span className="ap-logo-name">polarin</span>
            <span className="ap-logo-sub">by lightstorm</span>
          </div>
        </div>

        <div className="ap-nav-tabs">
          {["Dashboard","Services","Settings","Help"].map(tab => (
            <button key={tab} className={`ap-nav-tab${tab === "Settings" ? " active" : ""}`}>
              <span className="ap-nav-tab-inner">{tab}</span>
              <span className="ap-ink-bar"/>
            </button>
          ))}
        </div>

        <div className="ap-nav-right">
          <div style={{ position: "relative" }}>
            {envMenuOpen && <div onClick={() => setEnvMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />}
            <button className={`ap-env-pill ${env}`} onClick={() => setEnvMenuOpen(v => !v)}>
              <span className="ap-env-dot" />
              {env === "staging" ? "SANDBOX" : "PRODUCTION"}
              <ChevronDown size={12} />
            </button>
            {envMenuOpen && (
              <div className="ap-env-menu">
                {(["staging","production"] as Env[]).map(e => (
                  <button key={e} className={`ap-env-opt${env === e ? " current" : ""}`} onClick={() => requestEnvSwitch(e)}>
                    <span className="ap-env-opt-dot" style={{ background: e === "staging" ? "#16a34a" : "#dc2626" }} />
                    <div style={{ flex: 1 }}>
                      <div className="ap-env-opt-name">{e === "staging" ? "Sandbox" : "Production"}</div>
                      <div className="ap-env-opt-url">{ENV_URLS[e]}</div>
                    </div>
                    {env === e && <Check size={14} color="#227A93" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="ap-bell"><Bell size={16}/></button>
          <div className="ap-user">
            <div className="ap-avatar">AQ</div>
            <div className="ap-user-info">
              <strong>Abram Qureshi</strong>
              <small>Admin</small>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="ap-body">
        <aside className="ap-sidebar">
          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Organisation</span>
            {[
              ["Organisation Details", User],
              ["User Management",      User],
              ["Billing Profile",      FileSpreadsheet],
              ["Activity Logs",        BarChart2],
            ].map(([label, Icon]) => (
              <button key={label as string} className="ap-sidebar-item">
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Integrations</span>
            <button className={`ap-sidebar-item${section === "api-keys" ? " active" : ""}`} onClick={() => setSection("api-keys")}>
              <KeyRound size={15}/>API Key Generator
            </button>
            <button className={`ap-sidebar-item${section === "requests" ? " active" : ""}`} onClick={() => setSection("requests")}>
              <Layers size={15}/>Requests &amp; Orders
            </button>
          </div>

          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Alerts</span>
            <Link to="/alerts" className="ap-sidebar-item"><AlertTriangle size={15}/>Manage Alerts</Link>
            <Link to="/alerts" className="ap-sidebar-item"><Settings size={15}/>Settings</Link>
          </div>

          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Personal</span>
            <button className="ap-sidebar-item"><User size={15}/>Profile</button>
          </div>
        </aside>

        <main className="ap-main">
          {section === "api-keys" && (
            <ApiKeyGeneratorView
              env={env}
              keys={envKeys}
              revealed={revealed}
              copiedId={copiedId}
              onReveal={toggleReveal}
              onCopy={copyKey}
              onRegenerate={regenerateKey}
              onRevoke={revokeKey}
              gName={gName} onGName={setGName}
              gRole={gRole} onGRole={setGRole}
              gExpiry={gExpiry} onGExpiry={setGExpiry}
              onGenerate={generateKey}
            />
          )}
          {section === "requests" && (
            <RequestsView activity={activity} />
          )}
        </main>
      </div>

      {/* ── Env switch → reauth ── */}
      {pendingEnv && (
        <div className="ap-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPendingEnv(null); }}>
          <EnvReauthModal
            currentEnv={env}
            targetEnv={pendingEnv}
            onCancel={() => setPendingEnv(null)}
            onConfirm={() => {
              setEnv(pendingEnv);
              setPendingEnv(null);
              toast("success", `Signed in to ${cap(pendingEnv)}`);
            }}
          />
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirm && (
        <div className="ap-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setConfirm(null); }}>
          <div className="ap-modal sm">
            <div className="ap-confirm-body">
              <div className="ap-confirm-ic danger"><Trash2 size={22}/></div>
              <div className="ap-confirm-ttl">{confirm.title}</div>
              <div className="ap-confirm-msg" dangerouslySetInnerHTML={{ __html: confirm.msg }}/>
            </div>
            <div className="ap-modal-foot">
              <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="ap-btn ap-btn-danger ap-btn-sm" onClick={() => { setConfirm(null); confirm.onYes(); }}>{confirm.label}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toasts ── */}
      <div className="ap-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`ap-toast ${t.type}`}>
            <span className="ap-toast-ic">
              {t.type === "success" ? <Check size={13}/> : t.type === "info" ? <Bell size={13}/> : <AlertTriangle size={13}/>}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   API KEY GENERATOR VIEW
═══════════════════════════════════════════════════════════════════ */

function ApiKeyGeneratorView({
  env, keys, revealed, copiedId, onReveal, onCopy, onRegenerate, onRevoke,
  gName, onGName, gRole, onGRole, gExpiry, onGExpiry, onGenerate,
}: {
  env: Env; keys: ApiKey[];
  revealed: Set<string>; copiedId: string | null;
  onReveal: (id: string) => void; onCopy: (k: ApiKey) => void;
  onRegenerate: (k: ApiKey) => void; onRevoke: (k: ApiKey) => void;
  gName: string; onGName: (v: string) => void;
  gRole: Role; onGRole: (v: Role) => void;
  gExpiry: number; onGExpiry: (v: number) => void;
  onGenerate: () => void;
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontFamily: "'Lato', sans-serif", fontSize: 12.5, color: "#7E93B2" }}>
        <span style={{ color: "#E63950", fontWeight: 700 }}>Integrations</span>
        <ChevronRight size={12} />
        <span>API Key Generator</span>
      </div>

      <div className="ap-callout">
        <Info size={18} />
        <div className="ap-callout-body">
          If you need direct access to the Polarin API, you need an API key.<br/>
          API keys are only valid in the environment they were generated in. You are currently in the <b>{env === "production" ? "Production" : "Sandbox"}</b> environment, so any keys created and listed here will work in <b>{env === "production" ? "Production" : "Sandbox"}</b>. If you need keys for the other environment, switch environments using the pill in the top-right — you'll be asked to sign in again for that environment.
          <br/>Learn more in the <Link to="/developer">Polarin API Documentation</Link>.
        </div>
      </div>

      <div className="ap-panel" style={{ marginBottom: 20 }}>
        <div className="ap-page-head">
          <div className="ap-page-head-left">
            <div className="ap-page-icon"><KeyRound size={24}/></div>
            <div>
              <div className="ap-page-title">Generate API Keys</div>
              <div className="ap-page-subtitle">The API key is a unique identifier that authenticates requests for usage and billing purposes. Use the key to generate a token to authenticate API requests.</div>
            </div>
          </div>
          <a className="ap-btn ap-btn-secondary ap-btn-sm" href="/developer" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14}/>Open API Portal
          </a>
        </div>

        <div style={{ border: "1px solid #D8E4EC", borderRadius: 10, padding: "18px 20px", marginTop: 18 }}>
          <div className="ap-form-row">
            <div className="ap-fld">
              <span className="ap-fld-label">Name</span>
              <input className="ap-input" placeholder="Name" value={gName} onChange={e => onGName(e.target.value)} />
            </div>
            <div className="ap-fld">
              <span className="ap-fld-label">Role</span>
              <select className="ap-select-box" value={gRole} onChange={e => onGRole(e.target.value as Role)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="ap-fld">
              <span className="ap-fld-label">Token Expiry (Minutes)</span>
              <input className="ap-input" type="number" min={5} value={gExpiry} onChange={e => onGExpiry(Number(e.target.value) || 0)} />
              <span className="ap-fld-hint">= {(gExpiry / 60).toFixed(2)} Hours</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={onGenerate}>
              <Plus size={14}/>Generate Key
            </button>
          </div>
        </div>
      </div>

      <div className="ap-panel">
        <div className="ap-page-head" style={{ marginBottom: 14 }}>
          <div className="ap-page-head-left">
            <div>
              <div className="ap-page-title" style={{ fontSize: 18 }}>Active API Keys</div>
              <div className="ap-page-subtitle">Keys valid in the {env === "production" ? "Production" : "Sandbox"} environment ({ENV_URLS[env]})</div>
            </div>
          </div>
        </div>

        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead className="ap-thead">
              <tr>
                {["Name","Role","Key","Added By","API Resource","Actions"].map(h => (
                  <th key={h} className="ap-th"><span className="ap-th-inner">{h}</span></th>
                ))}
              </tr>
            </thead>
            <tbody className="ap-tbody">
              {keys.length === 0 ? (
                <tr><td className="ap-td" colSpan={6}>
                  <div className="ap-empty">
                    <KeyRound size={24}/>
                    <div className="ap-empty-title">No keys in this environment</div>
                    <div className="ap-empty-sub">Generate a key above to get started.</div>
                  </div>
                </td></tr>
              ) : keys.map(k => (
                <tr key={k.id}>
                  <td className="ap-td" style={{ fontWeight: 700, color: "#0A3954" }}>{k.name}</td>
                  <td className="ap-td">{k.role}</td>
                  <td className="ap-td">
                    <span className="ap-key-mask">
                      {revealed.has(k.id) ? k.key : `${k.key.slice(0, 8)}${"•".repeat(10)}`}
                      <button onClick={() => onReveal(k.id)} title={revealed.has(k.id) ? "Hide" : "Reveal"}>
                        {revealed.has(k.id) ? <EyeOff size={13}/> : <Eye size={13}/>}
                      </button>
                      <button onClick={() => onCopy(k)} title="Copy">
                        {copiedId === k.id ? <Check size={13} color="#15945e"/> : <Copy size={13}/>}
                      </button>
                    </span>
                  </td>
                  <td className="ap-td" style={{ fontSize: 12.5, color: "#475569" }}>{k.addedBy}</td>
                  <td className="ap-td">
                    <a className="ap-resource-link" href={ENV_URLS[k.env]} target="_blank" rel="noopener noreferrer">
                      {ENV_URLS[k.env]}<ExternalLink size={11}/>
                    </a>
                  </td>
                  <td className="ap-td">
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="ap-icon-btn" title="Regenerate" onClick={() => onRegenerate(k)}><RefreshCw size={14}/></button>
                      <button className="ap-icon-btn danger" title="Revoke" onClick={() => onRevoke(k)}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ap-tip">
          <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }}/>
          <span><b>Keep keys secret.</b> Anyone with a key can call the API as your organisation. Revoke a key immediately if it's ever exposed.</span>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REQUESTS & ORDERS VIEW  — end-to-end view across every module
═══════════════════════════════════════════════════════════════════ */

function RequestsView({ activity }: { activity: ActivityItem[] }) {
  const [typeFilter, setTypeFilter]     = useState<ActivityType | "all">("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [search, setSearch]             = useState("");

  const moduleCounts = useMemo(() => {
    const m: Record<string, number> = {};
    activity.forEach(a => { m[a.module] = (m[a.module] ?? 0) + 1; });
    return m;
  }, [activity]);

  const filtered = useMemo(() => {
    return activity.filter(a => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (moduleFilter !== "all" && a.module !== moduleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.requestedBy.toLowerCase().includes(q) && !a.module.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activity, typeFilter, moduleFilter, search]);

  const orderCount = activity.filter(a => a.type === "order").length;
  const apiCount   = activity.filter(a => a.type === "api-call").length;
  const failedCount = activity.filter(a => a.status === "failed").length;

  return (
    <div className="ap-panel">
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontFamily: "'Lato', sans-serif", fontSize: 12.5, color: "#7E93B2" }}>
        <span style={{ color: "#E63950", fontWeight: 700 }}>Integrations</span>
        <ChevronRight size={12} />
        <span>Requests &amp; Orders</span>
      </div>

      <div className="ap-page-head">
        <div className="ap-page-head-left">
          <div className="ap-page-icon"><Layers size={24}/></div>
          <div>
            <div className="ap-page-title">Requests &amp; Orders</div>
            <div className="ap-page-subtitle">End-to-end view of every service order and API request, across all modules — who raised it, and its current status.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <StatPill label="Total" value={activity.length} />
          <StatPill label="Orders" value={orderCount} />
          <StatPill label="API Calls" value={apiCount} />
          <StatPill label="Failed" value={failedCount} />
        </div>
      </div>

      <div className="ap-filter-bar">
        <button className={`ap-metric-chip${typeFilter === "all" ? " active" : ""}`} onClick={() => setTypeFilter("all")}>
          All <span className="ap-chip-count">{activity.length}</span>
        </button>
        <button className={`ap-metric-chip${typeFilter === "order" ? " active" : ""}`} onClick={() => setTypeFilter("order")}>
          Service Orders <span className="ap-chip-count">{orderCount}</span>
        </button>
        <button className={`ap-metric-chip${typeFilter === "api-call" ? " active" : ""}`} onClick={() => setTypeFilter("api-call")}>
          API Calls <span className="ap-chip-count">{apiCount}</span>
        </button>
      </div>

      <div className="ap-search-row">
        <div className="ap-search">
          <Search size={15}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by request name, module, or requester…" />
        </div>
        <select className="ap-select-box" style={{ width: 200 }} value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
          <option value="all">All modules</option>
          {MODULES.filter(m => moduleCounts[m]).map(m => (
            <option key={m} value={m}>{m} ({moduleCounts[m]})</option>
          ))}
        </select>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead className="ap-thead">
            <tr>
              {["Type","Module","Request","Requested By","Environment","Status","Timestamp"].map(h => (
                <th key={h} className="ap-th"><span className="ap-th-inner">{h}</span></th>
              ))}
            </tr>
          </thead>
          <tbody className="ap-tbody">
            {filtered.length === 0 ? (
              <tr><td className="ap-td" colSpan={7}>
                <div className="ap-empty">
                  <Layers size={24}/>
                  <div className="ap-empty-title">No requests found</div>
                  <div className="ap-empty-sub">Adjust filters or search to find activity.</div>
                </div>
              </td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td className="ap-td">
                  <span className={`ap-badge ${a.type === "order" ? "ap-type-order" : "ap-type-api"}`}>
                    {a.type === "order" ? "Order" : "API Call"}
                  </span>
                </td>
                <td className="ap-td" style={{ fontWeight: 600, color: "#0A3954" }}>{a.module}</td>
                <td className="ap-td">
                  <div style={{ fontWeight: 600, color: "#0A3954", fontSize: 13 }}>{a.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#7E93B2", marginTop: 2 }}>{a.method} {a.path}</div>
                </td>
                <td className="ap-td" style={{ fontSize: 12.5, color: "#475569" }}>{a.requestedBy}</td>
                <td className="ap-td">
                  <span className="ap-scope-tag" style={{ textTransform: "uppercase" }}>{a.env}</span>
                </td>
                <td className="ap-td">
                  <span className={`ap-badge ap-status-${a.status}`}>{a.statusLabel}</span>
                </td>
                <td className="ap-td"><span className="ap-timestamp">{a.timestamp}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ap-tip">
        <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>This view spans <b>every module</b> — Ports, Virtual Router, Virtual Connection, Cloud, Billing, Pricing, Locations, Authentication and User Management — so you always have one place to see what's been ordered or requested, by whom.</span>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: "#0A3954", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#7E93B2", marginTop: 2 }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ENV REAUTH MODAL
═══════════════════════════════════════════════════════════════════ */

function EnvReauthModal({ currentEnv, targetEnv, onCancel, onConfirm }: {
  currentEnv: Env; targetEnv: Env; onCancel: () => void; onConfirm: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (!email.trim() || !password.trim()) { setError("Enter your email and password to continue."); return; }
    onConfirm();
  }

  return (
    <div className="ap-modal sm">
      <div className="ap-modal-head">
        <div className="ap-modal-title">Sign in to {cap(targetEnv)}</div>
        <div className="ap-modal-sub">
          Access tokens and API keys are scoped to a single environment. Switching from <b>{cap(currentEnv)}</b> to <b>{cap(targetEnv)}</b> requires you to authenticate again for that environment.
        </div>
      </div>
      <div className="ap-modal-body">
        {targetEnv === "production" && (
          <div className="ap-callout ap-callout-warn" style={{ marginBottom: 16 }}>
            <AlertTriangle size={18} />
            <div className="ap-callout-body">
              Production is <b>live</b>. Orders, MACD, and deletions here are real and billable.
            </div>
          </div>
        )}
        <div className="ap-fld" style={{ marginBottom: 14 }}>
          <span className="ap-fld-label">Email Address</span>
          <input className="ap-input" type="email" placeholder="Enter your email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
        </div>
        <div className="ap-fld">
          <span className="ap-fld-label">Password</span>
          <div style={{ position: "relative" }}>
            <input className="ap-input" type={showPw ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} style={{ paddingRight: 38 }} />
            <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7E93B2" }}>
              {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
        </div>
        {error && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#C10008", marginTop: 8 }}>{error}</div>}
      </div>
      <div className="ap-modal-foot">
        <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={onCancel}>Stay in {cap(currentEnv)}</button>
        <button className={`ap-btn ap-btn-sm ${targetEnv === "production" ? "ap-btn-danger" : "ap-btn-primary"}`} onClick={submit}>
          Sign In &amp; Switch to {cap(targetEnv)}
        </button>
      </div>
    </div>
  );
}
