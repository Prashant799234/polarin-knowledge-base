import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",      label: "Overview" },
  { id: "requirements",  label: "Password Requirements", level: 2 as const },
  { id: "steps",         label: "Update Your Password",  level: 2 as const },
  { id: "next-steps",    label: "Next Steps" },
];

const PASSWORD_RULES = [
  "Password should have 8 characters.",
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
      <ArticleMeta>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </ArticleMeta>

      <P>
        The <strong>Password</strong> card on your <PageLink label="Profile" onClick={() => onNavigate("profile-personal")} /> page
        displays your masked password, verifies that it satisfies Polarin's security standard (
        <em>Your current password meets all security requirements</em>), and indicates the date on which it was last changed.
        Click <strong>Update Password</strong> to rotate your credentials at any time.
      </P>

      {/* ── Requirements ── */}
      <H2 id="requirements">Password Requirements</H2>
      <P>Before Polarin accepts a new password, it must satisfy all four complexity requirements:</P>
      <UL>
        {PASSWORD_RULES.map((rule) => <LI key={rule}>{rule}</LI>)}
      </UL>
      <Callout variant="info">
        The update form checks each requirement dynamically as you type your new password. As each condition is satisfied, its corresponding indicator ticks off in real time, making it easy to identify any missing rule before submitting.
      </Callout>

      {/* ── Steps ── */}
      <H2 id="steps">Update Your Password</H2>
      <P>
        Clicking <strong>Update Password</strong> opens the secure password update drawer from the right of the screen:
      </P>

      <DocImage
        src="/screenshots/profile/03-update-password.jpg"
        alt="Update Your Password drawer showing old password, new password with checklist, confirm field, and update button"
        caption="① Old Password — ② New Password with live requirements checklist — ③ Confirm New Password — ④ Update Password button"
      />

      <Steps>
        <Step num={1} title="Click Update Password">
          On the Profile page, click <strong>Update Password</strong> to open the drawer.
        </Step>
        <Step num={2} title="Enter your Old Password">
          Type your current password into the <strong>Old Password</strong> field <strong>①</strong>. Use the eye icon toggle on the right if you need to reveal and verify what you typed.
        </Step>
        <Step num={3} title="Enter your New Password">
          Type your new password into the <strong>New Password</strong> field <strong>②</strong>. Watch the live checklist beneath the field confirm each rule as you meet it.
        </Step>
        <Step num={4} title="Confirm your New Password">
          Re-enter the exact same password into the <strong>Confirm New Password</strong> field <strong>③</strong>. Both passwords must match before the form can be submitted.
        </Step>
        <Step num={5} title="Click Update Password">
          Once your old password is provided, all 4 complexity rules are met, and both new password entries match, the <strong>Update Password</strong> button <strong>④</strong> turns active. Click it to finalize your update.
        </Step>
      </Steps>

      <Callout variant="tip">
        We recommend rotating your account password periodically, and immediately if you ever suspect your device, email, or credentials have been compromised.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Review your personal contact details: <PageLink label="Personal Information" onClick={() => onNavigate("profile-personal")} />.</LI>
        <LI>Enhance your account with two-factor verification: <PageLink label="Two-Factor Authentication" onClick={() => onNavigate("profile-2fa")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
