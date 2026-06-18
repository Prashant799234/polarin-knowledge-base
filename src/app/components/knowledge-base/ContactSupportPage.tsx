import { useState } from "react";
import { Mail, Phone, Clock, Zap, ShieldCheck } from "lucide-react";

const FONT   = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_J = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export function ContactSupportPage() {
  return (
    <div style={{ padding: "48px 48px 56px" }}>

      {/* ── Hero row ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 40, marginBottom: 48,
        background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7f8 100%)",
        borderRadius: 16, padding: "40px 48px",
        border: "1px solid #d0edf3",
      }}>
        {/* Left: heading + contacts */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: FONT_J, fontSize: 36, fontWeight: 800,
            color: "#0a3954", margin: "0 0 10px",
            letterSpacing: "-0.5px",
          }}>
            Need help?
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 16, color: "#4b6b8a",
            margin: "0 0 36px", lineHeight: 1.65,
          }}>
            We're available 24×7 — please reach out to us at
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ContactCard
              href="mailto:polarinsupport@lightstorm.net"
              icon={<Mail size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="polarinsupport@lightstorm.net"
              accentColor="#2563eb"
            />
            <ContactCard
              href="tel:+912269315544"
              icon={<Phone size={20} color="#0891b2" />}
              iconBg="#ecfeff"
              label="+91 22 69315544"
              sublabel="EXT-2"
              accentColor="#0891b2"
            />
          </div>
        </div>

        {/* Right: illustration */}
        <div style={{
          flexShrink: 0, width: 180, height: 180,
          background: "linear-gradient(135deg, #dbeafe 0%, #cffafe 100%)",
          borderRadius: 28, display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 4px 20px rgba(28,128,141,0.12)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 72, lineHeight: 1,
              filter: "drop-shadow(0 2px 6px rgba(28,128,141,0.2))",
            }}>
              🎧
            </div>
            <p style={{
              fontFamily: FONT_J, fontSize: 12, fontWeight: 700,
              color: "#0a3954", margin: "10px 0 0", opacity: 0.6,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              24 / 7
            </p>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <InfoCard
          icon={<Clock size={22} color="#1c808d" />}
          title="24×7 Support"
          desc="Our team is available around the clock, every day of the year — no exceptions."
        />
        <InfoCard
          icon={<Zap size={22} color="#f97316" />}
          title="Fast Response"
          desc="P1 and P2 issues are acknowledged within 2 hours. We resolve most incidents same day."
        />
        <InfoCard
          icon={<ShieldCheck size={22} color="#059669" />}
          title="Expert Engineers"
          desc="Dedicated network engineers with deep knowledge of Polarin services handle every ticket."
        />
      </div>

    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

interface ContactCardProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel?: string;
  accentColor: string;
}

function ContactCard({ href, icon, iconBg, label, sublabel, accentColor }: ContactCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "14px 20px",
        borderRadius: 12,
        background: hovered ? "#fff" : "rgba(255,255,255,0.75)",
        border: `1.5px solid ${hovered ? accentColor : "rgba(255,255,255,0.9)"}`,
        boxShadow: hovered ? `0 4px 16px ${accentColor}20` : "0 1px 4px rgba(0,0,0,0.05)",
        textDecoration: "none",
        transition: "all 0.18s ease",
        cursor: "pointer",
        backdropFilter: "blur(4px)",
        maxWidth: 480,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 2px 8px ${accentColor}18`,
      }}>
        {icon}
      </div>
      <div>
        <span style={{
          fontFamily: FONT_J, fontSize: 16, fontWeight: 700,
          color: hovered ? accentColor : "#0a3954",
          transition: "color 0.15s ease",
          display: "block",
        }}>
          {label}
        </span>
        {sublabel && (
          <span style={{
            fontFamily: FONT, fontSize: 13, color: "#94a3b8",
            display: "block", marginTop: 2,
          }}>
            {sublabel}
          </span>
        )}
      </div>
    </a>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function InfoCard({ icon, title, desc }: InfoCardProps) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f1",
      borderRadius: 14, padding: "24px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "#f8fafc", display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 16,
        border: "1px solid #e2e8f1",
      }}>
        {icon}
      </div>
      <p style={{
        fontFamily: FONT_J, fontSize: 15, fontWeight: 700,
        color: "#0a3954", margin: "0 0 8px",
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: FONT, fontSize: 14, color: "#6b7280",
        margin: 0, lineHeight: 1.65,
      }}>
        {desc}
      </p>
    </div>
  );
}
