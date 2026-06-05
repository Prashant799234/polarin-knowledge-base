const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

interface Props {
  pageTitle: string;
}

export function ComingSoonPage({ pageTitle }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 480,
        gap: 24,
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      {/* Illustration */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: "#effcfd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: 100,
          background: "#eff5ff",
          border: "1px solid rgba(26,101,253,0.2)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a65fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, color: "#1a65fd" }}>
          Coming Soon
        </span>
      </div>

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 24,
            lineHeight: "32px",
            color: "#0a3954",
          }}
        >
          {pageTitle}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "22px",
            color: "#7e93b2",
          }}
        >
          This section is currently under development. Our team is working hard to bring you comprehensive documentation for this feature.
        </p>
      </div>

      {/* Info card */}
      <div
        style={{
          background: "#f8fafc",
          border: "0.5px solid #e2e8f1",
          borderRadius: 12,
          padding: "16px 24px",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "20px",
            color: "#7e93b2",
          }}
        >
          In the meantime, feel free to explore the{" "}
          <strong style={{ color: "#1c808d", fontWeight: 700 }}>Welcome</strong> page or check the{" "}
          <strong style={{ color: "#1c808d", fontWeight: 700 }}>Release Notes</strong> for what's new.
        </p>
      </div>
    </div>
  );
}
