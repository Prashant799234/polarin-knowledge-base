// Generates a static .md file per Knowledge Base page under public/md/.
// These files exist so external services (LLMs opened via "Open in ChatGPT"
// etc.) can read real page content with a plain fetch — the live app is a
// client-rendered SPA, so a plain fetch of it only sees an empty HTML shell.
//
// This script is intentionally fault-tolerant: a failure on any single page,
// or even a total failure of this script, must never break `vite build`.
// Worst case, some/all .md files are missing — the live site is unaffected.

import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { parse } from "node-html-parser";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/md");

const noop = () => {};

const PAGES = [
  { id: "about-polarin", file: "/src/app/components/knowledge-base/articles/AboutPolarinPage.tsx", exportName: "AboutPolarinPage", props: { onNavigate: noop } },
  { id: "services-offered", file: "/src/app/components/knowledge-base/articles/ServicesOfferedPage.tsx", exportName: "ServicesOfferedPage", props: { onNavigate: noop } },
  { id: "quick-setup", file: "/src/app/components/knowledge-base/articles/QuickSetupPage.tsx", exportName: "QuickSetupPage", props: { onNavigate: noop } },
  { id: "create-account", file: "/src/app/components/knowledge-base/articles/CreateAccountPage.tsx", exportName: "CreateAccountPage", props: {} },
  { id: "complete-profile", file: "/src/app/components/knowledge-base/articles/CompleteProfilePage.tsx", exportName: "CompleteProfilePage", props: {} },
  { id: "org-kyc", file: "/src/app/components/knowledge-base/articles/KYCDocumentsPage.tsx", exportName: "KYCDocumentsPage", props: {} },
  { id: "invite-members", file: "/src/app/components/knowledge-base/articles/InviteTeamPage.tsx", exportName: "InviteTeamPage", props: {} },
  { id: "port-overview", file: "/src/app/components/knowledge-base/articles/PortOverviewPage.tsx", exportName: "PortOverviewPage", props: { onNavigate: noop } },
  { id: "port-create", file: "/src/app/components/knowledge-base/articles/CreatePortPage.tsx", exportName: "CreatePortPage", props: {} },
  { id: "port-status", file: "/src/app/components/knowledge-base/articles/PortStatusPage.tsx", exportName: "PortStatusPage", props: {} },
  { id: "port-lag", file: "/src/app/components/knowledge-base/articles/CreateLAGPage.tsx", exportName: "CreateLAGPage", props: {} },
  { id: "vr-overview", file: "/src/app/components/knowledge-base/articles/VirtualRouterOverviewPage.tsx", exportName: "VirtualRouterOverviewPage", props: { onNavigate: noop } },
  { id: "vr-create", file: "/src/app/components/knowledge-base/articles/CreateVirtualRouterPage.tsx", exportName: "CreateVirtualRouterPage", props: {} },
  { id: "vr-status", file: "/src/app/components/knowledge-base/articles/VirtualRouterStatusPage.tsx", exportName: "VirtualRouterStatusPage", props: {} },
  { id: "vc-overview", file: "/src/app/components/knowledge-base/articles/VirtualConnectionOverviewPage.tsx", exportName: "VirtualConnectionOverviewPage", props: { onNavigate: noop } },
  { id: "cloud-connect", file: "/src/app/components/knowledge-base/articles/CloudConnectPage.tsx", exportName: "CloudConnectPage", props: { onNavigate: noop } },
  { id: "dci-overview", file: "/src/app/components/knowledge-base/articles/DCIOverviewPage.tsx", exportName: "DCIOverviewPage", props: { onNavigate: noop } },
  { id: "dci-create", file: "/src/app/components/knowledge-base/articles/DCICreatePage.tsx", exportName: "DCICreatePage", props: { onNavigate: noop } },
  { id: "ix-overview", file: "/src/app/components/knowledge-base/articles/InternetExchangeOverviewPage.tsx", exportName: "InternetExchangeOverviewPage", props: { onNavigate: noop } },
  { id: "ix-create", file: "/src/app/components/knowledge-base/articles/InternetExchangePage.tsx", exportName: "InternetExchangePage", props: { onNavigate: noop } },
  { id: "service-detail", file: "/src/app/components/knowledge-base/articles/ServiceDetailPage.tsx", exportName: "ServiceDetailPage", props: { onNavigate: noop } },
  { id: "service-status", file: "/src/app/components/knowledge-base/articles/ServiceStatusPage.tsx", exportName: "ServiceStatusPage", props: { onNavigate: noop } },
  { id: "vista-overview", file: "/src/app/components/knowledge-base/articles/VistaOverviewPage.tsx", exportName: "VistaOverviewPage", props: { onNavigate: noop } },
  { id: "dashboard-overview", file: "/src/app/components/knowledge-base/articles/DashboardOverviewPage.tsx", exportName: "DashboardOverviewPage", props: { onNavigate: noop } },
  { id: "notifications", file: "/src/app/components/knowledge-base/articles/NotificationsPage.tsx", exportName: "NotificationsPage", props: { onNavigate: noop } },
  { id: "activity-log-overview", file: "/src/app/components/knowledge-base/articles/ActivityLogOverviewPage.tsx", exportName: "ActivityLogOverviewPage", props: { onNavigate: noop } },
  { id: "activity-log-details", file: "/src/app/components/knowledge-base/articles/ActivityLogPage.tsx", exportName: "ActivityLogPage", props: { onNavigate: noop } },
  { id: "welcome", file: "/src/app/components/knowledge-base/WelcomePage.tsx", exportName: "WelcomePage", props: { onNavigate: noop } },
  { id: "locations", file: "/src/app/components/knowledge-base/LocationsPage.tsx", exportName: "LocationsPage", props: {} },
  { id: "release-notes", file: "/src/app/components/knowledge-base/ReleaseNotesPage.tsx", exportName: "ReleaseNotesPage", props: {} },
  { id: "ticket-overview", file: "/src/app/components/knowledge-base/articles/SupportOverviewPage.tsx", exportName: "SupportOverviewPage", props: { onNavigate: noop } },
  { id: "create-ticket", file: "/src/app/components/knowledge-base/articles/CreateTicketPage.tsx", exportName: "CreateTicketPage", props: { onNavigate: noop } },
  { id: "my-tickets", file: "/src/app/components/knowledge-base/articles/MyTicketsPage.tsx", exportName: "MyTicketsPage", props: { onNavigate: noop } },
  { id: "contact-support", file: "/src/app/components/knowledge-base/ContactSupportPage.tsx", exportName: "ContactSupportPage", props: {} },
  { id: "api-overview", file: "/src/app/components/knowledge-base/KnowledgeBase.tsx", exportName: "ApiOverviewPage", props: { onNavigate: noop } },
  { id: "api-onboarding", file: "/src/app/components/knowledge-base/KnowledgeBase.tsx", exportName: "ApiOnboardingPage", props: { onNavigate: noop } },
  { id: "api-pricing", file: "/src/app/components/knowledge-base/KnowledgeBase.tsx", exportName: "ApiPricingPage", props: { onNavigate: noop } },
];

