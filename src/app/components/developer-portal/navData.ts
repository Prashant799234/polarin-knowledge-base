import {
  BookOpen,
  Lock,
  Globe,
  ShieldCheck,
  Users,
  Activity,
  Building2,
  CreditCard,
  FileText,
  DollarSign,
  MapPin,
  Plug,
  Router,
  Link2,
  Key,
  Package,
  Truck,
  RefreshCw,
  BarChart2,
  Bell,
  Headphones,
  Server,
  MapPinned,
  History,
  AlertTriangle,
  Braces,
  HelpCircle,
  UserCheck,
  Tag,
} from "lucide-react";
import React from "react";

export interface SubItem {
  id: string;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  children?: SubItem[];
  external?: boolean;
  badge?: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "GET STARTED",
    items: [
      { id: "quick-start",          label: "Welcome",              icon: BookOpen },
      { id: "onboarding",           label: "Getting Access",       icon: UserCheck },
      { id: "authentication-guide", label: "Authentication Guide", icon: Lock },
      { id: "access-token",         label: "Access Token",         icon: Key },
      { id: "environments",         label: "Environments",         icon: Globe },
      { id: "responses",            label: "Responses",            icon: Braces },
      { id: "release-notes",        label: "Release Notes",        icon: History },
      { id: "api-alerts",           label: "API Alerts",           icon: AlertTriangle, badge: "2" },
      { id: "api-pricing",          label: "Pricing",              icon: Tag },
    ],
  },
  {
    title: "MODULES",
    items: [
      {
        id: "mod-authentication",
        label: "Authentication",
        icon: Lock,
        children: [
          { id: "auth-login", label: "Login" },
          { id: "auth-token", label: "Token" },
          { id: "auth-password", label: "Password" },
          { id: "auth-registration", label: "Registration" },
        ],
      },
      {
        id: "mod-mfa",
        label: "MFA / 2FA",
        icon: ShieldCheck,
        children: [
          { id: "mfa-totp-setup", label: "TOTP Setup" },
          { id: "mfa-totp-login", label: "TOTP Login" },
          { id: "mfa-email", label: "Email MFA" },
          { id: "mfa-recovery", label: "Recovery" },
          { id: "mfa-status", label: "Status" },
          { id: "mfa-admin", label: "Admin" },
        ],
      },
      {
        id: "mod-users",
        label: "User Management",
        icon: Users,
        children: [
          { id: "users-profile", label: "Profile" },
          { id: "users-admin", label: "User Admin" },
          { id: "users-roles", label: "Roles" },
          { id: "users-impersonation", label: "Impersonation" },
        ],
      },
      {
        id: "mod-activity",
        label: "Activity Logs",
        icon: Activity,
        children: [
          { id: "activity-logs", label: "Logs" },
        ],
      },
      {
        id: "mod-org",
        label: "Organization Profile",
        icon: Building2,
        children: [
          { id: "org-profile", label: "Profile" },
          { id: "org-terms", label: "Terms & Conditions" },
          { id: "org-po", label: "PO Settings" },
          { id: "org-disable", label: "Disable" },
        ],
      },
      {
        id: "mod-billing",
        label: "Billing Profile",
        icon: CreditCard,
        children: [
          { id: "billing-profiles", label: "Profiles" },
          { id: "billing-requirements", label: "Requirements" },
        ],
      },
      {
        id: "mod-invoice",
        label: "Invoice",
        icon: FileText,
        children: [
          { id: "invoice-list", label: "Invoice List" },
          { id: "invoice-detail", label: "Invoice Detail" },
          { id: "invoice-actions", label: "Invoice Actions" },
          { id: "invoice-history", label: "History" },
        ],
      },
      {
        id: "mod-pricing",
        label: "Pricing",
        icon: DollarSign,
        children: [
          { id: "pricing-estimate", label: "Price Estimate" },
          { id: "pricing-reporting", label: "Reporting Price" },
          { id: "pricing-coupons", label: "Coupons" },
        ],
      },
      {
        id: "mod-locations",
        label: "Locations",
        icon: MapPin,
        children: [
          { id: "loc-list", label: "List" },
          { id: "loc-detail", label: "Detail" },
          { id: "loc-search", label: "Search" },
          { id: "loc-filter", label: "Filter" },
          { id: "loc-special", label: "Special" },
          { id: "loc-public", label: "Public" },
        ],
      },
      {
        id: "mod-ports",
        label: "Service Orders – Ports",
        icon: Plug,
        children: [
          { id: "ports-order", label: "Order" },
          { id: "ports-qualification", label: "Qualification" },
          { id: "ports-poc", label: "POC Upgrade" },
          { id: "ports-lag", label: "LAG" },
          { id: "ports-bgp", label: "BGP" },
          { id: "ports-loa", label: "LOA" },
          { id: "ports-xconnect", label: "Cross Connect" },
          { id: "ports-delete", label: "Delete" },
        ],
      },
      {
        id: "mod-vr",
        label: "Service Orders – Virtual Router",
        icon: Router,
        children: [
          { id: "vr-macd", label: "Azure MACD" },
          { id: "vr-order", label: "Order" },
          { id: "vr-detail", label: "Detail" },
          { id: "vr-filters", label: "Router Filters" },
          { id: "vr-apply", label: "Apply Filters" },
        ],
      },
      {
        id: "mod-vc",
        label: "Service Orders – Connections",
        icon: Link2,
        children: [
          { id: "vc-list", label: "List" },
          { id: "vc-macd", label: "Bandwidth MACD" },
        ],
      },
      {
        id: "mod-service-keys",
        label: "Service Keys",
        icon: Key,
        children: [
          { id: "sk-keys", label: "Keys" },
        ],
      },
      {
        id: "mod-subscriptions",
        label: "Subscriptions",
        icon: Package,
        children: [
          { id: "sub-detail", label: "Detail" },
          { id: "sub-lifecycle", label: "Lifecycle" },
          { id: "sub-po", label: "PO Details" },
          { id: "sub-macd", label: "MACD Pricing" },
        ],
      },
      {
        id: "mod-track-order",
        label: "Track Order",
        icon: Truck,
        children: [
          { id: "track-dashboard", label: "Dashboard" },
          { id: "track-timeline", label: "Timeline" },
          { id: "track-port", label: "Port Detail" },
          { id: "track-vc", label: "VC Detail" },
          { id: "track-history", label: "Service History" },
        ],
      },
      {
        id: "mod-macd",
        label: "MACD",
        icon: RefreshCw,
        children: [
          { id: "macd-bandwidth", label: "Bandwidth Change" },
          { id: "macd-termination", label: "Termination" },
        ],
      },
      {
        id: "mod-vista",
        label: "VISTA – Performance Metrics",
        icon: BarChart2,
        children: [
          { id: "vista-port-metrics", label: "Port Metrics" },
          { id: "vista-vc-metrics", label: "VC Metrics" },
          { id: "vista-sla", label: "SLA" },
          { id: "vista-latency", label: "Latency" },
          { id: "vista-flap", label: "Flap Events" },
          { id: "vista-snmp", label: "SNMP" },
        ],
      },
      {
        id: "mod-notifications",
        label: "Notifications",
        icon: Bell,
        children: [
          { id: "notif-reports", label: "Scheduled Reports" },
        ],
      },
      {
        id: "mod-support",
        label: "Help & Support",
        icon: Headphones,
        children: [
          { id: "support-tickets", label: "Tickets" },
          { id: "support-comms", label: "Ticket Comms" },
          { id: "support-feedback", label: "Ticket Feedback" },
          { id: "support-mttr", label: "MTTR" },
        ],
      },
      {
        id: "mod-appliance",
        label: "Virtual Appliance",
        icon: Server,
        children: [
          { id: "va-list", label: "List" },
          { id: "va-detail", label: "Detail" },
          { id: "va-images", label: "Images" },
          { id: "va-config", label: "Image Config" },
          { id: "va-sku", label: "SKU" },
          { id: "va-macd", label: "Bandwidth MACD" },
        ],
      },
      {
        id: "mod-address",
        label: "Address",
        icon: MapPinned,
        children: [
          { id: "addr-geography", label: "Geography" },
          { id: "addr-tax", label: "Tax" },
          { id: "addr-entity", label: "Entity Types" },
        ],
      },
    ],
  },
  {
    title: "HELP",
    items: [
      { id: "faq", label: "FAQ", icon: HelpCircle },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export function findParentModule(childId: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) => item.children?.some((c) => c.id === childId));
}
