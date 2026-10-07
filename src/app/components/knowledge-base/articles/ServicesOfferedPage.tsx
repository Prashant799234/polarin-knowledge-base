import type { ElementType } from "react";
import { Plug, Router, Cloud, Server, Waypoints, Globe, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "port",       label: "Port",                             level: 2 as const },
  { id: "vr",         label: "Virtual Router",                   level: 2 as const },
  { id: "cloud",      label: "Cloud Connect",               level: 2 as const },
  { id: "dci",        label: "Data Centre Interconnect",         level: 2 as const },
  { id: "ix",         label: "Internet Exchange",                level: 2 as const },
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
    description: "Private, point-to-point links to a cloud provider — DC to Cloud or Cloud to Cloud.",
    badges: ["DC to Cloud", "Cloud to Cloud"],
  },
  {
    num: 4, icon: Server, color: "#fd5900", title: "Data Centre Interconnect",
    description: "High-bandwidth links between two or more of your data centre sites.",
    badges: ["DCI Wave", "DCI Layer 2"],
  },
  {
    num: 5, icon: Waypoints, color: "#7c3aed", title: "Internet Exchange",
    description: "Peer directly with other networks over BGP instead of paying a transit provider.",
    badges: ["Multilateral", "Bilateral"],
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
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Get Started" color="#0f766e" />
      </ArticleMeta>

      <P>
        Everything you can provision on Polarin falls into a handful of categories. Here's what each one does
        and when you'd reach for it. Every one of them starts from a{" "}
        <PageLink label="location" onClick={() => onNavigate("locations")} /> — the data centre or point of
        presence where Polarin has a physical footprint. New here? Start with{" "}
        <PageLink label="About Polarin" onClick={() => onNavigate("about-polarin")} /> or jump
        straight into <PageLink label="Quick Setup" onClick={() => onNavigate("quick-setup")} />.
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "24px 0" }}>
        {SERVICE_CARDS.map((card) => (
          <ServiceCard key={card.num} card={card} />
        ))}
      </div>

      <BenefitsBand items={BENEFITS} />

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
        A <strong>Cloud Connect</strong> gives you a private, point-to-point link to a cloud provider - DC to
        Cloud or Cloud to Cloud - bypassing the public internet for lower latency and more predictable
        performance than a standard VPN. See <PageLink label="What Is Cloud Connect?" onClick={() => onNavigate("vc-overview")} /> for the full breakdown.
      </P>
      <UL>
        <LI>Two types: DC to Cloud (a port you own reaching a cloud provider) and Cloud to Cloud (two cloud providers linked via a Virtual Router).</LI>
        <LI>Better suited to steady, high-bandwidth workloads than internet-based connectivity.</LI>
      </UL>

      <H2 id="dci">Data Centre Interconnect (DCI)</H2>
      <P>
        DCI links two or more of your data centre sites together at high bandwidth - for replication,
        disaster recovery, or simply treating multiple sites as one extended network. See <PageLink label="Create a Data Centre Interconnect" onClick={() => onNavigate("dci-create")} /> to get started.
      </P>
      <UL>
        <LI><strong>DCI Wave</strong>: dedicated, point-to-point optical connectivity (Layer 1) between two entire sites — the highest, most predictable throughput, with no port required.</LI>
        <LI><strong>DCI Layer 2</strong>: an Ethernet-based connection over two of your own ports - the more common choice, since it rides on infrastructure you've likely already provisioned.</LI>
      </UL>

      <H2 id="ix">Internet Exchange</H2>
      <P>
        <strong>Internet Exchange</strong> connects your Port to Polarin's peering fabric, so you exchange
        traffic directly with other networks over BGP instead of routing it through an upstream transit
        provider. See <PageLink label="What Is Internet Exchange?" onClick={() => onNavigate("ix-overview")} /> for the full breakdown.
      </P>
      <UL>
        <LI><strong>Multilateral (route-server) peering</strong>: one BGP session picks up every other participant on the exchange at once.</LI>
        <LI><strong>Bilateral peering</strong>: a direct, one-to-one BGP session with a specific network.</LI>
      </UL>

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

