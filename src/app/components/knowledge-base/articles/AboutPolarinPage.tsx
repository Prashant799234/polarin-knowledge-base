import { ArticlePage, H1, H2, P, UL, LI, Callout } from "../ArticlePage";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "what-it-does",  label: "What Polarin Does",   level: 2 as const },
  { id: "why-it-helps",  label: "Why It Helps",        level: 2 as const },
  { id: "how-it-fits",   label: "How the Pieces Fit",  level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

export function AboutPolarinPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">About Polarin</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Get Started" color="#1c808d" />
      </div>

      <P>
        Polarin is where you provision and manage your organisation's network connectivity — ports, virtual
        connections, cloud interconnects, and routers — from one place, without opening a support ticket for
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
        attention without switching between vendor portals.
      </P>

      <H2 id="why-it-helps">Why It Helps</H2>
      <UL>
        <LI><strong>Self-service:</strong> configure and order connectivity yourself instead of routing every request through a ticket queue.</LI>
        <LI><strong>One place to look:</strong> ports, routers, and cloud connections all show up in the same dashboard, with real status instead of a support thread.</LI>
        <LI><strong>Room to grow:</strong> scale bandwidth or add locations as your needs change, without renegotiating a contract each time.</LI>
        <LI><strong>Controlled access:</strong> invite teammates and assign roles, so the right people can act without sharing one login.</LI>
      </UL>

      <Callout variant="tip">
        Not sure where to start? <strong>Services Offered</strong> breaks down each service in more detail, and
        <strong> Quick Setup</strong> walks through getting your account ready end to end.
      </Callout>

      <H2 id="how-it-fits">How the Pieces Fit Together</H2>
      <P>
        A typical setup starts with a <strong>Port</strong> at the data centre where you need a presence. From
        there, you can attach a <strong>Virtual Router</strong> to route traffic between sites, or connect
        straight into a cloud provider. Ports can also be bundled into a <strong>Link Aggregation Group</strong>
        {" "}when you need more throughput or built-in redundancy.
      </P>
      <P>
        None of these are locked together — use just a port if that's all you need, or combine several
        services as your network grows.
      </P>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Read <strong>Services Offered</strong> for a closer look at each service category.</LI>
        <LI>Follow <strong>Quick Setup</strong> to get your account, profile, and first service ready.</LI>
        <LI>Already set up? Jump straight to <strong>Create a Port</strong> or <strong>Create a Virtual Router</strong>.</LI>
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
