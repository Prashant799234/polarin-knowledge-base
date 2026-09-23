import type { ElementType } from "react";
import { Shield, Mail } from "lucide-react";
import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "choosing",    label: "Choosing a Method",              level: 2 as const },
  { id: "app-setup",   label: "Setting Up an Authenticator App", level: 2 as const },
  { id: "email-setup",  label: "Setting Up Email Code",          level: 2 as const },
  { id: "next-steps",  label: "Next Steps" },
];

interface MethodCard {
  icon: ElementType;
  color: string;
  title: string;
  description: string;
}

const METHODS: MethodCard[] = [
  {
    icon: Shield,
    color: "#1c808d",
    title: "Authenticator App",
    description: "Scan a QR code once into an authenticator app (such as Google Authenticator or Duo). Codes generate locally on your device without needing mobile connectivity or email delivery at login.",
  },
  {
    icon: Mail,
    color: "#0a3954",
    title: "Email Code",
    description: "Receive a time-limited 6-digit one-time passcode sent directly to your registered email address every time you sign in. No mobile app required, but requires active inbox access when logging in.",
  },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function TwoFactorAuthPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Two-Factor Authentication</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </ArticleMeta>

      <P>
        <strong>Two-factor authentication (2FA)</strong> adds a vital second layer of defense beyond your password
        when logging in to Polarin. Even if your password becomes compromised, unauthorized users cannot access
        your account without physical access to your authenticator device or your email inbox.
      </P>

      {/* ── Choosing a method ── */}
      <H2 id="choosing">Choosing a Method</H2>
      <P>
        From the <strong>Two-factor authentication</strong> card on your <PageLink label="Profile" onClick={() => onNavigate("profile-personal")} /> page,
        click <strong>Set up Two-Factor Authentication</strong> to open the setup drawer. You can choose between two methods:
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, margin: "16px 0 24px" }}>
        {METHODS.map((m) => <MethodTile key={m.title} method={m} />)}
      </div>

      <Callout variant="tip">
        For the best experience, Polarin recommends using an <strong>Authenticator App</strong> like Google Authenticator or Duo.
        Time-based one-time passcodes (TOTP) generate instantaneously offline on your phone without waiting for email delivery.
      </Callout>

      {/* ── Authenticator app ── */}
      <H2 id="app-setup">Setting Up an Authenticator App</H2>
      <P>
        The <strong>Authenticator App</strong> tab <strong>①</strong> is selected by default upon opening the drawer:
      </P>

      <DocImage
        src="/screenshots/profile/04-setup-2fa-app.jpg"
        alt="Set up Two-Factor Authentication drawer showing QR code and manual setup key"
        caption="① Method tabs (Authenticator App selected) — ② QR Code and manual setup key — ③ 6-digit code entry and Verify button"
      />

      <Steps>
        <Step num={1} title="Click Set up Two-Factor Authentication">
          Opens the setup drawer with <strong>Authenticator App ①</strong> active.
        </Step>
        <Step num={2} title="Scan the QR Code or copy the manual key">
          Open Google Authenticator, Duo, Microsoft Authenticator, or 1Password on your mobile device and point your camera at the QR code <strong>②</strong>.
          If your device camera is unavailable, copy the 32-character secret key shown under <em>Or enter the code manually</em> and paste it directly into your authenticator app.
        </Step>
        <Step num={3} title="Enter the generated 6-digit code">
          Type the 6-digit temporary verification code displayed in your authenticator app into the six entry boxes <strong>③</strong>.
        </Step>
        <Step num={4} title="Click Verify">
          Click <strong>Verify ③</strong>. Polarin confirms that your authenticator app is generating synchronized codes and enables 2FA protection for all subsequent sign-ins.
        </Step>
      </Steps>

      <Callout variant="important">
        Treat your manual setup key as sensitive confidential data. Keep a secure backup of your authenticator account or export your authenticator credentials so you do not lose account access if you replace your phone.
      </Callout>

      {/* ── Email code ── */}
      <H2 id="email-setup">Setting Up Email Code</H2>
      <P>
        If you prefer receiving verification codes via email, select the <strong>Email Code</strong> tab:
      </P>

      <DocImage
        src="/screenshots/profile/05-setup-2fa-email.jpg"
        alt="Set up Two-Factor Authentication drawer showing email code countdown and verification inputs"
        caption="① Email Code tab — ② Email sent confirmation with 2:00 expiration countdown — ③ 6-digit code entry and Verify button"
      />

      <Steps>
        <Step num={1} title="Select Email Code">
          Click the <strong>Email Code</strong> tab <strong>①</strong> at the top of the setup drawer.
        </Step>
        <Step num={2} title="Click Request Verification Code">
          Click <strong>Request Verification Code</strong> to trigger an email dispatch to your registered login address.
        </Step>
        <Step num={3} title="Check your inbox before the code expires">
          The drawer confirms <em>Email sent successfully!</em> <strong>②</strong> and starts a <strong>2:00 countdown timer</strong>. Locate the 6-digit verification code sent by Polarin in your email inbox.
        </Step>
        <Step num={4} title="Enter the 6-digit code and click Verify">
          Type the received code into the six input boxes <strong>③</strong> and click <strong>Verify</strong> to activate email-based 2FA.
        </Step>
      </Steps>

      <Callout variant="tip">
        If the timer expires before you enter the code, simply request a fresh code directly from the screen without restarting the process.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Review your login credentials: <PageLink label="Update Password" onClick={() => onNavigate("profile-password")} />.</LI>
        <LI>Keep your personal contact details up to date: <PageLink label="Personal Information" onClick={() => onNavigate("profile-personal")} />.</LI>
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
