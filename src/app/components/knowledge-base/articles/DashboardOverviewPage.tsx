import { ArticlePage, H1, H2, P, UL, LI, Callout, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "services",    label: "Total Services",       level: 2 as const },
  { id: "map",         label: "The Global Map",        level: 2 as const },
  { id: "interacting", label: "Interacting With the Map", level: 2 as const },
  { id: "view-settings", label: "View Settings",       level: 2 as const },
  { id: "quick-links", label: "Quick Links",           level: 2 as const },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function DashboardOverviewPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Dashboard</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Getting Around" color="#1c808d" />
      </div>

      <P>
        The <strong>Dashboard</strong> is what you land on after signing in — your service count at a glance on
        the left, and an interactive global map on the right showing exactly where your network actually sits.
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
        Every location relevant to your account shows up on the map, toggleable between a rotating <strong>globe</strong> and a flat <strong>map</strong> view using the two icons on the right edge. The legend at the bottom distinguishes:
      </P>
      <UL>
        <LI><strong>Live</strong> — the service at this location is active.</LI>
        <LI><strong>Down</strong> — a live service here has lost connectivity.</LI>
        <LI><strong>Design</strong> — a service here is configured but not yet ordered.</LI>
        <LI><strong>Polarin PoPs</strong> — Polarin-owned data centres that make up the backbone infrastructure.</LI>
        <LI><strong>Active Service PoP</strong> — specifically where <em>you</em> have a service deployed, distinct from Polarin's full footprint.</LI>
      </UL>
      <P>
        When several locations sit close together, the map groups them into a numbered <strong>cluster</strong> — click it to zoom in and split it back into individual points. A cluster's ring colour tells you its aggregate status at a glance: green for all-live, mixed colours when some services are down, and a small badge if anything in that cluster has an active alert.
      </P>
      <Callout variant="tip">
        Click the <strong>ⓘ</strong> icon next to the legend for a full breakdown of every marker and cluster style — handy the first few times you're reading the map.
      </Callout>

      {/* ── Interacting with the map ── */}
      <H2 id="interacting">Interacting With the Map</H2>
      <UL>
        <LI><strong>Hover a connection line</strong> between two points to see a quick card: the service name, its parent product, and the A-End and Z-End ports with the bandwidth between them. Click the card for full service details.</LI>
        <LI><strong>Click a PoP marker</strong> to open a side panel listing every service at that location, split into <strong>Ordered Services</strong> (what you've already provisioned there) and <strong>Available to Order</strong> (what you could add). Search or filter by Live/Down right from that panel.</LI>
        <LI><strong>Zoom, search, and reset</strong> using the toolbar on the right edge of the map — the search icon jumps straight to a named location instead of panning manually.</LI>
      </UL>

      {/* ── View settings ── */}
      <H2 id="view-settings">View Settings</H2>
      <P>The gear icon on the map toolbar opens <strong>View Settings</strong>, with two groups of controls:</P>
      <UL>
        <LI><strong>Primary View</strong> — switch between <strong>Show All Locations</strong> (Polarin's full footprint plus yours) and <strong>Customer Locations</strong> (just where you're deployed).</LI>
        <LI><strong>Display Options</strong> — toggle <strong>Cable System View</strong> (the connection paths between locations), <strong>Show PoP Names</strong> (label every point of presence), and <strong>Auto Spin Globe</strong> (a slow automatic rotation, useful if you're leaving the dashboard up on a screen).</LI>
      </UL>

      {/* ── Quick links ── */}
      <H2 id="quick-links">Quick Links</H2>
      <P>Three shortcuts sit below your service count for the most common next actions:</P>
      <UL>
        <LI><strong>Add a service</strong> — jumps to the services catalogue. See the ordering guide for the specific product you need under <strong>Products</strong> in the sidebar.</LI>
        <LI><strong>Invite Your Teammates</strong> — bring colleagues onto the account. See <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.</LI>
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
