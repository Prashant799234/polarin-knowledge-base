import { useState, useRef, useEffect } from "react";
import type { ElementType } from "react";
import { SearchBar } from "./SearchBar";
import { CopyPageMenu } from "./CopyPageMenu";
import {
  Home, FileText, Code, UserCircle, Building2,
  MapPin, Cloud, Server, Plug, CreditCard,
  Headphones, ShieldAlert,
  ExternalLink, Sparkles, Menu, X, ChevronDown, Activity,
  Info, LayoutDashboard, Bell, Waypoints, ClipboardCheck, Gauge,
  LineChart, Users, FileBarChart, BellRing, UserCog, Boxes, LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WelcomePage } from "./WelcomePage";
import { ReleaseNotesPage } from "./ReleaseNotesPage";
import { LocationsPage } from "./LocationsPage";
import { ComingSoonPage } from "./ComingSoonPage";
import { ProgressBar } from "./ProgressBar";
import { AboutPolarinPage } from "./articles/AboutPolarinPage";
import { ServicesOfferedPage } from "./articles/ServicesOfferedPage";
import { QuickSetupPage } from "./articles/QuickSetupPage";
import { ChooseProductPage } from "./articles/ChooseProductPage";
import { SupportOverviewPage } from "./articles/SupportOverviewPage";
import { CreateTicketPage } from "./articles/CreateTicketPage";
import { MyTicketsPage } from "./articles/MyTicketsPage";
import { CreateAccountPage } from "./articles/CreateAccountPage";
import { SignInPage } from "./articles/SignInPage";
import { CompleteProfilePage } from "./articles/CompleteProfilePage";
import { PersonalInformationPage } from "./articles/PersonalInformationPage";
import { UpdatePasswordPage } from "./articles/UpdatePasswordPage";
import { TwoFactorAuthPage } from "./articles/TwoFactorAuthPage";
import { KYCDocumentsPage } from "./articles/KYCDocumentsPage";
import { OrgSettingsPage } from "./articles/OrgSettingsPage";
import { InviteTeamPage } from "./articles/InviteTeamPage";
import { BillingProfilePage } from "./articles/BillingProfilePage";
import { BillingOverviewPage } from "./articles/BillingOverviewPage";
import { BillingInvoicesPage } from "./articles/BillingInvoicesPage";
import { ReportsPage } from "./articles/ReportsPage";
import { CreatePortPage } from "./articles/CreatePortPage";
import { PortStatusPage } from "./articles/PortStatusPage";
import { CreateLAGPage } from "./articles/CreateLAGPage";
import { PortOverviewPage } from "./articles/PortOverviewPage";
import { CreateVirtualRouterPage } from "./articles/CreateVirtualRouterPage";
import { VirtualRouterStatusPage } from "./articles/VirtualRouterStatusPage";
import { VirtualRouterOverviewPage } from "./articles/VirtualRouterOverviewPage";
import { ActivityLogPage } from "./articles/ActivityLogPage";
import { ActivityLogOverviewPage } from "./articles/ActivityLogOverviewPage";
import { CreateCloudToCloudPage } from "./articles/CreateCloudToCloudPage";
import { CreateDCToCloudPage } from "./articles/CreateDCToCloudPage";
import { VirtualConnectionOverviewPage } from "./articles/VirtualConnectionOverviewPage";
import { DCICreatePage } from "./articles/DCICreatePage";
import { CreateDCIWavePage } from "./articles/CreateDCIWavePage";
import { CreateDCILayer2Page } from "./articles/CreateDCILayer2Page";
import { DCIOverviewPage } from "./articles/DCIOverviewPage";
import { InternetExchangePage } from "./articles/InternetExchangePage";
import { InternetExchangeOverviewPage } from "./articles/InternetExchangeOverviewPage";
import { ServiceDetailPage } from "./articles/ServiceDetailPage";
import { ServiceStatusPage } from "./articles/ServiceStatusPage";
import { VistaOverviewPage } from "./articles/VistaOverviewPage";
import { VistaPortPage } from "./articles/VistaPortPage";
import { VistaVirtualConnectionPage } from "./articles/VistaVirtualConnectionPage";
import { VistaDCIWavePage } from "./articles/VistaDCIWavePage";
import { DashboardOverviewPage } from "./articles/DashboardOverviewPage";
import { NotificationsPage } from "./articles/NotificationsPage";
import { ManageAlertsPage } from "./articles/ManageAlertsPage";
import { ContactSupportPage } from "./ContactSupportPage";
import { EscalationMatrixPage } from "./articles/EscalationMatrixPage";
import { ArticleFooter, PageToolsProvider, usePageTools, ArticlePage, H1, H2, P, UL, LI, Callout, Steps, Step, PageLink, ArticleMeta, Tag, Dot, ReadTime } from "./ArticlePage";
import type { ArticleLink } from "./ArticlePage";
import { useWindowWidth } from "./useWindowWidth";
import { prefersReducedMotion, REVEAL_VARIANTS, revealTransition } from "./animations/motionConfig";
import { RevealOnScroll, RevealGroup, RevealItem } from "./RevealOnScroll";

