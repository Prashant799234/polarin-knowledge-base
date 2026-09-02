import { ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { KBPage } from "./KnowledgeBase";
import { useWindowWidth } from "./useWindowWidth";
import { RevealOnScroll, RevealGroup, RevealItem } from "./RevealOnScroll";
import { REVEAL_VARIANTS, revealTransition, prefersReducedMotion } from "./animations/motionConfig";
import { usePageTools } from "./ArticlePage";
import { CopyPageMenu } from "./CopyPageMenu";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_JAKARTA = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const PATH_CARDS = [
  {
    iconBg: "#1a65fd",
    iconEl: <PersonAddIcon />,
    title: "New to Polarin",
    description: "Start here if you're new to the platform. Learn the basics and set up your first connection.",
    link: "Get Started",
    pageId: "create-account",
  },
  {
    iconBg: "#00b345",
    iconEl: <CategoryIcon />,
    title: "Configure Services",
    description: "Set up virtual connections, dedicated ports, and cloud integrations for your network.",
    link: "Configure Now",
    pageId: "cloud-connect",
  },
  {
    iconBg: "#9e27fd",
    iconEl: <BarChartIcon />,
    title: "Monitor & Optimize",
    description: "Use SPOG dashboard and analytics to monitor performance and optimize your network.",
    link: "View Analytics",
    pageId: "spog",
  },
  {
    iconBg: "#fd5900",
    iconEl: <LocationIcon />,
    title: "Explore Locations",
    description: "Discover our global network of points of presence and data center locations.",
    link: "View Network",
    pageId: "locations",
  },
  {
    iconBg: "#5549fa",
    iconEl: <CreditCardIcon />,
    title: "Billing & Usage",
    description: "Manage your billing, view usage reports, and optimize costs across your services.",
    link: "Manage Billing",
    pageId: "billing",
  },
  {
    iconBg: "#f40049",
    iconEl: <HeadphonesIcon />,
    title: "Need Help?",
    description: "Get support, access documentation, and connect with our community.",
    link: "Get Support",
    pageId: "contact-support",
  },
];

const POPULAR_TOPICS = [
  { title: "Account Setup & Verification", description: "Complete your profile and verify your organization", pageId: "create-account" },
  { title: "KYC Document Requirements", description: "List of supported documents for verification", pageId: "org-kyc" },
  { title: "Virtual Connection Setup", description: "Create your first virtual network connection", pageId: "cloud-connect" },
  { title: "Team Member Invitations", description: "Invite colleagues to your Polarin workspace", pageId: "invite-members" },
  { title: "API Documentation", description: "Integrate with Polarin using our APIs", pageId: "api-docs" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function WelcomePage({ onNavigate }: Props) {
  const tools = usePageTools();
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width < 1024;
  const gridCols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {/* ── Page Header + Hero — entrance animation on mount ── */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
      {/* ── Page Header ── */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "#effcfd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HomeIcon />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 20,
                lineHeight: "28px",
                color: "#0a3954",
              }}
            >
              Welcome to Polarin Platform
            </p>
            {tools && <CopyPageMenu contentRef={tools.contentRef} pageTitle={tools.pageTitle} />}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "22px",
              color: "#7e93b2",
            }}
          >
            Find everything you need to succeed with Polarin Platform - from getting started guides to advanced configurations.
          </p>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div
        style={{
          borderRadius: 16,
          background: "linear-gradient(104.41deg, rgb(12,60,87) 0.86%, rgb(50,141,168) 103.67%)",
          padding: isMobile ? "28px 24px" : "32px",
          display: "flex",
          alignItems: "flex-start",
          gap: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "white" }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 24,
                lineHeight: "32px",
                color: "white",
              }}
            >
              Everything You Need to Master Polarin Platform
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "22px",
                color: "white",
              }}
            >
              Your comprehensive resource for enterprise networking solutions. Whether you're setting up your first connection or managing complex global infrastructure, we've got you covered.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => onNavigate("create-account")}
              style={{
                padding: "7px 17px",
                height: 40,
                borderRadius: 12,
                background: "#FFFFFF",
                color: "#0a3954",
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "24px",
                border: "1px solid #e2e8f1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
              }}
            >
              <RocketIcon />
              Get Started
            </button>
            <button
              onClick={() => onNavigate("release-notes")}
              style={{
                padding: "7px 17px",
                height: 40,
                borderRadius: 16,
                background: "transparent",
                color: "white",
                fontFamily: FONT_JAKARTA,
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                border: "1px solid #e2e8f1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0px 2px 0px rgba(0,0,0,0.02)",
              }}
            >
              <WandIcon />
              What's New
            </button>
          </div>
        </div>

        {/* Network icon box */}
        {!isMobile && (
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LanIcon />
          </div>
        )}
      </div>
      </motion.div>{/* end header+hero group */}

      {/* ── Choose Your Path ── */}
      <RevealOnScroll>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            Choose Your Path
          </p>
          <RevealGroup style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: 24 }}>
            {PATH_CARDS.map((card) => (
              <RevealItem key={card.title}>
                <PathCard card={card} onNavigate={onNavigate} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </RevealOnScroll>

      {/* ── Popular Topics ── */}
      <RevealOnScroll>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            margin: 0,
            fontFamily: FONT_JAKARTA,
            fontWeight: 500,
            fontSize: 20,
            lineHeight: "28px",
            color: "#0a3954",
          }}
        >
          Popular Topics
        </p>
        <RevealGroup style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
          {POPULAR_TOPICS.map((topic) => (
            <motion.button
              key={topic.title}
              variants={REVEAL_VARIANTS}
              transition={revealTransition()}
              onClick={() => onNavigate(topic.pageId)}
              style={{
                background: "#FFFFFF",
                border: "0.5px solid #e2e8f1",
                borderRadius: 16,
                padding: 24,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 0px 1px rgba(40,41,61,0.12), 0px 2px 8px rgba(96,97,112,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)";
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "#0a3954",
                  }}
                >
                  {topic.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: FONT_JAKARTA,
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: "20px",
                    color: "#7e93b2",
                  }}
                >
                  {topic.description}
                </p>
              </div>
              <ChevronRight size={24} color="#7e93b2" style={{ flexShrink: 0, marginTop: 2 }} />
            </motion.button>
          ))}
        </RevealGroup>
        </div>
      </RevealOnScroll>

      {/* ── Latest Updates ── */}
      <RevealOnScroll delay={0.05}>
      <div
        style={{
          background: "#eff5ff",
          border: "0.5px solid rgba(26,101,253,0.2)",
          borderRadius: 16,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#1a65fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <NotificationsIcon />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 20,
                lineHeight: "28px",
                color: "#434343",
              }}
            >
              Latest Updates
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "20px",
                color: "#8c8c8c",
              }}
            >
              Released January 15, 2025
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 100,
              background: "#d9f7be",
              border: "1px solid #95de64",
              flexShrink: 0,
            }}
          >
            <WandStarsGreen />
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 14,
                lineHeight: "22px",
                color: "#237804",
              }}
            >
              New
            </span>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontSize: 16,
            lineHeight: "24px",
            color: "#434343",
          }}
        >
          <strong style={{ fontWeight: 700 }}>Platform Version 4.2</strong>
          {" is now available with enhanced Wave Analytics Dashboard, multi-cloud integration, and advanced security policies."}
        </p>

        <button
          onClick={() => onNavigate("release-notes")}
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 17px",
            height: 40,
            borderRadius: 12,
            background: "#FFFFFF",
            border: "1px solid #e2e8f1",
            color: "#0a3954",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "24px",
            cursor: "pointer",
            boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
          }}
        >
          View Release Notes
          <ArrowRight size={20} color="#0a3954" />
        </button>
      </div>
      </RevealOnScroll>
    </div>
  );
}

