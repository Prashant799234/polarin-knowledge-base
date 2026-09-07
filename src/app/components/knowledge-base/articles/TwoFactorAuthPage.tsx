import type { ElementType } from "react";
import { Shield, Mail } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",   label: "Overview" },
  { id: "choosing",   label: "Choosing a Method",           level: 2 as const },
  { id: "app-setup",  label: "Setting Up an Authenticator App", level: 2 as const },
  { id: "email-setup", label: "Setting Up Email Code",       level: 2 as const },
  { id: "next-steps", label: "Next Steps" },
];

interface MethodCard {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
}

const METHODS: MethodCard[] = [
  { icon: Shield, color: "#1c808d", title: "Authenticator App", description: "Scan a QR code once into an app like Google Authenticator or Duo. Codes generate on your phone, no internet or email needed at login." },
  { icon: Mail,   color: "#0a3954", title: "Email Code",         description: "Get a 6-digit code emailed to your registered address each time you sign in. No app to install, but you need inbox access at login." },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function TwoFactorAuthPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Two-Factor Authentication</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </div>

      <P>
        <strong>Two-factor authentication (2FA)</strong> adds a second check beyond your password when you sign in — even if your password leaks, an attacker still can't get in without also having your phone or your email inbox. It's optional, but worth turning on for any account with billing or provisioning access.
      </P>

      {/* ── Choosing a method ── */}
      <H2 id="choosing">Choosing a Method</H2>
      <P>From <strong>Set up Two-Factor Authentication</strong> on your Profile page, pick one of two methods:</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "16px 0 24px" }}>
        {METHODS.map((m) => <MethodTile key={m.title} method={m} />)}
      </div>
      <Callout variant="tip">
        For a smoother experience, Polarin recommends an authenticator app like <strong>Google Authenticator</strong> or <strong>Duo</strong> — codes generate instantly on your device without waiting on an email to arrive.
      </Callout>

      {/* ── Authenticator app ── */}
      <H2 id="app-setup">Setting Up an Authenticator App</H2>
      <Steps>
        <Step num={1} title="Click Set Up Two-Factor Authentication">
          Opens the setup panel with both methods available. <strong>Authenticator App</strong> is selected by default.
        </Step>
        <Step num={2} title="Scan the QR code">
          Open your authenticator app and scan the code shown on screen. Can't scan it? Use <strong>Or enter the code manually</strong> below the QR code instead — it's the same setup key, just typed in by hand.
        </Step>
        <Step num={3} title="Enter the 6-digit code your app generates">
          Type the current code from your authenticator app into the confirmation field.
        </Step>
        <Step num={4} title="Confirm">
          Confirms your app generated a valid code before 2FA is enforced on future logins.
        </Step>
      </Steps>
      <Callout variant="important">
        Treat the manual setup key exactly like a password — anyone with it can generate valid codes for your account. If you lose access to your authenticator app, you'll need Support to help you back in, so keep backup codes or a note of the setup key somewhere safe.
      </Callout>

      {/* ── Email code ── */}
      <H2 id="email-setup">Setting Up Email Code</H2>
      <Steps>
        <Step num={1} title="Click Set Up Two-Factor Authentication, then select Email Code">
          Switches the panel to show <strong>Verify your email address</strong>.
        </Step>
        <Step num={2} title="Click Request Verification Code">
          Sends a 6-digit code to your registered email address.
        </Step>
        <Step num={3} title="Enter the code before it expires">
          The code is time-limited — the panel shows a countdown so you know exactly how long you have.
        </Step>
        <Step num={4} title="Click Verify">
          Confirms your inbox access and finishes setup. From then on, every login sends a fresh code to that email.
        </Step>
      </Steps>
      <Callout variant="tip">
        Code expired before you entered it? No need to restart the whole flow — just request a new one from the same screen.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Haven't rotated your password in a while? <PageLink label="Update Password" onClick={() => onNavigate("profile-password")} />.</LI>
        <LI>Need to update your name or phone number too? <PageLink label="Personal Information" onClick={() => onNavigate("profile-personal")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

function MethodTile({ method }: { method: MethodCard }) {
  const Icon = method.icon;
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e2e8f1", borderRadius: 16, padding: 20,
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${method.color}18`, color: method.color,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontFamily: FONT_J, fontWeight: 800, fontSize: 14, color: "#0a3954", margin: "0 0 4px" }}>{method.title}</p>
        <p style={{ fontFamily: FONT, fontSize: 12.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{method.description}</p>
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