export type KBPage = string; // "welcome" | "release-notes" | any other id → ComingSoon

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface SubItem {
  id: string;
  label: string;
  group?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  badge?: string;
  external?: boolean;
  href?: string;
  children?: SubItem[];
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { id: "welcome", label: "Welcome", icon: Home },
      { id: "release-notes", label: "Release Notes", icon: FileText, badge: "New" },
      {
        id: "api-docs", label: "Polarin API", icon: Code,
        children: [
          { id: "api-overview",   label: "Overview" },
          { id: "api-onboarding", label: "Getting Access" },
        ],
      },
    ],
  },
  {
    title: "GET STARTED",
    items: [
      {
        id: "gs-overview", label: "Overview", icon: Info,
        children: [
          { id: "about-polarin",    label: "About Polarin" },
          { id: "services-offered", label: "Services Offered" },
          { id: "quick-setup",      label: "Quick Setup" },
          { id: "choose-product",   label: "Choosing the Right Product" },
        ],
      },
      { id: "create-account", label: "Create a Polarin Account", icon: UserCircle },
      {
        id: "org-profile", label: "Organisation Details", icon: Building2,
        children: [
          { id: "complete-profile", label: "Complete Your Profile" },
          { id: "org-kyc", label: "KYC Document Requirements" },
          { id: "org-settings", label: "Organisation Settings" },
        ],
      },
      { id: "sign-in", label: "Sign In", icon: LogIn },
    ],
  },
  {
    title: "GETTING AROUND",
    items: [
      { id: "dashboard-overview", label: "Dashboard", icon: LayoutDashboard },
      { id: "notifications", label: "Alerts & Notifications", icon: Bell },
    ],
  },
  {
    title: "PRODUCTS",
    items: [
      {
        id: "core-products", label: "Core Products", icon: Boxes,
        children: [
          { id: "port-overview", label: "Port Overview",      group: "Port" },
          { id: "port-create", label: "Create a Port",         group: "Port" },
          { id: "port-status", label: "Understand Port Status", group: "Port" },
          { id: "port-lag",    label: "Create a Link Aggregation Group", group: "Port" },
          { id: "vr-overview", label: "Virtual Router Overview",       group: "Virtual Router" },
          { id: "vr-create", label: "Create a Virtual Router",         group: "Virtual Router" },
          { id: "vr-status", label: "Understand Virtual Router Status", group: "Virtual Router" },
        ],
      },
      {
        id: "virtual-connection", label: "Cloud Connect", icon: Cloud,
        children: [
          { id: "vc-overview",   label: "Overview" },
          { id: "dc-to-cloud-create",    label: "Create a DC to Cloud Connection", group: "DC to Cloud" },
          { id: "cloud-to-cloud-create", label: "Create a Cloud to Cloud Connection", group: "Cloud to Cloud" },
        ],
      },
      {
        id: "dci", label: "Data Centre Interconnect", icon: Server,
        children: [
          { id: "dci-overview", label: "Overview" },
          { id: "dci-wave-create",   label: "Create a DCI Wave Connection", group: "DCI Wave" },
          { id: "dci-layer2-create", label: "Create a DCI Layer 2 Connection", group: "DCI Layer 2" },
          { id: "dci-create",   label: "Compare DCI Wave vs Layer 2" },
        ],
      },
      {
        id: "internet-exchange", label: "Internet Exchange", icon: Waypoints,
        children: [
          { id: "ix-overview", label: "Overview" },
          { id: "ix-create",   label: "Set Up Internet Exchange" },
        ],
      },
      { id: "locations", label: "Locations", icon: MapPin },
    ],
  },
  {
    title: "SERVICE MANAGEMENT",
    items: [
      { id: "service-detail", label: "Understanding the Service Detail Page", icon: ClipboardCheck },
      { id: "service-status", label: "Understanding Service Status", icon: Gauge },
    ],
  },
  {
    title: "VISTA",
    items: [
      { id: "vista-overview", label: "Overview", icon: LineChart },
      { id: "vista-port", label: "Port", icon: Plug },
      { id: "vista-vc", label: "Connections", icon: Cloud },
      { id: "vista-dci-wave", label: "DCI Wave", icon: Server },
      { id: "manage-alerts", label: "Manage Alerts", icon: BellRing },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { id: "invite-members", label: "User Management", icon: Users },
      {
        id: "billing", label: "Billing", icon: CreditCard,
        children: [
          { id: "billing-overview", label: "Overview" },
          { id: "billing-profile", label: "Billing Profile" },
          { id: "billing-invoices", label: "Invoices" },
        ],
      },
      {
        id: "activity-logs", label: "Activity Logs", icon: Activity,
        children: [
          { id: "activity-log-overview", label: "Overview" },
          { id: "activity-log-details",  label: "Using Activity Log" },
        ],
      },
      { id: "reports", label: "Reports", icon: FileBarChart },
    ],
  },
  {
    title: "MY ACCOUNT",
    items: [
      {
        id: "profile", label: "Profile", icon: UserCog,
        children: [
          { id: "profile-personal",  label: "Personal Information" },
          { id: "profile-password",  label: "Update Password" },
          { id: "profile-2fa",       label: "Two-Factor Authentication" },
        ],
      },
    ],
  },
  {
    title: "HELP & SUPPORT",
    items: [
      {
        id: "support-tickets", label: "Get Support", icon: Headphones,
        children: [
          { id: "ticket-overview", label: "Overview" },
          { id: "create-ticket",   label: "Create Ticket" },
          { id: "my-tickets",      label: "My Tickets" },
          { id: "contact-support", label: "Contact Support" },
        ],
      },
      { id: "escalation-matrix", label: "Escalation Matrix", icon: ShieldAlert },
    ],
  },
];

