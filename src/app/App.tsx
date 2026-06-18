import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { DeveloperPortal } from "./components/developer-portal/DeveloperPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/developer" replace />} />
        <Route path="/developer" element={<DeveloperPortal />} />
        <Route path="/developer/*" element={<DeveloperPortal />} />
        <Route path="*" element={<Navigate to="/developer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
