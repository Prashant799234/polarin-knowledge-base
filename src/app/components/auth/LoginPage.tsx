import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Lock, ShieldCheck, Users, Zap } from "lucide-react";

export type LoginVariant = "portal" | "api";

const COPY: Record<LoginVariant, { title: string; subtitle: string; redirectTo: string }> = {
  portal: {
    title: "Welcome to Polarin!",
    subtitle: "Sign in to access your platform",
    redirectTo: "/alerts",
  },
  api: {
    title: "Sign in to the Polarin API Portal",
    subtitle: "Access your API keys, documentation, and sandbox",
    redirectTo: "/developer",
  },
};

export function LoginPage({ variant = "portal" }: { variant?: LoginVariant }) {
  const navigate = useNavigate();
  const { title, subtitle, redirectTo } = COPY[variant];

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) { setError("Enter your email and password to continue."); return; }
    navigate(redirectTo);
  }

  return (
    <div className="login-root">
      <div className="login-brand">
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
          <circle cx="10" cy="14" r="5" fill="#0B2A3A"/>
          <circle cx="30" cy="10" r="4" fill="#0E7E8E"/>
          <circle cx="26" cy="29" r="5.5" fill="#0B2A3A"/>
          <circle cx="9"  cy="31" r="3.4" fill="#E63950"/>
          <path d="M13 15L25 27M14 13L27 11M28 14L27 25" stroke="#0B2A3A" strokeWidth="1.6" opacity=".5"/>
        </svg>
        <div className="login-brand-text">
          <span className="login-brand-name">polarin</span>
          <span className="login-brand-sub">by lightstorm</span>
        </div>
      </div>

      <form className="login-card" onSubmit={submit}>
        <h1 className="login-title">{title}</h1>
        <p className="login-subtitle">{subtitle}</p>

        <div className="login-pills">
          <span className="login-pill blue"><ShieldCheck size={13}/>Secure</span>
          <span className="login-pill green"><Zap size={13}/>Fast</span>
          <span className="login-pill purple"><Users size={13}/>Trusted</span>
        </div>

        {variant === "api" && (
          <div className="login-api-note">
            <Lock size={13}/>
            Signing in here authenticates against the environment your account is currently in. To reach a different environment, sign in to the Polarin Portal and switch environments from Integrations.
          </div>
        )}

        <label className="login-label" htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          className="login-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
        />

        <label className="login-label" htmlFor="login-password">Password</label>
        <div className="login-input-wrap">
          <input
            id="login-password"
            className="login-input"
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
          />
          <button type="button" className="login-eye" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>

        <div className="login-forgot">
          Forgot your password? <Link to="#">Request Reset Link</Link>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className={`login-submit${canSubmit ? " ready" : ""}`}>
          Sign In to Polarin →
        </button>

        <div className="login-foot">
          <div>Don't have a Polarin account? <Link to="#">Sign Up</Link></div>
          <div>Need help? <Link to="#">Contact Us</Link></div>
        </div>
      </form>
    </div>
  );
}
