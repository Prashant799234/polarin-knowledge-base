import type { ElementType } from "react";
import { User, Plug, Router, Cloud, Server, Network, Building2 } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, FlowDiagram, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";
import { useWindowWidth } from "../useWindowWidth";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "what-it-does",  label: "What Polarin Does",   level: 2 as const },
  { id: "why-it-helps",  label: "Why It Helps",        level: 2 as const },
  { id: "how-it-fits",   label: "How the Pieces Fit",  level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function AboutPolarinPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">About Polarin</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Get Started" color="#1c808d" />
      </div>

      <P>
        Polarin is where you provision and manage your organisation's network connectivity - ports, virtual
        connections, cloud interconnects, and routers - from one place, without opening a support ticket for
        every change.
      </P>
      <P>
        Instead of emailing a network team and waiting on a quote, you pick a location, configure the service
        you need, and place the order yourself. Most services move from order to "live" in minutes rather than
        days.
      </P>

      <H2 id="what-it-does">What Polarin Does</H2>
      <P>Polarin covers the connections most organisations need to stitch their infrastructure together:</P>
      <UL>
        <LI>Physical <strong>Ports</strong> at data centre locations, the entry point for everything else.</LI>
        <LI><strong>Virtual Routers</strong> for L3 routing between clouds, data centres, and partners.</LI>
        <LI>Direct <strong>cloud connections</strong> into major providers, bypassing the public internet.</LI>
        <LI><strong>Data Centre Interconnect (DCI)</strong> for linking sites together at high bandwidth.</LI>
      </UL>
      <P>
        Every service is visible in one dashboard, so you can see what's live, what's pending, and what needs
        attention without switching between vendor portals. See <PageLink label="Services Offered" onClick={() => onNavigate("services-offered")} /> for the full breakdown.
      </P>

      <H2 id="why-it-helps">Why It Helps</H2>
      <UL>
        <LI><strong>Self-service:</strong> configure and order connectivity yourself instead of routing every request through a ticket queue.</LI>
        <LI><strong>One place to look:</strong> ports, routers, and cloud connections all show up in the same dashboard, with real status instead of a support thread.</LI>
        <LI><strong>Room to grow:</strong> scale bandwidth or add locations as your needs change, without renegotiating a contract each time.</LI>
        <LI><strong>Controlled access:</strong> invite teammates and assign roles, so the right people can act without sharing one login.</LI>
      </UL>

      <Callout variant="tip">
        Not sure where to start? <PageLink label="Services Offered" onClick={() => onNavigate("services-offered")} /> breaks down each service in more detail, and{" "}
        <PageLink label="Quick Setup" onClick={() => onNavigate("quick-setup")} /> walks through getting your account ready end to end.
      </Callout>

      <H2 id="how-it-fits">How the Pieces Fit Together</H2>
      <P>
        A typical setup starts with a <strong>Port</strong> at the data centre where you need a presence. From
        there, you can attach a <strong>Virtual Router</strong> to route traffic between sites, or connect
        straight into a cloud provider. Ports can also be bundled into a <PageLink label="Link Aggregation Group" onClick={() => onNavigate("port-lag")} />
        {" "}when you need more throughput or built-in redundancy.
      </P>

      <ConnectionDiagram />
      <P>
        None of these are locked together - use just a port if that's all you need, or combine several
        services as your network grows.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Read <PageLink label="Services Offered" onClick={() => onNavigate("services-offered")} /> for a closer look at each service category.</LI>
        <LI>Follow <PageLink label="Quick Setup" onClick={() => onNavigate("quick-setup")} /> to get your account, profile, and first service ready.</LI>
        <LI>
          Already set up? Jump straight to <PageLink label="Create a Port" onClick={() => onNavigate("port-create")} /> or{" "}
          <PageLink label="Create a Virtual Router" onClick={() => onNavigate("vr-create")} />.
        </LI>
      </UL>
    </ArticlePage>
  );
}

// ── Illustrated "how you connect" diagram ────────────────────────────────────

