import { ArticlePage, H1, H2, P, UL, LI, Callout, DocImage, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "../ArticlePage";
import type { KBPage } from "../KnowledgeBase";

const TOC = [
  { id: "overview",    label: "Overview" },
  { id: "sign-in",     label: "Signing In",       level: 2 as const },
  { id: "forgot",      label: "Forgot Password?", level: 2 as const },
  { id: "next-steps",  label: "Next Steps" },
];

interface Props {
  onNavigate: (page: KBPage) => void;
}

export function SignInPage({ onNavigate }: Props) {
  return (
    <ArticlePage toc={TOC}>
      <H1 id="overview">Sign In</H1>
      <ArticleMeta>
        <ReadTime minutes={2} />
        <Dot />
        <Tag label="Beginner" color="#1c808d" />
      </ArticleMeta>

      <P>
        Signing up for Polarin doesn't log you in automatically — you verify your email first, then sign in
        separately. See <PageLink label="Create a Polarin Account" onClick={() => onNavigate("create-account")} /> if
        you haven't registered yet.
      </P>

      <H2 id="sign-in">Signing In</H2>
      <P>
        Verifying your email takes you to the <strong>"Welcome to Polarin! Sign in to access your platform"</strong>{" "}
        screen. Enter your email and password and click <strong>Sign In to Polarin</strong>.
      </P>
      <DocImage
        src="/screenshots/signup/03-sign-in.jpg"
        alt="Sign in screen with email and password fields"
        caption="Email address blurred here for privacy"
      />

      <H2 id="forgot">Forgot Password?</H2>
      <P>
        Use <strong>Request Reset Link</strong> right on the sign-in screen rather than signing up again. Already
        signed in and just want to change your password? See{" "}
        <PageLink label="Update Password" onClick={() => onNavigate("profile-password")} /> instead.
      </P>

      <Callout variant="tip">
        Enhance your account with two-factor verification once you're in:{" "}
        <PageLink label="Two-Factor Authentication" onClick={() => onNavigate("profile-2fa")} />.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI><PageLink label="Complete Organisation Profile" onClick={() => onNavigate("complete-profile")} /> — required before you can order any service.</LI>
        <LI><PageLink label="User Management" onClick={() => onNavigate("invite-members")} /> — add colleagues to your organisation and assign roles.</LI>
        <LI><PageLink label="Locations" onClick={() => onNavigate("locations")} /> — browse Polarin's global network of data centres and PoPs.</LI>
      </UL>
    </ArticlePage>
  );
}
