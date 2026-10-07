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
          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid #e2e8f1",
              borderTopColor: "#1c808d",
            }}
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
