import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Edit3,
  FileSpreadsheet,
  FileText,
  KeyRound,
  LayoutDashboard,
  Layers,
  LineChart,
  Mail,
  MoreHorizontal,
  Network,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */

type MetricKey =
  | "availability" | "utilization" | "latency"
  | "packet_loss"  | "traffic_in"  | "traffic_out"
  | "errors"       | "flaps"       | "packets_in";

type Priority   = "critical" | "warning" | "info";
type Product    = "Port" | "VC" | "Wave";
type RuleScope  = "Global" | "Private";
type DrawerTab  = "services" | "history" | "reports";
type Section    = "manage-alerts" | "manage-reports" | "settings";
type SortCol    = "title" | "scope" | "condition" | "metric" | "last";

type CustomRecipient = { email: string; registered: boolean };

type Schedule = {
  id: string;
  freq: "Daily" | "Weekly" | "Monthly";
  day: string;
  time: string;
  format: "Excel" | "PDF" | "CSV";
  recipients: string[];
  next: string;
};

type HistoryItem = {
  time: string;
  obs: string;
  res: string;
  status: "active" | "acknowledged" | "investigating" | "resolved";
  impact: string;
};

type Report = {
  id: string;
  name: string;
  at: string;
  by: string;
  sharedWith: string[];
  kind: "scheduled" | "manual";
};

type Rule = {
  id: string;
  title: string;
  scope: RuleScope;
  products: Product[];
  resources: string[];
  paused: string[];
  metric: MetricKey;
  aggregation: "AVG" | "MAX" | "MIN" | "SUM" | "COUNT";
  operator: ">" | "<" | ">=" | "<=" | "=" | "!=";
  value: string;
  thresholdType: "percentage" | "absolute";
  evalWindow: string;
  minOccurrences: number;
  lookback: string;
  priority: Priority;
  channels: string[];
  notifyFreq: string;
  who: string[];
  emailFormat: "Excel" | "PDF" | "CSV";
  customRecipients: CustomRecipient[];
  active: boolean;
  last?: { time: string; sev: Priority };
  history: HistoryItem[];
  schedules: Schedule[];
  reports: Report[];
};

type FeedItem = {
  id: string;
  alertId: string;
  title: string;
  sev: "success" | Priority;
  sub: string;
  impact: string;
  time: string;
  status: "active" | "acknowledged" | "resolved";
};

/* ─── Constants ─────────────────────────────────────────────────── */

const METRICS: Record<MetricKey, {
  label: string; unit: string; hint: string; products: Product[];
  defAgg: Rule["aggregation"]; defOp: Rule["operator"];
  defVal: string; defPrio: Priority; Icon: typeof BarChart2;
}> = {
  availability: { label: "Availability", unit: "%", hint: "Service uptime",      products: ["VC","Wave"], defAgg: "MIN", defOp: "<",  defVal: "99.9", defPrio: "critical", Icon: TrendingDown  },
  utilization:  { label: "Utilization",  unit: "%", hint: "Bandwidth usage",     products: ["Port","VC"],defAgg: "AVG", defOp: ">=", defVal: "80",   defPrio: "warning",  Icon: BarChart2     },
  latency:      { label: "Latency",      unit: "ms",hint: "Round-trip delay",    products: ["VC","Wave"], defAgg: "MAX", defOp: ">",  defVal: "20",   defPrio: "warning",  Icon: Clock         },
  packet_loss:  { label: "Packet Loss",  unit: "%", hint: "Dropped packets",     products: ["VC"],        defAgg: "MAX", defOp: ">",  defVal: "1",    defPrio: "critical", Icon: AlertTriangle  },
  traffic_in:   { label: "Traffic In",   unit: "Mbps",hint: "Ingress traffic",   products: ["Port","VC"],defAgg: "AVG", defOp: ">",  defVal: "1000", defPrio: "info",     Icon: TrendingUp    },
  traffic_out:  { label: "Traffic Out",  unit: "Mbps",hint: "Egress traffic",    products: ["Port","VC"],defAgg: "AVG", defOp: ">",  defVal: "1000", defPrio: "info",     Icon: TrendingDown  },
  errors:       { label: "Errors",       unit: "",  hint: "Interface errors",    products: ["Port","VC"],defAgg: "SUM", defOp: ">",  defVal: "100",  defPrio: "warning",  Icon: AlertTriangle  },
  flaps:        { label: "Flaps",        unit: "",  hint: "Link instability",    products: ["Wave"],     defAgg: "COUNT",defOp: ">", defVal: "5",    defPrio: "critical", Icon: Zap           },
  packets_in:   { label: "Packets In",   unit: "pps",hint: "Ingress packets",   products: ["Port","VC"],defAgg: "AVG", defOp: ">",  defVal: "500000",defPrio: "info",    Icon: Network       },
};

const RESOURCES: Record<Product, string[]> = {
  Port: ["Port-MUM-MB1-A","Port-MUM-MB1-B","Port-SG1-A","Port-FRA-FR5-A","Port-BLR-01","Port-DEL-01"],
  VC:   ["VC-Mumbai-01","VC-Delhi-01","VC-Chennai-01","VC-Bangalore-01","VC-Singapore-01","VC-Frankfurt-01","VC-London-01","VC-Hyderabad-01"],
  Wave: ["Wave-BLR-MUM","Wave-DEL-HYD","Wave-MUM-SPE","Wave-FRA-PAR","Wave-CHN-SIN","Wave-LON-AMS"],
};

const REGISTERED_USERS = new Set([
  "abram.qureshi@lightstorm.in","ops@lightstorm.in","noc@lightstorm.in",
  "product@lightstorm.in","cx@lightstorm.in","noc-team@lightstorm.in",
]);

const EVAL_WINDOWS  = ["1 min","5 min","15 min","1 hour","1 day"];
const LOOKBACKS     = ["T-1 hour","T-12 hours","T-1 day","T-7 days","MTD","YTD"];
const AGGREGATIONS  = ["AVG","MAX","MIN","SUM","COUNT"] as const;
const OPERATORS     = {">":"Greater than","<":"Less than",">=":"≥",
                       "<=":"≤","=":"Equals","!=":"Not equal"};
const FREQUENCIES   = [
  "Every 1 hour until resolved","Every 4 hours until resolved",
  "Every 12 hours until resolved","Notify once","Daily Digest",
];
const WHO_OPTIONS   = ["Customer","Account Manager","Service Manager","Operations","NOC Team"];
const REPORT_FREQ   = ["Daily","Weekly","Monthly"] as const;
const REPORT_DAYS   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const REPORT_FMT    = ["Excel","PDF","CSV"] as const;
const SHARE_TO      = ["Me","My team","Operations","Account Manager","NOC team"];

/* ─── Helpers ───────────────────────────────────────────────────── */

const uid = () => Math.random().toString(36).slice(2,8);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const productOf = (id: string) =>
  (Object.keys(RESOURCES) as Product[]).find(p => RESOURCES[p].includes(id));

function conditionStr(rule: Rule) {
  const m = METRICS[rule.metric];
  const u = rule.thresholdType === "percentage" ? "%" : (m.unit || "");
  return `${rule.aggregation} ${m.label} ${rule.operator} ${rule.value}${u}`;
}
function activeResources(rule: Rule) {
  return rule.resources.filter(id => !rule.paused.includes(id));
}
function productsCovered(rule: Rule) {
  return [...new Set(rule.resources.map(productOf).filter(Boolean))] as Product[];
}
function recipientSummary(rule: Rule) {
  const parts = [...rule.who];
  if (rule.customRecipients.length)
    parts.push(`${rule.customRecipients.length} custom`);
  return parts.join(", ");
}
function blankRule(): Rule {
  return {
    id: "", title: "", scope: "Private",
    products: ["VC","Wave"], resources: [], paused: [],
    metric: "availability", aggregation: "MIN", operator: "<",
    value: "99.9", thresholdType: "percentage",
    evalWindow: "5 min", minOccurrences: 1, lookback: "T-1 hour",
    priority: "critical", channels: ["In-app","Email"],
    notifyFreq: "Every 1 hour until resolved",
    who: ["Customer"], emailFormat: "Excel",
    customRecipients: [], active: true,
    last: undefined, history: [], schedules: [], reports: [],
  };
}
function findDuplicate(draft: Rule, rules: Rule[]) {
  return rules.find(r =>
    r.id !== draft.id &&
    r.metric === draft.metric &&
    r.operator === draft.operator &&
    r.value === draft.value &&
    r.aggregation === draft.aggregation
  ) ?? null;
}

/* ─── Seed data ─────────────────────────────────────────────────── */

