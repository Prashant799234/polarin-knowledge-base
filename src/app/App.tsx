import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { KnowledgeBase } from "./components/knowledge-base/KnowledgeBase";
import { GlobalLoader } from "./components/knowledge-base/GlobalLoader";
import { DeveloperPortal } from "./components/developer-portal/DeveloperPortal";

function KBWithLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KBWithLoader />} />
        <Route path="/developer" element={<DeveloperPortal />} />
        <Route path="/developer/*" element={<DeveloperPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
