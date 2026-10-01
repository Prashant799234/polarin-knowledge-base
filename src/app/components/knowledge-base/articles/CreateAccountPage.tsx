import { ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, DocImage, FieldTable, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "signup",          label: "Create Your Account",  level: 2 as const },
  { id: "verify-email",    label: "Verify Your Email",    level: 2 as const },
  { id: "sign-in",         label: "Sign In",              level: 2 as const },
  { id: "password-policy", label: "Password Policy",      level: 2 as const },
  { id: "next-steps",      label: "Next Steps" },
];

const SIGNUP_FIELDS = [
  { field: "Name",         description: "Your full name as it should appear on the account.",                              required: true  },
  { field: "Email Address",description: "A valid work email address. This will be used for account verification and sign-in.", required: true  },
  { field: "Organization", description: "Your company or organisation name. As you type, the form checks it against organisations already on Polarin.", required: true  },
  { field: "Password",     description: "Must satisfy every rule listed live under the field — see Password Policy below.", required: true  },
  { field: "Confirm Password", description: "Must match the Password field exactly.", required: true },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function CreateAccountPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Create a Polarin Account</H1>
      <ArticleMeta>
        <ReadTime minutes={4} />
        <Dot />
        <Tag label="Beginner" color="#1c808d" />
      </ArticleMeta>

      <P>
        Polarin is a software-defined networking platform that enables enterprises and carriers to provision
        virtual connections to cloud providers, data centres, and partners — all from a single portal. Creating
        your account is the first step; signing up only creates your <em>personal login</em> — your organisation
        itself still needs to be verified afterward, which is covered in{" "}
        <PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} />.
      </P>

      <Callout variant="info">
        Signing up does not log you in automatically. You must verify your email first, then sign in separately —
        both steps are covered below.
      </Callout>

      {/* ── Sign up ── */}
      <H2 id="signup">Create Your Account</H2>
      <P>
        Open the Polarin sign-up page — branded <strong>"India's First True NaaS Platform"</strong> — and fill in
        the form:
      </P>
      <FieldTable rows={SIGNUP_FIELDS} />
      <DocImage
        src="/screenshots/signup/01-signup-form.jpg"
        alt="Polarin sign up form with live password requirement checklist"
        caption="Each password rule gets its own checkmark as you type — name and email blurred here for privacy"
      />
      <P>Click <strong>Sign Up</strong> once every field (and every password rule) is satisfied.</P>
      <Callout variant="warning">
        If the organisation name you enter already exists on Polarin, the form will flag it — use a different,
        more specific name, or ask whoever manages that organisation to{" "}
        <PageLink label="invite you" onClick={() => onNavigate("invite-members")} /> instead of signing up separately.
      </Callout>

      {/* ── Email verification ── */}
      <H2 id="verify-email">Verify Your Email</H2>
      <P>
        Submitting the form takes you straight to an <strong>"Email sent successfully!"</strong> confirmation
        screen — it names the inbox it was sent to and offers a <strong>Resend link</strong> countdown if it
        doesn't arrive.
      </P>
      <DocImage
        src="/screenshots/signup/02-email-sent.jpg"
        alt="Email sent successfully confirmation screen with resend countdown"
        caption="Email address blurred here for privacy"
      />
      <Steps>
        <Step num={1} title="Check your inbox">
          Look for an email titled <strong>"Thank you for signing up to Polarin"</strong>. Check spam/junk if it
          doesn't arrive within a few minutes.
        </Step>
        <Step num={2} title="Click Verify My Email">
          The button is unique to your account and expires <strong>24 hours</strong> after signup — a plain-text
          link is also included underneath in case the button doesn't render.
        </Step>
        <Step num={3} title="Land on the Email Verified confirmation">
          You'll see a short "Welcome to Polarin" / "See What's Possible!" confirmation — from here you sign in
          separately, you are not logged in automatically.
        </Step>
      </Steps>

      {/* ── Sign in ── */}
      <H2 id="sign-in">Sign In</H2>
      <P>
        Verifying your email takes you to the <strong>"Welcome to Polarin! Sign in to access your platform"</strong>{" "}
        screen. Enter your email and password and click <strong>Sign In to Polarin</strong>.
      </P>
      <DocImage
        src="/screenshots/signup/03-sign-in.jpg"
        alt="Sign in screen with email and password fields"
        caption="Email address blurred here for privacy"
      />
      <P>
        Forgotten your password already? Use <strong>Request Reset Link</strong> right on this screen rather than
        signing up again.
      </P>

      {/* ── Password policy ── */}
      <H2 id="password-policy">Password Policy</H2>
      <P>The sign-up form checks your password live, item by item, as you type. It must include:</P>
      <UL>
        <LI>Minimum <strong>8 characters</strong></LI>
        <LI>At least one <strong>uppercase</strong> letter (A–Z)</LI>
        <LI>At least one <strong>number</strong> (0–9)</LI>
        <LI>At least one <strong>special character</strong> (e.g. @, #, $, !)</LI>
      </UL>
      <Callout variant="tip">
        Use a passphrase — a string of 3–4 random words mixed with a number and symbol — for a strong yet
        memorable password (e.g. <em>Sky9Mango!River</em>).
      </Callout>

      {/* ── Next steps ── */}
      <H2 id="next-steps">Next Steps</H2>
      <P>Right after your first sign-in, Polarin walks you straight into organisation setup:</P>
      <UL>
        <LI><PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} /> — this is required before you can order any service.</LI>
        <LI><PageLink label="User Management" onClick={() => onNavigate("invite-members")} /> — add colleagues to your organisation and assign roles.</LI>
        <LI><PageLink label="Locations" onClick={() => onNavigate("locations")} /> — browse Polarin's global network of data centres and PoPs.</LI>
      </UL>
    </ArticlePage>
  );
}
