import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { DeveloperPortal } from "./components/developer-portal/DeveloperPortal";
import { AlertManagementPortal } from "./components/AlertManagementPortal";
import { ApiIntegrationsPortal } from "./components/integrations/ApiIntegrationsPortal";
import { LoginPage } from "./components/auth/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/developer" replace />} />
        <Route path="/login" element={<LoginPage variant="portal" />} />
        <Route path="/developer/login" element={<LoginPage variant="api" />} />
        <Route path="/developer" element={<DeveloperPortal />} />
        <Route path="/developer/*" element={<DeveloperPortal />} />
        <Route path="/alerts" element={<AlertManagementPortal />} />
        <Route path="/alerts/*" element={<AlertManagementPortal />} />
        <Route path="/integrations" element={<ApiIntegrationsPortal />} />
        <Route path="/integrations/*" element={<ApiIntegrationsPortal />} />
        <Route path="*" element={<Navigate to="/developer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