function makeSeedRules(): Rule[] {
  return [
    {
      id: `al${uid()}`, title: "Production Availability Drop",
      scope: "Global", products: ["VC","Wave"],
      resources: ["VC-Mumbai-01","VC-Delhi-01","Wave-BLR-MUM"], paused: ["VC-Delhi-01"],
      metric: "availability", aggregation: "MIN", operator: "<", value: "95", thresholdType: "percentage",
      evalWindow: "5 min", minOccurrences: 1, lookback: "T-1 hour", priority: "critical",
      channels: ["In-app","Email"], notifyFreq: "Every 1 hour until resolved",
      who: ["Customer","Operations"], emailFormat: "Excel",
      customRecipients: [
        { email: "abram.qureshi@lightstorm.in", registered: true },
        { email: "noc-team@lightstorm.in",      registered: true  },
        { email: "manager@lightstorm.in",        registered: false },
      ],
      active: true, last: { time: "10 mins ago", sev: "critical" },
      history: [
        { time: "Today, 03:20 PM",     obs: "94% MIN", res: "VC-Mumbai-01",  status: "resolved", impact: "Availability below 95% for 3:15 h then recovered to 99.9%." },
        { time: "Yesterday, 11:10 PM", obs: "93% MIN", res: "Wave-BLR-MUM", status: "resolved", impact: "Availability dropped to 93% for 45 minutes." },
      ],
      schedules: [{ id: `s${uid()}`, freq: "Weekly", day: "Monday", time: "09:00", format: "Excel", recipients: ["Operations","Account Manager"], next: "Mon 09:00" }],
      reports: [],
    },
    {
      id: `al${uid()}`, title: "Core Utilization Warning",
      scope: "Private", products: ["Port","VC"],
      resources: ["Port-MUM-MB1-A","Port-SG1-A"], paused: [],
      metric: "utilization", aggregation: "AVG", operator: ">=", value: "80", thresholdType: "percentage",
      evalWindow: "15 min", minOccurrences: 1, lookback: "T-1 day", priority: "warning",
      channels: ["In-app","Email"], notifyFreq: "Notify once",
      who: ["Service Manager","Operations"], emailFormat: "PDF",
      customRecipients: [], active: true, last: undefined,
      history: [], schedules: [], reports: [],
    },
    {
      id: `al${uid()}`, title: "Packet Loss Watch",
      scope: "Global", products: ["VC"],
      resources: ["VC-Bangalore-01","VC-Hyderabad-01"], paused: [],
      metric: "packet_loss", aggregation: "MAX", operator: ">", value: "1", thresholdType: "percentage",
      evalWindow: "1 min", minOccurrences: 2, lookback: "T-12 hours", priority: "critical",
      channels: ["In-app"], notifyFreq: "Every 4 hours until resolved",
      who: ["Operations"], emailFormat: "CSV",
      customRecipients: [], active: false, last: undefined,
      history: [], schedules: [], reports: [],
    },
  ];
}

const SEED_RULES = makeSeedRules();

