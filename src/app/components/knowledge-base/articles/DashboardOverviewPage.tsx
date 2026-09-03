import { ArticlePage, H1, H2, P, UL, LI, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "services",    label: "Total Services",     level: 2 as const },
  { id: "map",         label: "The Global Map",      level: 2 as const },
  { id: "quick-links", label: "Quick Links",         level: 2 as const },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function DashboardOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Dashboard</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="Getting Around" color="#1c808d" />
      </div>

      <P>
        The <strong>Dashboard</strong> is what you land on after signing in — a single view of how many
        services you're running, which ones need attention, and where your network actually sits on the map.
      </P>

      {/* ── Total services ── */}
      <H2 id="services">Total Services</H2>
      <P>
        A running count of every service on your account, broken down into what's <strong>live and
        kicking</strong> versus what <strong>needs your attention</strong> — anything sitting in Design,
        pending an order, or in a Down state. Click <strong>View all services</strong> to jump straight to the
        full list.
      </P>

      {/* ── Map ── */}
      <H2 id="map">The Global Map</H2>
      <P>
        Every location relevant to your account shows up on the map — Polarin's own points of presence, and
        the specific sites where you have an active service. The legend distinguishes:
      </P>
      <UL>
        <LI><strong>Live</strong> — the service at this location is active.</LI>
        <LI><strong>Down</strong> — a live service here has lost connectivity.</LI>
        <LI><strong>Design</strong> — a service here is configured but not yet ordered.</LI>
        <LI><strong>Polarin PoPs</strong> vs <strong>Active Service PoP</strong> — Polarin's full footprint versus specifically where you're connected.</LI>
      </UL>

      {/* ── Quick links ── */}
      <H2 id="quick-links">Quick Links</H2>
      <P>Three shortcuts sit below your service count for the most common next actions:</P>
      <UL>
        <LI><strong>Add a service</strong> — jumps to the services catalogue. See the ordering guide for the specific product you need under <strong>Products</strong> in the sidebar.</LI>
        <LI><strong>Invite Your Teammates</strong> — bring colleagues onto the account. See <PageLink label="Invite Team Members" onClick={() => onNavigate("invite-members")} />.</LI>
        <LI><strong>Developer Portal</strong> — generate API keys and explore the API reference directly.</LI>
      </UL>
    </ArticlePage>
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