// Same heuristic as src/app/components/knowledge-base/extractContent.ts,
// but reading inline style="..." attribute text instead of computed style
// (there's no browser here to compute it from).
function classifyTag(tagName, styleAttr) {
  const tag = tagName.toUpperCase();
  if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "LI") return tag;
  const sizeMatch = styleAttr?.match(/font-size:\s*([\d.]+)/);
  const weightMatch = styleAttr?.match(/font-weight:\s*([\d.]+)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
  const weight = weightMatch ? parseFloat(weightMatch[1]) : 400;
  if (size >= 20) return "H1";
  if (size >= 16 || (weight >= 700 && size >= 14)) return "H2";
  if (weight >= 700 && size >= 12) return "H3";
  return "P";
}

function cleanCell(text) {
  return text.replace(/\s+/g, " ").replace(/\|/g, "/").trim();
}

function tableToMarkdown(table) {
  const headerCells = table.querySelectorAll("thead th");
  const bodyRows = table.querySelectorAll("tbody tr");
  const headers = headerCells.map((th) => cleanCell(th.text));
  if (headers.length === 0) return "";

  const lines = [`| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`];
  bodyRows.forEach((tr) => {
    const cells = tr.querySelectorAll("td").map((td) => cleanCell(td.text));
    if (cells.length === 0) return;
    lines.push(`| ${cells.join(" | ")} |`);
  });
  return lines.length > 2 ? lines.join("\n") : "";
}

