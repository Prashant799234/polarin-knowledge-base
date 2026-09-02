import type { ElementType } from "react";
import { Plug, Router, Cloud, Server, MapPin, Globe, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "locations",  label: "Locations",                       level: 2 as const },
  { id: "port",       label: "Port",                             level: 2 as const },
  { id: "vr",         label: "Virtual Router",                   level: 2 as const },
  { id: "cloud",      label: "Cloud Connect",                    level: 2 as const },
  { id: "dci",        label: "Data Centre Interconnect",         level: 2 as const },
  { id: "manage",     label: "Managing What You Order",          level: 1 as const },
];

interface ServiceCardData {
  num: number;
  icon: ElementType;
  color: string;
  title: string;
  description: string;
  badges: string[];
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    num: 1, icon: Plug, color: "#1a65fd", title: "Port",
    description: "Your organisation's physical entry point into the Polarin network.",
    badges: ["1GE", "10GE", "100GE"],
  },
  {
    num: 2, icon: Router, color: "#9e27fd", title: "Virtual Router",
    description: "Software-based L3 routing between clouds, data centres, and partners.",
    badges: ["High Performance", "Scalable", "Secure"],
  },
  {
    num: 3, icon: Cloud, color: "#00b345", title: "Cloud Connect",
    description: "Private, direct links into major cloud providers, off the public internet.",
    badges: ["AWS", "Azure", "GCP"],
  },
  {
    num: 4, icon: Server, color: "#fd5900", title: "Data Centre Interconnect",
    description: "High-bandwidth links between two or more of your data centre sites.",
    badges: ["Layer 2", "Site to Site"],
  },
  {
    num: 5, icon: MapPin, color: "#f40049", title: "Locations",
    description: "The global footprint of data centres and points of presence you can build from.",
    badges: ["Multiple Regions", "PoP Search"],
  },
];

const BENEFITS: { icon: ElementType; title: string; description: string }[] = [
  { icon: Globe, title: "Global Footprint", description: "Reach data centres and clouds across regions." },
  { icon: Zap, title: "Self-Service", description: "Order and configure without waiting on a ticket." },
  { icon: ShieldCheck, title: "Secure by Default", description: "Enterprise-grade access control on every service." },
  { icon: TrendingUp, title: "Built to Scale", description: "Grow bandwidth and add locations as you need them." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ServicesOfferedPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Services Offered</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Get Started" color="#1c808d" />
      </div>

      <P>
        Everything you can provision on Polarin falls into a handful of categories. Here's what each one does
        and when you'd reach for it. New here? Start with <PageLink label="About Polarin" onClick={() => onNavigate("about-polarin")} /> or jump
        straight into <PageLink label="Quick Setup" onClick={() => onNavigate("quick-setup")} />.
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "24px 0" }}>
        {SERVICE_CARDS.map((card) => (
          <ServiceCard key={card.num} card={card} />
        ))}
      </div>

      <BenefitsBand items={BENEFITS} />

      <H2 id="locations">Locations</H2>
      <P>
        Every service starts with a location - the data centre or point of presence where Polarin has a
        physical footprint. Browse <PageLink label="Locations" onClick={() => onNavigate("locations")} /> to see which sites are close to your infrastructure
        before ordering a port or connection there.
      </P>

      <H2 id="port">Port</H2>
      <P>
        A <strong>Port</strong> is your organisation's physical entry point into the Polarin network, available
        at 1GE, 10GE, or 100GE. It's the first thing you order at a new location - everything else (virtual
        connections, routers, cloud links) attaches to a port. See <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} /> for the full walkthrough.
      </P>
      <UL>
        <LI>Choose a speed that matches your current and near-term bandwidth needs.</LI>
        <LI>
          Group multiple ports into a <PageLink label="Link Aggregation Group" onClick={() => onNavigate("port-lag")} /> for higher throughput and failover.
        </LI>
      </UL>

      <H2 id="vr">Virtual Router</H2>
      <P>
        A <strong>Virtual Router</strong> is your L3 gateway for routing traffic between clouds, data centres,
        and partner networks, without deploying and maintaining physical routing hardware yourself. See <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} /> to get started.
      </P>
      <UL>
        <LI>Useful once you're connecting more than two endpoints and need real routing logic between them.</LI>
        <LI>Sits on top of a port - provision the port first, then attach a virtual router.</LI>
      </UL>

      <H2 id="cloud">Cloud Connect</H2>
      <P>
        Cloud Connect gives you a private, direct link into major cloud providers - bypassing the public
        internet for lower latency and more predictable performance than a standard VPN.
      </P>
      <UL>
        <LI>Point-to-point connections into your cloud provider(s) of choice.</LI>
        <LI>Better suited to steady, high-bandwidth workloads than internet-based connectivity.</LI>
      </UL>

      <H2 id="dci">Data Centre Interconnect (DCI)</H2>
      <P>
        DCI links two or more of your data centre sites together at high bandwidth - for replication,
        disaster recovery, or simply treating multiple sites as one extended network.
      </P>

      <Callout variant="tip">
        Not sure which service you need first? Most organisations start with a <strong>Port</strong>, then add
        a <strong>Virtual Router</strong> or <strong>Cloud Connect</strong> once they know what they're
        connecting to. <PageLink label="Quick Setup" onClick={() => onNavigate("quick-setup")} /> walks through the order.
      </Callout>

      <H2 id="manage">Managing What You Order</H2>
      <P>
        Once a service is ordered, its progress - from design through to live - shows up on the Services page,
        so you always know what's ready to use and what's still provisioning. All of it also feeds into the
        <strong> SPOG dashboard</strong> for a single view of usage and performance across every service you run.
      </P>
    </ArticlePage>
  );
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  const Icon = card.icon;
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 20,
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 22, height: 22, borderRadius: "50%", background: card.color, color: "#fff",
          fontFamily: FONT_J, fontWeight: 800, fontSize: 12, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {card.num}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: `${card.color}18`, color: card.color,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 15, color: "#0a3954", margin: "0 0 4px" }}>{card.title}</p>
        <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{card.description}</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {card.badges.map((b) => (
          <span key={b} style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700, color: card.color,
            background: `${card.color}12`, border: `1px solid ${card.color}30`,
            padding: "3px 9px", borderRadius: 20,
          }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitsBand({ items }: { items: { icon: ElementType; title: string; description: string }[] }) {
  return (
    <div style={{
      background: "linear-gradient(104.41deg, rgb(12,60,87) 0.86%, rgb(50,141,168) 103.67%)",
      borderRadius: 16, padding: 24, margin: "8px 0 32px",
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20,
    }}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}>
              <Icon size={16} />
            </div>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>{item.title}</p>
            <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{minutes} min read</span>;
}
function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />;
}
function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>{label}</span>;
}
