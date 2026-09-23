import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const TOC = [
  { id: "overview",            label: "Overview" },
  { id: "rbac-roles",          label: "Role-Based Access Control (RBAC)", level: 2 as const },
  { id: "permission-matrix",   label: "Role Permission Matrix",           level: 2 as const },
  { id: "user-list-view",      label: "User Management Dashboard" },
  { id: "invite-flow",         label: "How to Invite a New User" },
  { id: "accept-flow",         label: "Accepting an Invitation (Invitee Flow)" },
  { id: "edit-flow",           label: "Modifying User Roles & Access" },
  { id: "security-best-practices", label: "Security & Best Practices" },
];

interface Props {
  onNavigate?: (page: KBPage) => void;
}

export function InviteTeamPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">User Management</H1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Administration" color="#d97706" />
      </div>

      <P>
        Polarin offers comprehensive <strong>User Management</strong> with enterprise Role-Based Access Control (RBAC). Organisation administrators can invite team members, assign targeted roles matching engineering or financial responsibilities, and adjust privileges at any time.
      </P>

      <P>
        Role segmentation ensures that network engineers have the autonomy to configure connections without gaining exposure to sensitive corporate billing data, while finance managers can oversee invoices and tax profiles without risking accidental infrastructure changes.
      </P>

      <Callout variant="important">
        Only users with the <strong>System Admin</strong> role can invite new team members or alter existing user privileges.
      </Callout>

      {/* ── RBAC Roles ── */}
      <H2 id="rbac-roles">Role-Based Access Control (RBAC)</H2>
      <P>
        Polarin defines five distinct user roles tailored to enterprise organisational structures:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" }}>
        <RoleCard
          title="System Admin"
          badge="Full Access"
          color="#0d9488"
          description="System admin users have complete unrestricted access across all platform modules, including Services, Network Topology, Organisation Profile, KYC, User Management, Billing Profiles, Invoices, and Support."
        />
        <RoleCard
          title="Network Admin"
          badge="Engineering Lead"
          color="#2563eb"
          description="Network admins have Read/Write permission for Services (Ports, Virtual Connections, Routers, DCI) and Support Tickets only. They have strict Read-only permission for everything else."
        />
        <RoleCard
          title="Network Viewer"
          badge="Read Only Ops"
          color="#64748b"
          description="Network viewers have Read permission for all Services and Read/Write permission for Support Tickets. They can monitor circuits and raise incidents without altering configurations."
        />
        <RoleCard
          title="Finance Admin"
          badge="Accounts Payable"
          color="#7c3aed"
          description="Finance admins have Read/Write permission for Organisation Profile, Billing Profiles, and Support Tickets. They have Read-only permission for networking services and Invoices."
        />
        <RoleCard
          title="Finance Viewer"
          badge="Billing Auditor"
          color="#0284c7"
          description="Finance viewers have Read/Write permission for Support Tickets only, and Read-only permission for Organisation Profile, Billing Profile, Subscriptions, and Invoices."
        />
      </div>

      {/* ── Permission Matrix ── */}
      <H2 id="permission-matrix">Role Permission Matrix</H2>
      <P>Compare module access levels across each role:</P>

      <div className="kb-field-table" style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "20px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, color: "#0f172a", borderBottom: "1.5px solid #e2e8f0" }}>Platform Module</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#0d9488", borderBottom: "1.5px solid #e2e8f0" }}>System Admin</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#2563eb", borderBottom: "1.5px solid #e2e8f0" }}>Network Admin</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#64748b", borderBottom: "1.5px solid #e2e8f0" }}>Network Viewer</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#7c3aed", borderBottom: "1.5px solid #e2e8f0" }}>Finance Admin</th>
              <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, color: "#0284c7", borderBottom: "1.5px solid #e2e8f0" }}>Finance Viewer</th>
            </tr>
          </thead>
          <tbody>
            {[
              { module: "Services (Port, VC, Router, DCI)", sys: "Read / Write", netA: "Read / Write", netV: "Read Only", finA: "Read Only", finV: "No Access" },
              { module: "VISTA Telemetry & Monitoring",      sys: "Read / Write", netA: "Read / Write", netV: "Read Only", finA: "Read Only", finV: "No Access" },
              { module: "Support Tickets",                  sys: "Read / Write", netA: "Read / Write", netV: "Read / Write", finA: "Read / Write", finV: "Read / Write" },
              { module: "User Management (Invites & Roles)",sys: "Read / Write", netA: "Read Only",   netV: "No Access", finA: "Read Only", finV: "No Access" },
              { module: "Billing Profiles & Tax Entities",  sys: "Read / Write", netA: "Read Only",   netV: "No Access", finA: "Read / Write", finV: "Read Only" },
              { module: "Invoices & Payment Receipts",      sys: "Read / Write", netA: "Read Only",   netV: "No Access", finA: "Read / Write", finV: "Read Only" },
              { module: "Organisation KYC & Legal Terms",   sys: "Read / Write", netA: "Read Only",   netV: "No Access", finA: "Read / Write", finV: "Read Only" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: i < 6 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0f172a", fontFamily: FONT_J }}>{row.module}</td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}><PermBadge val={row.sys} /></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}><PermBadge val={row.netA} /></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}><PermBadge val={row.netV} /></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}><PermBadge val={row.finA} /></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}><PermBadge val={row.finV} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── User List View ── */}
      <H2 id="user-list-view">User Management Dashboard</H2>
      <P>
        To access team administration, navigate to <strong>Settings → User Management</strong> under the <em>ORGANISATION</em> menu.
      </P>

      <DocImage
        src="/screenshots/users/01-user-management-list.jpg"
        alt="Polarin User Management Dashboard"
        caption="User Management: (1) Team member table with status, (2) Role assignment column, (3) Actions dropdown (Edit, Resend Invite, Delete)."
      />

      <P>
        The table presents an overview of all active and pending colleagues:
      </P>
      <UL>
        <LI><strong>Badge 1 — User Information</strong>: Displays the user's name, corporate email address, and verification state (e.g., <em>Email Verified</em> or <em>Invited</em>).</LI>
        <LI><strong>Badge 2 — Role Assignment</strong>: Shows the current RBAC role controlling the user's platform access.</LI>
        <LI><strong>Badge 3 — Actions Menu (•••)</strong>: Allows System Admins to edit roles, resend activation emails for pending invites, or revoke platform access.</LI>
      </UL>

      {/* ── Invite Flow ── */}
      <H2 id="invite-flow">How to Invite a New User</H2>
      <P>
        To add a colleague to your organisation's Polarin workspace, click the <strong>Invite User</strong> button in the upper-right corner.
      </P>

      <DocImage
        src="/screenshots/users/02-user-invite-drawer.jpg"
        alt="Invite User Drawer in Polarin"
        caption="Invite User: (1) Corporate email input, (2) System Admin role selection, (3) Network Admin role selection, (4) Specialized viewer and finance roles."
      />

      <Steps>
        <Step num={1} title="Enter Corporate Email Address">
          Type your colleague's professional email address (<strong>Badge 1</strong>). An automated verification link will be sent to this inbox.
        </Step>
        <Step num={2} title="Select Role">
          Review the roles and choose the one that aligns with their job responsibilities:
          <UL>
            <LI>Select <strong>System Admin</strong> (<strong>Badge 2</strong>) for complete administrative control.</LI>
            <LI>Select <strong>Network Admin</strong> (<strong>Badge 3</strong>) for engineers provisioning Ports and Virtual Connections.</LI>
            <LI>Select <strong>Network Viewer</strong>, <strong>Finance Admin</strong>, or <strong>Finance Viewer</strong> (<strong>Badge 4</strong>) for specialized operational or billing functions.</LI>
          </UL>
        </Step>
        <Step num={3} title="Send Invitation">
          Click the <strong>Invite User</strong> button. A secure activation email is dispatched immediately, and the user appears in the User Management list with a <em>Pending</em> tag.
        </Step>
      </Steps>

      {/* ── Accept Flow ── */}
      <H2 id="accept-flow">Accepting an Invitation (Invitee Flow)</H2>
      <P>
        When a colleague receives the invitation email, they complete a straightforward onboarding setup:
      </P>

      <Steps>
        <Step num={1} title="Open Invitation Email">
          Locate the email sent from <code>no-reply@polarin.lightstorm.net</code> with the subject <em>"You've been invited to join Polarin"</em>. Click the secure <strong>Verify Your Email</strong> button.
          <Callout variant="warning">
            Invitation links expire after <strong>24 hours</strong> for security reasons. If the invite expires, a System Admin can click <em>Resend Invitation</em> from the Actions menu.
          </Callout>
        </Step>
        <Step num={2} title="Complete Account Setup">
          On the setup screen:
          <UL>
            <LI>Enter full name as it should appear in audit logs.</LI>
            <LI>Create a strong password (minimum 8 characters, with uppercase, lowercase, numbers, and symbols).</LI>
            <LI>Optionally upload an avatar photo.</LI>
            <LI>Accept Polarin's Terms of Service and Privacy Policy.</LI>
          </UL>
        </Step>
        <Step num={3} title="Sign In">
          Click <strong>Continue to Login</strong>. The user's status transitions from <em>Invited</em> to <em>Active</em> on the admin dashboard.
        </Step>
      </Steps>

      {/* ── Edit Flow ── */}
      <H2 id="edit-flow">Modifying User Roles & Access</H2>
      <P>
        As team members take on new responsibilities, System Admins can adjust their roles without deleting their account history.
      </P>

      <DocImage
        src="/screenshots/users/03-user-edit-drawer.jpg"
        alt="Edit User Role Drawer"
        caption="Edit User Drawer: (1) Locked email identifier, (2) Role selector with system descriptions, (3) Update button."
      />

      <Steps>
        <Step num={1} title="Open Edit User Drawer">
          In the User Management table, click the <strong>•••</strong> menu on the user's row and select <strong>Edit</strong>.
        </Step>
        <Step num={2} title="Select New Role">
          The email address is permanently locked to preserve audit integrity (<strong>Badge 1</strong>). Choose the updated role from the role options (<strong>Badge 2</strong>).
        </Step>
        <Step num={3} title="Save Changes">
          Click <strong>Update →</strong> (<strong>Badge 3</strong>). The new permissions take effect immediately upon the user's next request or page refresh.
        </Step>
      </Steps>

      {/* ── Security Best Practices ── */}
      <H2 id="security-best-practices">Security & Best Practices</H2>
      <UL>
        <LI>
          <strong>Principle of Least Privilege</strong>: Assign <em>Network Admin</em> or <em>Viewer</em> roles by default, reserving <em>System Admin</em> for primary infrastructure managers.
        </LI>
        <LI>
          <strong>Enforce Two-Factor Authentication</strong>: Ensure all administrators configure 2FA under their profile settings. See <PageLink label="Two-Factor Authentication Guide" onClick={() => onNavigate?.("profile-2fa")} />.
        </LI>
        <LI>
          <strong>Immediate Offboarding</strong>: When a team member departs your organisation, delete their user account immediately via the Actions menu to revoke all portal access.
        </LI>
        <LI>
          <strong>Audit Trails</strong>: All user invitations, role changes, and sign-in activities are logged in the <PageLink label="Activity Log" onClick={() => onNavigate?.("activity-log-details")} />.
        </LI>
      </UL>
    </ArticlePage>
  );
}

function RoleCard({ title, badge, color, description }: { title: string; badge: string; color: string; description: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <p style={{ fontFamily: FONT_J, fontSize: 15, fontWeight: 700, color: "#0a3954", margin: 0 }}>{title}</p>
        <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color, background: `${color}14`, border: `1px solid ${color}33`, padding: "2px 8px", borderRadius: 12 }}>{badge}</span>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

function PermBadge({ val }: { val: string }) {
  if (val === "Read / Write") {
    return <span style={{ background: "#ecfdf5", color: "#047857", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, border: "1px solid #a7f3d0" }}>Read / Write</span>;
  }
  if (val === "Read Only") {
    return <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1px solid #bfdbfe" }}>Read Only</span>;
  }
  return <span style={{ background: "#f1f5f9", color: "#94a3b8", fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>No Access</span>;
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
