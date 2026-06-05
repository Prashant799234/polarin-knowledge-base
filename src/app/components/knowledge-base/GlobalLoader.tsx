import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// Inject CSS once at module level
if (typeof document !== "undefined" && !document.getElementById("pk-global-loader-style")) {
  const s = document.createElement("style");
  s.id = "pk-global-loader-style";
  s.textContent = `
    @keyframes pk-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    @keyframes pk-bar-pulse {
      0%,100% { opacity: 1; }
      50%     { opacity: 0.7; }
    }
    .pk-skeleton {
      background: linear-gradient(90deg, #eef2f7 25%, #f5f8fc 50%, #eef2f7 75%);
      background-size: 600px 100%;
      animation: pk-shimmer 1.5s ease-in-out infinite;
      border-radius: 6px;
    }
    @media (prefers-reduced-motion: reduce) {
      .pk-skeleton { animation: none; background: #e9eef5; }
    }
  `;
  document.head.appendChild(s);
}

interface Props {
  show: boolean;
}

export function GlobalLoader({ show }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) { setProgress(0); return; }
    const timers = [
      setTimeout(() => setProgress(20), 60),
      setTimeout(() => setProgress(50), 250),
      setTimeout(() => setProgress(75), 500),
      setTimeout(() => setProgress(90), 750),
    ];
    return () => timers.forEach(clearTimeout);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#f8fafc",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Top progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#eef2f7", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #1c808d 0%, #3ebdcc 50%, #1c808d 100%)",
                backgroundSize: "200% 100%",
                animation: "pk-bar-pulse 1.2s ease-in-out infinite",
                borderRadius: "0 2px 2px 0",
                boxShadow: "0 0 10px rgba(28,128,141,0.5)",
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {/* Pulsing logo */}
          <motion.img
            src="/polarin-logo.svg"
            alt="Polarin"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: 44, width: "auto", display: "block" }}
          />

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            style={{
              margin: 0,
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 400,
              color: "#90a2b9",
              letterSpacing: "0.015em",
            }}
          >
            Loading Polarin Docs...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