function PathCard({ card, onNavigate }: { card: (typeof PATH_CARDS)[0]; onNavigate: (page: KBPage) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(card.pageId)}
      onKeyDown={(e) => e.key === "Enter" && onNavigate(card.pageId)}
      style={{
        background: "#FFFFFF",
        border: "0.5px solid #e2e8f1",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0px 0px 1px rgba(40,41,61,0.12), 0px 4px 12px rgba(96,97,112,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: card.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {card.iconEl}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: "22px",
              color: "#0a3954",
            }}
          >
            {card.title}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'Lato', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "20px",
              color: "#7e93b2",
            }}
          >
            {card.description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 0",
          }}
        >
          <span
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "22px",
              color: "#1c808d",
            }}
          >
            {card.link}
          </span>
          <ArrowRight size={20} color="#1c808d" />
        </div>
      </div>
    </div>
  );
}

// ── Icon helpers (white 24px SVGs inside colored boxes) ──

function HomeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PersonAddIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a3954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function WandStarsGreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#237804" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" />
    </svg>
  );
}

function LanIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <rect x="20" y="20" width="20" height="20" rx="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="12" cy="12" r="6" fill="rgba(255,255,255,0.5)" />
      <circle cx="48" cy="12" r="6" fill="rgba(255,255,255,0.5)" />
      <circle cx="12" cy="48" r="6" fill="rgba(255,255,255,0.5)" />
      <circle cx="48" cy="48" r="6" fill="rgba(255,255,255,0.5)" />
      <line x1="18" y1="12" x2="20" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="42" y1="12" x2="40" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="18" y1="48" x2="20" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="42" y1="48" x2="40" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    </svg>
  );
}
