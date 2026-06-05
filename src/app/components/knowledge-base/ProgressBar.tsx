import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  active: boolean;
}

export function ProgressBar({ active }: Props) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setWidth(0);
      const t1 = setTimeout(() => setWidth(18), 10);
      const t2 = setTimeout(() => setWidth(48), 130);
      const t3 = setTimeout(() => setWidth(72), 380);
      const t4 = setTimeout(() => setWidth(88), 700);
      return () => [t1, t2, t3, t4].forEach(clearTimeout);
    } else {
      if (!visible) return;
      setWidth(100);
      const t = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            height: 2,
            zIndex: 9998,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${width}%`,
              background: "linear-gradient(90deg, #1c808d, #3ebdcc)",
              borderRadius: "0 2px 2px 0",
              boxShadow: "0 0 8px rgba(28,128,141,0.4)",
              transition: `width ${width === 100 ? "0.2s" : "0.5s"} cubic-bezier(0.4,0,0.2,1)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
