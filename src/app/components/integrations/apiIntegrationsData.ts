export type Env = "staging" | "production";

export type Role = "Company Admin" | "Developer" | "Billing Viewer" | "Read Only";

export type ApiKey = {
  id: string;
  name: string;
  role: Role;
  key: string;
  addedBy: string;
  env: Env;
  createdAt: string;
  expiryMinutes: number;
};

export type ActivityType = "order" | "api-call";
export type ActivityStatus = "success" | "pending" | "failed";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  module: string;
  name: string;
  method: string;
  path: string;
  requestedBy: string;
  org: string;
  env: Env;
  status: ActivityStatus;
  statusLabel: string;
  timestamp: string;
};

export const MODULES = [
  "Ports",
  "Virtual Router",
  "Virtual Connection",
  "Cloud",
  "Billing",
  "Pricing",
  "Locations",
  "Authentication",
  "User Management",
] as const;

export const ROLES: Role[] = ["Company Admin", "Developer", "Billing Viewer", "Read Only"];

export const uid = () => Math.random().toString(36).slice(2, 10);

function maskedSecret() {
  return Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 6)).join("");
}

export function makeSeedKeys(): ApiKey[] {
  return [
    { id: `k${uid()}`, name: "Abram Qureshi",    role: "Company Admin", key: `pk_live_${maskedSecret()}`, addedBy: "abram.qureshi@lightstorm.in", env: "production", createdAt: "12 Jun 2026, 11:04 AM", expiryMinutes: 1440 },
    { id: `k${uid()}`, name: "CI/CD Pipeline",   role: "Developer",     key: `pk_live_${maskedSecret()}`, addedBy: "abram.qureshi@lightstorm.in", env: "production", createdAt: "18 Jun 2026, 09:40 AM", expiryMinutes: 60 },
    { id: `k${uid()}`, name: "Billing Export Bot", role: "Billing Viewer", key: `pk_test_${maskedSecret()}`, addedBy: "ops@lightstorm.in", env: "staging", createdAt: "02 Jul 2026, 04:15 PM", expiryMinutes: 1440 },
    { id: `k${uid()}`, name: "Sandbox Test Key", role: "Read Only",     key: `pk_test_${maskedSecret()}`, addedBy: "product@lightstorm.in", env: "staging", createdAt: "20 Jul 2026, 02:30 PM", expiryMinutes: 720 },
  ];
}

export function makeSeedActivity(): ActivityItem[] {
  return [
    { id: `a${uid()}`, type: "order",    module: "Ports",             name: "Create Order — Port",                path: "/api/order",           method: "POST", requestedBy: "abram.qureshi@lightstorm.in", org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "Provisioning", timestamp: "29 Jul 2026, 11:52 AM" },
    { id: `a${uid()}`, type: "order",    module: "Virtual Router",    name: "Upgrade Virtual Router",             path: "/api/vr/upgrade",       method: "PUT",  requestedBy: "ops@lightstorm.in",             org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "Active",       timestamp: "28 Jul 2026, 06:14 PM" },
    { id: `a${uid()}`, type: "order",    module: "Virtual Connection",name: "Create Cloud-to-Cloud Order",        path: "/api/order/cloud",      method: "POST", requestedBy: "cx@lightstorm.in",              org: "Lightstorm Networks Pvt Ltd", env: "staging",    status: "pending", statusLabel: "Pending Approval", timestamp: "28 Jul 2026, 03:02 PM" },
    { id: `a${uid()}`, type: "order",    module: "Ports",             name: "Add Ports to LAG",                   path: "/api/port/lag",         method: "POST", requestedBy: "noc@lightstorm.in",             org: "Lightstorm Networks Pvt Ltd", env: "production", status: "failed",  statusLabel: "Failed — capacity", timestamp: "27 Jul 2026, 09:47 AM" },
    { id: `a${uid()}`, type: "order",    module: "Cloud",             name: "Validate Azure Service Key",         path: "/api/cloud/azure/validate", method: "POST", requestedBy: "product@lightstorm.in",    org: "Lightstorm Networks Pvt Ltd", env: "staging",    status: "success", statusLabel: "Validated",    timestamp: "26 Jul 2026, 05:20 PM" },
    { id: `a${uid()}`, type: "api-call", module: "Pricing",           name: "Get Price Estimate for Product",     path: "/api/pricing/estimate", method: "GET",  requestedBy: "abram.qureshi@lightstorm.in", org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "200 OK",       timestamp: "26 Jul 2026, 01:11 PM" },
    { id: `a${uid()}`, type: "api-call", module: "Locations",         name: "Search Locations",                   path: "/api/locations/search", method: "GET",  requestedBy: "cx@lightstorm.in",              org: "Lightstorm Networks Pvt Ltd", env: "staging",    status: "success", statusLabel: "200 OK",       timestamp: "25 Jul 2026, 10:33 AM" },
    { id: `a${uid()}`, type: "api-call", module: "Billing",           name: "Download Invoice PDF",                path: "/api/invoice/download", method: "POST", requestedBy: "ops@lightstorm.in",             org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "200 OK",       timestamp: "24 Jul 2026, 04:47 PM" },
    { id: `a${uid()}`, type: "api-call", module: "Authentication",    name: "Refresh Access Token",                path: "/api/token/refresh",    method: "POST", requestedBy: "noc-team@lightstorm.in",        org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "200 OK",       timestamp: "24 Jul 2026, 09:02 AM" },
    { id: `a${uid()}`, type: "api-call", module: "User Management",   name: "Add New User (Invite)",               path: "/api/users/invite",     method: "POST", requestedBy: "abram.qureshi@lightstorm.in", org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "201 Created",  timestamp: "23 Jul 2026, 03:15 PM" },
    { id: `a${uid()}`, type: "api-call", module: "Authentication",    name: "User Login",                          path: "/api/login",            method: "POST", requestedBy: "manager@lightstorm.in",         org: "Lightstorm Networks Pvt Ltd", env: "staging",    status: "failed",  statusLabel: "401 Unauthorized", timestamp: "22 Jul 2026, 07:40 PM" },
    { id: `a${uid()}`, type: "order",    module: "Ports",             name: "Delete Port / Circuit / Router",     path: "/api/port/delete",      method: "DELETE", requestedBy: "product@lightstorm.in",       org: "Lightstorm Networks Pvt Ltd", env: "production", status: "success", statusLabel: "Decommissioned", timestamp: "21 Jul 2026, 11:00 AM" },
  ];
}
