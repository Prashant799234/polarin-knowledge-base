import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";

const TOC = [
  { id: "overview",       label: "Overview" },
  { id: "roles",          label: "Understanding Roles",   level: 2 as const },
  { id: "invite-steps",   label: "Invite a User",         level: 2 as const },
  { id: "accept-invite",  label: "Accepting an Invite",   level: 2 as const },
  { id: "manage",         label: "Managing Team Members" },
];

export function InviteTeamPage() {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Invite Team Members to Polarin</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Admin Only" color="#d97706" />
      </div>

      <P>
        Organisation admins can invite colleagues to collaborate on the Polarin platform. Each invited user receives an activation email, sets up their own credentials, and gains access based on the role you assign. Role-based access control ensures team members can only see and do what their job requires.
      </P>

      <Callout variant="important">
        Only users with the <strong>Admin</strong> role can invite new team members. If you don't see the <strong>Add User</strong> button, contact your organisation admin.
      </Callout>

      {/* ── Roles ── */}
      <H2 id="roles">Understanding Roles</H2>
      <P>
        When you invite a user, you assign them a role that controls their permissions across the portal. Polarin uses role-based access control (RBAC) — the available roles are listed in the <strong>Role</strong> dropdown when adding a user. Assign the most restrictive role that still lets the user complete their work.
      </P>
      <Callout variant="tip">
        Not sure which role to assign? Start with a <strong>Viewer</strong> or lower-privilege role and upgrade it after you've confirmed the user's responsibilities.
      </Callout>

      {/* ── Invite steps ── */}
      <H2 id="invite-steps">How to Invite a User</H2>
      <P>Follow these steps as an organisation admin:</P>

      <Steps>
        <Step num={1} title="Navigate to User Management">
          Sign in to Polarin, then from the left sidebar select <strong>Organisation → User Management</strong>.
        </Step>
        <Step num={2}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_1.png" alt="User Management navigation" caption="Select Organisation → User Management from the sidebar." />
        </Step>
        <Step num={3} title="Click Add User">
          In the upper-right corner of the User Management section, click the <strong>Add User</strong> button.
        </Step>
        <Step num={4}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_2.png" alt="Add User button in User Management" caption="The Add User button opens the invitation form." />
        </Step>
        <Step num={5} title="Fill in the invitation form">
          Complete the following fields:
          <FieldTable rows={[
            { field: "Email", description: "The email address of the person you want to invite. They must not already have a Polarin account.", required: true  },
            { field: "Role",  description: "Select the appropriate role from the dropdown to control the user's access level.",                   required: true  },
          ]} />
        </Step>
        <Step num={6}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_3.png" alt="Add User invitation form" caption="Enter the email and select a role before sending the invitation." />
        </Step>
        <Step num={7} title="Click Send Invitation">
          Click <strong>Send Invitation</strong>. The user appears in the User Management list with a <em>pending</em> status, and an activation email is sent to their address.
        </Step>
        <Step num={8}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_4.png" alt="User Management list with pending invite" caption="Invited users appear in the list immediately, before they've accepted." />
        </Step>
      </Steps>

      {/* ── Accept invite ── */}
      <H2 id="accept-invite">Accepting an Invitation (Invitee's Steps)</H2>
      <P>
        When a user receives an invitation email from Polarin, they complete their own account setup — separate from the inviting admin's flow.
      </P>

      <Steps>
        <Step num={1} title="Open the invitation email">
          Look for a Polarin email with the subject <strong>"You've been invited"</strong>. Click the <strong>Verify Your Email</strong> button inside the email.
        </Step>
        <Step num={2}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_5.png" alt="Invitation email" caption="The invitation email contains a single-click verification button." />
        </Step>
        <Step num={3} title="Set up your account">
          On the Account Setup page, complete the following:
          <UL>
            <LI><strong>Profile Picture</strong> — optional. Upload a JPEG or PNG, max 10 MB.</LI>
            <LI><strong>Name</strong> — enter your full name as it should appear in the portal.</LI>
            <LI><strong>Password</strong> — set a password meeting Polarin's complexity requirements.</LI>
            <LI>Review and accept the <strong>Terms and Conditions</strong> and <strong>Privacy Policy</strong>.</LI>
          </UL>
        </Step>
        <Step num={4}>
          <DocImage src="https://docs.polarin.lightstorm.net/um_6.png" alt="Account Setup page for invited user" caption="Invited users set their name, password, and optionally upload a profile picture." />
        </Step>
        <Step num={5} title="Click Continue To Login">
          After completing the form, click <strong>Continue To Login</strong>. The account is now active and the user can sign in with the role assigned by the admin.
        </Step>
      </Steps>

      <Callout variant="info">
        The invitation link expires after <strong>24 hours</strong>. If the invitee misses the window, the admin can resend the invitation from the User Management page.
      </Callout>

      {/* ── Managing ── */}
      <H2 id="manage">Managing Team Members</H2>
      <P>After a user accepts their invitation, you can manage their account from <strong>Organisation → User Management</strong>:</P>
      <UL>
        <LI><strong>Change role</strong> — update a user's role at any time to reflect their changing responsibilities.</LI>
        <LI><strong>Deactivate</strong> — remove platform access without deleting the account history.</LI>
        <LI><strong>Resend invitation</strong> — re-send the activation email for pending invitations.</LI>
      </UL>
      <Callout variant="warning">
        Deactivating a user immediately revokes all their portal access. Ensure any in-progress configurations they own are handed off before deactivating.
      </Callout>
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
