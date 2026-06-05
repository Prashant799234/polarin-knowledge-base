import { useEffect, useState } from "react";
import { KnowledgeBase } from "./components/knowledge-base/KnowledgeBase";
import { GlobalLoader } from "./components/knowledge-base/GlobalLoader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for minimum 750ms — enough to see the brand, avoids flash
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>
      <GlobalLoader show={loading} />
      <KnowledgeBase />
    </div>
  );
}
