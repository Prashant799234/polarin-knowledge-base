import { UserCircle, ShieldCheck, UserPlus, Plug } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FlowDiagram, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "checklist",  label: "The Checklist", level: 2 as const },
  { id: "next",       label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function QuickSetupPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Quick Setup</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Get Started" color="#1c808d" />
      </div>

      <P>
        A fast path through the pages you'll need to get your account ready and your first service live. Each
        step links to a full guide if you want more detail.
      </P>

      <FlowDiagram
        actor="You"
        stages={[
          { title: "Account", items: [{ icon: <UserCircle size={16} />, label: "Sign Up" }] },
          { title: "Verification", items: [{ icon: <ShieldCheck size={16} />, label: "Org Profile + KYC" }] },
          { title: "Team", items: [{ icon: <UserPlus size={16} />, label: "Invite Members" }] },
          { title: "Service", items: [{ icon: <Plug size={16} />, label: "Create a Port" }] },
        ]}
      />

      <H2 id="checklist">The Checklist</H2>

      <Steps>
        <Step num={1} title="Create your account">
          <P>
            Sign up, verify your email, and set a password. See <PageLink label="Create a Polarin Account" onClick={() => onNavigate("create-account")} /> for the full walkthrough.
          </P>
        </Step>
        <Step num={2} title="Complete your organisation profile">
          <P>
            Add your organisation's details and submit KYC documents so Polarin can verify your account. Start with{" "}
            <PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} />, then check{" "}
            <PageLink label="KYC Document Requirements" onClick={() => onNavigate("org-kyc")} /> for what's needed for your entity type.
          </P>
        </Step>
        <Step num={3} title="Invite your team">
          <P>
            Add colleagues and assign roles so more than one person can manage services. See{" "}
            <PageLink label="Invite Team Members" onClick={() => onNavigate("invite-members")} />.
          </P>
        </Step>
        <Step num={4} title="Order your first service">
          <P>
            Once your organisation is verified, provision a <PageLink label="Port" onClick={() => onNavigate("port-create")} /> at the location you need. From there,
            attach a <PageLink label="Virtual Router" onClick={() => onNavigate("vr-create")} /> or set up a cloud connection, depending on what you're connecting to.
          </P>
        </Step>
      </Steps>

      <Callout variant="tip">
        Not sure which service fits your use case? <PageLink label="Services Offered" onClick={() => onNavigate("services-offered")} /> breaks each one down, and{" "}
        <PageLink label="About Polarin" onClick={() => onNavigate("about-polarin")} /> covers the bigger picture.
      </Callout>

      <H2 id="next">Next Steps</H2>
      <UL>
        <LI>Once your first port is live, check its progress under <strong>Understand Port Status</strong>.</LI>
        <LI>Keep an eye on activity across your account from the <strong>Activity Log</strong>.</LI>
        <LI>Need help along the way? <PageLink label="Contact Support" onClick={() => onNavigate("contact-support")} /> is always available.</LI>
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
