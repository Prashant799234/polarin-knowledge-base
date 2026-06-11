import { useState } from "react";
import type { ElementType } from "react";
import {
  Home, FileText, Code, UserCircle, Building2, UserPlus,
  MapPin, Cloud, Server, Plug, Router, BarChart2, CreditCard,
  Package, Headphones, HelpCircle, ShieldAlert, Lightbulb,
  ExternalLink, Sparkles, Menu, X, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WelcomePage } from "./WelcomePage";
import { ReleaseNotesPage } from "./ReleaseNotesPage";
import { LocationsPage } from "./LocationsPage";
import { ComingSoonPage } from "./ComingSoonPage";
import { ProgressBar } from "./ProgressBar";
import { CreateAccountPage } from "./articles/CreateAccountPage";
import { CompleteProfilePage } from "./articles/CompleteProfilePage";
import { KYCDocumentsPage } from "./articles/KYCDocumentsPage";
import { InviteTeamPage } from "./articles/InviteTeamPage";
import { useWindowWidth } from "./useWindowWidth";
import { prefersReducedMotion } from "./animations/motionConfig";

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
      { id: "api-docs", label: "API Documentation", icon: Code, external: true },
    ],
  },
  {
    title: "GET STARTED",
    items: [
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
          { id: "port-order", label: "Order a Port" },
          { id: "port-configure", label: "Port Configuration" },
        ],
      },
      {
        id: "virtual-router", label: "Virtual Router", icon: Router,
        children: [
          { id: "vr-create", label: "Create Virtual Router" },
          { id: "vr-bgp", label: "BGP Configuration" },
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
  const [activePage, setActivePage] = useState<KBPage>("welcome");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
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
    setIsNavigating(true);
    setActivePage(id);
    if (isMobile) setSidebarOpen(false);
    setTimeout(() => setIsNavigating(false), 550);
  };

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
                    if (hasChildren) {
                      toggleExpand(item.id);
                      // Also navigate to first child if not already on one
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
        src="/polarin-logo.svg"
        alt="Polarin Docs"
        style={{ height: 40, width: "auto", display: "block" }}
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
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ height: 56, background: "#fff", borderBottom: "0.5px solid #e2e8f1", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, position: "sticky", top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0a3954", display: "flex", padding: 4, borderRadius: 6 }}>
            <Menu size={22} />
          </button>
          <img src="/polarin-logo.svg" alt="Polarin Docs" style={{ height: 32, width: "auto" }} />
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }} />
        )}

        {/* Sidebar — no background, transparent over page bg */}
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
          {/* Desktop: show logo area in sidebar, aligned with header */}
          {logoRow(isMobile)}
          {sidebarContent}
        </aside>

        {/* Right panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Desktop header right side (blank, aligns with sidebar logo) */}
          {!isMobile && (
            <div style={{ height: 64, background: "#fff", borderBottom: "0.5px solid #e2e8f1", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, overflow: "hidden", padding: 16, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                background: "#FFFFFF",
                border: "0.5px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                boxShadow: "0px 0px 1px 0px rgba(40,41,61,0.04), 0px 2px 4px 0px rgba(96,97,112,0.16)",
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
                >
                  {activePage === "welcome" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                      <WelcomePage onNavigate={(p) => navigate(p)} />
                    </div>
                  )}
                  {activePage === "release-notes" && <ReleaseNotesPage />}
                  {activePage === "locations" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                      <LocationsPage />
                    </div>
                  )}
                  {activePage === "create-account" && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <CreateAccountPage onNavigate={(p) => navigate(p)} />
                    </div>
                  )}
                  {activePage === "complete-profile" && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <CompleteProfilePage onNavigate={(p) => navigate(p)} />
                    </div>
                  )}
                  {activePage === "org-kyc" && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <KYCDocumentsPage onNavigate={(p) => navigate(p)} />
                    </div>
                  )}
                  {activePage === "invite-members" && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <InviteTeamPage onNavigate={(p) => navigate(p)} />
                    </div>
                  )}
                  {activePage !== "welcome" && activePage !== "release-notes" && activePage !== "locations" &&
                   activePage !== "create-account" && activePage !== "complete-profile" &&
                   activePage !== "org-kyc" && activePage !== "invite-members" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                      <ComingSoonPage pageTitle={getPageLabel(activePage)} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
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