function extractClassifiedNodes(html, fallbackTitle) {
  const root = parse(html);
  const nodes = [];
  let hasH1 = false;

  root.querySelectorAll("h1, h2, h3, p, li, table").forEach((el) => {
    if (el.tagName?.toUpperCase() === "TABLE") {
      const md = tableToMarkdown(el);
      if (md) nodes.push({ tag: "TABLE", text: md });
      return;
    }
    const tag = classifyTag(el.tagName, el.getAttribute("style"));
    if (tag === "H1") hasH1 = true;
    const text = el.text.trim();
    if (text) nodes.push({ tag, text });
  });

  if (!hasH1) nodes.unshift({ tag: "H1", text: fallbackTitle });
  return nodes;
}

function nodesToMarkdown(nodes) {
  const lines = [];
  nodes.forEach(({ tag, text }) => {
    switch (tag) {
      case "H1": lines.push(`# ${text}`, ""); break;
      case "H2": lines.push(`## ${text}`, ""); break;
      case "H3": lines.push(`### ${text}`, ""); break;
      case "LI": lines.push(`- ${text}`); break;
      default: lines.push(text, "");
    }
  });
  return lines.join("\n").trim();
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// A markdown pipe-table's rows, back into cell arrays (skips the "| --- |"
// separator line). The TABLE node's `text` is that markdown, produced by
// tableToMarkdown() above.
function markdownTableToHtmlRows(md) {
  const lines = md.split("\n").filter(Boolean);
  const parseRow = (line) => line.slice(1, -1).split("|").map((c) => c.trim());
  if (lines.length < 2) return null;
  return { header: parseRow(lines[0]), rows: lines.slice(2).map(parseRow) };
}

// Plain, dependency-free HTML — some tools that "browse" a URL only accept
// HTML responses and refuse plain text/markdown outright, even with a
// text/plain Content-Type. This is the most universally readable format.
// Real semantic tags throughout (including a real <table>, not <pre>) since
// some readers skip <pre> content, treating it as a code block.
function nodesToHtml(nodes, pageTitle) {
  const body = [];
  let inList = false;
  nodes.forEach(({ tag, text }) => {
    if (tag === "TABLE") {
      if (inList) { body.push("</ul>"); inList = false; }
      const parsed = markdownTableToHtmlRows(text);
      if (!parsed) { body.push(`<pre>${escapeHtml(text)}</pre>`); return; }
      const headHtml = `<tr>${parsed.header.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
      const bodyHtml = parsed.rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("\n");
      body.push(`<table><thead>${headHtml}</thead><tbody>${bodyHtml}</tbody></table>`);
      return;
    }
    const safe = escapeHtml(text);
    if (tag === "LI") {
      if (!inList) { body.push("<ul>"); inList = true; }
      body.push(`<li>${safe}</li>`);
      return;
    }
    if (inList) { body.push("</ul>"); inList = false; }
    switch (tag) {
      case "H1": body.push(`<h1>${safe}</h1>`); break;
      case "H2": body.push(`<h2>${safe}</h2>`); break;
      case "H3": body.push(`<h3>${safe}</h3>`); break;
      default: body.push(`<p>${safe}</p>`);
    }
  });
  if (inList) body.push("</ul>");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(pageTitle)} — Polarin Docs</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
${body.join("\n")}
</body>
</html>
`;
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  let ok = 0;
  for (const page of PAGES) {
    try {
      const mod = await server.ssrLoadModule(page.file);
      const Component = mod[page.exportName];
      if (!Component) {
        console.warn(`[md] Skipping ${page.id}: export "${page.exportName}" not found in ${page.file}`);
        continue;
      }
      const rendered = renderToStaticMarkup(React.createElement(Component, page.props));
      const nodes = extractClassifiedNodes(rendered, page.id);
      const pageTitle = nodes.find((n) => n.tag === "H1")?.text || page.id;
      writeFileSync(path.join(OUT_DIR, `${page.id}.md`), nodesToMarkdown(nodes) + "\n", "utf-8");
      writeFileSync(path.join(OUT_DIR, `${page.id}.html`), nodesToHtml(nodes, pageTitle), "utf-8");
      ok++;
    } catch (err) {
      console.warn(`[md] Skipping ${page.id}:`, err instanceof Error ? err.message : err);
    }
  }

  await server.close();
  console.log(`[md] Generated ${ok}/${PAGES.length} markdown pages.`);
}

run().catch((err) => {
  console.warn("[md] Markdown generation failed, continuing build without it:", err);
});
