import { useState, useMemo, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { motion } from "motion/react";
import { prefersReducedMotion } from "./animations/motionConfig";
import { usePageTools } from "./ArticlePage";
import { CopyPageMenu } from "./CopyPageMenu";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Interfaces ────────────────────────────────────────────────────────────────

interface DC {
  id: number;
  org: string;
  color: string;
  name: string;
  shortCode: string;
  city: string;
  state: string;
  country: string;
  portProducts: string[];
  waveProducts: string[];
  vcProducts: string[];
}

// ── Org → color ───────────────────────────────────────────────────────────────

const ORG_COLORS: Record<string, string> = {
  CtrlS: "#1976d2", ESDS: "#7c3aed", NTT: "#009ddc", Nxtra: "#ff6b00",
  Sify: "#6a3091", STT: "#00a1c9", "WF DC": "#d97706", ACT: "#556270",
  Adani: "#1e40af", ICICI: "#9b2335", Equinix: "#e8501f", Yotta: "#7c2d12",
  "Iron Mountain": "#b0192c", IBM: "#006699", "Gift City": "#0d9488",
  LTV: "#64748b", NextDC: "#0c2340", "Global Switch": "#1e3a5f",
  Interxion: "#dc2626", "AT Tokyo": "#c00000", CoreSite: "#059669", GNC: "#374151",
};

function getOrg(name: string): string {
  const n = name.trim();
  if (/^ctrls/i.test(n))          return "CtrlS";
  if (/^ntt/i.test(n))            return "NTT";
  if (/^nxtra/i.test(n))          return "Nxtra";
  if (/^sify/i.test(n))           return "Sify";
  if (/^stt/i.test(n))            return "STT";
  if (/^equinix/i.test(n))        return "Equinix";
  if (/^yotta/i.test(n))          return "Yotta";
  if (/^iron mountain/i.test(n))  return "Iron Mountain";
  if (/^ibm/i.test(n))            return "IBM";
  if (/^esds/i.test(n))           return "ESDS";
  if (/^act /i.test(n))           return "ACT";
  if (/^adani/i.test(n))          return "Adani";
  if (/^icici/i.test(n))          return "ICICI";
  if (/^nextdc/i.test(n))         return "NextDC";
  if (/^global switch/i.test(n))  return "Global Switch";
  if (/^interxion/i.test(n))      return "Interxion";
  if (/^tokyo cc/i.test(n))       return "AT Tokyo";
  if (/^coresite/i.test(n))       return "CoreSite";
  if (/^gnc/i.test(n))            return "GNC";
  if (/^wf /i.test(n))            return "WF DC";
  if (/^gift city/i.test(n))      return "Gift City";
  if (/^ltv/i.test(n))            return "LTV";
  return n.split(/\s+/)[0];
}

function parsePort(raw: string): string[] {
  if (!raw || raw.toLowerCase().trim() === "none") return [];
  return [...new Set(raw.split(",").map(s => {
    const t = s.trim().toLowerCase();
    if (/^100/.test(t)) return "100GE";
    if (/^10/.test(t))  return "10GE";
    if (/^1/.test(t))   return "1GE";
    return s.trim();
  }))];
}

function parseWave(raw: string): string[] {
  if (!raw || raw.toLowerCase().trim() === "none") return [];
  return [...new Set(raw.split(",").map(s => s.trim()).filter(Boolean))];
}

function parseVC(raw: string): string[] {
  if (!raw || raw.toLowerCase().trim() === "none") return [];
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

// ── Raw data (from CSV) ───────────────────────────────────────────────────────
// [name, shortCode, city, state, country, portRaw, waveRaw, vcRaw]
type R = [string, string, string, string, string, string, string, string];

const RAW: R[] = [
  // Bangalore
  ["CtrlS Bengaluru DC1",              "CTRLEC",     "Bangalore",        "Karnataka",    "India",     "None",                                  "10GB",        "None"],
  ["ESDS DC1",                         "EDC1",       "Bangalore",        "Karnataka",    "India",     "None",                                  "10GB",        "None"],
  ["NTT Bengaluru DC2",                "EDC3",       "Bangalore",        "Karnataka",    "India",     "None",                                  "10GB",        "None"],
  ["NTT Bengaluru DC3",                "WDC2",       "Bangalore",        "Karnataka",    "India",     "1 GE - port, 10 GE - port, 100 GE - port", "100GB, 10GB", "1 GBPS, 100 MBPS, 1000 MBPS, 10000 MBPS, 1500 MBPS, 20 MBPS, 200 MBPS, 2500 MBPS, 3000 MBPS, 4000 MBPS, 50 MBPS, 500 MBPS, 5000 MBPS"],
  ["Nxtra Bengaluru I",                "NDC1",       "Bangalore",        "Karnataka",    "India",     "None",                                  "100GB, 10GB", "None"],
  ["Sify Electronic City Bangalore",   "SNEW",       "Bangalore",        "Karnataka",    "India",     "None",                                  "10GB",        "None"],
  ["STT Bengaluru DC3",                "SDC3",       "Bangalore",        "Karnataka",    "India",     "None",                                  "100GB, 10GB", "None"],
  ["WF DC3",                           "WDC3",       "Bangalore",        "Karnataka",    "India",     "None",                                  "100GB, 10GB", "None"],
  // Delhi
  ["STT Delhi DC1",                    "VSB2",       "Central Delhi",    "Delhi",        "India",     "None",                                  "10GB",        "None"],
  ["STT Delhi DC2",                    "GKD1",       "South Delhi",      "Delhi",        "India",     "None",                                  "100GB, 10GB", "None"],
  ["STT Delhi DC3",                    "GKD2",       "South Delhi",      "Delhi",        "India",     "None",                                  "100GB, 10GB", "None"],
  // Chennai
  ["ACT KLR",                          "KLR",        "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["Adani DC Chennai",                 "ADNI",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["CtrlS Ambattur",                   "CtrlS Amba", "Chennai",          "Tamil Nadu",   "India",     "None",                                  "None",        "None"],
  ["NTT Ambattur",                     "CNN2",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["NTT Chennai DC1",                  "NTDC",       "Chennai",          "Tamil Nadu",   "India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "10000 MBPS, 2000 MBPS, 300 MBPS, 4000 MBPS, 500 MBPS, 5000 MBPS"],
  ["NTT Ambattur DC3",                 "CNN3",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["Nxtra Chennai 1",                  "NXCH",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "100GB, 10GB", "None"],
  ["Nxtra Chennai III",                "NXST",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["Nxtra Siruseri 2",                 "NWDC",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "100GB, 10GB", "None"],
  ["Sify Chennai",                     "SFCH",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "10GB",        "None"],
  ["STT Chennai DC1",                  "STD2",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "100GB, 10GB", "None"],
  ["STT Chennai DC2",                  "STD1",       "Chennai",          "Tamil Nadu",   "India",     "None",                                  "100GB, 10GB", "None"],
  // Hyderabad
  ["CtrlS Hyderabad DC1",              "CTD1",       "Hyderabad",        "Telangana",    "India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "1 GBPS, 100 MBPS, 1000 MBPS, 200 MBPS, 2600 MBPS, 500 MBPS, 700 MBPS, 8000 MBPS"],
  ["CtrlS Hyderabad DC2",              "CTDFD",      "Hyderabad",        "Telangana",    "India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "100 MBPS, 1000 MBPS, 1500 MBPS, 5 GBPS, 500 MBPS, 5000 MBPS"],
  ["ICICI Securities Hyderabad",       "ICICI_HYD",  "Hyderabad",        "Telangana",    "India",     "1 GE - port, 10 GE - port, 100 GE - port", "None",     "1000 MBPS, 10000 MBPS, 2000 MBPS, 3000 MBPS, 30000 MBPS, 4000 MBPS, 50 MBPS, 5000 MBPS, 8000 MBPS"],
  ["Sify Hyderabad",                   "SFHD",       "Hyderabad",        "Telangana",    "India",     "1 GE - port, 10 GE - port, 100 GE - PORT", "100GB, 10GB", "1000 MBPS, 10000 MBPS, 20 MBPS, 2000 MBPS, 50 MBPS, 500 MBPS, 5000 MBPS"],
  ["STT Hyderabad DC1",                "STDC",       "Hyderabad",        "Telangana",    "India",     "None",                                  "100GB, 10GB", "None"],
  // Kolkata
  ["Sify Kolkata",                     "SFKO",       "Kolkata",          "West Bengal",  "India",     "10 GE - port",                          "100GB",       "1500 MBPS"],
  ["STT Ultadanga",                    "OTHD",       "Kolkata",          "West Bengal",  "India",     "None",                                  "100GB",       "None"],
  ["Bongaon",                          "N24P",       "North 24 Parganas","West Bengal",  "India",     "None",                                  "100GB",       "None"],
  // Mumbai
  ["Equinix MB1",                      "MB1",        "Mumbai",           "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["Equinix MB2",                      "MB2",        "Mumbai",           "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["NTT Mumbai DC2",                   "NDC2",       "Mumbai",           "Maharashtra",  "India",     "1 GE - port, 10 GE - PORT, 100 GE - port", "100GB, 10GB", "100 MBPS, 1000 MBPS, 10000 MBPS, 20 MBPS, 200 MBPS, 250 MBPS, 2500 MBPS, 3000 MBPS, 4000 MBPS, 50 MBPS, 5000 MBPS"],
  ["NTT Mumbai DC6",                   "NTD6",       "Mumbai",           "Maharashtra",  "India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "1 GBPS, 100 MBPS, 1000 MBPS, 10000 MBPS, 200 MBPS, 4000 MBPS, 500 MBPS, 5000 MBPS"],
  ["NTT Mumbai DC7",                   "NMDC9",      "Mumbai",           "Maharashtra",  "India",     "None",                                  "None",        "None"],
  ["NTT Mumbai DC9",                   "NTD9",       "Mumbai",           "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  ["Nxtra Chandivali Mumbai",          "NXTA",       "Mumbai",           "Maharashtra",  "India",     "None",                                  "100GB",       "None"],
  ["STT Mumbai DC1",                   "LVSB",       "Mumbai",           "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["STT Mumbai DC3",                   "SBKC",       "Mumbai",           "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  // Navi Mumbai
  ["CtrlS Mumbai DC1",                 "CTRLMHP1",   "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["Equinix MB-4",                     "GPX4",       "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  ["ESDS Mahape",                      "ESMHPE",     "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["IBM Cloud DC Navi Mumbai",         "IRTP",       "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  ["Iron Mountain Mumbai (MUM-1)",     "WRBL1",      "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  ["NTT DC8",                          "NTD8",       "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  ["NTT Mahape",                       "NV1A",       "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["Sify Airoli",                      "SARL",       "Navi Mumbai",      "Maharashtra",  "India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "1 GBPS, 10 GBPS, 1000 MBPS, 10000 MBPS, 2000 MBPS, 4000 MBPS, 500 MBPS, 5000 MBPS"],
  ["Sify Rabale Mumbai",               "SRBL1",      "Navi Mumbai",      "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  // Noida
  ["CtrlS Noida DC1",                  "CTRL",       "Noida",            "Uttar Pradesh","India",     "10 GE - port",                          "10GB",        "10 GBPS, 1000 MBPS, 10000 MBPS, 1500 MBPS, 200 MBPS, 5000 MBPS"],
  ["Gift City MMR",                    "GIFMMR",     "Noida",            "Uttar Pradesh","India",     "None",                                  "10GB",        "None"],
  ["LTV POP Noida",                    "NPOP",       "Noida",            "Uttar Pradesh","India",     "None",                                  "100GB, 10GB", "None"],
  ["NTT DC2 Noida",                    "NTGN",       "Noida",            "Uttar Pradesh","India",     "None",                                  "100GB, 10GB", "None"],
  ["NTT Noida DC1",                    "NMAG",       "Noida",            "Uttar Pradesh","India",     "1 GE - port, 10 GE - port",             "100GB, 10GB", "100 MBPS, 1000 MBPS, 50 MBPS"],
  ["Nxtra Noida 1",                    "NXNO",       "Noida",            "Uttar Pradesh","India",     "1 GE - port",                           "10GB",        "None"],
  ["Sify Noida",                       "SFNO",       "Noida",            "Uttar Pradesh","India",     "1 GE - port, 10 GE - port, 100 GE - port", "100GB, 10GB", "1 GBPS, 10 MBPS, 100 MBPS, 1000 MBPS, 10000 MBPS, 200 MBPS, 2000 MBPS, 4000 MBPS, 50 MBPS, 500 MBPS"],
  ["Yotta D1",                         "YGNO",       "Noida",            "Uttar Pradesh","India",     "1 GE - port, 10 GE - port, 100 GE - port", "100GB, 10GB", "1 GBPS, 100000 MBPS, 25 GBPS, 3000 MBPS, 5000 MBPS"],
  // Panvel
  ["Yotta NM1",                        "YPNVL",      "Panvel",           "Maharashtra",  "India",     "1 GE - port, 10 GE - PORT, 100 GE - PORT", "10GB",      "1 GBPS, 100 MBPS, 1000 MBPS, 10000 MBPS, 100000 MBPS, 200 MBPS, 2000 MBPS, 300 MBPS, 3000 MBPS, 4000 MBPS, 50 MBPS, 500 MBPS, 5000 MBPS"],
  // Pune
  ["Iron Mountain Data Centers PUN-2", "WHJD",       "Pune",             "Maharashtra",  "India",     "None",                                  "None",        "None"],
  ["Nxtra Pune I",                     "NXKR",       "Pune",             "Maharashtra",  "India",     "None",                                  "100GB, 10GB", "None"],
  ["Nxtra Pune II",                    "NXHJ",       "Pune",             "Maharashtra",  "India",     "None",                                  "100GB",       "None"],
  ["STT Pune DC1",                     "DIGI",       "Pune",             "Maharashtra",  "India",     "None",                                  "10GB",        "None"],
  // Australia
  ["NextDC B1",                        "BBNE01",     "Brisbane",         "Queensland",   "Australia", "None",                                  "None",        "None"],
  ["NextDC B2",                        "BBNE02",     "Brisbane",         "Queensland",   "Australia", "None",                                  "None",        "None"],
  ["NextDC SC1",                       "SCNE01",     "Maroochydore",     "Queensland",   "Australia", "None",                                  "None",        "None"],
  ["Equinix SY1",                      "SYEQ01",     "Sydney",           "NSW",          "Australia", "None",                                  "None",        "None"],
  ["Equinix SY2",                      "SYEQ02",     "Sydney",           "NSW",          "Australia", "None",                                  "None",        "None"],
  ["Equinix SY3",                      "SYEQ03",     "Sydney",           "NSW",          "Australia", "None",                                  "None",        "None"],
  ["Equinix SY4",                      "SYEQ04",     "Sydney",           "NSW",          "Australia", "None",                                  "10GB",        "None"],
  ["Equinix SY5",                      "SYEQ05",     "Sydney",           "NSW",          "Australia", "None",                                  "10GB",        "None"],
  ["Equinix SY6",                      "SYEQ06",     "Sydney",           "NSW",          "Australia", "None",                                  "None",        "None"],
  ["Global Switch Sydney",             "SYGSSY",     "Sydney",           "NSW",          "Australia", "None",                                  "None",        "None"],
  // France
  ["Interxion MRS1",                   "MRIX01",     "Marseille",        "Marseille",    "France",    "None",                                  "10GB",        "None"],
  // Japan
  ["Equinix TY1",                      "TYEQ01",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY2",                      "TYEQ02",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "10GB",        "None"],
  ["Equinix TY3",                      "TYEQ03",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY5",                      "TYEQ05",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY6",                      "TYEQ06",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY7",                      "TYEQ07",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY8",                      "TYEQ08",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY9",                      "TYEQ09",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Equinix TY10",                     "TYEQ10",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  ["Tokyo CC1",                        "TYAT01",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "10GB",        "None"],
  ["Tokyo CC2",                        "TYAT02",     "Tokyo",            "Tokyo",        "Japan",     "None",                                  "None",        "None"],
  // Singapore
  ["Equinix SG1",                      "SGEQ01",     "Singapore",        "Singapore",    "Singapore", "1 GE - PORT, 10 GE - port",             "10GB",        "10 GBPS, 1000 MBPS, 5000 MBPS"],
  ["Equinix SG2",                      "SGEQ02",     "Singapore",        "Singapore",    "Singapore", "None",                                  "None",        "None"],
  ["Equinix SG3",                      "SGEQ03",     "Singapore",        "Singapore",    "Singapore", "None",                                  "None",        "None"],
  ["Equinix SG4",                      "SGEQ04",     "Singapore",        "Singapore",    "Singapore", "None",                                  "None",        "None"],
  ["Equinix SG5",                      "SGEQ05",     "Singapore",        "Singapore",    "Singapore", "None",                                  "None",        "None"],
  ["Global Switch Singapore",          "SGGSSG",     "Singapore",        "Singapore",    "Singapore", "None",                                  "None",        "None"],
  // USA
  ["GNC Data Centre",                  "GNGNC1",     "Guam",             "Guam",         "USA",       "None",                                  "10GB",        "None"],
  ["CoreSite LA1",                     "LACO01",     "Los Angeles",      "California",   "USA",       "None",                                  "None",        "None"],
  ["CoreSite LA2",                     "LACO02",     "Los Angeles",      "California",   "USA",       "None",                                  "10GB",        "None"],
];

const DATA: DC[] = RAW.map((row, i) => {
  const [name, shortCode, city, state, country, portRaw, waveRaw, vcRaw] = row;
  const org = getOrg(name);
  return { id: i + 1, org, color: ORG_COLORS[org] ?? "#64748b", name, shortCode, city, state, country, portProducts: parsePort(portRaw), waveProducts: parseWave(waveRaw), vcProducts: parseVC(vcRaw) };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(org: string) {
  const w = org.trim().split(/\s+/);
  return w.length === 1 ? org.slice(0, 2).toUpperCase() : (w[0][0] + w[1][0]).toUpperCase();
}

// ── Product cell chips ────────────────────────────────────────────────────────

function ProductCell({ values, color, maxShow = 3 }: { values: string[]; color: string; maxShow?: number }) {
  if (values.length === 0) return <span style={{ fontFamily: FONT, fontSize: 12, color: "#d1d5db" }}>—</span>;
  const shown = values.slice(0, maxShow);
  const rest = values.length - maxShow;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {shown.map((v, i) => (
        <span key={i} style={{ fontSize: 11, fontWeight: 700, background: `${color}14`, color, border: `1px solid ${color}28`, padding: "3px 9px", borderRadius: 20, fontFamily: FONT, whiteSpace: "nowrap" }}>{v}</span>
      ))}
      {rest > 0 && (
        <span style={{ fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f1", padding: "3px 9px", borderRadius: 20, fontFamily: FONT }}>+{rest}</span>
      )}
    </div>
  );
}

// ── Inline 6-col skeleton ─────────────────────────────────────────────────────

function Skeleton6({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
          <td style={{ padding: "14px 8px 14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="pk-skeleton" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
              <div className="pk-skeleton" style={{ width: 56, height: 13, borderRadius: 6 }} />
            </div>
          </td>
          <td style={{ padding: "14px 8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div className="pk-skeleton" style={{ width: "80%", height: 13, borderRadius: 6 }} />
              <div className="pk-skeleton" style={{ width: "40%", height: 11, borderRadius: 6 }} />
            </div>
          </td>
          <td style={{ padding: "14px 8px" }}>
            <div className="pk-skeleton" style={{ width: "70%", height: 13, borderRadius: 6 }} />
          </td>
          <td style={{ padding: "14px 8px" }}>
            <div style={{ display: "flex", gap: 4 }}>
              <div className="pk-skeleton" style={{ width: 38, height: 22, borderRadius: 20 }} />
              <div className="pk-skeleton" style={{ width: 38, height: 22, borderRadius: 20 }} />
            </div>
          </td>
          <td style={{ padding: "14px 8px" }}>
            <div className="pk-skeleton" style={{ width: 44, height: 22, borderRadius: 20 }} />
          </td>
          <td style={{ padding: "14px 8px" }}>
            <div style={{ display: "flex", gap: 4 }}>
              <div className="pk-skeleton" style={{ width: 64, height: 22, borderRadius: 20 }} />
              <div className="pk-skeleton" style={{ width: 44, height: 22, borderRadius: 20 }} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ── Filter dropdown ───────────────────────────────────────────────────────────

function FilterDropdown({ options, selected, onToggle, onClear, label }: {
  options: string[]; selected: Set<string>; onToggle: (v: string) => void; onClear: () => void; label: string;
}) {
  const [open, setOpen] = useState(false);
  const [srch, setSrch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = options.filter(o => o.toLowerCase().includes(srch.toLowerCase()));
  const active = selected.size > 0;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button onClick={() => setOpen(v => !v)} title={`Filter by ${label}`}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 22, background: "none", border: "none", cursor: "pointer", padding: 0, borderRadius: 4, position: "relative", opacity: active ? 1 : 0.5 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M0.5 1.5h9M2 5h6M3.5 8.5h3" stroke={active ? "#1c808d" : "#7e93b2"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {active && <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: "#1c808d" }} />}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200, background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12, boxShadow: "0px 4px 16px rgba(96,97,112,0.16)", width: 220, overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "6px 10px" }}>
              <Search size={14} color="#90a2b9" />
              <input autoFocus placeholder={`Search ${label}...`} value={srch} onChange={e => setSrch(e.target.value)}
                style={{ border: "none", background: "none", outline: "none", fontFamily: FONT, fontSize: 13, color: "#0a3954", width: "100%" }} />
            </div>
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.map(o => (
              <button key={o} onClick={() => onToggle(o)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: "#0a3954", textAlign: "left", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected.has(o) ? "#1c808d" : "#e2e8f1"}`, background: selected.has(o) ? "#1c808d" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.has(o) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o}</span>
              </button>
            ))}
          </div>
          {active && (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px 12px" }}>
              <button onClick={() => { onClear(); setOpen(false); }} style={{ fontFamily: FONT, fontSize: 12, color: "#e7000b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Clear filter</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Product filter (Has Port / Wave / VC) ─────────────────────────────────────

function ProductFilter({ selected, onToggle, onClear }: {
  selected: Set<string>; onToggle: (v: string) => void; onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const OPTS = ["L2/L3 Port", "DCI Wave", "Virtual Connection"];
  const active = selected.size > 0;
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: `1.5px solid ${active ? "#1c808d" : "#e2e8f1"}`, borderRadius: 10, background: active ? "#effcfd" : "#fff", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: active ? "#1c808d" : "#64748b", cursor: "pointer", whiteSpace: "nowrap" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M4 7h6M4 5h6M4 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        Products {active ? `(${selected.size})` : ""}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200, background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12, boxShadow: "0px 4px 16px rgba(96,97,112,0.16)", width: 210, overflow: "hidden" }}>
          <div style={{ padding: "8px 12px 4px", fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Filter by product</div>
          {OPTS.map((o, i) => {
            const def = PROD_DEFS[i];
            return (
              <button key={o} onClick={() => onToggle(o)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: "#0a3954", textAlign: "left" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                <span style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected.has(o) ? def.color : "#e2e8f1"}`, background: selected.has(o) ? def.color : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.has(o) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span>{o}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, background: `${def.color}15`, color: def.color, border: `1px solid ${def.color}25`, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>
                  {o === "L2/L3 Port" ? DATA.filter(d => d.portProducts.length > 0).length :
                   o === "DCI Wave"   ? DATA.filter(d => d.waveProducts.length > 0).length :
                                        DATA.filter(d => d.vcProducts.length > 0).length}
                </span>
              </button>
            );
          })}
          {active && (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px 12px" }}>
              <button onClick={() => { onClear(); setOpen(false); }} style={{ fontFamily: FONT, fontSize: 12, color: "#e7000b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Clear filter</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared table-header style ─────────────────────────────────────────────────

const TH_STYLE: CSSProperties = {
  background: "#f8fafc",
  padding: "12px 8px 12px 8px",
  textAlign: "left",
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 12,
  color: "#7e93b2",
  borderBottom: "1px solid #e2e8f1",
  whiteSpace: "nowrap",
};

// ── Main ──────────────────────────────────────────────────────────────────────

const PAGE_SIZES = [10, 20, 50];

export function LocationsPage() {
  const tools = usePageTools();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orgFilter, setOrgFilter] = useState<Set<string>>(new Set());
  const [countryFilter, setCountryFilter] = useState<Set<string>>(new Set());
  const [productFilter, setProductFilter] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const psRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val !== debouncedSearch) {
      setIsSearching(true);
      debounceRef.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); setIsSearching(false); }, 200);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (psRef.current && !psRef.current.contains(e.target as Node)) setPageSizeOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const allOrgs = useMemo(() => [...new Set(DATA.map(d => d.org))].sort(), []);
  const allCountries = useMemo(() => [...new Set(DATA.map(d => d.country))].sort(), []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return DATA.filter(d => {
      const matchSearch = !q || [d.name, d.org, d.city, d.country, d.shortCode, d.state].some(v => v.toLowerCase().includes(q));
      const matchOrg = orgFilter.size === 0 || orgFilter.has(d.org);
      const matchCountry = countryFilter.size === 0 || countryFilter.has(d.country);
      const matchProduct =
        productFilter.size === 0 ||
        ([...productFilter].every(p =>
          (p === "L2/L3 Port"        && d.portProducts.length > 0) ||
          (p === "DCI Wave"          && d.waveProducts.length > 0) ||
          (p === "Virtual Connection"&& d.vcProducts.length > 0)
        ));
      return matchSearch && matchOrg && matchCountry && matchProduct;
    });
  }, [debouncedSearch, orgFilter, countryFilter, productFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const resetPage = () => setPage(1);
  const toggleOrg = (v: string) => { setOrgFilter(p => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; }); resetPage(); };
  const toggleCountry = (v: string) => { setCountryFilter(p => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; }); resetPage(); };
  const toggleProduct = (v: string) => { setProductFilter(p => { const s = new Set(p); s.has(v) ? s.delete(v) : s.add(v); return s; }); resetPage(); };
  const activeFilterCount = orgFilter.size + countryFilter.size + productFilter.size;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "#effcfd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
            <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>Data Center Locations</h1>
            {tools && <CopyPageMenu contentRef={tools.contentRef} pageTitle={tools.pageTitle} pageId={tools.pageId} />}
          </div>
          <p style={{ margin: "4px 0 0", fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "#7e93b2" }}>
            Browse Polarin's partner data centres. Click any row to see available port, wave and virtual connection products at that location.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total DCs",             value: DATA.length,                                          color: "#1c808d" },
          { label: "With L2/L3 Port",        value: DATA.filter(d => d.portProducts.length > 0).length,  color: "#1a65fd" },
          { label: "With DCI Wave",          value: DATA.filter(d => d.waveProducts.length > 0).length,  color: "#1c808d" },
          { label: "With Virtual Connection",value: DATA.filter(d => d.vcProducts.length > 0).length,    color: "#00a854" },
          { label: "Countries",              value: new Set(DATA.map(d => d.country)).size,               color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f1", borderRadius: 10, padding: "10px 18px", display: "flex", flexDirection: "column", gap: 2, minWidth: 120 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontFamily: FONT, fontSize: 12, color: "#94a3b8" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table container */}
      <div style={{ border: "1px solid #e2e8f1", borderRadius: 16, overflow: "hidden", background: "#fff" }}>

        {/* Search + filters */}
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 260, background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
            <input
              placeholder="Search by name, short code, city, country..."
              value={search} onChange={e => handleSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT, fontSize: 14, color: "#0a3954", background: "transparent", lineHeight: "24px" }}
            />
            {isSearching ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #1c808d", borderTopColor: "transparent", flexShrink: 0 }} />
            ) : search ? (
              <button onClick={() => handleSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}><X size={18} color="#90a2b9" /></button>
            ) : (
              <Search size={20} color="#90a2b9" style={{ flexShrink: 0 }} />
            )}
          </div>

          <ProductFilter selected={productFilter} onToggle={toggleProduct} onClear={() => { setProductFilter(new Set()); resetPage(); }} />

          {activeFilterCount > 0 && (
            <button onClick={() => { setOrgFilter(new Set()); setCountryFilter(new Set()); setProductFilter(new Set()); resetPage(); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 8, fontFamily: FONT, fontSize: 13, color: "#e7000b", cursor: "pointer" }}>
              <X size={14} /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}

          {filtered.length !== DATA.length && (
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", marginLeft: "auto" }}>
              Showing {filtered.length} of {DATA.length}
            </span>
          )}
        </div>

        {/* Table */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: 820 }}>
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={TH_STYLE}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Organization
                    <FilterDropdown options={allOrgs} selected={orgFilter} onToggle={toggleOrg} onClear={() => { setOrgFilter(new Set()); resetPage(); }} label="Organization" />
                  </div>
                </th>
                <th style={TH_STYLE}>DC Name</th>
                <th style={TH_STYLE}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Location
                    <FilterDropdown options={allCountries} selected={countryFilter} onToggle={toggleCountry} onClear={() => { setCountryFilter(new Set()); resetPage(); }} label="Country" />
                  </div>
                </th>
                <th style={{ ...TH_STYLE, color: "#1a65fd" }}>L2/L3 Port</th>
                <th style={{ ...TH_STYLE, color: "#1c808d" }}>DCI Wave</th>
                <th style={{ ...TH_STYLE, color: "#00a854" }}>Virtual Connection</th>
              </tr>
            </thead>
            <tbody>
              {isSearching ? (
                <Skeleton6 rows={pageSize > 10 ? 8 : pageSize} />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center", fontFamily: FONT, fontSize: 14, color: "#90a2b9" }}>
                    No data centers match your filters.
                  </td>
                </tr>
              ) : rows.map((dc, i) => (
                <motion.tr
                  key={dc.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, delay: prefersReducedMotion ? 0 : i * 0.02 }}
                  style={{ borderBottom: "1px solid #e2e8f1" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafbfc")}
                  onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  {/* Organization */}
                  <td style={{ padding: "12px 8px 12px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: dc.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10, color: "white" }}>{initials(dc.org)}</span>
                      </div>
                      <span style={{ fontFamily: FONT, fontSize: 13, color: "#324158", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dc.org}</span>
                    </div>
                  </td>
                  {/* DC Name + code */}
                  <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0a3954", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dc.name}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{dc.shortCode}</div>
                  </td>
                  {/* Location */}
                  <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                    <div style={{ fontFamily: FONT, fontSize: 13, color: "#324158" }}>{dc.city}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{dc.state !== dc.country ? `${dc.state}, ` : ""}{dc.country}</div>
                  </td>
                  {/* L2/L3 Port */}
                  <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                    <ProductCell values={dc.portProducts} color="#1a65fd" maxShow={3} />
                  </td>
                  {/* DCI Wave */}
                  <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                    <ProductCell values={dc.waveProducts} color="#1c808d" maxShow={2} />
                  </td>
                  {/* Virtual Connection */}
                  <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                    <ProductCell values={dc.vcProducts} color="#00a854" maxShow={4} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "14px 16px", gap: 12, borderTop: "1px solid #e2e8f1", flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", marginRight: 4, whiteSpace: "nowrap" }}>Total {filtered.length} items</span>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #bdc7d4", background: "#ecf1f8", cursor: safePage === 1 ? "not-allowed" : "pointer", opacity: safePage === 1 ? 0.5 : 1 }}>
            <ChevronLeft size={16} color="#374151" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p: number;
            if (totalPages <= 5) p = i + 1;
            else if (safePage <= 3) p = i + 1;
            else if (safePage >= totalPages - 2) p = totalPages - 4 + i;
            else p = safePage - 2 + i;
            return (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: "pointer", border: `1px solid ${p === safePage ? "#1c808d" : "#bdc7d4"}`, background: p === safePage ? "white" : "#ecf1f8", color: p === safePage ? "#1c808d" : "#374151" }}>
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #bdc7d4", background: "#ecf1f8", cursor: safePage === totalPages ? "not-allowed" : "pointer", opacity: safePage === totalPages ? 0.5 : 1 }}>
            <ChevronRight size={16} color="#374151" />
          </button>
          <div ref={psRef} style={{ position: "relative" }}>
            <button onClick={() => setPageSizeOpen(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", border: "1px solid #e2e8f1", borderRadius: 8, background: "white", fontFamily: FONT, fontSize: 14, color: "#0a3954", cursor: "pointer" }}>
              {pageSize} / page
              <ChevronDown size={18} color="#7e93b2" style={{ transform: pageSizeOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
            {pageSizeOpen && (
              <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, background: "white", border: "1px solid #e2e8f1", borderRadius: 10, boxShadow: "0px 4px 16px rgba(96,97,112,0.16)", overflow: "hidden", zIndex: 100 }}>
                {PAGE_SIZES.map(s => (
                  <button key={s} onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
                    style={{ display: "block", width: "100%", padding: "8px 16px", textAlign: "left", fontFamily: FONT, fontSize: 14, color: s === pageSize ? "#1c808d" : "#0a3954", fontWeight: s === pageSize ? 700 : 400, background: s === pageSize ? "#f0fdfa" : "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => { if (s !== pageSize) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                    onMouseLeave={e => { if (s !== pageSize) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}>
                    {s} / page
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
