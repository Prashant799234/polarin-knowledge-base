import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, FieldTable, DocImage, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",         label: "Overview" },
  { id: "profile-sections", label: "Profile Sections",             level: 2 as const },
  { id: "update-details",   label: "Update Personal Information",  level: 2 as const },
  { id: "field-reference",  label: "Field Reference",              level: 2 as const },
  { id: "next-steps",       label: "Next Steps" },
];

const PERSONAL_FIELDS = [
  { field: "Name",         description: "Your display name across the Polarin console. Fully editable.", required: true },
  { field: "Email ID",     description: "The primary email address tied to your login. Locked and read-only in this form — email changes must be requested through Support or your organisation's administrator.", required: false },
  { field: "Phone Number", description: "Select your country dial code from the dropdown, then enter your mobile number. Used for account recovery and emergency notifications.", required: false },
  { field: "Role",         description: "Read-only. Reflects your assigned permission level (e.g. Network Admin) set under User Management by your organisation's administrator.", required: false },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function PersonalInformationPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Personal Information</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="My Account" color="#0f766e" />
      </ArticleMeta>

      <P>
        The <strong>Profile</strong> page under <strong>Settings &gt; Profile</strong> gives you direct visibility
        and control over your individual login identity, security credentials, and account protection. Unlike{" "}
        <PageLink label="Organisation Details" onClick={() => onNavigate("org-profile")} /> (which applies to your entire
        company and billing tenancy), settings here are strictly personal to your user account.
      </P>

      <DocImage
        src="/screenshots/profile/01-profile-overview.jpg"
        alt="Polarin Profile page overview showing personal information, password, and two-factor authentication cards"
        caption="① Personal Information card — ② Password card — ③ Two-Factor Authentication card"
      />

      {/* ── Profile Sections ── */}
      <H2 id="profile-sections">Profile Sections</H2>
      <P>The main Profile screen organizes your account preferences into three dedicated cards:</P>
      <UL>
        <LI>
          <strong>① Personal Information</strong>: Displays your contact details, avatar, and system role. Click{" "}
          <strong>Edit</strong> to modify your name or phone number.
        </LI>
        <LI>
          <strong>② Password</strong>: Displays your masked password, security compliance indicator (
          <em>Your current password meets all security requirements</em>), and the date it was last rotated. Click{" "}
          <strong>Update Password</strong> to change it.
        </LI>
        <LI>
          <strong>③ Two-factor authentication</strong>: Displays whether multi-factor security is currently active.
          Polarin recommends Google Authenticator or Duo for instant code verification. Click{" "}
          <strong>Set up Two-Factor Authentication</strong> to configure app- or email-based 2FA.
        </LI>
      </UL>

      {/* ── Update Details ── */}
      <H2 id="update-details">Update Personal Information</H2>
      <P>
        Clicking the <strong>Edit</strong> button on the Personal Information card opens the slide-out drawer where you
        can update your profile name and contact number:
      </P>

      <DocImage
        src="/screenshots/profile/02-update-personal-info.jpg"
        alt="Update Your Personal Information slide-out drawer"
        caption="① Name (editable) — ② Email ID (locked) — ③ Phone Number with country code — ④ Role (locked) — ⑤ Update button"
      />

      <Steps>
        <Step num={1} title="Click Edit on the Personal Information card">
          The <strong>Update Your Personal Information</strong> drawer slides open from the right side of the screen with your current details pre-populated.
        </Step>
        <Step num={2} title="Edit your Name">
          Type your preferred display name in the <strong>Name</strong> field <strong>①</strong>.
        </Step>
        <Step num={3} title="Provide or update your Phone Number">
          Choose your international calling country code from the dropdown menu, then enter your mobile number in the{" "}
          <strong>Phone Number</strong> field <strong>③</strong>.
        </Step>
        <Step num={4} title="Review locked fields (Email ID & Role)">
          <strong>Email ID ②</strong> and <strong>Role ④</strong> are intentionally non-editable in this drawer. Because email addresses are bound to active authentication tokens and roles determine administrative privileges across Polarin, changes must be processed through an administrator.
        </Step>
        <Step num={5} title="Click Update to save">
          Click the <strong>Update</strong> button <strong>⑤</strong> at the bottom right. Your profile updates immediately without requiring approval.
        </Step>
      </Steps>

      {/* ── Field Reference ── */}
      <H2 id="field-reference">Field Reference</H2>
      <FieldTable rows={PERSONAL_FIELDS} />

      <Callout variant="info">
        Need to change the email address tied to your login? Reach out to your organisation's Polarin administrator or contact Polarin Support. For role upgrades (such as gaining Service Ordering or Billing access), see <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Rotate your account password: <PageLink label="Update Password" onClick={() => onNavigate("profile-password")} />.</LI>
        <LI>Add extra protection to your login: <PageLink label="Two-Factor Authentication" onClick={() => onNavigate("profile-2fa")} />.</LI>
        <LI>Invite colleagues or manage user permissions: <PageLink label="User Management" onClick={() => onNavigate("invite-members")} />.</LI>
      </UL>
    </ArticlePage>
  );
}
