import { useState, useRef, useEffect } from "react";
import type { ElementType } from "react";
import { SearchBar } from "./SearchBar";
import { CopyPageMenu } from "./CopyPageMenu";
import {
  Home, FileText, Code, UserCircle, Building2, UserPlus,
  MapPin, Cloud, Server, Plug, Router, BarChart2, CreditCard,
  Package, Headphones, HelpCircle, ShieldAlert, Lightbulb,
  ExternalLink, Sparkles, Menu, X, ChevronDown, Activity,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WelcomePage } from "./WelcomePage";
import { ReleaseNotesPage } from "./ReleaseNotesPage";
import { LocationsPage } from "./LocationsPage";
import { ComingSoonPage } from "./ComingSoonPage";
import { ProgressBar } from "./ProgressBar";
import { AboutPolarinPage } from "./articles/AboutPolarinPage";
import { ServicesOfferedPage } from "./articles/ServicesOfferedPage";
import { QuickSetupPage } from "./articles/QuickSetupPage";
import { CreateAccountPage } from "./articles/CreateAccountPage";
import { CompleteProfilePage } from "./articles/CompleteProfilePage";
import { KYCDocumentsPage } from "./articles/KYCDocumentsPage";
import { InviteTeamPage } from "./articles/InviteTeamPage";
import { CreatePortPage } from "./articles/CreatePortPage";
import { PortStatusPage } from "./articles/PortStatusPage";
import { CreateLAGPage } from "./articles/CreateLAGPage";
import { CreateVirtualRouterPage } from "./articles/CreateVirtualRouterPage";
import { VirtualRouterStatusPage } from "./articles/VirtualRouterStatusPage";
import { ActivityLogPage } from "./articles/ActivityLogPage";
import { ContactSupportPage } from "./ContactSupportPage";
import { ArticleFooter, PageToolsProvider, usePageTools } from "./ArticlePage";
import type { ArticleLink } from "./ArticlePage";
import { useWindowWidth } from "./useWindowWidth";
import { prefersReducedMotion, REVEAL_VARIANTS, revealTransition } from "./animations/motionConfig";
import { RevealOnScroll, RevealGroup, RevealItem } from "./RevealOnScroll";

export type KBPage = string; // "welcome" | "release-notes" | any other id → ComingSoon

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface SubItem {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  badge?: string;
  external?: boolean;
  href?: string;
  children?: SubItem[];
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { id: "welcome", label: "Welcome", icon: Home },
      { id: "release-notes", label: "Release Notes", icon: FileText, badge: "New" },
      {
        id: "api-docs", label: "Polarin API", icon: Code,
        children: [
          { id: "api-overview",   label: "Overview" },
          { id: "api-onboarding", label: "Getting Access" },
          { id: "api-pricing",    label: "Pricing" },
        ],
      },
    ],
  },
  {
    title: "GET STARTED",
    items: [
      {
        id: "gs-overview", label: "Overview", icon: Info,
        children: [
          { id: "about-polarin",    label: "About Polarin" },
          { id: "services-offered", label: "Services Offered" },
          { id: "quick-setup",      label: "Quick Setup" },
        ],
      },
      { id: "create-account", label: "Create a Polarin Account", icon: UserCircle },
      {
        id: "org-profile", label: "Organisation Profile", icon: Building2,
        children: [
          { id: "complete-profile", label: "Complete Your Profile" },
          { id: "org-kyc", label: "KYC Document Requirements" },
          { id: "org-settings", label: "Organisation Settings" },
        ],
      },
      { id: "invite-members", label: "Invite Team Members", icon: UserPlus },
    ],
  },
  {
    title: "SERVICES",
    items: [
      { id: "locations", label: "Locations", icon: MapPin },
      {
        id: "cloud-connect", label: "Cloud connect", icon: Cloud,
        children: [
          { id: "cloud-aws", label: "AWS Direct Connect" },
          { id: "cloud-azure", label: "Azure ExpressRoute" },
          { id: "cloud-gcp", label: "Google Cloud Interconnect" },
        ],
      },
      {
        id: "dci", label: "Data Center Interconnect (DCI)", icon: Server,
        children: [
          { id: "dci-create", label: "Create DCI Service" },
          { id: "dci-manage", label: "Manage DCI" },
        ],
      },
      {
        id: "port", label: "Port", icon: Plug,
        children: [
          { id: "port-create", label: "Create a Port" },
          { id: "port-status", label: "Understand Port Status" },
          { id: "port-lag",    label: "Create a Link Aggregation Group" },
        ],
      },
      {
        id: "virtual-router", label: "Virtual Router", icon: Router,
        children: [
          { id: "vr-status", label: "Understand Virtual Router Status" },
          { id: "vr-create", label: "Create a Virtual Router" },
        ],
      },
    ],
  },
  {
    title: "MANAGE SERVICES",
    items: [
      {
        id: "spog", label: "SPOG", icon: BarChart2,
        children: [
          { id: "spog-dashboard", label: "Dashboard Overview" },
          { id: "spog-analytics", label: "Analytics" },
        ],
      },
      {
        id: "billing", label: "Billing", icon: CreditCard,
        children: [
          { id: "billing-invoices", label: "Invoices" },
          { id: "billing-payment", label: "Payment Methods" },
        ],
      },
      {
        id: "subscription", label: "Subscription", icon: Package,
        children: [
          { id: "sub-plans", label: "Plans & Pricing" },
          { id: "sub-usage", label: "Usage Reports" },
        ],
      },
      { id: "activity-logs", label: "Activity Log", icon: Activity },
    ],
  },
  {
    title: "HELP & SUPPORT",
    items: [
      { id: "contact-support", label: "Contact Support", icon: Headphones },
      {
        id: "support-tickets", label: "Support Tickets", icon: HelpCircle,
        children: [
          { id: "my-tickets", label: "My Tickets" },
          { id: "create-ticket", label: "Create Ticket" },
        ],
      },
      { id: "escalation-matrix", label: "Escalation Matrix", icon: ShieldAlert },
      { id: "feedback", label: "Feedback & Suggestions", icon: Lightbulb },
    ],
  },
];

