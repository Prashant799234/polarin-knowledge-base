import { ArticlePage, H1, H2, H3, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable } from "../ArticlePage";

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "signup",          label: "Create Your Account",  level: 2 as const },
  { id: "verify-email",    label: "Verify Your Email",    level: 2 as const },
  { id: "password-policy", label: "Password Policy",      level: 2 as const },
  { id: "next-steps",      label: "Next Steps" },
];

export function CreateAccountPage() {
  return (
    <ArticlePage toc={TOC}>
      {/* Breadcrumb */}
      <Breadcrumb items={["Home", "Get Started", "Create a Polarin Account"]} />

      <H1 id="overview">Create a Polarin Account</H1>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 20px" }}>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Beginner" color="#1c808d" />
      </div>

      <P>
        Polarin is a software-defined networking platform that enables enterprises and carriers to provision virtual connections to cloud providers, data centres, and partners — all from a single portal. Creating your account is the first step toward managing your entire network from one place.
      </P>

      <Callout variant="info">
        After signing up, you must verify your email before you can log in. The verification link expires in <strong>24 hours</strong> — if it expires, use the <strong>Resend Verification Email</strong> option on the login page.
      </Callout>

      {/* ── Step-by-step ── */}
      <H2 id="signup">Create Your Account</H2>
      <P>Follow these steps to register on the Polarin portal:</P>

      <Steps>
        <Step num={1} title="Open the Sign Up page">
          Navigate to the <strong>Polarin Sign Up</strong> page. You can find the link on the Polarin website or go directly via the portal URL.
        </Step>
        <Step num={2} title="Fill in your details">
          Enter your information in the Signup section:
          <FieldTable rows={[
            { field: "Name",         description: "Your full name as it should appear on the account.",                              required: true  },
            { field: "Email",        description: "A valid work email address. This will be used for account verification.",          required: true  },
            { field: "Organisation", description: "Your company or organisation name. Must be unique across the platform.",           required: true  },
            { field: "Password",     description: "A strong password meeting the complexity requirements listed in Password Policy.", required: true  },
          ]} />
        </Step>
        <Step num={3} title="Accept Terms & Conditions">
          Review and check the box to accept the <strong>Terms and Conditions</strong> and <strong>Privacy Policy</strong> before proceeding.
        </Step>
        <Step num={4} title="Click Sign Up">
          Submit the form. If the email or organisation name already exists, the portal will display an error — try a different value.
        </Step>
      </Steps>

      <DocImage src="https://docs.polarin.lightstorm.net/password_check.png" alt="Password policy indicator on sign up form" caption="The portal shows a live password strength indicator as you type." />

      <Callout variant="warning">
        If you see <strong>"Account already exists"</strong> or <strong>"Organisation name is not unique"</strong>, your email or org name is already registered. Use a unique organisation name or sign in to the existing account.
      </Callout>

      <DocImage src="https://docs.polarin.lightstorm.net/account_exists.png" alt="Duplicate account error" caption="Error shown when the email or organisation name is already taken." />

      {/* ── Email verification ── */}
      <H2 id="verify-email">Verify Your Email</H2>
      <P>Once you submit the form, Polarin sends a verification email to your registered address.</P>

      <Steps>
        <Step num={1} title="Check your inbox">
          Look for an email from Polarin with the subject <strong>"Verify Your Email"</strong>. Check your spam or junk folder if it doesn't arrive within a few minutes.
        </Step>
        <Step num={2} title="Click Verify Your Email">
          Open the email and click the <strong>Verify Your Email</strong> button. This link is unique to your account.
        </Step>
        <Step num={3} title="Confirmation">
          You'll see a <strong>"Your email is verified successfully"</strong> message. The page redirects to the Polarin Welcome page automatically after 3 seconds.
        </Step>
      </Steps>

      <DocImage src="https://docs.polarin.lightstorm.net/mail.png" alt="Verification email from Polarin" caption="The verification email contains a one-click button to activate your account." />

      <DocImage src="https://docs.polarin.lightstorm.net/welcome_page.png" alt="Polarin Welcome page after first login" caption="After verifying, you land on the Polarin Welcome page." />

      {/* ── Password policy ── */}
      <H2 id="password-policy">Password Policy</H2>
      <P>Polarin enforces minimum password complexity to protect your account. Your password must include all of the following:</P>
      <UL>
        <LI>Minimum <strong>8 characters</strong></LI>
        <LI>At least one <strong>uppercase</strong> letter (A–Z)</LI>
        <LI>At least one <strong>lowercase</strong> letter (a–z)</LI>
        <LI>At least one <strong>special character</strong> (e.g. @, #, $, !)</LI>
        <LI>At least one <strong>number</strong> (0–9)</LI>
      </UL>
      <Callout variant="tip">
        Use a passphrase — a string of 3–4 random words mixed with a number and symbol — for a strong yet memorable password (e.g. <em>Sky9Mango!River</em>).
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>With your account created and email verified, complete your organisation profile to unlock Polarin services:</P>
      <UL>
        <LI><strong>Complete Organisation Profile</strong> — submit KYC documents so the Polarin team can verify your organisation.</LI>
        <LI><strong>Invite Team Members</strong> — add colleagues to your organisation and assign roles.</LI>
        <LI><strong>Explore Locations</strong> — browse our global network of data centres and PoPs.</LI>
      </UL>
    </ArticlePage>
  );
}

// ── Small shared helpers ──────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#cbd5e1", fontSize: 12 }}>›</span>}
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: i === items.length - 1 ? "#0a3954" : "#94a3b8", fontWeight: i === items.length - 1 ? 600 : 400 }}>{item}</span>
        </span>
      ))}
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
  return (
    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20 }}>
      {label}
    </span>
  );
}