const W = 920;
const H = 300;

interface DiagramNodeData {
  id: string;
  x: number;
  y: number;
  icon: ElementType;
  color: string;
  label: string;
  caption?: string;
  size?: number;
}

const NODES: DiagramNodeData[] = [
  { id: "you",      x: 70,  y: 150, icon: User,     color: "#64748b", label: "You" },
  { id: "port",     x: 260, y: 150, icon: Plug,     color: "#1c808d", label: "Port", caption: "1GE · 10GE · 100GE", size: 60 },
  { id: "vr",       x: 480, y: 70,  icon: Router,   color: "#9e27fd", label: "Virtual Router" },
  { id: "cc",       x: 480, y: 150, icon: Cloud,    color: "#00b345", label: "Cloud Connect" },
  { id: "dci",      x: 480, y: 230, icon: Server,   color: "#fd5900", label: "DCI" },
  { id: "networks", x: 700, y: 70,  icon: Network,  color: "#94a3b8", label: "Other Networks" },
  { id: "clouds",   x: 700, y: 150, icon: Cloud,    color: "#94a3b8", label: "Cloud Providers" },
  { id: "sites",    x: 700, y: 230, icon: Building2, color: "#94a3b8", label: "Other Data Centres" },
];

const EDGES: [string, string][] = [
  ["you", "port"],
  ["port", "vr"], ["port", "cc"], ["port", "dci"],
  ["vr", "networks"], ["cc", "clouds"], ["dci", "sites"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function ConnectionDiagram() {
  const width = useWindowWidth();
  const isNarrow = width < 760;

  if (isNarrow) {
    return (
      <FlowDiagram
        actor="You"
        stages={[
          { title: "Port", items: [{ icon: <Plug size={16} />, label: "Physical access", caption: "1GE · 10GE · 100GE" }] },
          { title: "Route or Connect", items: [{ icon: <Router size={16} />, label: "Virtual Router" }, { icon: <Cloud size={16} />, label: "Cloud Connect" }, { icon: <Server size={16} />, label: "DCI" }] },
          { title: "Destination", items: [{ icon: <Network size={16} />, label: "Other networks, clouds & sites" }] },
        ]}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: H, margin: "24px 0" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="conn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#cbd5e1" />
          </marker>
        </defs>
        {EDGES.map(([a, b]) => {
          const from = nodeById(a);
          const to = nodeById(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#cbd5e1" strokeWidth={2} markerEnd="url(#conn-arrow)"
            />
          );
        })}
      </svg>
      {NODES.map((node) => (
        <DiagramNode key={node.id} node={node} />
      ))}
    </div>
  );
}

function DiagramNode({ node }: { node: DiagramNodeData }) {
  const Icon = node.icon;
  const size = node.size ?? 52;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${(node.x / W) * 100}%`,
          top: `${(node.y / H) * 100}%`,
          transform: "translate(-50%, -50%)",
          width: size, height: size, borderRadius: "50%",
          // Layered background (tint painted over solid white) so this circle
          // is fully opaque and cleanly hides the connector line behind it —
          // a plain translucent fill let the line bleed through.
          background: `linear-gradient(${node.color}18, ${node.color}18), #ffffff`,
          border: `1.5px solid ${node.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: node.color,
        }}
      >
        <Icon size={Math.round(size * 0.42)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: `${(node.x / W) * 100}%`,
          top: `${(node.y / H) * 100}%`,
          transform: `translate(-50%, ${size / 2 + 8}px)`,
          textAlign: "center", width: 140,
        }}
      >
        <p style={{ fontFamily: FONT_J, fontWeight: 700, fontSize: 12, color: "#0a3954", margin: 0, whiteSpace: "nowrap" }}>{node.label}</p>
        {node.caption && (
          <p style={{ fontFamily: FONT, fontSize: 10, color: "#94a3b8", margin: "2px 0 0" }}>{node.caption}</p>
        )}
      </div>
    </>
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