// Metadata for article footer (prev / next / related) — single source of truth
const ARTICLE_META: Record<string, { prev?: ArticleLink; next?: ArticleLink; related?: ArticleLink[] }> = {
  "about-polarin": {
    next: { label: "Services Offered", pageId: "services-offered" },
    related: [
      { label: "Services Offered",        pageId: "services-offered" },
      { label: "Quick Setup",             pageId: "quick-setup" },
      { label: "Create a Polarin Account", pageId: "create-account" },
    ],
  },
  "services-offered": {
    prev: { label: "About Polarin", pageId: "about-polarin" },
    next: { label: "Quick Setup",   pageId: "quick-setup" },
    related: [
      { label: "About Polarin",           pageId: "about-polarin" },
      { label: "Create a Port",           pageId: "port-create" },
      { label: "Create a Virtual Router", pageId: "vr-create" },
    ],
  },
  "quick-setup": {
    prev: { label: "Services Offered", pageId: "services-offered" },
    next: { label: "Create a Polarin Account", pageId: "create-account" },
    related: [
      { label: "About Polarin",              pageId: "about-polarin" },
      { label: "Services Offered",           pageId: "services-offered" },
      { label: "Create a Polarin Account",   pageId: "create-account" },
    ],
  },
  "create-account": {
    next: { label: "Complete Organisation Profile", pageId: "complete-profile" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "KYC Document Requirements",     pageId: "org-kyc" },
      { label: "Invite Team Members",           pageId: "invite-members" },
    ],
  },
  "complete-profile": {
    prev: { label: "Create a Polarin Account",  pageId: "create-account" },
    next: { label: "KYC Document Requirements", pageId: "org-kyc" },
    related: [
      { label: "KYC Document Requirements", pageId: "org-kyc" },
      { label: "Invite Team Members",       pageId: "invite-members" },
      { label: "Create a Polarin Account",  pageId: "create-account" },
    ],
  },
  "org-kyc": {
    prev: { label: "Complete Organisation Profile", pageId: "complete-profile" },
    next: { label: "Invite Team Members",           pageId: "invite-members" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "Invite Team Members",           pageId: "invite-members" },
      { label: "Create a Polarin Account",      pageId: "create-account" },
    ],
  },
  "invite-members": {
    prev: { label: "KYC Document Requirements", pageId: "org-kyc" },
    next: { label: "Locations",                 pageId: "locations" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "KYC Document Requirements",     pageId: "org-kyc" },
      { label: "Create a Polarin Account",      pageId: "create-account" },
    ],
  },
  "port-create": {
    next: { label: "Understand Port Status",            pageId: "port-status" },
    related: [
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Create a Link Aggregation Group",       pageId: "port-lag" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "port-status": {
    prev: { label: "Create a Port",                     pageId: "port-create" },
    next: { label: "Create a Link Aggregation Group",   pageId: "port-lag" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Create a Link Aggregation Group",       pageId: "port-lag" },
    ],
  },
  "port-lag": {
    prev: { label: "Understand Port Status",            pageId: "port-status" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "vr-create": {
    next: { label: "Understand Virtual Router Status",  pageId: "vr-status" },
    related: [
      { label: "Understand Virtual Router Status",      pageId: "vr-status" },
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "vr-status": {
    prev: { label: "Create a Virtual Router",           pageId: "vr-create" },
    related: [
      { label: "Create a Virtual Router",               pageId: "vr-create" },
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Understand Port Status",                pageId: "port-status" },
    ],
  },
  "activity-logs": {
    related: [
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Understand Virtual Router Status",      pageId: "vr-status" },
      { label: "Create a Port",                         pageId: "port-create" },
    ],
  },
};

const ARTICLE_PAGES = new Set(Object.keys(ARTICLE_META));

function getPageLabel(id: string): string {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.id === id) return item.label;
      if (item.children) {
        for (const child of item.children) {
          if (child.id === id) return child.label;
        }
      }
    }
  }
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function KnowledgeBase() {
  const [activePage, setActivePage] = useState<KBPage>(
    () => new URLSearchParams(window.location.search).get("page") || "welcome"
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [recentPageHistory, setRecentPageHistory] = useState<string[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const width = useWindowWidth();
  const isMobile = width < 768;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigate = (id: string) => {
    if (id === activePage) return;
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    setRecentPageHistory(prev => [activePage, ...prev.filter(p => p !== activePage)].slice(0, 8));
    setIsNavigating(true);
    setActivePage(id);
    if (isMobile) setSidebarOpen(false);
    setTimeout(() => setIsNavigating(false), 550);
  };

  // Keep the URL in sync so every page has a real, shareable link.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", activePage);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [activePage]);

  const isActiveOrChild = (item: NavItem): boolean => {
    if (item.id === activePage) return true;
    if (item.children) return item.children.some((c) => c.id === activePage);
    return false;
  };

  const sidebarContent = (
    <nav style={{ flex: 1, paddingTop: 8, paddingBottom: 24, overflowY: "auto" }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && (
            <div style={{ height: 1, background: "#e2e8f1", margin: "6px 0" }} />
          )}
          {group.title && (
            <div
              style={{
                padding: "8px 24px 4px",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                color: "#90a2b9",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: "32px",
              }}
            >
              {group.title}
            </div>
          )}
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activePage;
            const isParentActive = isActiveOrChild(item) && !isActive;
            const isOpen = expanded.has(item.id);
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.id}>
                <NavButton
                  icon={<Icon size={20} color={isActive || isParentActive ? "#1c808d" : "#7e93b2"} strokeWidth={1.8} />}
                  label={item.label}
                  isActive={isActive}
                  isParentActive={isParentActive}
                  badge={item.badge}
                  external={item.external}
                  hasChildren={hasChildren}
                  isOpen={isOpen}
                  onClick={() => {
                    if (item.href) {
                      window.open(item.href, "_blank", "noopener,noreferrer");
                      return;
                    }
                    if (hasChildren) {
                      toggleExpand(item.id);
                      if (!isParentActive && item.children?.[0]) {
                        navigate(item.children[0].id);
                      }
                    } else {
                      navigate(item.id);
                    }
                  }}
                />
                {/* Sub-items — animated expand/collapse */}
                <AnimatePresence initial={false}>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      {item.children!.map((child) => {
                        const isChildActive = child.id === activePage;
                        return (
                          <NavButton
                            key={child.id}
                            icon={null}
                            label={child.label}
                            isActive={isChildActive}
                            isParentActive={false}
                            indent
                            onClick={() => navigate(child.id)}
                          />
                        );
                      })}
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

  const logoRow = (showClose: boolean) => (
    <div
      style={{
        height: 64,
        borderBottom: "0.5px solid #e2e8f1",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        padding: "0 16px 0 24px",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <img
        src="/polarin-logo.png"
        alt="Polarin Docs"
        style={{ height: 47, width: "auto", display: "block" }}
      />
      {showClose && (
        <button
          onClick={() => setSidebarOpen(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#7e93b2", display: "flex", padding: 4, borderRadius: 6 }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", fontFamily: FONT }}>
      <ProgressBar active={isNavigating} />

      {/* ── Full-width desktop header (spans sidebar + content) ── */}
      {!isMobile && (
        <div style={{
          height: 64, flexShrink: 0,
          background: "#fff", borderBottom: "0.5px solid #e2e8f1",
          display: "flex", alignItems: "center",
          position: "relative", zIndex: 20,
        }}>
          {/* Logo section — exact width of sidebar */}
          <div style={{
            width: 240, minWidth: 240, flexShrink: 0,
            padding: "0 16px 0 24px",
            display: "flex", alignItems: "center",
            height: "100%",
            borderRight: "0.5px solid #e2e8f1",
          }}>
            <img src="/polarin-logo.png" alt="Polarin Docs" style={{ height: 47, width: "auto", display: "block" }} />
          </div>
          {/* Search — centered in the remaining space */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 24px" }}>
            <div style={{ width: 480, maxWidth: "100%" }}>
              <SearchBar onNavigate={navigate} recentPageIds={recentPageHistory} />
            </div>
          </div>
          {/* Portal CTA */}
          <div style={{ paddingRight: 24, flexShrink: 0 }}>
            <PortalCTA />
          </div>
        </div>
      )}

      {/* ── Mobile top bar ── */}
      {isMobile && (
        <div style={{ height: 56, background: "#fff", borderBottom: "0.5px solid #e2e8f1", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, position: "sticky", top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0a3954", display: "flex", padding: 4, borderRadius: 6 }}>
            <Menu size={22} />
          </button>
          <img src="/polarin-logo.png" alt="Polarin Docs" style={{ height: 36, width: "auto" }} />
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }} />
        )}

        {/* Sidebar — desktop: no logo row (it's in the full-width header) */}
        <aside
          style={{
            width: 240,
            minWidth: 240,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            ...(isMobile
              ? {
                  position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
                  background: "#f8fafc",
                  transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                  transition: "transform 0.25s ease",
                  boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.1)" : "none",
                }
              : {}),
          }}
        >
          {/* Mobile only: show logo + close button in sidebar drawer */}
          {isMobile && logoRow(true)}
          {sidebarContent}
        </aside>

        {/* Right panel — no header here, sits directly below the full-width header */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Outer scroll container — card + footer both live here */}
          <div ref={scrollerRef} style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {/* Inner flex column: card fills height on short pages; footer appends below for articles */}
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", gap: 0 }}>
              {/* White card */}
              <div
                ref={cardRef}
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid rgba(0,0,0,0.06)",
                  borderRadius: 16,
                  boxShadow: "0px 0px 1px 0px rgba(40,41,61,0.04), 0px 2px 4px 0px rgba(96,97,112,0.16)",
                  flex: ARTICLE_PAGES.has(activePage) ? "0 0 auto" : 1,
                }}
              >
                <PageToolsProvider value={{ pageTitle: getPageLabel(activePage), contentRef: cardRef }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {activePage === "welcome" && (
                      <div style={{ padding: 24 }}>
                        <WelcomePage onNavigate={(p) => navigate(p)} />
                      </div>
                    )}
                    {activePage === "release-notes" && <ReleaseNotesPage />}
                    {activePage === "locations" && (
                      <div style={{ padding: 24 }}>
                        <LocationsPage />
                      </div>
                    )}
                    {activePage === "about-polarin" && <AboutPolarinPage onNavigate={navigate} />}
                    {activePage === "services-offered" && <ServicesOfferedPage onNavigate={navigate} />}
                    {activePage === "quick-setup" && <QuickSetupPage onNavigate={navigate} />}
                    {activePage === "create-account" && <CreateAccountPage />}
                    {activePage === "complete-profile" && <CompleteProfilePage />}
                    {activePage === "org-kyc" && <KYCDocumentsPage />}
                    {activePage === "invite-members" && <InviteTeamPage />}
                    {activePage === "port-create" && <CreatePortPage />}
                    {activePage === "port-status" && <PortStatusPage />}
                    {activePage === "port-lag" && <CreateLAGPage />}
                    {activePage === "vr-create" && <CreateVirtualRouterPage />}
                    {activePage === "vr-status" && <VirtualRouterStatusPage />}
                    {activePage === "activity-logs" && <ActivityLogPage />}
                    {activePage === "contact-support" && (
                      <ContactSupportPage />
                    )}
                    {activePage === "api-overview" && (
                      <div style={{ padding: 24 }}>
                        <ApiOverviewPage onNavigate={navigate} />
                      </div>
                    )}
                    {activePage === "api-onboarding" && (
                      <div style={{ padding: 24 }}>
                        <ApiOnboardingPage onNavigate={navigate} />
                      </div>
                    )}
                    {activePage === "api-pricing" && (
                      <div style={{ padding: 24 }}>
                        <ApiPricingPage onNavigate={navigate} />
                      </div>
                    )}
                    {!ARTICLE_PAGES.has(activePage) &&
                     activePage !== "welcome" && activePage !== "release-notes" &&
                     activePage !== "locations" && activePage !== "contact-support" &&
                     activePage !== "api-overview" && activePage !== "api-onboarding" && activePage !== "api-pricing" && (
                      <div style={{ padding: 24 }}>
                        <ComingSoonPage pageTitle={getPageLabel(activePage)} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                </PageToolsProvider>
              </div>

              {/* Article footer — outside the white card, rendered below it */}
              {ARTICLE_PAGES.has(activePage) && ARTICLE_META[activePage] && (
                <ArticleFooter
                  {...ARTICLE_META[activePage]}
                  onNavigate={(p) => navigate(p)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Portal CTA ──────────────────────────────────────────────────────────────

function PortalCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://polarin.lightstorm.net/app/login?next=/app/home"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px",
        borderRadius: 8,
        border: `1px solid ${hovered ? "#1c808d" : "#c8d4e0"}`,
        background: hovered
          ? "linear-gradient(135deg, #0a3954 0%, #1c808d 100%)"
          : "transparent",
        color: hovered ? "#fff" : "#4b6b8a",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: FONT,
        textDecoration: "none",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        transition: "border-color 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered ? "0 2px 8px rgba(28,128,141,0.22)" : "none",
        cursor: "pointer",
      }}
    >
      Polarin Portal
      <ExternalLink size={13} style={{ opacity: hovered ? 1 : 0.55, transition: "opacity 0.18s ease" }} />
    </a>
  );
}

// ── API Documentation pages ──────────────────────────────────────────────────

const C = { teal: "#1c808d", navy: "#0a3954", bg: "#f8fafc", border: "#e2e8f1", muted: "#64748b" };
const FONT_J = "'Plus Jakarta Sans', 'Lato', -apple-system, sans-serif";

const API_PATH_CARDS = [
  {
    iconBg: "#1a65fd",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    title: "Get Access",
    description: "Register, complete KYC, and receive your API credentials. Active Polarin customers only.",
    link: "Get Started",
    pageId: "api-onboarding",
  },
  {
    iconBg: "#00b345",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: "Authenticate",
    description: "Exchange credentials for a short-lived JWT token. Pass it as the access-token header on every call.",
    link: "Learn How",
    pageId: null,
    href: "/developer",
  },
  {
    iconBg: "#9e27fd",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    title: "Call the APIs",
    description: "Use standard REST calls to provision ports, manage routers, monitor VISTA metrics, and more.",
    link: "Explore APIs",
    pageId: null,
    href: "/developer",
  },
];

const API_TOPICS = [
  { title: "Getting Access", description: "5-step journey from sign-up to your first API call", pageId: "api-onboarding" },
  { title: "API Pricing", description: "Free tier and VISTA usage limits explained", pageId: "api-pricing" },
  { title: "Developer Portal", description: "Full reference docs with live request testing", pageId: null, href: "/developer" },
  { title: "Staging Environment", description: "Test safely — no real services, no billing", pageId: null, href: "/developer" },
];

function ApiOverviewPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const apiTools = usePageTools();
  const width = useWindowWidth();
  const isMobile = width < 640;

  const go = (pageId: string | null, href?: string) => {
    if (pageId) { onNavigate(pageId); return; }
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 40 }}>

      {/* ── Page header + hero ── */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}
      >
        {/* Page header */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#effcfd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24 }}>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
                Polarin API
              </p>
              {apiTools && <CopyPageMenu contentRef={apiTools.contentRef} pageTitle={apiTools.pageTitle} />}
            </div>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "#7e93b2" }}>
              Automate your network infrastructure through simple REST calls — no portal required.
            </p>
          </div>
        </div>

        {/* Hero banner — same gradient as WelcomePage */}
        <div style={{
          borderRadius: 16,
          background: "linear-gradient(104.41deg, rgb(12,60,87) 0.86%, rgb(50,141,168) 103.67%)",
          padding: isMobile ? "28px 24px" : "32px",
          display: "flex", alignItems: "flex-start", gap: 60,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 24, lineHeight: "32px", color: "white" }}>
                Build & Automate with Polarin API
              </p>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "white" }}>
                Programmatic access to your entire network. Provision services, monitor real-time performance, and integrate Polarin into your automation workflows — all through standard HTTP.
              </p>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
              <button
                onClick={() => onNavigate("api-onboarding")}
                style={{ padding: "7px 17px", height: 40, borderRadius: 12, background: "#FFFFFF", color: "#0a3954", fontFamily: FONT, fontWeight: 600, fontSize: 14, lineHeight: "24px", border: "1px solid #e2e8f1", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a3954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Get Access
              </button>
              <button
                onClick={() => window.open("/developer", "_blank", "noopener,noreferrer")}
                style={{ padding: "7px 17px", height: 40, borderRadius: 16, background: "transparent", color: "white", fontFamily: FONT, fontWeight: 400, fontSize: 16, lineHeight: "24px", border: "1px solid #e2e8f1", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Explore APIs
              </button>
            </div>
          </div>
          {!isMobile && (
            <div style={{ width: 100, height: 100, borderRadius: 8, background: "rgba(255,255,255,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect x="10" y="22" width="40" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
                <rect x="10" y="26" width="14" height="2" rx="1" fill="rgba(255,255,255,0.6)"/>
                <rect x="10" y="30" width="10" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
                <rect x="10" y="34" width="18" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
                <circle cx="46" cy="14" r="6" fill="rgba(255,255,255,0.3)"/>
                <circle cx="14" cy="46" r="6" fill="rgba(255,255,255,0.3)"/>
                <circle cx="46" cy="46" r="6" fill="rgba(255,255,255,0.3)"/>
                <line x1="46" y1="20" x2="46" y2="22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                <line x1="20" y1="46" x2="22" y2="38" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                <line x1="46" y1="46" x2="46" y2="38" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              </svg>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── How it works (path cards) ── */}
      <RevealOnScroll>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            How it works
          </p>
          <RevealGroup style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
            {API_PATH_CARDS.map((card) => (
              <RevealItem key={card.title}>
                <div
                  role="button" tabIndex={0}
                  onClick={() => go(card.pageId, card.href)}
                  onKeyDown={(e) => e.key === "Enter" && go(card.pageId, card.href)}
                  style={{ background: "#FFFFFF", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)", cursor: "pointer", transition: "box-shadow 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0px 0px 1px rgba(40,41,61,0.12), 0px 4px 12px rgba(96,97,112,0.2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)"; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#0a3954" }}>{card.title}</p>
                      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#7e93b2" }}>{card.description}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "22px", color: "#1c808d" }}>{card.link}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </RevealOnScroll>

      {/* ── Quick topics ── */}
      <RevealOnScroll>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            Quick Topics
          </p>
          <RevealGroup style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
            {API_TOPICS.map((topic) => (
              <motion.button
                key={topic.title}
                variants={REVEAL_VARIANTS}
                transition={revealTransition()}
                onClick={() => go(topic.pageId, topic.href)}
                style={{ background: "#FFFFFF", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 24, display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", textAlign: "left", boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)", transition: "box-shadow 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 1px rgba(40,41,61,0.12), 0px 2px 8px rgba(96,97,112,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)"; }}
              >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 4 }}>
                  <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#0a3954" }}>{topic.title}</p>
                  <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#7e93b2" }}>{topic.description}</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e93b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            ))}
          </RevealGroup>
        </div>
      </RevealOnScroll>

      {/* ── Developer Portal callout ── */}
      <RevealOnScroll delay={0.05}>
        <div style={{ background: "#effcfd", border: "0.5px solid rgba(28,128,141,0.2)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column" as const, gap: 16, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#1c808d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "#434343" }}>Developer Portal</p>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#8c8c8c" }}>Full API reference with live request testing</p>
            </div>
          </div>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 16, lineHeight: "24px", color: "#434343" }}>
            <strong style={{ fontWeight: 700 }}>Explore every endpoint</strong>{" in our interactive Developer Portal — try requests live, see real response examples, and test against the staging environment without affecting production."}
          </p>
          <button
            onClick={() => window.open("/developer", "_blank", "noopener,noreferrer")}
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, padding: "7px 17px", height: 40, borderRadius: 12, background: "#FFFFFF", border: "1px solid #e2e8f1", color: "#0a3954", fontFamily: FONT, fontWeight: 600, fontSize: 14, lineHeight: "24px", cursor: "pointer", boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}
          >
            Open Developer Portal
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a3954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </RevealOnScroll>

    </div>
  );
}

function ApiOnboardingPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const apiTools = usePageTools();
  return (
    <div style={{ padding: "32px 40px 52px" }}>
      <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24, marginBottom: 8 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 26, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.4px" }}>Getting Access</h1>
        {apiTools && <CopyPageMenu contentRef={apiTools.contentRef} pageTitle={apiTools.pageTitle} />}
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 560 }}>
        The Polarin API is available to all active Polarin customers. Here's the full journey — from sign-up to your first API call.
      </p>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, marginBottom: 36 }}>
        {[
          { n: 1, title: "Register on Polarin", desc: "Sign up at the Polarin portal with your company name, primary contact, and required services. Takes about 5 minutes." },
          { n: 2, title: "Complete KYC", desc: "Upload business registration, director ID, and proof of address. Reviewed within 1–2 business days." },
          { n: 3, title: "Account Activated", desc: "Once KYC is approved, your account goes live with all ordered services accessible in the portal." },
          { n: 4, title: "Receive Activation Email", desc: "You'll get your portal login credentials and initial staging API key directly to your registered email." },
          { n: 5, title: "Start with Staging", desc: "Test with your staging credentials — no real services, no billing. Contact your account manager for production access.", highlight: "First API call in under 30 minutes from activation." },
        ].map((step, i, arr) => (
          <div key={step.n} style={{ display: "flex", gap: 0 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginRight: 20, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.teal}15`, border: `2px solid ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 900, color: C.teal }}>{step.n}</span>
              </div>
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${C.teal}20`, minHeight: 24, margin: "5px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < arr.length - 1 ? 24 : 0, paddingTop: 6 }}>
              <div style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 5 }}>{step.title}</div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
              {step.highlight && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 12px" }}>
                  <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>✓ {step.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 12 }}>API access tiers</div>
        {[
          { tier: "All Customers", desc: "Full access to provisioning, management, and account APIs. No per-call charges." },
          { tier: "VISTA Free", desc: "10,000 calls/day per circuit for VISTA Performance Monitoring. Included automatically." },
          { tier: "VISTA Premium", desc: "50,000 calls/day per circuit + 180-day history. Contact your account manager." },
        ].map(t => (
          <div key={t.tier} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontFamily: FONT, fontSize: 13, color: "#475569" }}>
              <strong style={{ color: C.navy, fontFamily: FONT_J, fontWeight: 700 }}>{t.tier}</strong> — {t.desc}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
        For usage limits and billing details, see{" "}
        <button
          onClick={() => onNavigate("api-pricing")}
          style={{ fontFamily: FONT, fontSize: 13, color: "#1367D6", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
        >Pricing</button>.
        For the full API reference, visit the{" "}
        <a
          href="/developer"
          style={{ color: "#1367D6", fontSize: 13, textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
        >Developer Portal</a>.
      </p>
    </div>
  );
}

function ApiPricingPage({ onNavigate: _onNavigate }: { onNavigate: (id: string) => void }) {
  const apiTools = usePageTools();
  return (
    <div style={{ padding: "32px 40px 52px" }}>
      <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24, marginBottom: 8 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 26, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.4px" }}>API Pricing</h1>
        {apiTools && <CopyPageMenu contentRef={apiTools.contentRef} pageTitle={apiTools.pageTitle} />}
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 28px", maxWidth: 560 }}>
        Simple rule: almost all Polarin APIs are free. The only exception is VISTA Performance Monitoring, which has a daily free allowance per circuit.
      </p>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>✓</div>
        <div>
          <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: "#15803d", marginBottom: 4 }}>All provisioning, management & account APIs are free</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: "#16a34a", lineHeight: 1.7 }}>Authentication, Ports, Virtual Routers, Connections, Locations, Billing, Subscriptions, Support, User Management — no usage charges.</div>
        </div>
      </div>

      <div style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 12 }}>VISTA Performance Monitoring</div>
      <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "0 0 18px" }}>
        VISTA APIs return real-time and historical performance metrics for your circuits. They have a free daily allowance per circuit — calls beyond that are charged.
      </p>

      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", background: C.navy }}>
          {["Feature", "Free", "Premium"].map((h, i) => (
            <div key={h} style={{ padding: "10px 18px", fontFamily: FONT_J, fontSize: 10, fontWeight: 700, color: i === 2 ? "#4dd9e6" : "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" as const, borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>{h}</div>
          ))}
        </div>
        {[
          ["Daily call limit (per circuit)", "10,000 calls", "50,000 calls"],
          ["Historical data retention", "31 days", "180 days"],
          ["SLA & latency metrics", "✓ Included", "✓ Included"],
          ["Cost", "Included with service", "Contact Polarin"],
        ].map(([feat, free, prem], i) => (
          <div key={feat} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", background: i % 2 === 0 ? "#fff" : C.bg, borderTop: `1px solid ${C.border}` }}>
            <div style={{ padding: "12px 18px", fontFamily: FONT, fontSize: 12, color: C.navy, fontWeight: 500 }}>{feat}</div>
            <div style={{ padding: "12px 18px", fontFamily: FONT, fontSize: 12, color: "#16a34a", borderLeft: `1px solid ${C.border}` }}>{free}</div>
            <div style={{ padding: "12px 18px", fontFamily: FONT_J, fontSize: 12, color: C.teal, fontWeight: 700, borderLeft: `1px solid ${C.border}` }}>{prem}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: FONT_J, fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Additional calls (beyond free limit)</div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
        {[
          ["Rate", "Flat rate per call above the daily limit"],
          ["Tracking", "Usage tracked daily, per circuit"],
          ["Billing", "Invoiced monthly — charges on your next cycle"],
          ["Carry-over", "No carry-over — pool resets at 00:00 UTC daily"],
          ["Overage", "429 Too Many Requests when free limit is reached"],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", gap: 12, padding: "10px 16px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: FONT_J, fontSize: 11, fontWeight: 700, color: C.navy, minWidth: 90, flexShrink: 0 }}>{label}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "#475569" }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 18px" }}>
        <p style={{ fontFamily: FONT, fontSize: 13, color: "#92400e", lineHeight: 1.75, margin: 0 }}>
          <strong style={{ color: "#78350f" }}>Need VISTA Premium?</strong> Contact your Polarin account manager to upgrade. The change is applied the same business day.
        </p>
      </div>
    </div>
  );
}

// ── Nav button ──────────────────────────────────────────────────────────────

interface NavButtonProps {
  icon: React.ReactNode | null;
  label: string;
  isActive: boolean;
  isParentActive: boolean;
  badge?: string;
  external?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  indent?: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, isParentActive, badge, external, hasChildren, isOpen, indent, onClick }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);
  const textColor = isActive || isParentActive || hovered ? "#1c808d" : "#0a3954";

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.975 }}
      transition={{ duration: 0.12 }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingLeft: indent ? 48 : 24,
        paddingRight: 16,
        paddingTop: indent ? 10 : 12,
        paddingBottom: indent ? 10 : 12,
        fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: textColor,
        background: isActive ? "#FFFFFF" : hovered && !isActive ? "rgba(28,128,141,0.04)" : "transparent",
        border: "none",
        borderRadius: isActive ? "0 16px 16px 0" : "0 8px 8px 0",
        boxShadow: isActive
          ? "0px 1px 1px rgba(0,0,0,0.03), 0px 1px 3px rgba(0,0,0,0.02), 0px 2px 2px rgba(0,0,0,0.02)"
          : "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FONT,
        lineHeight: "20px",
        marginRight: 8,
        transition: "color 0.12s, background 0.12s",
      }}
    >
      {icon && <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>}
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 16, background: "#dcfce7", border: "1px solid #b9f8cf", color: "#008236", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontFamily: FONT }}>
          <Sparkles size={10} />
          {badge}
        </span>
      )}
      {external && <ExternalLink size={14} color="#7e93b2" style={{ flexShrink: 0 }} />}
      {hasChildren && (
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ flexShrink: 0, display: "flex" }}
        >
          <ChevronDown size={18} color="#7e93b2" />
        </motion.span>
      )}
    </motion.button>
  );
}

