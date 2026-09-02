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
  { id: "port-create", file: "/src/app/components/knowledge-base/articles/CreatePortPage.tsx", exportName: "CreatePortPage", props: {} },
  { id: "port-status", file: "/src/app/components/knowledge-base/articles/PortStatusPage.tsx", exportName: "PortStatusPage", props: {} },
  { id: "port-lag", file: "/src/app/components/knowledge-base/articles/CreateLAGPage.tsx", exportName: "CreateLAGPage", props: {} },
  { id: "vr-create", file: "/src/app/components/knowledge-base/articles/CreateVirtualRouterPage.tsx", exportName: "CreateVirtualRouterPage", props: {} },
  { id: "vr-status", file: "/src/app/components/knowledge-base/articles/VirtualRouterStatusPage.tsx", exportName: "VirtualRouterStatusPage", props: {} },
  { id: "activity-logs", file: "/src/app/components/knowledge-base/articles/ActivityLogPage.tsx", exportName: "ActivityLogPage", props: {} },
  { id: "welcome", file: "/src/app/components/knowledge-base/WelcomePage.tsx", exportName: "WelcomePage", props: { onNavigate: noop } },
  { id: "locations", file: "/src/app/components/knowledge-base/LocationsPage.tsx", exportName: "LocationsPage", props: {} },
  { id: "release-notes", file: "/src/app/components/knowledge-base/ReleaseNotesPage.tsx", exportName: "ReleaseNotesPage", props: {} },
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

function htmlToMarkdown(html, fallbackTitle) {
  const root = parse(html);
  const classified = root
    .querySelectorAll("h1, h2, h3, p, li")
    .map((el) => ({ tag: classifyTag(el.tagName, el.getAttribute("style")), text: el.text.trim() }))
    .filter((n) => n.text);

  const hasH1 = classified.some((n) => n.tag === "H1");
  const lines = [];
  if (!hasH1) lines.push(`# ${fallbackTitle}`, "");
  classified.forEach(({ tag, text }) => {
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
      const html = renderToStaticMarkup(React.createElement(Component, page.props));
      const markdown = htmlToMarkdown(html, page.id);
      writeFileSync(path.join(OUT_DIR, `${page.id}.md`), markdown + "\n", "utf-8");
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