// Metadata for article footer (prev / next / related) — single source of truth
const ARTICLE_META: Record<string, { prev?: ArticleLink; next?: ArticleLink; related?: ArticleLink[] }> = {
  "about-polarin": {
    next: { label: "Services Offered", pageId: "services-offered" },
    related: [
      { label: "Services Offered",        pageId: "services-offered" },
      { label: "Quick Setup",             pageId: "quick-setup" },
      { label: "Create a Polarin Account", pageId: "create-account" },
    ],
  },
  "services-offered": {
    prev: { label: "About Polarin", pageId: "about-polarin" },
    next: { label: "Quick Setup",   pageId: "quick-setup" },
    related: [
      { label: "About Polarin",           pageId: "about-polarin" },
      { label: "Create a Port",           pageId: "port-create" },
      { label: "Create a Virtual Router", pageId: "vr-create" },
    ],
  },
  "quick-setup": {
    prev: { label: "Services Offered", pageId: "services-offered" },
    next: { label: "Choosing the Right Product", pageId: "choose-product" },
    related: [
      { label: "About Polarin",              pageId: "about-polarin" },
      { label: "Services Offered",           pageId: "services-offered" },
      { label: "Create a Polarin Account",   pageId: "create-account" },
    ],
  },
  "choose-product": {
    prev: { label: "Quick Setup", pageId: "quick-setup" },
    next: { label: "Create a Polarin Account", pageId: "create-account" },
    related: [
      { label: "What Is a Port?",                   pageId: "port-overview" },
      { label: "What Is a Virtual Router?",         pageId: "vr-overview" },
      { label: "What Is Cloud Connect?",     pageId: "vc-overview" },
      { label: "What Is Data Centre Interconnect?", pageId: "dci-overview" },
    ],
  },
  "create-account": {
    next: { label: "Complete Organisation Profile", pageId: "complete-profile" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "KYC Document Requirements",     pageId: "org-kyc" },
      { label: "Invite Team Members",           pageId: "invite-members" },
    ],
  },
  "complete-profile": {
    prev: { label: "Create a Polarin Account",  pageId: "create-account" },
    next: { label: "KYC Document Requirements", pageId: "org-kyc" },
    related: [
      { label: "KYC Document Requirements", pageId: "org-kyc" },
      { label: "Invite Team Members",       pageId: "invite-members" },
      { label: "Create a Polarin Account",  pageId: "create-account" },
    ],
  },
  "org-kyc": {
    prev: { label: "Complete Organisation Profile", pageId: "complete-profile" },
    next: { label: "Organisation Settings",         pageId: "org-settings" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "Organisation Settings",         pageId: "org-settings" },
      { label: "Create a Polarin Account",      pageId: "create-account" },
    ],
  },
  "org-settings": {
    prev: { label: "KYC Document Requirements", pageId: "org-kyc" },
    next: { label: "Sign In",                   pageId: "sign-in" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "KYC Document Requirements",     pageId: "org-kyc" },
      { label: "Invoices",                      pageId: "billing-invoices" },
    ],
  },
  "sign-in": {
    prev: { label: "Organisation Settings",     pageId: "org-settings" },
    next: { label: "User Management",           pageId: "invite-members" },
    related: [
      { label: "Create a Polarin Account",      pageId: "create-account" },
      { label: "Update Password",               pageId: "profile-password" },
      { label: "Two-Factor Authentication",     pageId: "profile-2fa" },
    ],
  },
  "invite-members": {
    prev: { label: "Sign In",                   pageId: "sign-in" },
    next: { label: "Billing Overview",          pageId: "billing-overview" },
    related: [
      { label: "Complete Organisation Profile", pageId: "complete-profile" },
      { label: "Organisation Settings",         pageId: "org-settings" },
      { label: "Billing Profile",               pageId: "billing-profile" },
      { label: "Create a Polarin Account",      pageId: "create-account" },
    ],
  },
  "billing-overview": {
    prev: { label: "User Management",          pageId: "invite-members" },
    next: { label: "Billing Profile",          pageId: "billing-profile" },
    related: [
      { label: "Billing Profile",               pageId: "billing-profile" },
      { label: "Organisation Settings",         pageId: "org-settings" },
      { label: "VISTA",                         pageId: "vista-overview" },
    ],
  },
  "billing-profile": {
    prev: { label: "Billing Overview",         pageId: "billing-overview" },
    next: { label: "Invoices",                 pageId: "billing-invoices" },
    related: [
      { label: "Billing Overview",              pageId: "billing-overview" },
      { label: "User Management",               pageId: "invite-members" },
      { label: "Organisation Settings",         pageId: "org-settings" },
    ],
  },
  "billing-invoices": {
    prev: { label: "Billing Profile",          pageId: "billing-profile" },
    next: { label: "Activity Log Overview",    pageId: "activity-log-overview" },
    related: [
      { label: "Billing Overview",              pageId: "billing-overview" },
      { label: "Billing Profile",               pageId: "billing-profile" },
      { label: "Organisation Settings",         pageId: "org-settings" },
    ],
  },
  "profile-personal": {
    next: { label: "Update Password", pageId: "profile-password" },
    related: [
      { label: "Update Password",               pageId: "profile-password" },
      { label: "Two-Factor Authentication",      pageId: "profile-2fa" },
      { label: "User Management",                pageId: "invite-members" },
    ],
  },
  "profile-password": {
    prev: { label: "Personal Information", pageId: "profile-personal" },
    next: { label: "Two-Factor Authentication", pageId: "profile-2fa" },
    related: [
      { label: "Personal Information",           pageId: "profile-personal" },
      { label: "Two-Factor Authentication",      pageId: "profile-2fa" },
    ],
  },
  "profile-2fa": {
    prev: { label: "Update Password", pageId: "profile-password" },
    related: [
      { label: "Update Password",               pageId: "profile-password" },
      { label: "Personal Information",           pageId: "profile-personal" },
    ],
  },
  "port-overview": {
    next: { label: "Create a Port", pageId: "port-create" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "What Is a Virtual Router?",             pageId: "vr-overview" },
      { label: "What Is Cloud Connect?",         pageId: "vc-overview" },
      { label: "What Is Data Centre Interconnect?",     pageId: "dci-overview" },
    ],
  },
  "port-create": {
    prev: { label: "What Is a Port?",                   pageId: "port-overview" },
    next: { label: "Understand Port Status",            pageId: "port-status" },
    related: [
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Create a Link Aggregation Group",       pageId: "port-lag" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "port-status": {
    prev: { label: "Create a Port",                     pageId: "port-create" },
    next: { label: "Create a Link Aggregation Group",   pageId: "port-lag" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Create a Link Aggregation Group",       pageId: "port-lag" },
    ],
  },
  "port-lag": {
    prev: { label: "Understand Port Status",            pageId: "port-status" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "cloud-to-cloud-create": {
    prev: { label: "What Is Cloud Connect?",     pageId: "vc-overview" },
    next: { label: "Create a DC to Cloud Connection",   pageId: "dc-to-cloud-create" },
    related: [
      { label: "Create a Virtual Router",               pageId: "vr-create" },
      { label: "Create a DC to Cloud Connection",        pageId: "dc-to-cloud-create" },
      { label: "VISTA for Connections",           pageId: "vista-vc" },
    ],
  },
  "dc-to-cloud-create": {
    prev: { label: "Create a Cloud to Cloud Connection", pageId: "cloud-to-cloud-create" },
    related: [
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Create a Cloud to Cloud Connection",     pageId: "cloud-to-cloud-create" },
      { label: "VISTA for Connections",           pageId: "vista-vc" },
    ],
  },
  "dci-wave-create": {
    prev: { label: "What Is Data Centre Interconnect?", pageId: "dci-overview" },
    next: { label: "Create a DCI Layer 2 Connection",   pageId: "dci-layer2-create" },
    related: [
      { label: "Create a DCI Layer 2 Connection",       pageId: "dci-layer2-create" },
      { label: "VISTA for DCI Wave",                    pageId: "vista-dci-wave" },
      { label: "Create a Port",                         pageId: "port-create" },
    ],
  },
  "dci-layer2-create": {
    prev: { label: "Create a DCI Wave Connection",      pageId: "dci-wave-create" },
    related: [
      { label: "Create a DCI Wave Connection",          pageId: "dci-wave-create" },
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "VISTA for Connections",          pageId: "vista-vc" },
    ],
  },
  "vr-overview": {
    next: { label: "Create a Virtual Router", pageId: "vr-create" },
    related: [
      { label: "Create a Virtual Router",               pageId: "vr-create" },
      { label: "What Is a Port?",                       pageId: "port-overview" },
      { label: "What Is Cloud Connect?",         pageId: "vc-overview" },
    ],
  },
  "vr-create": {
    prev: { label: "What Is a Virtual Router?",         pageId: "vr-overview" },
    next: { label: "Understand Virtual Router Status",  pageId: "vr-status" },
    related: [
      { label: "Understand Virtual Router Status",      pageId: "vr-status" },
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Locations",                             pageId: "locations" },
    ],
  },
  "vr-status": {
    prev: { label: "Create a Virtual Router",           pageId: "vr-create" },
    related: [
      { label: "Create a Virtual Router",               pageId: "vr-create" },
      { label: "Create a Port",                         pageId: "port-create" },
      { label: "Understand Port Status",                pageId: "port-status" },
    ],
  },
  "activity-log-overview": {
    next: { label: "Using Activity Log", pageId: "activity-log-details" },
    related: [
      { label: "Using Activity Log",     pageId: "activity-log-details" },
      { label: "Create a Ticket",        pageId: "create-ticket" },
    ],
  },
  "activity-log-details": {
    prev: { label: "Activity Log Overview", pageId: "activity-log-overview" },
    next: { label: "Manage Alerts", pageId: "manage-alerts" },
    related: [
      { label: "Activity Log Overview",                 pageId: "activity-log-overview" },
      { label: "Manage Alerts",                         pageId: "manage-alerts" },
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Understand Virtual Router Status",      pageId: "vr-status" },
      { label: "Create a Port",                         pageId: "port-create" },
    ],
  },
  "manage-alerts": {
    prev: { label: "Alerts & Notifications", pageId: "notifications" },
    next: { label: "Activity Log Overview", pageId: "activity-log-overview" },
    related: [
      { label: "Alerts & Notifications", pageId: "notifications" },
      { label: "VISTA",                  pageId: "vista-overview" },
      { label: "Using Activity Log",     pageId: "activity-log-details" },
    ],
  },
  "ticket-overview": {
    next: { label: "Create a Ticket", pageId: "create-ticket" },
    related: [
      { label: "Create a Ticket",   pageId: "create-ticket" },
      { label: "My Tickets",        pageId: "my-tickets" },
      { label: "Contact Support",   pageId: "contact-support" },
      { label: "Escalation Matrix", pageId: "escalation-matrix" },
    ],
  },
  "create-ticket": {
    prev: { label: "Get Support",   pageId: "ticket-overview" },
    next: { label: "My Tickets",    pageId: "my-tickets" },
    related: [
      { label: "Get Support",       pageId: "ticket-overview" },
      { label: "My Tickets",        pageId: "my-tickets" },
      { label: "Contact Support",   pageId: "contact-support" },
      { label: "Escalation Matrix", pageId: "escalation-matrix" },
    ],
  },
  "my-tickets": {
    prev: { label: "Create a Ticket", pageId: "create-ticket" },
    next: { label: "Escalation Matrix", pageId: "escalation-matrix" },
    related: [
      { label: "Get Support",       pageId: "ticket-overview" },
      { label: "Create a Ticket",   pageId: "create-ticket" },
      { label: "Contact Support",   pageId: "contact-support" },
      { label: "Escalation Matrix", pageId: "escalation-matrix" },
    ],
  },
  "escalation-matrix": {
    prev: { label: "My Tickets", pageId: "my-tickets" },
    related: [
      { label: "Get Support",       pageId: "ticket-overview" },
      { label: "Create a Ticket",   pageId: "create-ticket" },
      { label: "Contact Support",   pageId: "contact-support" },
      { label: "Alerts & Notifications", pageId: "notifications" },
    ],
  },
  "dashboard-overview": {
    next: { label: "Alerts & Notifications", pageId: "notifications" },
    related: [
      { label: "Alerts & Notifications", pageId: "notifications" },
      { label: "Quick Setup",   pageId: "quick-setup" },
    ],
  },
  "notifications": {
    prev: { label: "Dashboard", pageId: "dashboard-overview" },
    next: { label: "Manage Alerts", pageId: "manage-alerts" },
    related: [
      { label: "Manage Alerts",                      pageId: "manage-alerts" },
      { label: "VISTA",                              pageId: "vista-overview" },
      { label: "Understanding Service Status",       pageId: "service-status" },
    ],
  },
  "vc-overview": {
    next: { label: "Create a DC to Cloud Connection", pageId: "dc-to-cloud-create" },
    related: [
      { label: "Create a Cloud to Cloud Connection",    pageId: "cloud-to-cloud-create" },
      { label: "What Is a Port?",                       pageId: "port-overview" },
      { label: "What Is a Virtual Router?",             pageId: "vr-overview" },
    ],
  },
  "dci-overview": {
    next: { label: "Create a Data Centre Interconnect", pageId: "dci-create" },
    related: [
      { label: "Create a Data Centre Interconnect",     pageId: "dci-create" },
      { label: "What Is a Port?",                       pageId: "port-overview" },
      { label: "What Is Cloud Connect?",         pageId: "vc-overview" },
    ],
  },
  "dci-create": {
    prev: { label: "What Is Data Centre Interconnect?", pageId: "dci-overview" },
    related: [
      { label: "Create a DCI Wave Connection",          pageId: "dci-wave-create" },
      { label: "Create a DCI Layer 2 Connection",       pageId: "dci-layer2-create" },
      { label: "Create a Port",                        pageId: "port-create" },
    ],
  },
  "ix-overview": {
    next: { label: "Set Up Internet Exchange", pageId: "ix-create" },
    related: [
      { label: "Set Up Internet Exchange",              pageId: "ix-create" },
      { label: "What Is a Port?",                       pageId: "port-overview" },
      { label: "What Is Cloud Connect?",         pageId: "vc-overview" },
    ],
  },
  "ix-create": {
    prev: { label: "What Is Internet Exchange?",        pageId: "ix-overview" },
    related: [
      { label: "Create a Port",                        pageId: "port-create" },
      { label: "Understanding the Service Detail Page", pageId: "service-detail" },
    ],
  },
  "service-detail": {
    next: { label: "Understanding Service Status", pageId: "service-status" },
    related: [
      { label: "Understanding Service Status", pageId: "service-status" },
      { label: "Create a Port",                pageId: "port-create" },
      { label: "Create a Ticket",              pageId: "create-ticket" },
    ],
  },
  "service-status": {
    prev: { label: "Understanding the Service Detail Page", pageId: "service-detail" },
    related: [
      { label: "Understanding the Service Detail Page", pageId: "service-detail" },
      { label: "Understand Port Status",                pageId: "port-status" },
      { label: "Understand Virtual Router Status",      pageId: "vr-status" },
    ],
  },
  "reports": {
    prev: { label: "Using Activity Log",       pageId: "activity-log-details" },
    next: { label: "Manage Alerts",            pageId: "manage-alerts" },
    related: [
      { label: "VISTA",                        pageId: "vista-overview" },
      { label: "Alerts & Notifications",        pageId: "notifications" },
      { label: "What Is Data Centre Interconnect?", pageId: "dci-overview" },
      { label: "What Is a Port?",               pageId: "port-overview" },
    ],
  },
  "vista-overview": {
    next: { label: "VISTA for Port", pageId: "vista-port" },
    related: [
      { label: "VISTA for Port",               pageId: "vista-port" },
      { label: "VISTA for Connections", pageId: "vista-vc" },
      { label: "VISTA for DCI Wave",           pageId: "vista-dci-wave" },
      { label: "Reports",                      pageId: "reports" },
      { label: "Alerts & Notifications",       pageId: "notifications" },
    ],
  },
  "vista-port": {
    prev: { label: "VISTA Overview",           pageId: "vista-overview" },
    next: { label: "VISTA for Connections", pageId: "vista-vc" },
    related: [
      { label: "What Is a Port?",              pageId: "port-overview" },
      { label: "Create a Port",                pageId: "port-create" },
      { label: "VISTA Overview",               pageId: "vista-overview" },
      { label: "Reports",                      pageId: "reports" },
    ],
  },
  "vista-vc": {
    prev: { label: "VISTA for Port",           pageId: "vista-port" },
    next: { label: "VISTA for DCI Wave",       pageId: "vista-dci-wave" },
    related: [
      { label: "What Is Cloud Connect?", pageId: "vc-overview" },
      { label: "Create a DCI Layer 2 Connection", pageId: "dci-layer2-create" },
      { label: "VISTA Overview",               pageId: "vista-overview" },
      { label: "Manage Alerts",                pageId: "manage-alerts" },
    ],
  },
  "vista-dci-wave": {
    prev: { label: "VISTA for Connections", pageId: "vista-vc" },
    related: [
      { label: "What Is Data Centre Interconnect?", pageId: "dci-overview" },
      { label: "Create a Data Centre Interconnect", pageId: "dci-create" },
      { label: "VISTA Overview",               pageId: "vista-overview" },
      { label: "Reports",                      pageId: "reports" },
    ],
  },
};

const ARTICLE_PAGES = new Set(Object.keys(ARTICLE_META));

function getPageLabel(id: string): string {
  if (id === "billing-overview") return "Billing Overview";
  if (id === "vista-overview") return "VISTA Overview";
  if (id === "vista-port") return "VISTA for Port";
  if (id === "vista-vc") return "VISTA for Connections";
  if (id === "vista-dci-wave") return "VISTA for DCI Wave";
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.id === id) return item.label;
      if (item.children) {
        for (const child of item.children) {
          if (child.id === id) {
            if (child.label === "Overview") return `${item.label} Overview`;
            return child.label;
          }
        }
      }
    }
  }
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function KnowledgeBase() {
  const [activePage, setActivePage] = useState<KBPage>(() => {
    const p = new URLSearchParams(window.location.search).get("page");
    if (p === "feedback") return "escalation-matrix";
    if (p === "billing" || p === "billing-payment") return "billing-overview";
    return p || "welcome";
  });
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initialPage = new URLSearchParams(window.location.search).get("page") || "welcome";
    const set = new Set<string>();
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (item.children?.some(c => c.id === initialPage)) {
          set.add(item.id);
        }
      }
    }
    return set;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [recentPageHistory, setRecentPageHistory] = useState<string[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const width = useWindowWidth();
  const isMobile = width < 768;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigate = (id: string) => {
    if (id === activePage) return;
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    setRecentPageHistory(prev => [activePage, ...prev.filter(p => p !== activePage)].slice(0, 8));
    // Accordion behaviour: only the group containing the destination page stays
    // expanded — every other expanded group collapses automatically.
    let destinationParent: string | null = null;
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (item.children?.some(c => c.id === id)) {
          destinationParent = item.id;
        }
      }
    }
    setExpanded(destinationParent ? new Set([destinationParent]) : new Set());
    setIsNavigating(true);
    setActivePage(id);
    if (isMobile) setSidebarOpen(false);
    setTimeout(() => setIsNavigating(false), 550);
  };

  // Keep the URL in sync so every page has a real, shareable link.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", activePage);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [activePage]);

  const isActiveOrChild = (item: NavItem): boolean => {
    if (item.id === activePage) return true;
    if (item.children) return item.children.some((c) => c.id === activePage);
    return false;
  };

  const sidebarContent = (
    <nav style={{ flex: 1, paddingTop: 8, paddingBottom: 24, overflowY: "auto" }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && (
            <div style={{ height: 1, background: "#e2e8f1", margin: "6px 0" }} />
          )}
          {group.title && (
            <div
              style={{
                padding: "8px 24px 4px",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 400,
                color: "#90a2b9",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: "32px",
              }}
            >
              {group.title}
            </div>
          )}
          {group.items.map((item, ii) => {
            const Icon = item.icon;
            const isActive = item.id === activePage;
            const isParentActive = isActiveOrChild(item) && !isActive;
            const isOpen = expanded.has(item.id);
            const hasChildren = !!item.children?.length;
            // Extra breathing room when this standalone item immediately follows an
            // expanded group — otherwise it visually reads as one more row inside that
            // group's (sub-grouped) children instead of a separate top-level product.
            const prevExpanded = ii > 0 && !!group.items[ii - 1].children?.length && expanded.has(group.items[ii - 1].id);

            return (
              <div key={item.id} style={prevExpanded ? { marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" } : undefined}>
                <NavButton
                  icon={<Icon size={20} color={isActive || isParentActive ? "#1c808d" : "#7e93b2"} strokeWidth={1.8} />}
                  label={item.label}
                  isActive={isActive}
                  isParentActive={isParentActive}
                  badge={item.badge}
                  external={item.external}
                  hasChildren={hasChildren}
                  isOpen={isOpen}
                  onClick={() => {
                    if (item.href) {
                      window.open(item.href, "_blank", "noopener,noreferrer");
                      return;
                    }
                    if (hasChildren) {
                      toggleExpand(item.id);
                      if (!isParentActive && item.children?.[0]) {
                        navigate(item.children[0].id);
                      }
                    } else {
                      navigate(item.id);
                    }
                  }}
                />
                {/* Sub-items — animated expand/collapse */}
                <AnimatePresence initial={false}>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      {item.children!.map((child, ci) => {
                        const isChildActive = child.id === activePage;
                        const showGroupHeader = !!child.group && child.group !== item.children![ci - 1]?.group;
                        return (
                          <div key={child.id}>
                            {showGroupHeader && (
                              <div
                                style={{
                                  padding: ci === 0 ? "4px 24px 2px 48px" : "10px 24px 2px 48px",
                                  fontFamily: FONT,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#aab8cc",
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {child.group}
                              </div>
                            )}
                            <NavButton
                              icon={null}
                              label={child.label}
                              isActive={isChildActive}
                              isParentActive={false}
                              indent
                              onClick={() => navigate(child.id)}
                            />
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const logoRow = (showClose: boolean) => (
    <div
      style={{
        height: 64,
        borderBottom: "0.5px solid #e2e8f1",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        padding: "0 16px 0 24px",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <img
        src="/polarin-logo.png"
        alt="Polarin Docs"
        style={{ height: 47, width: "auto", display: "block" }}
      />
      {showClose && (
        <button
          onClick={() => setSidebarOpen(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#7e93b2", display: "flex", padding: 4, borderRadius: 6, transition: "background 0.12s, color 0.12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(28,128,141,0.08)"; e.currentTarget.style.color = "#1c808d"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#7e93b2"; }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className="kb-app-body" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc", fontFamily: FONT }}>
      <ProgressBar active={isNavigating} />

      {/* ── Full-width desktop header (spans sidebar + content) ── */}
      {!isMobile && (
        <div className="kb-top-header" style={{
          height: 64, flexShrink: 0,
          background: "#fff",
          display: "flex", alignItems: "center",
          position: "relative", zIndex: 20,
        }}>
          {/* Logo section — exact width of sidebar */}
          <div style={{
            width: 240, minWidth: 240, flexShrink: 0,
            padding: "0 16px 0 24px",
            display: "flex", alignItems: "center",
            height: "100%",
            borderRight: "0.5px solid #e2e8f1",
          }}>
            <img src="/polarin-logo.png" alt="Polarin Docs" style={{ height: 47, width: "auto", display: "block" }} />
          </div>
          {/* Search — centered in the remaining space */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 24px" }}>
            <div style={{ width: 480, maxWidth: "100%" }}>
              <SearchBar onNavigate={navigate} recentPageIds={recentPageHistory} />
            </div>
          </div>
          {/* Portal CTA */}
          <div style={{ paddingRight: 24, flexShrink: 0 }}>
            <PortalCTA />
          </div>
        </div>
      )}

      {/* ── Mobile top bar ── */}
      {isMobile && (
        <div className="kb-top-header" style={{ height: 56, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, position: "sticky", top: 0, zIndex: 30 }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#0a3954", display: "flex", padding: 4, borderRadius: 6, transition: "background 0.12s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(28,128,141,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            <Menu size={22} />
          </button>
          <img src="/polarin-logo.png" alt="Polarin Docs" style={{ height: 36, width: "auto" }} />
        </div>
      )}

      <div className="kb-main-layout" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }} />
        )}

        {/* Sidebar — desktop: no logo row (it's in the full-width header) */}
        <aside
          className="kb-sidebar"
          style={{
            width: 240,
            minWidth: 240,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            ...(isMobile
              ? {
                  position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 50,
                  background: "#f8fafc",
                  transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                  transition: "transform 0.25s ease",
                  boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.1)" : "none",
                }
              : {}),
          }}
        >
          {/* Mobile only: show logo + close button in sidebar drawer */}
          {isMobile && logoRow(true)}
          {sidebarContent}
        </aside>

        {/* Right panel — no header here, sits directly below the full-width header */}
        <div className="kb-content-area" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Outer scroll container — card + footer both live here */}
          <div ref={scrollerRef} style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {/* Inner flex column: card fills height on short pages; footer appends below for articles */}
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", gap: 0 }}>
              {/* White card */}
              <div
                ref={cardRef}
                className="kb-card"
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid rgba(0,0,0,0.06)",
                  borderRadius: 16,
                  boxShadow: "0px 0px 1px 0px rgba(40,41,61,0.04), 0px 2px 4px 0px rgba(96,97,112,0.16)",
                  flex: ARTICLE_PAGES.has(activePage) ? "0 0 auto" : 1,
                }}
              >
                <PageToolsProvider value={{ pageId: activePage, pageTitle: getPageLabel(activePage), contentRef: cardRef }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePage}
                    // Opacity-only: a motion-managed `transform` (even translateY(0)) creates a
                    // containing block that breaks position:sticky in descendants (e.g. the
                    // EscalationMatrixPage region tabs).
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {activePage === "welcome" && (
                      <div style={{ padding: 24 }}>
                        <WelcomePage onNavigate={(p) => navigate(p)} />
                      </div>
                    )}
                    {activePage === "release-notes" && <ReleaseNotesPage />}
                    {activePage === "locations" && (
                      <div style={{ padding: 24 }}>
                        <LocationsPage />
                      </div>
                    )}
                    {activePage === "about-polarin" && <AboutPolarinPage onNavigate={navigate} />}
                    {activePage === "services-offered" && <ServicesOfferedPage onNavigate={navigate} />}
                    {activePage === "quick-setup" && <QuickSetupPage onNavigate={navigate} />}
                    {activePage === "choose-product" && <ChooseProductPage onNavigate={navigate} />}
                    {activePage === "create-account" && <CreateAccountPage onNavigate={navigate} />}
                    {activePage === "sign-in" && <SignInPage onNavigate={navigate} />}
                    {activePage === "complete-profile" && <CompleteProfilePage onNavigate={navigate} />}
                    {activePage === "profile-personal" && <PersonalInformationPage onNavigate={navigate} />}
                    {activePage === "profile-password" && <UpdatePasswordPage onNavigate={navigate} />}
                    {activePage === "profile-2fa" && <TwoFactorAuthPage onNavigate={navigate} />}
                    {activePage === "org-kyc" && <KYCDocumentsPage />}
                    {activePage === "org-settings" && <OrgSettingsPage onNavigate={navigate} />}
                    {activePage === "invite-members" && <InviteTeamPage onNavigate={navigate} />}
                    {activePage === "billing-overview" && <BillingOverviewPage onNavigate={navigate} />}
                    {activePage === "billing-profile" && <BillingProfilePage onNavigate={navigate} />}
                    {activePage === "billing-invoices" && <BillingInvoicesPage onNavigate={navigate} />}
                    {activePage === "port-overview" && <PortOverviewPage onNavigate={navigate} />}
                    {activePage === "port-create" && <CreatePortPage onNavigate={navigate} />}
                    {activePage === "port-status" && <PortStatusPage />}
                    {activePage === "port-lag" && <CreateLAGPage onNavigate={navigate} />}
                    {activePage === "vr-overview" && <VirtualRouterOverviewPage onNavigate={navigate} />}
                    {activePage === "vr-create" && <CreateVirtualRouterPage onNavigate={navigate} />}
                    {activePage === "vr-status" && <VirtualRouterStatusPage />}
                    {activePage === "vc-overview" && <VirtualConnectionOverviewPage onNavigate={navigate} />}
                    {activePage === "dci-overview" && <DCIOverviewPage onNavigate={navigate} />}
                    {activePage === "ix-overview" && <InternetExchangeOverviewPage onNavigate={navigate} />}
                    {activePage === "cloud-to-cloud-create" && <CreateCloudToCloudPage onNavigate={navigate} />}
                    {activePage === "dc-to-cloud-create" && <CreateDCToCloudPage onNavigate={navigate} />}
                    {activePage === "dci-create" && <DCICreatePage onNavigate={navigate} />}
                    {activePage === "dci-wave-create" && <CreateDCIWavePage onNavigate={navigate} />}
                    {activePage === "dci-layer2-create" && <CreateDCILayer2Page onNavigate={navigate} />}
                    {activePage === "ix-create" && <InternetExchangePage onNavigate={navigate} />}
                    {activePage === "service-detail" && <ServiceDetailPage onNavigate={navigate} />}
                    {activePage === "service-status" && <ServiceStatusPage onNavigate={navigate} />}
                    {activePage === "vista-overview" && <VistaOverviewPage onNavigate={navigate} />}
                    {activePage === "vista-port" && <VistaPortPage onNavigate={navigate} />}
                    {activePage === "vista-vc" && <VistaVirtualConnectionPage onNavigate={navigate} />}
                    {activePage === "vista-dci-wave" && <VistaDCIWavePage onNavigate={navigate} />}
                    {activePage === "dashboard-overview" && <DashboardOverviewPage onNavigate={navigate} />}
                    {activePage === "notifications" && <NotificationsPage onNavigate={navigate} />}
                    {activePage === "manage-alerts" && <ManageAlertsPage onNavigate={navigate} />}
                    {activePage === "activity-log-overview" && <ActivityLogOverviewPage onNavigate={navigate} />}
                    {activePage === "activity-log-details" && <ActivityLogPage onNavigate={navigate} />}
                    {activePage === "reports" && <ReportsPage onNavigate={navigate} />}
                    {activePage === "ticket-overview" && <SupportOverviewPage onNavigate={navigate} />}
                    {activePage === "create-ticket" && <CreateTicketPage onNavigate={navigate} />}
                    {activePage === "my-tickets" && <MyTicketsPage onNavigate={navigate} />}
                    {activePage === "contact-support" && (
                      <ContactSupportPage onNavigate={navigate} />
                    )}
                    {activePage === "escalation-matrix" && (
                      <EscalationMatrixPage onNavigate={navigate} />
                    )}
                    {activePage === "api-overview" && (
                      <ApiOverviewPage onNavigate={navigate} />
                    )}
                    {activePage === "api-onboarding" && (
                      <div style={{ padding: 24 }}>
                        <ApiOnboardingPage onNavigate={navigate} />
                      </div>
                    )}
                    {!ARTICLE_PAGES.has(activePage) &&
                     activePage !== "welcome" && activePage !== "release-notes" &&
                     activePage !== "locations" && activePage !== "contact-support" &&
                     activePage !== "api-overview" && activePage !== "api-onboarding" && (
                      <div style={{ padding: 24 }}>
                        <ComingSoonPage pageTitle={getPageLabel(activePage)} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                </PageToolsProvider>
              </div>

              {/* Article footer — outside the white card, rendered below it */}
              {ARTICLE_PAGES.has(activePage) && ARTICLE_META[activePage] && (
                <ArticleFooter
                  {...ARTICLE_META[activePage]}
                  onNavigate={(p) => navigate(p)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Portal CTA ──────────────────────────────────────────────────────────────

function PortalCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://polarin.lightstorm.net/app/login?next=/app/home"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px",
        borderRadius: 8,
        border: `1px solid ${hovered ? "#1c808d" : "#c8d4e0"}`,
        background: hovered
          ? "linear-gradient(135deg, #0a3954 0%, #1c808d 100%)"
          : "transparent",
        color: hovered ? "#fff" : "#4b6b8a",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: FONT,
        textDecoration: "none",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        transition: "border-color 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered ? "0 2px 8px rgba(28,128,141,0.22)" : "none",
        cursor: "pointer",
      }}
    >
      Polarin Portal
      <ExternalLink size={13} style={{ opacity: hovered ? 1 : 0.55, transition: "opacity 0.18s ease" }} />
    </a>
  );
}

// ── API Documentation pages ──────────────────────────────────────────────────

const C = { teal: "#1c808d", navy: "#0a3954", bg: "#f8fafc", border: "#e2e8f1", muted: "#64748b" };
const FONT_J = "'Plus Jakarta Sans', 'Lato', -apple-system, sans-serif";

const API_OVERVIEW_TOC = [
  { id: "overview",     label: "Overview" },
  { id: "how-it-works", label: "How It Works", level: 2 as const },
  { id: "next-steps",   label: "Next Steps" },
];

// Deliberately a plain ArticlePage, not a hero/card-grid landing page like WelcomePage —
// it's a developer reference page, not a second homepage.
export function ApiOverviewPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <ArticlePage toc={API_OVERVIEW_TOC}>
      <H1 id="overview">Polarin API</H1>
      <ArticleMeta>
        <ReadTime minutes={3} />
        <Dot />
        <Tag label="Developers" color="#0f766e" />
      </ArticleMeta>

      <P>
        Automate your network infrastructure through simple REST calls — no portal required. Provision
        services, monitor real-time performance, and integrate Polarin into your own automation workflows
        over standard HTTP.
      </P>

      <Callout variant="tip">
        Available to active Polarin customers only. See{" "}
        <PageLink label="Getting Access" onClick={() => onNavigate("api-onboarding")} /> for the full
        sign-up-to-first-call journey.
      </Callout>

      <H2 id="how-it-works">How It Works</H2>
      <Steps>
        <Step num={1} title="Get Access">
          Register, complete KYC, and receive your API credentials. See{" "}
          <PageLink label="Getting Access" onClick={() => onNavigate("api-onboarding")} />.
        </Step>
        <Step num={2} title="Authenticate">
          Exchange your credentials for a short-lived JWT token, then pass it as the{" "}
          <code>access-token</code> header on every call.
        </Step>
        <Step num={3} title="Call the APIs">
          Use standard REST calls to provision ports, manage routers, monitor VISTA metrics, and more.
        </Step>
      </Steps>

      <Callout variant="info">
        For the full reference with live request testing, open the{" "}
        <a href="/developer" target="_blank" rel="noopener noreferrer" style={{ color: "#0f766e", fontWeight: 700 }}>
          Developer Portal
        </a>
        . It runs against a staging environment, so you can try real requests without touching live
        services or billing.
      </Callout>

      <H2 id="next-steps">Next Steps</H2>
      <UL>
        <LI>Walk through the full onboarding journey: <PageLink label="Getting Access" onClick={() => onNavigate("api-onboarding")} />.</LI>
        <LI>Not sure which product to call first? <PageLink label="Choosing the Right Product" onClick={() => onNavigate("choose-product")} />.</LI>
      </UL>
    </ArticlePage>
  );
}

export function ApiOnboardingPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const apiTools = usePageTools();
  return (
    <div style={{ padding: "32px 40px 52px" }}>
      <div style={{ display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 24, marginBottom: 8 }}>
        <h1 style={{ fontFamily: FONT_J, fontSize: 26, fontWeight: 900, color: C.navy, margin: 0, letterSpacing: "-0.4px" }}>Getting Access</h1>
        {apiTools && <CopyPageMenu contentRef={apiTools.contentRef} pageTitle={apiTools.pageTitle} pageId={apiTools.pageId} />}
      </div>
      <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 560 }}>
        The Polarin API is available to all active Polarin customers. Here's the full journey — from sign-up to your first API call.
      </p>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, marginBottom: 36 }}>
        {[
          { n: 1, title: "Register on Polarin", desc: "Sign up at the Polarin portal with your company name, primary contact, and required services. Takes about 5 minutes." },
          { n: 2, title: "Complete KYC", desc: "Upload business registration, director ID, and proof of address. Reviewed within 1–2 business days." },
          { n: 3, title: "Account Activated", desc: "Once KYC is approved, your account goes live with all ordered services accessible in the portal." },
          { n: 4, title: "Receive Activation Email", desc: "You'll get your portal login credentials and initial staging API key directly to your registered email." },
          { n: 5, title: "Start with Staging", desc: "Test with your staging credentials — no real services, no billing. Contact your account manager for production access.", highlight: "First API call in under 30 minutes from activation." },
        ].map((step, i, arr) => (
          <div key={step.n} style={{ display: "flex", gap: 0 }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginRight: 20, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.teal}15`, border: `2px solid ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 900, color: C.teal }}>{step.n}</span>
              </div>
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${C.teal}20`, minHeight: 24, margin: "5px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < arr.length - 1 ? 24 : 0, paddingTop: 6 }}>
              <div style={{ fontFamily: FONT_J, fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 5 }}>{step.title}</div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
              {step.highlight && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 12px" }}>
                  <span style={{ fontFamily: FONT_J, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>✓ {step.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: FONT, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
        For the full API reference, visit the{" "}
        <a
          href="/developer"
          style={{ color: "#1367D6", fontSize: 13, textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
        >Developer Portal</a>.
      </p>
    </div>
  );
}

// ── Nav button ──────────────────────────────────────────────────────────────

interface NavButtonProps {
  icon: React.ReactNode | null;
  label: string;
  isActive: boolean;
  isParentActive: boolean;
  badge?: string;
  external?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  indent?: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, isParentActive, badge, external, hasChildren, isOpen, indent, onClick }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);
  const textColor = isActive || isParentActive || hovered ? "#1c808d" : "#0a3954";

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={prefersReducedMotion ? {} : { scale: 0.975 }}
      transition={{ duration: 0.12 }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingLeft: indent ? 48 : 24,
        paddingRight: 16,
        paddingTop: indent ? 10 : 12,
        paddingBottom: indent ? 10 : 12,
        fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: textColor,
        background: isActive ? "#FFFFFF" : hovered && !isActive ? "rgba(28,128,141,0.04)" : "transparent",
        border: "none",
        borderRadius: isActive ? "0 16px 16px 0" : "0 8px 8px 0",
        boxShadow: isActive
          ? "0px 1px 1px rgba(0,0,0,0.03), 0px 1px 3px rgba(0,0,0,0.02), 0px 2px 2px rgba(0,0,0,0.02)"
          : "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FONT,
        lineHeight: "20px",
        marginRight: 8,
        transition: "color 0.12s, background 0.12s",
      }}
    >
      {icon && <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>}
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 16, background: "#dcfce7", border: "1px solid #b9f8cf", color: "#008236", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontFamily: FONT }}>
          <Sparkles size={10} />
          {badge}
        </span>
      )}
      {external && <ExternalLink size={14} color="#7e93b2" style={{ flexShrink: 0 }} />}
      {hasChildren && (
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ flexShrink: 0, display: "flex" }}
        >
          <ChevronDown size={18} color="#7e93b2" />
        </motion.span>
      )}
    </motion.button>
  );
}

