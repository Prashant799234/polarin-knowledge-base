import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",     label: "Overview" },
  { id: "what-you-see", label: "What You'll See",      level: 2 as const },
  { id: "steps",        label: "Update Your Details",  level: 2 as const },
  { id: "next-steps",   label: "Next Steps" },
];

const PERSONAL_FIELDS = [
  { field: "Name",         description: "Your display name across Polarin. Fully editable.",                                          required: true },
  { field: "Email ID",     description: "The email tied to your login. Shown read-only in the edit form — contact your admin or Support to change it.", required: false },
  { field: "Phone Number", description: "Select your country code from the dropdown, then enter your number. Optional today, worth adding for account recovery.", required: false },
  { field: "Role",         description: "Read-only. Set by your organisation's admin under User Management — not something you can change yourself.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function PersonalInformationPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Personal Information</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </div>

      <P>
        The <strong>Personal Information</strong> card on your <PageLink label="Profile" onClick={() => onNavigate("profile-personal")} /> page shows your name, phone number, email, and role at a glance — the identity details tied to your own login, separate from anything under{" "}
        <PageLink label="Organisation Details" onClick={() => onNavigate("org-profile")} />, which is shared across your whole team.
      </P>

      {/* ── What you'll see ── */}
      <H2 id="what-you-see">What You'll See</H2>
      <P>Click <strong>Edit</strong> on the Personal Information card to open the update form. It has four fields:</P>
      <FieldTable rows={PERSONAL_FIELDS} />
      <Callout variant="info">
        Email and Role appear shaded and locked in the edit form on purpose. Email changes need to be verified against your login, and role changes affect what you're allowed to do across the organisation — both go through an admin rather than being self-served here.
      </Callout>

      {/* ── Steps ── */}
      <H2 id="steps">Update Your Details</H2>
      <Steps>
        <Step num={1} title="Go to Profile">
          Under <strong>My Account</strong> in the left sidebar, open <strong>Profile</strong>.
        </Step>
        <Step num={2} title="Click Edit on Personal Information">
          Opens the <strong>Update Your Personal Information</strong> panel with your current details pre-filled.
        </Step>
        <Step num={3} title="Update your Name and/or Phone Number">
          Type your new name directly into the field. For phone number, pick the correct country code from the dropdown first, then enter the number.
        </Step>
        <Step num={4} title="Click Update">
          Changes save immediately — no admin approval needed for your name or phone number.
        </Step>
      </Steps>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Want to rotate your password too? <PageLink label="Update Password" onClick={() => onNavigate("profile-password")} />.</LI>
        <LI>Haven't turned on extra login security yet? <PageLink label="Two-Factor Authentication" onClick={() => onNavigate("profile-2fa")} />.</LI>
        <LI>Need your role changed? That's an org-level action — see <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.</LI>
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
