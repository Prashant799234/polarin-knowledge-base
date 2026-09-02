import { ArticlePage, H1, H2, P, UL, LI, Callout } from "../ArticlePage";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "locations",  label: "Locations",                       level: 2 as const },
  { id: "port",       label: "Port",                             level: 2 as const },
  { id: "vr",         label: "Virtual Router",                   level: 2 as const },
  { id: "cloud",      label: "Cloud Connect",                    level: 2 as const },
  { id: "dci",        label: "Data Centre Interconnect",         level: 2 as const },
  { id: "manage",     label: "Managing What You Order",          level: 1 as const },
];

export function ServicesOfferedPage() {
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
        and when you'd reach for it.
      </P>

      <H2 id="locations">Locations</H2>
      <P>
        Every service starts with a location — the data centre or point of presence where Polarin has a
        physical footprint. Browse available locations to see which sites are close to your infrastructure
        before ordering a port or connection there.
      </P>

      <H2 id="port">Port</H2>
      <P>
        A <strong>Port</strong> is your organisation's physical entry point into the Polarin network, available
        at 1GE, 10GE, or 100GE. It's the first thing you order at a new location — everything else (virtual
        connections, routers, cloud links) attaches to a port.
      </P>
      <UL>
        <LI>Choose a speed that matches your current and near-term bandwidth needs.</LI>
        <LI>Group multiple ports into a <strong>Link Aggregation Group (LAG)</strong> for higher throughput and failover.</LI>
      </UL>

      <H2 id="vr">Virtual Router</H2>
      <P>
        A <strong>Virtual Router</strong> is your L3 gateway for routing traffic between clouds, data centres,
        and partner networks, without deploying and maintaining physical routing hardware yourself.
      </P>
      <UL>
        <LI>Useful once you're connecting more than two endpoints and need real routing logic between them.</LI>
        <LI>Sits on top of a port — provision the port first, then attach a virtual router.</LI>
      </UL>

      <H2 id="cloud">Cloud Connect</H2>
      <P>
        Cloud Connect gives you a private, direct link into major cloud providers — bypassing the public
        internet for lower latency and more predictable performance than a standard VPN.
      </P>
      <UL>
        <LI>Point-to-point connections into your cloud provider(s) of choice.</LI>
        <LI>Better suited to steady, high-bandwidth workloads than internet-based connectivity.</LI>
      </UL>

      <H2 id="dci">Data Centre Interconnect (DCI)</H2>
      <P>
        DCI links two or more of your data centre sites together at high bandwidth — for replication,
        disaster recovery, or simply treating multiple sites as one extended network.
      </P>

      <Callout variant="tip">
        Not sure which service you need first? Most organisations start with a <strong>Port</strong>, then add
        a <strong>Virtual Router</strong> or <strong>Cloud Connect</strong> once they know what they're
        connecting to.
      </Callout>

      <H2 id="manage">Managing What You Order</H2>
      <P>
        Once a service is ordered, its progress — from design through to live — shows up on the Services page,
        so you always know what's ready to use and what's still provisioning. All of it also feeds into the
        <strong> SPOG dashboard</strong> for a single view of usage and performance across every service you run.
      </P>
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