const SEED_FEED: FeedItem[] = [
  {
    id: `f${uid()}`, alertId: SEED_RULES[0].id,
    title: "Availability resolved on VC-Mumbai-01",
    sev: "success",
    sub: "Incident closed. Service now meets the 95% minimum availability threshold.",
    impact: "Availability below 95% for 3:15 hours then recovered to 99.9%.",
    time: "10 mins ago", status: "resolved",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */

export function AlertManagementPortal() {
  /* ── State ── */
  const [rules,    setRules]    = useState<Rule[]>(SEED_RULES);
  const [feed,     setFeed]     = useState<FeedItem[]>(SEED_FEED);
  const [section,  setSection]  = useState<Section>("manage-alerts");

  // Filters & sorting
  const [metricFilter, setMetricFilter] = useState<MetricKey | "all">("all");
  const [search,       setSearch]       = useState("");
  const [sortCol,      setSortCol]      = useState<SortCol>("last");
  const [sortDir,      setSortDir]      = useState<"asc"|"desc">("desc");
  const [page,         setPage]         = useState(1);
  const perPage = 8;

  // Detail drawer
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerTab,  setDrawerTab]  = useState<DrawerTab>("services");

  // Activity drawer
  const [activityOpen, setActivityOpen] = useState(false);

  // Wizard
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [draft,      setDraft]      = useState<Rule>(blankRule());
  const [emailInput, setEmailInput] = useState("");
  const [emailMsg,   setEmailMsg]   = useState<{text:string;type:"ok"|"warn"|"err"} | null>(null);

  // Schedule form
  const [schedFormOpen, setSchedFormOpen] = useState(false);
  const [schedRuleId,   setSchedRuleId]   = useState<string | null>(null);
  const [schedDraft,    setSchedDraft]    = useState<Partial<Schedule>>({});

  // Confirm dialog
  const [confirm, setConfirm] = useState<{
    title:string; msg:string; label:string;
    danger?:boolean; onYes:()=>void;
  } | null>(null);

  // Default notification settings
  const [defChannels, setDefChannels] = useState(["In-app","Email"]);
  const [defFreq,     setDefFreq]     = useState("Every 1 hour until resolved");
  const [defFormat,   setDefFormat]   = useState<"Excel"|"PDF"|"CSV">("Excel");
  const [defScope,    setDefScope]    = useState<RuleScope>("Private");

  // Toasts
  const [toasts, setToasts] = useState<{id:string;type:"success"|"info"|"alert";msg:string}[]>([]);
  const toastRef = useRef(0);

  /* ── Computed ── */
  const needsAttention = feed.filter(f => f.status !== "resolved").length;
  const selectedRule   = rules.find(r => r.id === selectedId) ?? null;

  const metricCounts = useMemo(() =>
    Object.fromEntries(
      (Object.keys(METRICS) as MetricKey[]).map(k => [k, rules.filter(r => r.metric === k).length])
    ), [rules]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rules.filter(r => {
      const textOk = !q ||
        r.title.toLowerCase().includes(q) ||
        METRICS[r.metric].label.toLowerCase().includes(q) ||
        r.resources.some(res => res.toLowerCase().includes(q));
      const metricOk = metricFilter === "all" || r.metric === metricFilter;
      return textOk && metricOk;
    });
    list = [...list].sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      if (sortCol === "title")     { va = a.title; vb = b.title; }
      if (sortCol === "scope")     { va = a.scope; vb = b.scope; }
      if (sortCol === "condition") { va = conditionStr(a); vb = conditionStr(b); }
      if (sortCol === "metric")    { va = METRICS[a.metric].label; vb = METRICS[b.metric].label; }
      if (sortCol === "last")      { va = a.last?.time ?? ""; vb = b.last?.time ?? ""; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [rules, search, metricFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / perPage));
  const pageRules  = filteredSorted.slice((page - 1) * perPage, page * perPage);

  // All schedules for Manage Reports view
  const allSchedules = useMemo(() =>
    rules.flatMap(r => r.schedules.map(s => ({ ...s, ruleName: r.title, ruleId: r.id }))),
    [rules]);

  /* ── Handlers ── */
  function toast(type: "success"|"info"|"alert", msg: string) {
    const id = String(++toastRef.current);
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }

  function openWizard(ruleId?: string) {
    const base = ruleId ? structuredClone(rules.find(r => r.id === ruleId)!) : blankRule();
    setDraft({ ...blankRule(), ...base });
    setWizardStep(1);
    setEmailInput("");
    setEmailMsg(null);
    setWizardOpen(true);
  }

  function saveDraft() {
    const title = draft.title.trim() || `${METRICS[draft.metric].label} Policy`;
    const updated = { ...draft, title };
    if (draft.id) {
      setRules(prev => prev.map(r => r.id === draft.id ? updated : r));
      if (selectedId === draft.id) setDrawerTab("services");
      toast("success", "Rule updated");
    } else {
      const created = { ...updated, id: `al${uid()}` };
      setRules(prev => [created, ...prev]);
      setSelectedId(created.id);
      toast("success", `Rule created · tracking ${created.resources.length} resources`);
    }
    setWizardOpen(false);
  }

  function updateRule(id: string, fn: (r: Rule) => Rule) {
    setRules(prev => prev.map(r => r.id === id ? fn(r) : r));
  }

  function deleteRule(id: string) {
    setRules(prev => prev.filter(r => r.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast("info", "Rule deleted");
  }

  function toggleSort(col: SortCol) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function addEmailRecipient() {
    const email = emailInput.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailMsg({ text: "Enter a valid email address.", type: "err" }); return;
    }
    if (!email.endsWith("@lightstorm.in")) {
      setEmailMsg({ text: "Only @lightstorm.in organisation emails are allowed.", type: "err" }); return;
    }
    if (draft.customRecipients.some(r => r.email === email)) {
      setEmailMsg({ text: "Already added.", type: "err" }); return;
    }
    const registered = REGISTERED_USERS.has(email);
    setDraft(d => ({ ...d, customRecipients: [...d.customRecipients, { email, registered }] }));
    setEmailInput("");
    setEmailMsg(registered
      ? { text: "Recipient added.", type: "ok" }
      : { text: `${email} is not yet registered. An invite will be sent.`, type: "warn" });
  }

  function saveSchedule() {
    if (!schedRuleId) return;
    const s: Schedule = {
      id: `s${uid()}`,
      freq: (schedDraft.freq ?? "Weekly") as Schedule["freq"],
      day: schedDraft.day ?? "Monday",
      time: schedDraft.time ?? "09:00",
      format: (schedDraft.format ?? "Excel") as Schedule["format"],
      recipients: schedDraft.recipients ?? ["Operations"],
      next: schedDraft.day ? `${schedDraft.day.slice(0,3)} ${schedDraft.time ?? "09:00"}` : "Mon 09:00",
    };
    updateRule(schedRuleId, r => ({ ...r, schedules: [...r.schedules, s] }));
    setSchedFormOpen(false);
    setSchedDraft({});
    toast("success", "Report schedule added");
  }

  function openScheduleForm(ruleId: string) {
    setSchedRuleId(ruleId);
    setSchedDraft({ freq: "Weekly", day: "Monday", time: "09:00", format: "Excel", recipients: ["Operations"] });
    setSchedFormOpen(true);
  }

  function generateReport(ruleId: string) {
    const rep: Report = {
      id: `rp${uid()}`,
      name: `Ad-hoc Report · ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}`,
      at: new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),
      by: "Abram Qureshi", sharedWith: ["Me"], kind: "manual",
    };
    updateRule(ruleId, r => ({ ...r, reports: [rep, ...r.reports] }));
    toast("success", "Report generated");
  }

  /* ── Render ── */
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
          <button className="ap-bell" onClick={() => setActivityOpen(true)}>
            <Bell size={16}/>
            {needsAttention > 0 && <span className="ap-bell-dot"/>}
          </button>
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
        {/* ── Sidebar ── */}
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
            <Link to="/integrations" className="ap-sidebar-item"><KeyRound size={15}/>API Key Generator</Link>
            <Link to="/integrations" className="ap-sidebar-item"><Layers size={15}/>Requests &amp; Orders</Link>
          </div>

          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Alerts</span>
            <button
              className={`ap-sidebar-item${section === "manage-alerts" ? " active" : ""}`}
              onClick={() => setSection("manage-alerts")}
            >
              <AlertTriangle size={15}/>Manage Alerts
            </button>
            <button
              className={`ap-sidebar-item${section === "manage-reports" ? " active" : ""}`}
              onClick={() => setSection("manage-reports")}
            >
              <CalendarDays size={15}/>Manage Reports
            </button>
            <button
              className={`ap-sidebar-item${section === "settings" ? " active" : ""}`}
              onClick={() => setSection("settings")}
            >
              <Settings size={15}/>Settings
            </button>
          </div>

          <div className="ap-sidebar-section">
            <span className="ap-sidebar-label">Personal</span>
            <button className="ap-sidebar-item"><User size={15}/>Profile</button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="ap-main">
          {section === "manage-alerts" && (
            <ManageAlertsView
              rules={rules}
              pageRules={pageRules}
              filteredCount={filteredSorted.length}
              metricCounts={metricCounts}
              metricFilter={metricFilter}
              onMetricFilter={k => { setMetricFilter(k); setPage(1); }}
              search={search}
              onSearch={q => { setSearch(q); setPage(1); }}
              sortCol={sortCol}
              sortDir={sortDir}
              onSort={toggleSort}
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPage={setPage}
              selectedId={selectedId}
              onSelect={id => { setSelectedId(id); setDrawerTab("services"); }}
              onCreateRule={() => openWizard()}
              onViewReports={() => setSection("manage-reports")}
            />
          )}

          {section === "manage-reports" && (
            <ManageReportsView
              allSchedules={allSchedules}
              rules={rules}
              onAddSchedule={openScheduleForm}
              onDeleteSchedule={(ruleId, schedId) => {
                updateRule(ruleId, r => ({ ...r, schedules: r.schedules.filter(s => s.id !== schedId) }));
                toast("info", "Schedule removed");
              }}
              onGenerateNow={generateReport}
            />
          )}

          {section === "settings" && (
            <AlertSettingsView
              defChannels={defChannels}
              onToggleChannel={ch => setDefChannels(prev =>
                prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]
              )}
              defFreq={defFreq}
              onFreq={setDefFreq}
              defFormat={defFormat}
              onFormat={v => setDefFormat(v as "Excel"|"PDF"|"CSV")}
              defScope={defScope}
              onScope={v => setDefScope(v as RuleScope)}
            />
          )}
        </main>
      </div>

      {/* ── Detail drawer ── */}
      {selectedRule && (
        <>
          <div className="ap-overlay" onClick={() => setSelectedId(null)}/>
          <RuleDetailDrawer
            rule={selectedRule}
            tab={drawerTab}
            onTab={setDrawerTab}
            onClose={() => setSelectedId(null)}
            onEdit={() => openWizard(selectedRule.id)}
            onToggleActive={() => {
              if (selectedRule.active) {
                setConfirm({
                  title: "Pause this rule?",
                  msg: `<b>${selectedRule.title}</b> will stop monitoring until resumed.`,
                  label: "Pause", danger: false,
                  onYes: () => { updateRule(selectedRule.id, r => ({ ...r, active: false })); toast("info", "Rule paused"); },
                });
              } else {
                updateRule(selectedRule.id, r => ({ ...r, active: true }));
                toast("success", "Rule resumed");
              }
            }}
            onDelete={() => setConfirm({
              title: "Delete this rule?",
              msg: `"<b>${selectedRule.title}</b>" and all its history will be permanently deleted.`,
              label: "Delete", danger: true,
              onYes: () => deleteRule(selectedRule.id),
            })}
            onToggleResource={resId => updateRule(selectedRule.id, r => ({
              ...r,
              paused: r.paused.includes(resId)
                ? r.paused.filter(x => x !== resId)
                : [...r.paused, resId],
            }))}
            onRemoveResource={resId => {
              if (selectedRule.resources.length <= 1) {
                setConfirm({
                  title: "Remove the last service?",
                  msg: `<b>${resId}</b> is the only service. Removing it will pause the rule.`,
                  label: "Remove & pause", danger: true,
                  onYes: () => updateRule(selectedRule.id, r => ({ ...r, resources: [], paused: [], active: false })),
                });
              } else {
                updateRule(selectedRule.id, r => ({
                  ...r,
                  resources: r.resources.filter(x => x !== resId),
                  paused:    r.paused.filter(x => x !== resId),
                }));
                toast("info", `Removed ${resId}`);
              }
            }}
            onAddSchedule={() => openScheduleForm(selectedRule.id)}
            onDeleteSchedule={schedId => {
              updateRule(selectedRule.id, r => ({ ...r, schedules: r.schedules.filter(s => s.id !== schedId) }));
              toast("info", "Schedule removed");
            }}
            onGenerateNow={() => generateReport(selectedRule.id)}
          />
        </>
      )}

      {/* ── Activity drawer ── */}
      {activityOpen && (
        <>
          <div className="ap-overlay" onClick={() => setActivityOpen(false)}/>
          <aside className="ap-drawer narrow">
            <div className="ap-drawer-head">
              <div className="ap-drawer-head-row">
                <div className="ap-drawer-head-info">
                  <div className="ap-drawer-title">Recent activity</div>
                  <div className="ap-drawer-subtitle">{feed.length} event{feed.length !== 1 ? "s" : ""}</div>
                </div>
                <button className="ap-icon-btn" onClick={() => setActivityOpen(false)}><X size={18}/></button>
              </div>
            </div>
            <div className="ap-drawer-body">
              {feed.length === 0 && (
                <div className="ap-empty">
                  <Bell size={28}/>
                  <div className="ap-empty-title">All clear</div>
                  <div className="ap-empty-sub">No alerts have fired.</div>
                </div>
              )}
              {feed.map(item => (
                <div className="ap-feed-item" key={item.id}>
                  <div className={`ap-feed-ic ${item.sev}`}>
                    {item.sev === "success" ? <Check size={16}/> : <AlertTriangle size={16}/>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ap-feed-title">{item.title}</div>
                    <div className="ap-feed-sub">{item.sub}</div>
                    <div className="ap-feed-impact"><b>Impact:</b> {item.impact}</div>
                    <div className="ap-feed-foot">
                      <span className={`ap-status-chip ap-status-${item.status}`}>{cap(item.status)}</span>
                      <span style={{ fontSize: 11.5, color: "#90A2AC" }}>{item.time}</span>
                      {item.status !== "resolved" && (
                        <button className="ap-feed-ack" onClick={() =>
                          setFeed(prev => prev.map(f => f.id === item.id
                            ? { ...f, status: f.status === "active" ? "acknowledged" : "resolved" }
                            : f))
                        }>
                          {item.status === "active" ? "Acknowledge" : "Mark resolved"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* ── Create / Edit wizard ── */}
      {wizardOpen && (
        <div className="ap-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setWizardOpen(false); }}>
          <WizardModal
            draft={draft}
            step={wizardStep}
            rules={rules}
            emailInput={emailInput}
            emailMsg={emailMsg}
            onEmailInput={setEmailInput}
            onAddEmail={addEmailRecipient}
            onDraft={setDraft}
            onStep={setWizardStep}
            onClose={() => setWizardOpen(false)}
            onSave={saveDraft}
            onEmailMsg={setEmailMsg}
          />
        </div>
      )}

      {/* ── Schedule form ── */}
      {schedFormOpen && (
        <div className="ap-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSchedFormOpen(false); }}>
          <ScheduleFormModal
            draft={schedDraft}
            onChange={setSchedDraft}
            onClose={() => setSchedFormOpen(false)}
            onSave={saveSchedule}
          />
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirm && (
        <div className="ap-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setConfirm(null); }}>
          <div className="ap-modal sm">
            <div className="ap-confirm-body">
              <div className={`ap-confirm-ic ${confirm.danger ? "danger" : "warn"}`}>
                {confirm.danger ? <Trash2 size={22}/> : <AlertTriangle size={22}/>}
              </div>
              <div className="ap-confirm-ttl">{confirm.title}</div>
              <div className="ap-confirm-msg" dangerouslySetInnerHTML={{ __html: confirm.msg }}/>
            </div>
            <div className="ap-modal-foot">
              <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`ap-btn ap-btn-sm ${confirm.danger ? "ap-btn-danger" : "ap-btn-primary"}`}
                onClick={() => { setConfirm(null); confirm.onYes(); }}
              >{confirm.label}</button>
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
   MANAGE ALERTS VIEW
═══════════════════════════════════════════════════════════════════ */

function ManageAlertsView({
  rules, pageRules, filteredCount,
  metricCounts, metricFilter, onMetricFilter,
  search, onSearch, sortCol, sortDir, onSort,
  page, totalPages, perPage, onPage,
  selectedId, onSelect, onCreateRule, onViewReports,
}: {
  rules: Rule[]; pageRules: Rule[]; filteredCount: number;
  metricCounts: Record<string,number>;
  metricFilter: MetricKey|"all"; onMetricFilter: (k:MetricKey|"all")=>void;
  search: string; onSearch: (q:string)=>void;
  sortCol: SortCol; sortDir: "asc"|"desc"; onSort: (c:SortCol)=>void;
  page: number; totalPages: number; perPage: number; onPage: (p:number)=>void;
  selectedId: string|null; onSelect: (id:string)=>void;
  onCreateRule: ()=>void; onViewReports: ()=>void;
}) {
  const activeCount  = rules.filter(r => r.active).length;
  const trackedCount = rules.reduce((n,r) => n + r.resources.length, 0);

  const metricsWithRules = (Object.keys(METRICS) as MetricKey[])
    .filter(k => (metricCounts[k] ?? 0) > 0);

  return (
    <div className="ap-panel">
      {/* Header */}
      <div className="ap-page-head">
        <div className="ap-page-head-left">
          <div className="ap-page-icon"><ShieldCheck size={24}/></div>
          <div>
            <div className="ap-page-title">Manage Alert Rules</div>
            <div className="ap-page-subtitle">Create, edit, duplicate or disable rules</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ display:"flex", gap:14, marginRight:8 }}>
            <StatPill label="Rules"     value={rules.length}  />
            <StatPill label="Active"    value={activeCount}   />
            <StatPill label="Resources" value={trackedCount}  />
          </div>
          <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={onViewReports}>
            <CalendarDays size={14}/>Schedule Report
          </button>
          <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={onCreateRule}>
            <Plus size={14}/>Create rule
          </button>
        </div>
      </div>

      {/* Metric filter chips */}
      <div className="ap-filter-bar">
        <button
          className={`ap-metric-chip${metricFilter === "all" ? " active" : ""}`}
          onClick={() => onMetricFilter("all")}
        >
          All <span className="ap-chip-count">{rules.length}</span>
        </button>
        {metricsWithRules.map(k => (
          <button
            key={k}
            className={`ap-metric-chip${metricFilter === k ? " active" : ""}`}
            onClick={() => onMetricFilter(k)}
          >
            {METRICS[k].label}
            <span className="ap-chip-count">{metricCounts[k]}</span>
          </button>
        ))}
        <button className="ap-view-reports" onClick={onViewReports}>
          View Scheduled Reports →
        </button>
      </div>

      {/* Search */}
      <div className="ap-search-row">
        <div className="ap-search">
          <Search size={15}/>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by alert name, metric, or service name…"
          />
        </div>
        <button className="ap-date-btn">
          Last 1 Month <ChevronDown size={14}/>
        </button>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead className="ap-thead">
            <tr>
              {([
                ["title","Rule Name"], ["scope","Scope"], ["condition","Condition"],
                ["metric","Event Type"], ["last","Timestamp"],
              ] as [SortCol,string][]).map(([col,label]) => (
                <th key={col} className="ap-th" onClick={() => onSort(col)}>
                  <span className="ap-th-inner">
                    {label}
                    <SortIcon active={sortCol === col} dir={sortDir}/>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ap-tbody">
            {pageRules.length === 0 ? (
              <tr><td className="ap-td" colSpan={5}>
                <div className="ap-empty">
                  <AlertTriangle size={24}/>
                  <div className="ap-empty-title">No rules found</div>
                  <div className="ap-empty-sub">Adjust filters or search to find your rules.</div>
                </div>
              </td></tr>
            ) : pageRules.map(rule => {
              const m    = METRICS[rule.metric];
              const Icon = m.Icon;
              const act  = activeResources(rule).length;
              const pau  = rule.resources.length - act;
              return (
                <tr
                  key={rule.id}
                  className={selectedId === rule.id ? "selected" : ""}
                  onClick={() => onSelect(rule.id)}
                  style={{ opacity: rule.active ? 1 : 0.65 }}
                >
                  {/* Rule Name */}
                  <td className="ap-td">
                    <div className="ap-rule-name">{rule.title}</div>
                    <div className="ap-rule-chips">
                      <span className={`ap-badge ap-badge-${rule.priority}`}>{cap(rule.priority)}</span>
                      <span className="ap-scope-tag">{rule.scope}</span>
                      {!rule.active && <span className="ap-scope-tag">Paused</span>}
                    </div>
                  </td>

                  {/* Scope / Resources */}
                  <td className="ap-td">
                    <div style={{ fontSize:13, fontWeight:600, color:"#0E2A38" }}>
                      {rule.resources[0] ?? "—"}
                      {rule.resources.length > 1 && (
                        <span style={{ fontSize:11, color:"#6B7E89", marginLeft:4 }}>
                          +{rule.resources.length - 1} more
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize:11, color:"#6B7E89", marginTop:2 }}>
                      <span style={{ color: act > 0 ? "#22B473" : "#6B7E89", fontWeight:700 }}>{act} active</span>
                      {pau > 0 && <span style={{ color:"#c8780a", fontWeight:700, marginLeft:6 }}>{pau} paused</span>}
                    </div>
                  </td>

                  {/* Condition */}
                  <td className="ap-td">
                    <span className="ap-condition-tag">{conditionStr(rule)}</span>
                  </td>

                  {/* Event Type */}
                  <td className="ap-td">
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <Icon size={14} style={{ color:"#0E7E8E" }}/>
                      <span className="ap-metric-label">{m.label}</span>
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="ap-td">
                    {rule.last
                      ? <span className="ap-timestamp">{rule.last.time}</span>
                      : <span className="ap-no-events">No events yet</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="ap-pagination">
        <span className="ap-pag-total">Total {filteredCount} items</span>
        <button className="ap-pag-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={15}/>
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} className={`ap-pag-num${page === p ? " current" : ""}`} onClick={() => onPage(p)}>{p}</button>
        ))}
        <button className="ap-pag-btn" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          <ChevronRight size={15}/>
        </button>
        <button className="ap-per-page">{perPage} / page <ChevronDown size={12}/></button>
      </div>

      <div className="ap-tip">
        <ShieldCheck size={15} style={{ flexShrink:0, marginTop:1 }}/>
        <span><b>Click any row</b> to view services, configure reports, and see incident history. Only <b>@lightstorm.in</b> domain emails can be added as custom recipients.</span>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:20, color:"#0B2A3A", lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:11, color:"#6B7E89", fontWeight:600 }}>{label}</div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc"|"desc" }) {
  return (
    <span className={`ap-sort-arrows${active ? (dir === "asc" ? " asc" : " desc") : ""}`}>
      <ChevronUp  size={10} className="up"/>
      <ChevronDown size={10} className="dn"/>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RULE DETAIL DRAWER
═══════════════════════════════════════════════════════════════════ */

function RuleDetailDrawer({
  rule, tab, onTab, onClose, onEdit, onToggleActive, onDelete,
  onToggleResource, onRemoveResource, onAddSchedule, onDeleteSchedule, onGenerateNow,
}: {
  rule: Rule; tab: DrawerTab;
  onTab: (t:DrawerTab)=>void; onClose: ()=>void;
  onEdit: ()=>void; onToggleActive: ()=>void; onDelete: ()=>void;
  onToggleResource: (id:string)=>void; onRemoveResource: (id:string)=>void;
  onAddSchedule: ()=>void; onDeleteSchedule: (id:string)=>void;
  onGenerateNow: ()=>void;
}) {
  const m    = METRICS[rule.metric];
  const Icon = m.Icon;
  const act  = activeResources(rule).length;
  const pau  = rule.resources.length - act;

  return (
    <aside className="ap-drawer">
      {/* Head */}
      <div className="ap-drawer-head">
        <div className="ap-drawer-head-row">
          <div className={`ap-drawer-icon ap-badge-${rule.priority}`} style={{ border:`1px solid` }}>
            <Icon size={20}/>
          </div>
          <div className="ap-drawer-head-info">
            <div className="ap-drawer-title">
              {rule.title}
              <span className={`ap-badge ap-badge-${rule.priority}`} style={{ marginLeft:8, fontSize:10.5 }}>{cap(rule.priority)}</span>
              <span className="ap-scope-tag" style={{ marginLeft:5 }}>{rule.scope}</span>
            </div>
            <div className="ap-drawer-subtitle">
              {conditionStr(rule)} · {rule.evalWindow} ·{" "}
              <span style={{ color:"#22B473", fontWeight:700 }}>{act} active</span>
              {pau > 0 && <span style={{ color:"#c8780a", fontWeight:700, marginLeft:6 }}>{pau} paused</span>}
            </div>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center", flexShrink:0 }}>
            <button
              className={`ap-toggle${rule.active ? " on" : ""}`}
              onClick={onToggleActive}
              title={rule.active ? "Pause" : "Resume"}
            />
            <button className="ap-icon-btn" onClick={onClose}><X size={17}/></button>
          </div>
        </div>
        <div className="ap-drawer-action-row">
          <button className="ap-drawer-act-btn" onClick={onEdit}><Edit3 size={13}/>Edit rule</button>
          <button className="ap-drawer-act-btn" onClick={onToggleActive}>
            {rule.active ? <Pause size={13}/> : <Play size={13}/>}
            {rule.active ? "Pause" : "Resume"}
          </button>
          <button className="ap-drawer-act-btn danger" onClick={onDelete}><Trash2 size={13}/>Delete</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ap-drawer-tabs">
        <button className={`ap-drawer-tab${tab==="services" ? " active":""}`} onClick={() => onTab("services")}>
          Services ({rule.resources.length})
        </button>
        <button className={`ap-drawer-tab${tab==="history" ? " active":""}`} onClick={() => onTab("history")}>
          Alert history
        </button>
        <button className={`ap-drawer-tab${tab==="reports" ? " active":""}`} onClick={() => onTab("reports")}>
          Reports{rule.schedules.length ? ` · ${rule.schedules.length}` : ""}
        </button>
      </div>

      {/* Body */}
      <div className="ap-drawer-body">
        {tab === "services" && (
          <ServicesTab rule={rule} onToggle={onToggleResource} onRemove={onRemoveResource}/>
        )}
        {tab === "history" && (
          <HistoryTab rule={rule}/>
        )}
        {tab === "reports" && (
          <ReportsTab
            rule={rule}
            onAddSchedule={onAddSchedule}
            onDeleteSchedule={onDeleteSchedule}
            onGenerateNow={onGenerateNow}
          />
        )}
      </div>
    </aside>
  );
}

/* Services tab */
function ServicesTab({ rule, onToggle, onRemove }: {
  rule: Rule; onToggle: (id:string)=>void; onRemove: (id:string)=>void;
}) {
  const prods = productsCovered(rule);
  return (
    <>
      <div className="ap-sec-title">
        Monitored services
        <span className="ap-sec-count">{activeResources(rule).length} active</span>
      </div>
      {prods.map(prod => (
        <div className="ap-prod-group" key={prod}>
          <div className="ap-prod-group-label">
            <span className={`ap-prod-tag ap-prod-${prod.toLowerCase()}`}>{prod}</span>
            {rule.resources.filter(id => productOf(id) === prod).length} resources
          </div>
          <div className="ap-svc-grid">
            {rule.resources
              .filter(id => productOf(id) === prod)
              .map(id => {
                const paused = rule.paused.includes(id);
                return (
                  <span key={id} className={`ap-svc-chip${paused ? " paused" : ""}`}>
                    <span className={`ap-svc-dot${paused ? "" : " live"}`}/>
                    {id}
                    {paused && <span className="ap-svc-ptag">Paused</span>}
                    <button className="ap-svc-btn" onClick={() => onToggle(id)} title={paused ? "Resume" : "Pause"}>
                      {paused ? <Play size={9}/> : <Pause size={9}/>}
                    </button>
                    <button className="ap-svc-btn rm" onClick={() => onRemove(id)} title="Remove">
                      <X size={9}/>
                    </button>
                  </span>
                );
              })}
          </div>
        </div>
      ))}
      <button className="ap-add-svc"><Plus size={12}/>Add resource</button>
    </>
  );
}

/* History tab */
function HistoryTab({ rule }: { rule: Rule }) {
  return (
    <>
      <div className="ap-sec-title">
        Alert events
        <span className="ap-sec-count">{rule.history.length} total</span>
      </div>
      {rule.history.length === 0 ? (
        <div className="ap-empty">
          <Clock size={26}/>
          <div className="ap-empty-title">No events yet</div>
          <div className="ap-empty-sub">This rule hasn't breached its threshold conditions.</div>
        </div>
      ) : rule.history.map((h, i) => (
        <div className="ap-hist-item" key={i}>
          <div className="ap-hist-main">
            <div className="ap-hist-top">
              {h.res}
              <span className={`ap-status-chip ap-status-${h.status}`}>{cap(h.status)}</span>
            </div>
            <div className="ap-hist-meta">{h.time} · Observed: <b>{h.obs}</b></div>
            <div className="ap-hist-impact"><b>Impact:</b> {h.impact}</div>
          </div>
        </div>
      ))}
    </>
  );
}

/* Reports tab */
function ReportsTab({ rule, onAddSchedule, onDeleteSchedule, onGenerateNow }: {
  rule: Rule;
  onAddSchedule: ()=>void;
  onDeleteSchedule: (id:string)=>void;
  onGenerateNow: ()=>void;
}) {
  return (
    <>
      <div className="ap-sec-title">
        Scheduled reports
        <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={onGenerateNow}>
          <FileText size={13}/>Generate now
        </button>
      </div>

      {rule.schedules.map(s => (
        <div className="ap-sched-card" key={s.id}>
          <div className="ap-sched-top">
            <div>
              <div className="ap-sched-title">{s.freq} · {s.format} report</div>
              <div className="ap-sched-meta">
                {s.freq === "Weekly"  ? `Every ${s.day} at ${s.time}` :
                 s.freq === "Daily"   ? `Every day at ${s.time}` :
                 `Monthly on the 1st at ${s.time}`}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
              <span className="ap-next-badge">Next: {s.next}</span>
              <button className="ap-icon-btn danger" onClick={() => onDeleteSchedule(s.id)}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
          <div className="ap-sched-chips">
            <span style={{ fontSize:11.5, fontWeight:700, color:"#90A2AC", marginRight:4 }}>Shared with</span>
            {s.recipients.map(r => <span key={r} className="ap-sched-chip">{r}</span>)}
          </div>
        </div>
      ))}

      <button className="ap-add-sched" onClick={onAddSchedule}>
        <Plus size={15}/>Add report schedule
      </button>

      <div className="ap-divider"/>

      <div className="ap-sec-title">
        Generated reports
        <span className="ap-sec-count">{rule.reports.length} total</span>
      </div>

      {rule.reports.length === 0 ? (
        <div className="ap-empty" style={{ padding:"22px 0" }}>
          <FileSpreadsheet size={24}/>
          <div className="ap-empty-title">No reports yet</div>
          <div className="ap-empty-sub">Generate one now or set up a schedule above.</div>
        </div>
      ) : rule.reports.map(r => (
        <div className="ap-rep-row" key={r.id}>
          <div className="ap-rep-icon"><FileText size={16}/></div>
          <div style={{ flex:1 }}>
            <div className="ap-rep-name">
              {r.name}
              <span className={r.kind === "scheduled" ? "ap-kind-sched" : "ap-kind-manual"}>{cap(r.kind)}</span>
            </div>
            <div className="ap-rep-meta">{r.at} · {r.by}</div>
            <div className="ap-rep-shared">
              {r.sharedWith.map(w => <span key={w} className="ap-share-chip">{w}</span>)}
            </div>
          </div>
          <button className="ap-icon-btn"><ChevronDown size={15}/></button>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MANAGE REPORTS VIEW
═══════════════════════════════════════════════════════════════════ */

function ManageReportsView({ allSchedules, rules, onAddSchedule, onDeleteSchedule, onGenerateNow }: {
  allSchedules: (Schedule & { ruleName:string; ruleId:string })[];
  rules: Rule[];
  onAddSchedule: (ruleId:string)=>void;
  onDeleteSchedule: (ruleId:string, schedId:string)=>void;
  onGenerateNow: (ruleId:string)=>void;
}) {
  const [selRule, setSelRule] = useState<string>("all");

  const shown = selRule === "all"
    ? allSchedules
    : allSchedules.filter(s => s.ruleId === selRule);

  return (
    <div className="ap-panel">
      <div className="ap-page-head">
        <div className="ap-page-head-left">
          <div className="ap-page-icon"><CalendarDays size={24}/></div>
          <div>
            <div className="ap-page-title">Manage Reports</div>
            <div className="ap-page-subtitle">Scheduled and on-demand reports across all alert rules</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <select
            style={{ padding:"8px 12px", border:"1px solid #E6EDF1", borderRadius:10, fontFamily:"inherit", fontSize:13, color:"#0E2A38", background:"#fff" }}
            value={selRule}
            onChange={e => setSelRule(e.target.value)}
          >
            <option value="all">All rules</option>
            {rules.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="ap-empty">
          <CalendarDays size={28}/>
          <div className="ap-empty-title">No scheduled reports</div>
          <div className="ap-empty-sub">Open a rule's Reports tab to add a schedule.</div>
        </div>
      ) : shown.map(s => (
        <div className="ap-report-card" key={s.id}>
          <div className="ap-report-card-top">
            <div>
              <div className="ap-report-title">{s.freq} · {s.format} report</div>
              <div className="ap-report-rule">{s.ruleName}</div>
              <div className="ap-report-meta">
                {s.freq === "Weekly" ? `Every ${s.day} at ${s.time}` :
                 s.freq === "Daily"  ? `Every day at ${s.time}` :
                 `Monthly at ${s.time}`}
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
              <span className="ap-next-badge">Next: {s.next}</span>
              <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={() => onGenerateNow(s.ruleId)}>
                <FileText size={13}/>Generate now
              </button>
              <button className="ap-icon-btn danger" onClick={() => onDeleteSchedule(s.ruleId, s.id)}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11.5, fontWeight:700, color:"#90A2AC" }}>Shared with:</span>
            {s.recipients.map(r => <span key={r} className="ap-sched-chip">{r}</span>)}
          </div>
        </div>
      ))}

      <button
        className="ap-add-sched"
        style={{ marginTop:8 }}
        onClick={() => rules.length && onAddSchedule(rules[0].id)}
      >
        <Plus size={15}/>Add a new report schedule
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ALERT SETTINGS VIEW
═══════════════════════════════════════════════════════════════════ */

function AlertSettingsView({ defChannels, onToggleChannel, defFreq, onFreq, defFormat, onFormat, defScope, onScope }: {
  defChannels: string[]; onToggleChannel: (ch:string)=>void;
  defFreq: string; onFreq: (v:string)=>void;
  defFormat: string; onFormat: (v:string)=>void;
  defScope: string; onScope: (v:string)=>void;
}) {
  return (
    <div>
      <div className="ap-page-head" style={{ marginBottom:20 }}>
        <div className="ap-page-head-left">
          <div className="ap-page-icon"><Settings size={24}/></div>
          <div>
            <div className="ap-page-title">Notification Settings</div>
            <div className="ap-page-subtitle">Default preferences applied when creating new alert rules</div>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="ap-settings-card">
        <div className="ap-settings-card-title">Default Notification Channels</div>
        <div className="ap-settings-card-desc">Choose which channels receive alerts by default when a rule is created.</div>
        {[
          ["In-app", "Show notifications inside the Polarin portal dashboard and service pages."],
          ["Email",  "Send email alerts to all configured recipients on each breach."],
        ].map(([ch, desc]) => (
          <div className="ap-toggle-row" key={ch}>
            <div>
              <div className="ap-toggle-lbl">{ch} notifications</div>
              <div className="ap-toggle-desc">{desc}</div>
            </div>
            <button
              className={`ap-toggle${defChannels.includes(ch) ? " on" : ""}`}
              onClick={() => onToggleChannel(ch)}
            />
          </div>
        ))}
      </div>

      {/* Frequency */}
      <div className="ap-settings-card">
        <div className="ap-settings-card-title">Default Notification Frequency</div>
        <div className="ap-settings-card-desc">How often to re-notify when a breach remains unresolved.</div>
        <select className="ap-settings-sel" value={defFreq} onChange={e => onFreq(e.target.value)}>
          {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Email format & scope */}
      <div className="ap-settings-card">
        <div className="ap-settings-card-title">Default Report Preferences</div>
        <div className="ap-settings-card-desc">Used as the starting values when creating a new rule.</div>
        <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <div className="ap-toggle-lbl" style={{ fontSize:12, marginBottom:4 }}>Email Format</div>
            <select className="ap-settings-sel" value={defFormat} onChange={e => onFormat(e.target.value)}>
              {REPORT_FMT.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={{ flex:1 }}>
            <div className="ap-toggle-lbl" style={{ fontSize:12, marginBottom:4 }}>Default Scope</div>
            <select className="ap-settings-sel" value={defScope} onChange={e => onScope(e.target.value)}>
              <option value="Private">Private</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>
      </div>

      {/* Org domain notice */}
      <div className="ap-tip">
        <Mail size={14} style={{ flexShrink:0, marginTop:1 }}/>
        <span>Only emails from the <b>@lightstorm.in</b> organisation domain can be added as custom recipients. Non-registered users will receive a portal invitation automatically.</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   WIZARD MODAL  (4 steps: Metric → Condition → Resources → Action)
═══════════════════════════════════════════════════════════════════ */

const STEP_LABELS = ["Metric","Condition","Resources","Action"];

function WizardModal({ draft, step, rules, emailInput, emailMsg,
  onEmailInput, onAddEmail, onDraft, onStep, onClose, onSave, onEmailMsg }: {
  draft: Rule; step: number; rules: Rule[];
  emailInput: string; emailMsg: {text:string;type:"ok"|"warn"|"err"}|null;
  onEmailInput: (v:string)=>void;
  onAddEmail: ()=>void;
  onDraft: (fn:(d:Rule)=>Rule)=>void;
  onStep: (n:number)=>void;
  onClose: ()=>void;
  onSave: ()=>void;
  onEmailMsg: (m:{text:string;type:"ok"|"warn"|"err"}|null)=>void;
}) {
  const dup = findDuplicate(draft, rules);

  function next() {
    if (step === 1 && !draft.metric) return;
    if (step === 2 && !draft.value)  return;
    if (step === 3 && draft.resources.length === 0) return;
    if (step === 4) { onSave(); return; }
    onStep(step + 1);
  }

  const canNext =
    (step === 1 && !!draft.metric) ||
    (step === 2 && !!draft.value)  ||
    (step === 3 && draft.resources.length > 0) ||
    step === 4;

  return (
    <div className="ap-modal">
      {/* Head */}
      <div className="ap-modal-head">
        <div>
          <div className="ap-modal-title">{draft.id ? "Edit rule" : "Create alert rule"}</div>
          <div className="ap-modal-sub">Metric-driven policies for your Polarin services.</div>
        </div>
        <button className="ap-icon-btn" onClick={onClose}><X size={18}/></button>
      </div>

      {/* Steps */}
      <div className="ap-steps">
        {STEP_LABELS.map((lbl, i) => (
          <div key={lbl} style={{ display:"flex", alignItems:"center", flex: i < 3 ? "1" : "none" }}>
            <div className={`ap-step${step === i+1 ? " active" : ""}${step > i+1 ? " done" : ""}`}
                 style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, cursor:"pointer" }}
                 onClick={() => i < step - 1 && onStep(i+1)}>
              <span className="ap-step-n">{step > i+1 ? <Check size={12}/> : i+1}</span>
              <span className="ap-step-lbl">{lbl}</span>
            </div>
            {i < 3 && <div className="ap-step-line"/>}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="ap-modal-body">
        {step === 1 && <WizStep1 draft={draft} onDraft={onDraft}/>}
        {step === 2 && <WizStep2 draft={draft} onDraft={onDraft}/>}
        {step === 3 && <WizStep3 draft={draft} onDraft={onDraft}/>}
        {step === 4 && (
          <WizStep4
            draft={draft} onDraft={onDraft}
            emailInput={emailInput} emailMsg={emailMsg}
            onEmailInput={onEmailInput} onAddEmail={onAddEmail} onEmailMsg={onEmailMsg}
          />
        )}
        {dup && step >= 2 && (
          <div className="ap-dup-warn">
            <AlertTriangle size={15} style={{ flexShrink:0, marginTop:1 }}/>
            <div>Duplicate detected: <b>{dup.title}</b> already monitors the same condition. Consider adding resources to it instead.</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="ap-modal-foot">
        <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={onClose}>Cancel</button>
        <div style={{ display:"flex", gap:8 }}>
          <button className="ap-btn ap-btn-secondary ap-btn-sm" disabled={step === 1} onClick={() => onStep(step - 1)}>Back</button>
          <button className="ap-btn ap-btn-primary ap-btn-sm" disabled={!canNext} onClick={next}>
            {step < 4 ? "Continue" : (draft.id ? "Save rule" : "Create rule")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Step 1: Metric picker */
function WizStep1({ draft, onDraft }: { draft:Rule; onDraft:(fn:(d:Rule)=>Rule)=>void }) {
  return (
    <>
      <div className="ap-wiz-q">What should we watch?</div>
      <div className="ap-wiz-sub">Pick a metric — Polarin automatically filters supported products.</div>
      <div className="ap-pick-grid">
        {(Object.keys(METRICS) as MetricKey[]).map(k => {
          const m = METRICS[k]; const Icon = m.Icon;
          return (
            <button
              key={k}
              className={`ap-pick${draft.metric === k ? " active" : ""}`}
              onClick={() => onDraft(d => ({
                ...d, metric: k,
                products: m.products, resources: [], paused: [],
                aggregation: m.defAgg, operator: m.defOp,
                value: m.defVal, priority: m.defPrio,
              }))}
            >
              <div className="ap-pick-ic"><Icon size={16}/></div>
              <div className="ap-pick-t">{m.label}</div>
              <div className="ap-pick-h">{m.hint}</div>
              <div className="ap-pick-p">{m.products.join(" · ")}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* Step 2: Condition */
function WizStep2({ draft, onDraft }: { draft:Rule; onDraft:(fn:(d:Rule)=>Rule)=>void }) {
  const m = METRICS[draft.metric];
  const preview = `IF ${conditionStr(draft)} for ${draft.evalWindow} (min ${draft.minOccurrences} occ.)`;
  return (
    <>
      <div className="ap-wiz-q">Define the condition</div>
      <div className="ap-wiz-sub">Set the threshold and evaluation parameters.</div>

      <div className="ap-cond-row">
        <select className="ap-wiz-sel" value={draft.aggregation}
          onChange={e => onDraft(d => ({ ...d, aggregation: e.target.value as Rule["aggregation"] }))}>
          {AGGREGATIONS.map(a => <option key={a}>{a}</option>)}
        </select>
        <div className="ap-unit-box" style={{ padding:"0 11px" }}>{m.label}</div>
        <select className="ap-wiz-sel" value={draft.operator}
          onChange={e => onDraft(d => ({ ...d, operator: e.target.value as Rule["operator"] }))}>
          {(Object.entries(OPERATORS) as [Rule["operator"],string][]).map(([k,v]) => (
            <option key={k} value={k}>{k} ({v})</option>
          ))}
        </select>
        <input className="ap-wiz-inp ap-wiz-big" value={draft.value}
          onChange={e => onDraft(d => ({ ...d, value: e.target.value }))}/>
        <select className="ap-wiz-sel" value={draft.thresholdType}
          onChange={e => onDraft(d => ({ ...d, thresholdType: e.target.value as Rule["thresholdType"] }))}>
          <option value="absolute">{m.unit || "count"}</option>
          <option value="percentage">%</option>
        </select>
      </div>

      <div className="ap-fld-lbl">Evaluation Window</div>
      <div className="ap-wiz-chips">
        {EVAL_WINDOWS.map(w => (
          <button key={w} className={`ap-wiz-chip${draft.evalWindow === w ? " active":""}`}
            onClick={() => onDraft(d => ({ ...d, evalWindow: w }))}>{w}</button>
        ))}
      </div>

      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:4 }}>
        <div>
          <div className="ap-fld-lbl">Min Occurrences</div>
          <input className="ap-wiz-inp" type="number" min={1} style={{ width:110 }}
            value={draft.minOccurrences}
            onChange={e => onDraft(d => ({ ...d, minOccurrences: Number(e.target.value) }))}/>
        </div>
        <div>
          <div className="ap-fld-lbl">Lookback Period</div>
          <select className="ap-wiz-sel" value={draft.lookback}
            onChange={e => onDraft(d => ({ ...d, lookback: e.target.value }))}>
            {LOOKBACKS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="ap-fld-lbl">Priority</div>
      <div className="ap-wiz-chips">
        {(["critical","warning","info"] as Priority[]).map(p => (
          <button key={p} className={`ap-wiz-chip${draft.priority === p ? " active":""}`}
            onClick={() => onDraft(d => ({ ...d, priority: p }))}>{cap(p)}</button>
        ))}
      </div>

      <div className="ap-preview"><b>{preview}</b> · Priority: {cap(draft.priority)}</div>
    </>
  );
}

/* Step 3: Resources */
function WizStep3({ draft, onDraft }: { draft:Rule; onDraft:(fn:(d:Rule)=>Rule)=>void }) {
  const [resSearch, setResSearch] = useState("");
  const eligible = METRICS[draft.metric].products;

  function toggleProd(p: Product) {
    onDraft(d => {
      const prods = d.products.includes(p)
        ? d.products.filter(x => x !== p)
        : [...d.products, p];
      return {
        ...d, products: prods,
        resources: d.resources.filter(id => prods.includes(productOf(id)!)),
      };
    });
  }
  function toggleRes(id: string) {
    onDraft(d => ({
      ...d,
      resources: d.resources.includes(id)
        ? d.resources.filter(x => x !== id)
        : [...d.resources, id],
    }));
  }
  function selectAll(p: Product) {
    const ids = RESOURCES[p];
    const allOn = ids.every(id => draft.resources.includes(id));
    onDraft(d => ({
      ...d,
      resources: allOn
        ? d.resources.filter(id => !ids.includes(id))
        : [...new Set([...d.resources, ...ids])],
    }));
  }

  const q = resSearch.toLowerCase();
  const groups = draft.products
    .map(p => ({ p, ids: RESOURCES[p].filter(id => id.toLowerCase().includes(q)) }))
    .filter(g => g.ids.length > 0);

  return (
    <>
      <div className="ap-wiz-q">Products & Services</div>
      <div className="ap-wiz-sub">Select eligible products and resources to monitor.</div>

      <div className="ap-fld-lbl" style={{ marginTop:0 }}>Products</div>
      <div className="ap-wiz-chips" style={{ marginBottom:12 }}>
        {eligible.map(p => (
          <button key={p} className={`ap-wiz-chip${draft.products.includes(p) ? " active":""}`}
            onClick={() => toggleProd(p)}>{p}</button>
        ))}
      </div>

      <div className="ap-search-box">
        <Search size={14}/>
        <input value={resSearch} onChange={e => setResSearch(e.target.value)} placeholder="Search resources…"/>
      </div>

      {groups.length === 0 ? (
        <div className="ap-empty" style={{ padding:"18px 0", border:"1px dashed #E6EDF1", borderRadius:10 }}>
          Select at least one product above.
        </div>
      ) : groups.map(({ p, ids }) => {
        const allOn = ids.every(id => draft.resources.includes(id));
        return (
          <div key={p}>
            <div className="ap-grp-head">
              <span className="ap-grp-t">
                <span className={`ap-prod-tag ap-prod-${p.toLowerCase()}`}>{p}</span>
                {ids.length} resources
              </span>
              <button className="ap-btn ap-btn-ghost" onClick={() => selectAll(p)}>
                {allOn ? "Clear" : "Select all"}
              </button>
            </div>
            {ids.map(id => (
              <div key={id} className={`ap-check-row${draft.resources.includes(id) ? " active":""}`}
                onClick={() => toggleRes(id)}>
                <div className="ap-cbox">
                  {draft.resources.includes(id) && <Check size={11}/>}
                </div>
                <div>
                  <div className="ap-check-n">{id}</div>
                  <div className="ap-check-s">{p}</div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {draft.resources.length > 0 && (
        <div className="ap-preview">
          <b>{draft.resources.length} resources</b> selected across{" "}
          {[...new Set(draft.resources.map(productOf))].join(" + ")}.
        </div>
      )}
    </>
  );
}

/* Step 4: Action */
function WizStep4({ draft, onDraft, emailInput, emailMsg, onEmailInput, onAddEmail, onEmailMsg }: {
  draft: Rule; onDraft: (fn:(d:Rule)=>Rule)=>void;
  emailInput: string; emailMsg: {text:string;type:"ok"|"warn"|"err"}|null;
  onEmailInput: (v:string)=>void; onAddEmail: ()=>void;
  onEmailMsg: (m:{text:string;type:"ok"|"warn"|"err"}|null)=>void;
}) {
  const suggestName = () => `${METRICS[draft.metric].label} Policy`;

  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  return (
    <>
      <div className="ap-wiz-q">Action & Setup</div>
      <div className="ap-wiz-sub">Scope, naming, and who to notify on breach.</div>

      <input
        className="ap-name-inp"
        value={draft.title}
        placeholder={suggestName()}
        onChange={e => onDraft(d => ({ ...d, title: e.target.value }))}
      />

      <div className="ap-form-row">
        <div className="ap-form-fld">
          <div className="ap-fld-lbl" style={{ marginTop:0 }}>Scope</div>
          <div className="ap-wiz-chips">
            {(["Global","Private"] as RuleScope[]).map(s => (
              <button key={s} className={`ap-wiz-chip${draft.scope === s ? " active":""}`}
                onClick={() => onDraft(d => ({ ...d, scope: s }))}>{s}</button>
            ))}
          </div>
        </div>
        <div className="ap-form-fld">
          <div className="ap-fld-lbl" style={{ marginTop:0 }}>Email Format</div>
          <select className="ap-wiz-sel" value={draft.emailFormat}
            onChange={e => onDraft(d => ({ ...d, emailFormat: e.target.value as Rule["emailFormat"] }))}>
            {REPORT_FMT.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="ap-fld-lbl">Notify via</div>
      <div className="ap-wiz-chips">
        {["In-app","Email"].map(ch => (
          <button key={ch} className={`ap-wiz-chip${draft.channels.includes(ch) ? " active":""}`}
            onClick={() => onDraft(d => ({ ...d, channels: toggleArr(d.channels, ch) }))}>
            {ch === "Email" ? <Mail size={12}/> : <Bell size={12}/>} {ch}
          </button>
        ))}
      </div>

      <div className="ap-fld-lbl">Notification Frequency</div>
      <div className="ap-wiz-chips">
        {FREQUENCIES.map(f => (
          <button key={f} className={`ap-wiz-chip${draft.notifyFreq === f ? " active":""}`}
            style={{ fontSize:12 }}
            onClick={() => onDraft(d => ({ ...d, notifyFreq: f }))}>
            {f}
          </button>
        ))}
      </div>

      <div className="ap-fld-lbl">Standard Recipients</div>
      <div className="ap-wiz-chips">
        {WHO_OPTIONS.map(w => (
          <button key={w} className={`ap-wiz-chip${draft.who.includes(w) ? " active":""}`}
            onClick={() => onDraft(d => ({ ...d, who: toggleArr(d.who, w) }))}>
            {w}
          </button>
        ))}
      </div>

      <div className="ap-fld-lbl">Custom Email Recipients <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#90A2AC" }}>(@lightstorm.in only)</span></div>
      <div className="ap-email-row">
        <input
          className="ap-wiz-inp" style={{ flex:1, padding:"10px 13px" }}
          value={emailInput}
          placeholder="name@lightstorm.in"
          onChange={e => onEmailInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onAddEmail()}
        />
        <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={onAddEmail}>Add</button>
      </div>
      {emailMsg && (
        <div className={`ap-email-note ${emailMsg.type}`}>{emailMsg.text}</div>
      )}
      <div className="ap-recip-chips">
        {draft.customRecipients.map(r => (
          <span key={r.email} className="ap-recip-chip">
            {r.email}
            <small className={r.registered ? "reg" : "pending"}>
              {r.registered ? "Portal user" : "Pending invite"}
            </small>
            <button
              style={{ background:"none", border:"none", cursor:"pointer", color:"#90A2AC", padding:0, lineHeight:1 }}
              onClick={() => onDraft(d => ({ ...d, customRecipients: d.customRecipients.filter(x => x.email !== r.email) }))}
            ><X size={11}/></button>
          </span>
        ))}
      </div>

      <div className="ap-preview">
        <b>{draft.title || suggestName()}</b> ({draft.scope}) covers{" "}
        <b>{draft.resources.length} resources</b> and notifies{" "}
        <b>{recipientSummary(draft)}</b> via {draft.channels.join(", ")}.
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE FORM MODAL
═══════════════════════════════════════════════════════════════════ */

function ScheduleFormModal({ draft, onChange, onClose, onSave }: {
  draft: Partial<Schedule>;
  onChange: (d: Partial<Schedule>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function u<K extends keyof Schedule>(key: K, val: Schedule[K]) {
    onChange({ ...draft, [key]: val });
  }

  return (
    <div className="ap-modal sm">
      <div className="ap-modal-head">
        <div>
          <div className="ap-modal-title">Add Report Schedule</div>
          <div className="ap-modal-sub">Set up automated report delivery.</div>
        </div>
        <button className="ap-icon-btn" onClick={onClose}><X size={17}/></button>
      </div>
      <div className="ap-modal-body" style={{ maxHeight:"none" }}>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:10 }}>
          <div style={{ flex:1, minWidth:110 }}>
            <div className="ap-fld-lbl" style={{ marginTop:6 }}>Frequency</div>
            <select className="ap-wiz-sel" style={{ width:"100%" }}
              value={draft.freq ?? "Weekly"}
              onChange={e => u("freq", e.target.value as Schedule["freq"])}>
              {REPORT_FREQ.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          {draft.freq === "Weekly" && (
            <div style={{ flex:1, minWidth:120 }}>
              <div className="ap-fld-lbl" style={{ marginTop:6 }}>Day</div>
              <select className="ap-wiz-sel" style={{ width:"100%" }}
                value={draft.day ?? "Monday"}
                onChange={e => u("day", e.target.value)}>
                {REPORT_DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}
          <div style={{ flex:1, minWidth:100 }}>
            <div className="ap-fld-lbl" style={{ marginTop:6 }}>Time</div>
            <input className="ap-wiz-inp" type="time" style={{ width:"100%" }}
              value={draft.time ?? "09:00"}
              onChange={e => u("time", e.target.value)}/>
          </div>
          <div style={{ flex:1, minWidth:90 }}>
            <div className="ap-fld-lbl" style={{ marginTop:6 }}>Format</div>
            <select className="ap-wiz-sel" style={{ width:"100%" }}
              value={draft.format ?? "Excel"}
              onChange={e => u("format", e.target.value as Schedule["format"])}>
              {REPORT_FMT.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="ap-fld-lbl">Share with</div>
        <div className="ap-wiz-chips">
          {SHARE_TO.map(w => {
            const sel = (draft.recipients ?? []).includes(w);
            return (
              <button key={w} className={`ap-wiz-chip${sel ? " active":""}`}
                onClick={() => {
                  const next = sel
                    ? (draft.recipients ?? []).filter(x => x !== w)
                    : [...(draft.recipients ?? []), w];
                  u("recipients", next);
                }}>{w}</button>
            );
          })}
        </div>
      </div>
      <div className="ap-modal-foot">
        <button className="ap-btn ap-btn-secondary ap-btn-sm" onClick={onClose}>Cancel</button>
        <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={onSave}>
          <CalendarDays size={13}/>Add schedule
        </button>
      </div>
    </div>
  );
}
