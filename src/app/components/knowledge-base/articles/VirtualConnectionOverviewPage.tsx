import type { ElementType } from "react";
import { Server, Cloud, Building2 } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "types",      label: "The Three Types", level: 2 as const },
  { id: "choosing",   label: "Which One Do You Need?", level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface ConnType {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
}

const TYPES: ConnType[] = [
  { icon: Building2, color: "#1a65fd", title: "DC to DC",      description: "Links two of your own data centre sites together, over Polarin's network instead of leased dark fibre." },
  { icon: Cloud,      color: "#00b345", title: "DC to Cloud",   description: "Links a data centre site directly into a cloud provider — AWS, Azure, or GCP — bypassing the public internet." },
  { icon: Server,     color: "#fd5900", title: "Cloud to Cloud", description: "Links two cloud providers, or two regions of the same provider, directly to each other." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function VirtualConnectionOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">What Is a Virtual Connection?</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Products" color="#00b345" />
      </div>

      <P>
        A <strong>Virtual Connection</strong> is a private, point-to-point link between two endpoints on
        Polarin's network — bypassing the public internet for lower latency and more predictable performance
        than a standard VPN. It's the simplest way to connect two specific places together.
      </P>

      <P>
        Every Virtual Connection is one of three types, depending on what's on each end:
      </P>

      {/* ── Types ── */}
      <H2 id="types">The Three Types</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, margin: "16px 0 24px" }}>
        {TYPES.map((t) => (
          <TypeCard key={t.title} type={t} />
        ))}
      </div>

      {/* ── Choosing ── */}
      <H2 id="choosing">Which One Do You Need?</H2>
      <UL>
        <LI>Extending your own infrastructure across sites, for replication or disaster recovery? <strong>DC to DC.</strong></LI>
        <LI>Reaching a cloud provider from your own equipment? <strong>DC to Cloud.</strong></LI>
        <LI>Connecting workloads that already live in two different clouds, or two regions? <strong>Cloud to Cloud.</strong></LI>
      </UL>

      <Callout variant="tip">
        Connecting more than two points, or need real routing logic between them? A single Virtual Connection
        is point-to-point only — reach for a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-overview")} /> instead once the topology grows past a simple link.
      </Callout>

      <P>
        Every Virtual Connection attaches to a <PageLink label="Port" onClick={() => onNavigate("port-overview")} /> at the Polarin end — provision that first if you don't already have one at the location you need.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Ready to set one up? <PageLink label="Create a Virtual Connection" onClick={() => onNavigate("cloud-connect")} />.</LI>
        <LI>Need something with routing logic instead? <PageLink label="What Is a Virtual Router?" onClick={() => onNavigate("vr-overview")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

function TypeCard({ type }: { type: ConnType }) {
  const Icon = type.icon;
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 20,
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${type.color}18`, color: type.color,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#0a3954", margin: "0 0 4px" }}>{type.title}</p>
        <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{type.description}</p>
      </div>
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
