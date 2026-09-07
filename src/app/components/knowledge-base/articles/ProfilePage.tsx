import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "personal-info", label: "Personal Information", level: 2 as const },
  { id: "password",      label: "Password",             level: 2 as const },
  { id: "2fa",           label: "Two-Factor Authentication", level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

const PERSONAL_FIELDS = [
  { field: "Name",         description: "Your display name across Polarin — editable any time.",                                    required: true },
  { field: "Email ID",     description: "The email tied to your account. Read-only here — contact your admin or Support to change it.", required: false },
  { field: "Phone Number", description: "Select your country code, then enter your number.",                                          required: false },
  { field: "Role",         description: "Read-only — set by your organisation's admin under User Management, not by you.",            required: false },
];

const PASSWORD_RULES = [
  "At least 8 characters",
  "At least 1 upper case letter",
  "At least 1 number",
  "At least 1 special character",
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function ProfilePage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Profile</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </div>

      <P>
        Your <strong>Profile</strong> covers your own account — separate from anything under{" "}
        <PageLink label="Organisation Details" onClick={() => onNavigate("org-profile")} />, which is shared
        across your whole team. It's kept to three distinct areas: your personal information, your password,
        and two-factor authentication.
      </P>

      {/* ── Personal Information ── */}
      <H2 id="personal-info">Personal Information</H2>
      <P>
        Shows your name, phone number, email, and role at a glance. Click <strong>Edit</strong> to open the
        update form:
      </P>
      <FieldTable rows={PERSONAL_FIELDS} />
      <Callout variant="info">
        Email and Role are shown read-only in the edit form on purpose — email changes and role changes both
        need to go through an admin, so they can't be self-served from here.
      </Callout>
      <Steps>
        <Step num={1} title="Click Edit on Personal Information">
          Opens the <strong>Update Your Personal Information</strong> panel.
        </Step>
        <Step num={2} title="Update your Name and/or Phone Number">
          Email and Role stay locked — everything else is yours to edit.
        </Step>
        <Step num={3} title="Click Update">
          Changes apply immediately, no admin approval needed for name or phone.
        </Step>
      </Steps>

      {/* ── Password ── */}
      <H2 id="password">Password</H2>
      <P>
        Shows your current password, masked, along with when it was last changed. Click{" "}
        <strong>Update Password</strong> to rotate it.
      </P>
      <UL>
        {PASSWORD_RULES.map((rule) => <LI key={rule}>{rule}</LI>)}
      </UL>
      <Steps>
        <Step num={1} title="Click Update Password">
          Opens the <strong>Update Your Password</strong> panel.
        </Step>
        <Step num={2} title="Enter your old password, then your new one">
          A live checklist confirms each requirement as your new password meets it.
        </Step>
        <Step num={3} title="Confirm the new password and submit">
          Re-enter it in <strong>Confirm New Password</strong> to catch typos before saving.
        </Step>
      </Steps>
      <Callout variant="tip">
        Rotate your password periodically, and immediately if you suspect it's been shared or exposed.
      </Callout>

      {/* ── 2FA ── */}
      <H2 id="2fa">Two-Factor Authentication</H2>
      <P>
        An optional extra layer of security beyond your password — worth turning on for any account with
        billing or provisioning access. Two ways to receive your verification code:
      </P>
      <UL>
        <LI><strong>Authenticator App</strong> — scan a QR code (or enter the setup key manually) into an app like Google Authenticator or Duo, then enter the 6-digit code it generates.</LI>
        <LI><strong>Email Code</strong> — receive a verification code by email each time you sign in.</LI>
      </UL>
      <Steps>
        <Step num={1} title="Click Set Up Two-Factor Authentication">
          Opens the setup panel with both methods to choose from.
        </Step>
        <Step num={2} title="Choose Authenticator App or Email Code">
          For an app, scan the QR code shown — or enter the setup key manually if you can't scan.
        </Step>
        <Step num={3} title="Enter the 6-digit code to confirm">
          Confirms your authenticator is set up correctly before 2FA is enforced on future logins.
        </Step>
      </Steps>
      <Callout variant="important">
        Keep your setup key or backup codes somewhere safe — if you lose access to your authenticator app or
        inbox, you'll need Support to help you back into your account.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Managing your team instead of just yourself? <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.</LI>
        <LI>Looking for organisation-wide settings? <PageLink label="Organisation Details" onClick={() => onNavigate("org-profile")} />.</LI>
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
