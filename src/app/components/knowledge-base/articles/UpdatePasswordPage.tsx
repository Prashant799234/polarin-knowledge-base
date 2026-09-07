import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "requirements",  label: "Password Requirements", level: 2 as const },
  { id: "steps",         label: "Update Your Password",  level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
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

export function UpdatePasswordPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Update Password</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </div>

      <P>
        The <strong>Password</strong> card on your <PageLink label="Profile" onClick={() => onNavigate("profile-personal")} /> page shows your current password masked, confirms it still meets Polarin's security requirements, and tells you when it was last changed. Click <strong>Update Password</strong> to rotate it.
      </P>

      {/* ── Requirements ── */}
      <H2 id="requirements">Password Requirements</H2>
      <P>A new password must satisfy all four rules before Polarin will accept it:</P>
      <UL>
        {PASSWORD_RULES.map((rule) => <LI key={rule}>{rule}</LI>)}
      </UL>
      <Callout variant="info">
        The update form checks each requirement live as you type your new password — each one ticks off individually, so you can see exactly what's still missing instead of guessing after a failed submit.
      </Callout>

      {/* ── Steps ── */}
      <H2 id="steps">Update Your Password</H2>
      <Steps>
        <Step num={1} title="Click Update Password">
          Opens the <strong>Update Your Password</strong> panel.
        </Step>
        <Step num={2} title="Enter your Old Password">
          Confirms it's really you before anything changes.
        </Step>
        <Step num={3} title="Enter your New Password">
          Watch the requirements checklist below the field — each rule confirms as your new password satisfies it.
        </Step>
        <Step num={4} title="Re-enter it in Confirm New Password">
          Catches typos before saving — the two fields must match exactly.
        </Step>
        <Step num={5} title="Click Update Password">
          The button stays disabled until the old password is verified, every requirement is met, and both new-password fields match.
        </Step>
      </Steps>

      <Callout variant="tip">
        Rotate your password periodically, and immediately if you suspect it's been shared, reused elsewhere, or exposed in any way.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Also update your name or phone number? <PageLink label="Personal Information" onClick={() => onNavigate("profile-personal")} />.</LI>
        <LI>A password alone isn't enough for sensitive accounts — add <PageLink label="Two-Factor Authentication" onClick={() => onNavigate("profile-2fa")} />.</LI>
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
