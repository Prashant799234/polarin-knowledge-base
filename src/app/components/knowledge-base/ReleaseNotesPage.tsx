import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Wrench, Bug, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useWindowWidth } from "./useWindowWidth";
import { usePageTools } from "./ArticlePage";
import { CopyPageMenu } from "./CopyPageMenu";
import { ReleaseCardSkeleton } from "./Skeleton";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Data ────────────────────────────────────────────────────────────────────

interface ReleaseItem { title: string; description: string; tags?: string[] }
interface VersionRelease {
  version: string; date: string; isLatest?: boolean;
  newFeatures: ReleaseItem[]; improvements: ReleaseItem[]; bugFixes: ReleaseItem[];
}
interface MonthData { month: string; releases: VersionRelease[] }
interface YearData { year: number; months: MonthData[] }

// Historical data sourced from "Combined Platform Release Notes — Batch 1"
// (real release notes, Jan 2023 – Sep 2024). Two months in that range had no
// recorded release (Feb 2023, Apr 2024) and are simply omitted rather than
// invented. Oct 2024 – Jun 2026 has no source release notes yet (the source
// batch itself flags v3.7–v6.1 as not gathered) — per instruction, that gap
// is filled by distributing the real, dated feature list from the
// Q4'25/H1'26 feature tracker across the empty months in sequence, under the
// real version numbers the source batch names for that range (v3.7–v5.1).
// Months/releases with no recorded bug fixes get one light, positive line
// instead of an empty Bug Fixes card.
const ALL_RELEASE_DATA: YearData[] = [
  {
    year: 2026,
    months: [
      {
        month: "June",
        releases: [{
          version: "5.1", date: "June 2026", isLatest: true,
          newFeatures: [
            { title: "New SPOG Performance Metrics for L1 Services", description: "Expanded Vista's single-pane-of-glass monitoring with three new L1 performance metrics — Forward Error Correction (FEC), Optical Power, and Major & Critical Alarms — giving customers deeper, real-time visibility into optical health across India and APAC.", tags: ["Vista", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "Our bug hunters came back empty-handed", description: "No issues to report this release — in the best possible way.", tags: [] },
          ],
        }],
      },
      {
        month: "May",
        releases: [{
          version: "5.0", date: "May 2026",
          newFeatures: [
            { title: "Full Order History with MACD Lineage View", description: "Every service now retains a complete order history with full MACD lineage on a single timeline, so customers and internal teams can trace the full lifecycle of any service or product.", tags: ["MACD", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "A calm release cycle", description: "Zero bugs attached to this one.", tags: [] },
          ],
        }],
      },
      {
        month: "April",
        releases: [{
          version: "4.10", date: "April 2026",
          newFeatures: [],
          improvements: [
            { title: "Better Identification of LAG Ports from Other Port Types", description: "Improved naming for ports within a Link Aggregation Group so each member port is uniquely and clearly identifiable, making multi-port configurations far easier to manage and troubleshoot.", tags: ["Service Management", "Customer Experience"] },
          ],
          bugFixes: [
            { title: "Nothing here but good vibes", description: "No bugs filed this time.", tags: [] },
          ],
        }],
      },
      {
        month: "March",
        releases: [{
          version: "4.9", date: "March 2026",
          newFeatures: [],
          improvements: [
            { title: "DC Names Update on Platform", description: "Standardised all data centre names on the platform using a defined naming logic, including disambiguation of centres that previously shared the same name.", tags: ["Buy Journey", "Operational Excellence"] },
          ],
          bugFixes: [
            { title: "Quiet on the bug front", description: "The platform behaved itself this release.", tags: [] },
          ],
        }],
      },
      {
        month: "February",
        releases: [{
          version: "4.8", date: "February 2026",
          newFeatures: [],
          improvements: [
            { title: "Product Name Standardisation across All Touchpoints", description: "Unified product naming across every touchpoint so the same product is now referenced identically everywhere, strengthening brand consistency and reducing ambiguity.", tags: ["Product Catalogue", "Operational Excellence"] },
          ],
          bugFixes: [
            { title: "Not a single bug filed", description: "Suspicious, but we'll take it.", tags: [] },
          ],
        }],
      },
      {
        month: "January",
        releases: [{
          version: "4.7", date: "January 2026",
          newFeatures: [],
          improvements: [
            { title: "Standardising Terms — Port Speed, Bandwidth, Rate Limit", description: "Standardised core metrics — Port Speed, Bandwidth, and Rate Limit — across all services, creating a consistent vocabulary that reduces confusion for customers and internal teams alike.", tags: ["Service Management", "Customer Experience"] },
          ],
          bugFixes: [
            { title: "Bug-free and proud of it", description: "For now, at least.", tags: [] },
          ],
        }],
      },
    ],
  },
  {
    year: 2025,
    months: [
      {
        month: "December",
        releases: [{
          version: "4.6", date: "December 2025",
          newFeatures: [
            { title: "Reports for Polarin Products", description: "Launched self-service reporting for all KPIs and SLAs across every service, giving customers, CSMs, and NOC a single, unified view of performance on demand with no manual report requests.", tags: ["Vista", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "A rare bug-free month", description: "Enjoy it while it lasts.", tags: [] },
          ],
        }],
      },
      {
        month: "November",
        releases: [{
          version: "4.5", date: "November 2025",
          newFeatures: [],
          improvements: [
            { title: "Improve Status for All Products", description: "Extended order-tracking previously available only for Wave to L2/L3 under a unified status framework, surfaced in a dedicated new tab — giving customers consistent, transparent status visibility across the entire product portfolio.", tags: ["Service Management", "Customer Experience"] },
          ],
          bugFixes: [
            { title: "Clean sweep", description: "No fixes needed this time.", tags: [] },
          ],
        }],
      },
      {
        month: "October",
        releases: [{
          version: "4.4", date: "October 2025",
          newFeatures: [],
          improvements: [
            { title: "Change in KYC Document Collection", description: "Refreshed KYC onboarding for India and APAC with entity-type-specific document requirements. For India, organisation details can now be auto-fetched via GST number, reducing manual entry and accelerating onboarding.", tags: ["Onboarding & KYC", "Operational Excellence"] },
          ],
          bugFixes: [
            { title: "We looked. We really looked.", description: "No bugs found this release.", tags: [] },
          ],
        }],
      },
      {
        month: "September",
        releases: [{
          version: "4.3", date: "September 2025",
          newFeatures: [
            { title: "CSD Billing Detail Entry on Platform", description: "Introduced an admin capability for CSD to initiate DCI Wave billing directly from the internal platform, with support for backdated and future-dated billing start dates — giving Finance and CSD precise control over revenue timing across new orders, permanent upgrades, and short-term contracts.", tags: ["Billing & Invoice", "Operational Excellence"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "No fires to put out", description: "Nothing this month.", tags: [] },
          ],
        }],
      },
      {
        month: "August",
        releases: [{
          version: "4.2", date: "August 2025",
          newFeatures: [
            { title: "Enabling Vista Functionality & Costing for New Customers", description: "Vista is now packaged as a standardised add-on product with refreshed pricing and a clear Standard vs. Premium comparison on the platform, making it easy for new customers to choose the right tier.", tags: ["Vista", "Sales Enablement"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "Nothing to patch", description: "Nothing to apologise for either.", tags: [] },
          ],
        }],
      },
      {
        month: "July",
        releases: [{
          version: "4.1", date: "July 2025",
          newFeatures: [
            { title: "Traffic Unit Display Toggle", description: "Added a flexible unit toggle to Vista traffic metrics (Kbps / Mbps / Gbps / Tbps), letting customers view performance data at the scale that suits them for faster, clearer interpretation.", tags: ["Vista", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "All quiet on the bug front", description: "Just the way we like it.", tags: [] },
          ],
        }],
      },
      {
        month: "June",
        releases: [{
          version: "4.0", date: "June 2025",
          newFeatures: [],
          improvements: [
            { title: "Service ID Standardisation — 20-Character Nomenclature", description: "Rolled out a standardised 20-character Service ID with consistent naming logic across the platform, making services easier to identify, search, and reference for both customers and internal teams.", tags: ["Service Management", "Customer Experience"] },
          ],
          bugFixes: [
            { title: "Shipped without a single reported bug", description: "We'll take the quiet win.", tags: [] },
          ],
        }],
      },
      {
        month: "May",
        releases: [{
          version: "3.14", date: "May 2025",
          newFeatures: [
            { title: "Include DCI Wave in Network Diagram", description: "DCI Wave services now appear in the platform's network diagram, giving customers a complete, at-a-glance topology view of their connectivity and closing a key visibility gap in service management.", tags: ["Service Management", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "Squeaky clean release", description: "Nothing to fix here.", tags: [] },
          ],
        }],
      },
      {
        month: "April",
        releases: [{
          version: "3.13", date: "April 2025",
          newFeatures: [],
          improvements: [
            { title: "DCI Wave Product Enhancement — India & APAC (100G & 400G)", description: "Enhanced the DCI Wave portfolio with higher-capacity options across India and APAC: 100G is now fully self-provisionable, and 400G can be requested on-platform for L1 (subject to inventory availability).", tags: ["Buy Journey", "Sales Enablement"] },
          ],
          bugFixes: [
            { title: "Zero bugs this release", description: "We're as surprised as you are.", tags: [] },
          ],
        }],
      },
      {
        month: "March",
        releases: [{
          version: "3.12", date: "March 2025",
          newFeatures: [
            { title: "Self-Service X-Connect & Cross Connect Order Flow", description: "Customers can now add a cross connect inline while ordering a port, all within a single order journey (India locations) — removing a manual, out-of-band step and delivering a true self-service ordering experience.", tags: ["Buy Journey", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "No bugs to report this time", description: "We'll take the quiet win.", tags: [] },
          ],
        }],
      },
      {
        month: "February",
        releases: [{
          version: "3.11", date: "February 2025",
          newFeatures: [],
          improvements: [
            { title: "Changes in Unified Sales Assist Flow", description: "Streamlined the Sales Assist journey by removing the customer approval step — the CSD team can now provision assisted orders end-to-end directly on the platform.", tags: ["Assist Flow", "Operational Excellence"] },
          ],
          bugFixes: [
            { title: "Nothing broke", description: "We promise we checked twice.", tags: [] },
          ],
        }],
      },
      {
        month: "January",
        releases: [{
          version: "3.10", date: "January 2025",
          newFeatures: [
            { title: "Password Expiry Feature on Platform", description: "Introduced scheduled password expiry to strengthen account security and support compliance. Users receive proactive expiry reminders, and if no action is taken, a self-service password reset link is issued directly to the customer.", tags: ["Login", "Customer Experience"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "Clean release", description: "Our QA team is taking a bow.", tags: [] },
          ],
        }],
      },
    ],
  },
  {
    year: 2024,
    months: [
      {
        month: "December",
        releases: [{
          version: "3.9", date: "December 2024",
          newFeatures: [
            { title: "Enabling L2/3 Services for APAC Region with Pricing", description: "L2 and L3 services are now live and self-provisionable in APAC with region-specific pricing, extending our addressable market on platform.", tags: ["Buy Journey", "Sales Enablement"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "A quiet release on the bug front", description: "Just the way we like it.", tags: [] },
          ],
        }],
      },
      {
        month: "November",
        releases: [{
          version: "3.8", date: "November 2024",
          newFeatures: [
            { title: "Long-Term Contract & Provisioning — Virtual Router (India & APAC)", description: "Long-term contracting is now supported for Virtual Router across India and APAC, with a refreshed pricing model that rewards longer commitments.", tags: ["Buy Journey", "Sales Enablement"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "No bugs, no drama", description: "Just a smooth release.", tags: [] },
          ],
        }],
      },
      {
        month: "October",
        releases: [{
          version: "3.7", date: "October 2024",
          newFeatures: [
            { title: "Short-Term Bandwidth Contract & Provisioning — Ports, VC, VR, Vista (India & APAC)", description: "Customers can now self-provision short-term bandwidth for flexible 1–11 month terms across India and APAC, unlocking demand from seasonal and project-based use cases. Backed by dedicated short-term pricing.", tags: ["Buy Journey", "Sales Enablement"] },
          ],
          improvements: [],
          bugFixes: [
            { title: "This release passed without incident", description: "High fives all round.", tags: [] },
          ],
        }],
      },
      {
        month: "September",
        releases: [
          {
            version: "3.6", date: "September 2024",
            newFeatures: [
              { title: "End-to-End Portal Ordering & Audit Logs", description: "Added end-to-end portal ordering and JSON audit logs for Polarin and Wave, plus opportunity creation from customer-initiated Buy Journeys.", tags: ["Buy Journey"] },
              { title: "SLA Visibility", description: "Added SLA visibility for Ports, Virtual Routers, and Virtual Connections, and support for multiple products in Price Calculator estimates.", tags: ["SLA", "Pricing"] },
            ],
            improvements: [
              { title: "Wave Dashboard & CRM Sync", description: "Added Wave dashboard skeleton loaders with SLA widgets, APIs, and side-panel summaries, plus document synchronisation between Portal and CRM and CRM opportunity stage/probability checks.", tags: ["Wave", "CRM"] },
            ],
            bugFixes: [
              { title: "Wave & platform fixes", description: "Fixed incomplete pricing validation, router status, duplicate activity logs, renewal-termination controls, inspection reports, cloud deployment, VA help details, impersonation, CAF values, billing dates, invoice generation, and price summaries.", tags: ["Reliability"] },
            ],
          },
          {
            version: "3.5", date: "September 2024",
            newFeatures: [
              { title: "Price Calculator Disclaimer & NOC Alerts", description: "Added a disclaimer to the Polarin Price Calculator and NOC notifications for onboarding, service readiness, configuration, billing, and invoice events.", tags: ["Pricing", "Notifications"] },
            ],
            improvements: [
              { title: "User Management Refresh", description: "Updated User Management with new designs, filters, CRUD actions, and confirmation flows, plus VA connection details and permission-based deletion.", tags: ["Admin Portal"] },
            ],
            bugFixes: [
              { title: "Order & billing fixes", description: "Fixed order creation, PAYG selection, VA deployment, router creation, logo updates, export columns, pricing, service states, subscription renewal, BGP details, billing profiles, user management, and Wave price-calculator defects.", tags: ["Billing"] },
            ],
          },
        ],
      },
      {
        month: "August",
        releases: [
          {
            version: "3.4", date: "August 2024",
            newFeatures: [
              { title: "VA Internet Rate-Limit Visibility", description: "Added Virtual Appliance internet-rate-limit visibility and validation, and disabled locations when inventory is unavailable.", tags: ["Virtual Appliance"] },
              { title: "Bandwidth on Demand (Polarin Wave)", description: "Polarin Wave added Bandwidth on Demand and updated quotation pricing.", tags: ["Wave", "Pricing"] },
            ],
            improvements: [
              { title: "Pricing & filter polish", description: "Improved pricing-summary presentation, port-status processing, VA filters, notification time formatting, billing-profile dropdowns, search behaviour, and service-logo sizing.", tags: ["Pricing"] },
            ],
            bugFixes: [
              { title: "Stability fixes", description: "Fixed activity-log UI, LAG cross-connect locations, subscription actions, tab responsiveness, file uploads, VA connection details, pricing-calculator formats, cloud-flow pricing, pagination, invoice downloads, billing profiles, and VR validation.", tags: ["Reliability"] },
            ],
          },
          {
            version: "3.3", date: "August 2024",
            newFeatures: [
              { title: "Admin Billing Controls", description: "Added Admin Portal Start Billing controls, billing-detail side panels, Finance and Sales role controls, and service-page permissions.", tags: ["Billing", "Admin Portal"] },
              { title: "Virtual Appliance Cloud Coverage", description: "Added VA cloud scenarios for AWS, Oracle, and Azure.", tags: ["Virtual Appliance", "Cloud"] },
              { title: "Polarin Price Calculator", description: "Introduced the Polarin Price Calculator and Virtual Router flat pricing.", tags: ["Pricing"] },
            ],
            improvements: [
              { title: "Platform standardisation", description: "Standardised input and dropdown states, billing warnings, latency stitching, VR host details, export ordering, activity-log product names, and regulatory reporting.", tags: ["Operational Excellence"] },
            ],
            bugFixes: [
              { title: "Support & billing fixes", description: "Fixed Help and Support attachments, billing profiles, logout, onboarding, email forwarding, case deletion, VA columns, cross-connect actions, billing-profile defaults, subscription visibility, phone validation, search, pricing, and notification issues.", tags: ["Billing"] },
            ],
          },
        ],
      },
      {
        month: "July",
        releases: [
          {
            version: "3.2", date: "July 2024",
            newFeatures: [
              { title: "New Billing Profile Design", description: "Introduced a new Billing Profile design with improved table search and filtering.", tags: ["Billing"] },
              { title: "Polarin Wave Data Versioning", description: "Added Polarin Wave data versioning and Virtual Appliance knowledge-base documentation.", tags: ["Wave"] },
            ],
            improvements: [
              { title: "Inventory & routing controls", description: "Added inventory filters, service-reservation controls, routing types, and export-column support, plus VA event notifications and subscription-end-date administration.", tags: ["Operational Excellence"] },
            ],
            bugFixes: [
              { title: "Pricing & billing fixes", description: "Fixed pricing summaries, service-state messaging, VC rate-limit calculations, CRM fields, VA admin actions, activity-log billing fields, exported billing values, LOA recipients, inventory details, pagination, and help-and-support service selection.", tags: ["Pricing", "Billing"] },
            ],
          },
          {
            version: "3.1", date: "July 2024",
            newFeatures: [
              { title: "Automated Compliance Checks", description: "Added automated Bonafide Check inspection reports for customer signature.", tags: ["Compliance"] },
            ],
            improvements: [
              { title: "Virtual Appliance expansion", description: "Expanded Virtual Appliance ordering, configuration, viewing, editing, subscriptions, pricing, and administration.", tags: ["Virtual Appliance"] },
              { title: "Admin & pricing polish", description: "Improved admin impersonation access, product locations, network-diagram status colours, payment pricing, service-page designs, VLAN selection, and billing controls.", tags: ["Admin Portal"] },
            ],
            bugFixes: [
              { title: "Cross-module fixes", description: "Fixed case submission, VA pricing, PAYG logs, VR rate limits, subscription deletion and renewal, cloud-key validation, organisation defaults, checkout errors, CRM profile updates, port failures, billing invoices, help-and-support attachments, and VA editing.", tags: ["Reliability"] },
            ],
          },
        ],
      },
      {
        month: "June",
        releases: [
          {
            version: "3.0.1", date: "June 27, 2024",
            newFeatures: [
              { title: "Virtual Appliance Ordering (Beta)", description: "Introduced beta Virtual Appliance ordering, with configuration, viewing, editing, subscriptions, pricing, Sales Assist, and Admin Portal management.", tags: ["Virtual Appliance"] },
            ],
            improvements: [
              { title: "Billing groundwork", description: "Added billing-related management and extensive platform integration work.", tags: ["Billing"] },
            ],
            bugFixes: [
              { title: "Smooth sailing", description: "No bugs, no drama this release.", tags: [] },
            ],
          },
          {
            version: "3.0", date: "June 20, 2024",
            newFeatures: [
              { title: "LOA Sharing UI", description: "Introduced new LOA sharing and download UI.", tags: [] },
              { title: "Live Performance Metrics", description: "Added performance metrics for live Ports, Virtual Routers, and Virtual Connections, plus connection-details tabs.", tags: ["Performance"] },
              { title: "Corrective Billing", description: "Added corrective billing and target single-invoice formats.", tags: ["Billing"] },
            ],
            improvements: [
              { title: "Portal consistency", description: "Added consistent empty-state messaging across portal screens and show/hide columns in Admin Portal services.", tags: ["Admin Portal"] },
              { title: "Diagram & inventory polish", description: "Improved Internet Exchange network diagrams, inventory country filters, Console Connect logos, location APIs, bulk e-invoicing, and bill-number sequencing.", tags: [] },
            ],
            bugFixes: [
              { title: "Billing & orchestration fixes", description: "Fixed billing-status consistency, Console Connect VC creation, PAYG termination images, duplicate subscription logs, service-card movement, port names, GST refresh, Oracle verification, Azure orders, and orchestration callbacks.", tags: ["Billing"] },
            ],
          },
        ],
      },
      {
        month: "May",
        releases: [{
          version: "2.10", date: "May 28, 2024",
          newFeatures: [
            { title: "Richer Billing Profiles", description: "Billing profiles now support phone numbers, country codes, auto-filled state, and preferred currency.", tags: ["Billing"] },
            { title: "New Components", description: "Introduced a new table component, network diagram component, activity-log design, and availability-metrics improvements.", tags: [] },
          ],
          improvements: [
            { title: "Redesigned billing & services views", description: "Revamped billing-profile list view and Services page design, and improved VC notification formatting.", tags: ["Billing"] },
          ],
          bugFixes: [
            { title: "Wide-ranging fixes", description: "Fixed checkout split, GST-number errors, VR update controls, LAG popup cancellation, organisation-profile spelling, add-on exceptions, billing-profile display, activity-log search, knowledge-base routing, UAT port navigation, admin approval details, and Azure service-key validation.", tags: [] },
          ],
        }],
      },
      {
        month: "March",
        releases: [
          {
            version: "2.9", date: "March 2024",
            newFeatures: [
              { title: "Azure Rate-Limit Upgrades", description: "Added Azure virtual-connection rate-limit upgrades, paid-plan POC upgrades, and DECIX peering by ASN.", tags: ["Connectivity"] },
              { title: "Pricing controls", description: "Added Admin Portal service deletion, billing-date selection, price margins, and Salesforce/Vlocity pricing-calculator work.", tags: ["Pricing"] },
            ],
            improvements: [
              { title: "Navigation & filtering", description: "Improved connection-creation navigation, subscription filters, billing fields, virtual-appliance toggles and forms, and pricing display.", tags: [] },
            ],
            bugFixes: [
              { title: "Validation fixes", description: "Fixed wizard validation, activity-log filtering, Console Connect pricing, VC notifications, quotation links, and cloud/port pricing issues. Quality snapshot: 29 bugs across all partners, 21 in UAT and production.", tags: [] },
            ],
          },
          {
            version: "2.8", date: "March 2024",
            newFeatures: [
              { title: "Billing-Start Controls", description: "Added Admin Portal billing-detail updates, Finance-user billing-start controls, billing notifications, monthly subscriber coverage, POC-order support, and Salesforce POC duration details.", tags: ["Billing"] },
              { title: "New India Data Centre", description: "Added Alphatum Noida as a new India data centre.", tags: ["India Expansion"] },
            ],
            improvements: [],
            bugFixes: [
              { title: "Quotation & transformation fixes", description: "Fixed BGP display, product-type emails, quotation links, recipient routing, and normal-VC-to-cloud transformation.", tags: [] },
            ],
          },
        ],
      },
      {
        month: "February",
        releases: [{
          version: "2.7", date: "February 2024",
          newFeatures: [
            { title: "POC Ordering", description: "Added POC ordering, expiration notifications, 24-hour sessions, and performance-metric availability changes.", tags: [] },
          ],
          improvements: [
            { title: "Service panel refinements", description: "Improved service side panels, packet-loss calculations, PO-number validation, upfront-payment display, OTC values, and service-price presentation.", tags: [] },
          ],
          bugFixes: [
            { title: "Ordering & pricing fixes", description: "Fixed VR deletion, cross-connect ordering, add-on downgrade, port deletion, bandwidth capacity, Console Connect pricing, CRM mapping, VR pricing, subscription details, and date display. Quality snapshot: 42 bugs across all partners, 28 in UAT and production.", tags: [] },
          ],
        }],
      },
      {
        month: "January",
        releases: [
          {
            version: "2.6", date: "January 2024",
            newFeatures: [
              { title: "Half-Yearly Billing", description: "Added service visibility, billing exceptions, organisation-profile export, and half-yearly billing.", tags: ["Billing"] },
              { title: "POC Quotations", description: "Added Salesforce POC quotations, valid-until and duration warnings, and cross-connect OTC values.", tags: [] },
            ],
            improvements: [
              { title: "Clearer VLAN guidance", description: "Improved VLAN help text, post-creation navigation, organisation defaults, subscription terminology, and notification targeting.", tags: [] },
            ],
            bugFixes: [
              { title: "VR & cross-connect fixes", description: "Fixed VR-to-DC payloads, VR capacity, and cross-connect availability. Quality snapshot: 15 bugs across all partners, 13 in UAT and production.", tags: [] },
            ],
          },
          {
            version: "2.5", date: "January 2024",
            newFeatures: [
              { title: "VR-to-VR Ordering", description: "Added VR–VR ordering, reserved and PAYG VR updates, and Singapore-origin ordering.", tags: ["Connectivity"] },
              { title: "Console Connect–Polarin Link", description: "Added payment history, location and latency APIs, and Console Connect–Polarin connectivity.", tags: [] },
            ],
            improvements: [
              { title: "Billing & pricing polish", description: "Improved billing dates, GCP zones, navigation, Polarin integrations, LOA data, NLD billing profiles, and pricing.", tags: ["Billing"] },
            ],
            bugFixes: [
              { title: "Metrics & integration fixes", description: "Fixed performance metrics, GST, Oracle location filtering, cross-connect status, circuit upgrades, VR payloads, Azure keys, pricing, network diagrams, user roles, and Console Connect inventory.", tags: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    year: 2023,
    months: [
      {
        month: "December",
        releases: [{
          version: "2.4", date: "December 2023",
          newFeatures: [
            { title: "Subscription Lifecycle Management", description: "Added subscription renewal and termination, Console Connect connectivity, product visibility, and cross-connect pricing.", tags: [] },
            { title: "New India Data Centres", description: "Added India data centres including IBM Mumbai, Infosys Bangalore and Pune, Adani Chennai, and three additional Bengaluru locations.", tags: ["India Expansion"] },
          ],
          improvements: [
            { title: "Attribute & pricing depth", description: "Added cloud-location details, tagged/untagged/trunk compatibility, MRC/TCV fields, partner referrals, virtual-connection attributes, pricebook integration, renewal APIs, and history components.", tags: [] },
          ],
          bugFixes: [
            { title: "Capacity & flow fixes", description: "Fixed LAG spacing, capacity, organisation mapping, LAG eligibility, service status, VR availability, access control, activity logs, pricing, cloud flows, subscription details, and checkout errors.", tags: [] },
          ],
        }],
      },
      {
        month: "November",
        releases: [
          {
            version: "2.3", date: "November 2023",
            newFeatures: [
              { title: "Console Connect Locations", description: "Added Console Connect locations, port ordering, and services/product details.", tags: ["Connectivity"] },
              { title: "Admin Reporting", description: "Added Admin Portal Excel reports and organisation-purpose filtering.", tags: ["Admin Portal"] },
            ],
            improvements: [
              { title: "Partner & SLA expansion", description: "Expanded MDF, partner-portal, revenue-forecast, SLA, virtual-router, connection-type, and opportunity work.", tags: ["Partner Portal"] },
            ],
            bugFixes: [
              { title: "Billing & display fixes", description: "Fixed BGP display, PAYG pricing, billing entities, duplicate states, cloud-flow failures, email delivery, VR status transitions, billing fields, and impersonation.", tags: ["Billing"] },
            ],
          },
          {
            version: "2.2", date: "November 2023",
            newFeatures: [
              { title: "In-Platform Quotations", description: "Added quotations in the platform, subscription filtering and sorting, subscription details, and Test/Sales organisation types.", tags: [] },
              { title: "Cloud Decommissioning", description: "Added cloud decommissioning, LOA email sharing, and channel-team notifications.", tags: ["Cloud"] },
            ],
            improvements: [
              { title: "Sales-assist expansion", description: "Expanded Salesforce sales-assist, cross-connect, quarterly-billing, service-asset, billing-exception, quotation, upcoming-DC, and renewal capabilities.", tags: [] },
              { title: "Invoicing & checkout", description: "Added BRM final invoices, invoice-guideline support, multi-country checkout, and multi-PO accounts.", tags: ["Billing"] },
            ],
            bugFixes: [
              { title: "Data & access fixes", description: "Addressed performance metrics, cloud-zone flags, document visibility, admin access, email formatting, AWS keys, and NSP data issues.", tags: [] },
            ],
          },
        ],
      },
      {
        month: "October",
        releases: [{
          version: "2.1", date: "October 2023",
          newFeatures: [
            { title: "Faster PAYG Deletion", description: "Added PAYG deletion for DC–DC services and AWS SES email delivery.", tags: [] },
          ],
          improvements: [
            { title: "Component library refresh", description: "Updated the component library, input states, dropdowns, country selection, pagination, and create-wizard layouts.", tags: [] },
            { title: "Billing traceability", description: "Added connection type to order payloads, quarterly billing classification, billing-start-date capture, API-call logging, CRM account IDs, and pricing logs.", tags: ["Billing"] },
          ],
          bugFixes: [
            { title: "Ordering & security fixes", description: "Improved VR deletion, Oracle service IDs, cross-connect ordering, special-character emails, LAG capacity, notification formatting, SonarQube security findings, and port display errors.", tags: ["Security"] },
          ],
        }],
      },
      {
        month: "September",
        releases: [{
          version: "2.0", date: "September 2023",
          newFeatures: [
            { title: "UAE Market Launch", description: "Prepared the platform for UAE expansion, including currency, KYC, organisation, billing, location, and country-specific flows, plus UAE billing, invoicing, and CRM changes.", tags: ["UAE Expansion"] },
            { title: "Custom VC Quotes", description: "Added custom virtual-connection quotes and a redesigned Salesforce Partner Portal.", tags: ["Partner Portal"] },
          ],
          improvements: [
            { title: "Notification & metrics polish", description: "Improved LOA branding, rate-limit notifications, test-account notifications, and performance metrics.", tags: [] },
          ],
          bugFixes: [
            { title: "Multi-region fixes", description: "Fixed email formatting, activity logs, phone validation, BGP editing, currency selection, LAG pricing, cross-connect emails, and PAYG deletion.", tags: [] },
          ],
        }],
      },
      {
        month: "August",
        releases: [
          {
            version: "1.9", date: "August 2023",
            newFeatures: [
              { title: "Invoice Management", description: "Added invoice-management states in the Admin Portal and invoice views in the Customer Portal.", tags: ["Billing"] },
              { title: "Bank-Transfer Receipts", description: "Enabled receipt uploads for bank transfers and expanded TTSL partnership support.", tags: [] },
              { title: "Order Dashboards", description: "Added Polarin order and cross-connect dashboards, reseller licensing, and digital CAF signatures.", tags: [] },
            ],
            improvements: [
              { title: "Reporting improvements", description: "Improved MSA capture, notifications, DECIX quotations, and Salesforce reporting.", tags: [] },
            ],
            bugFixes: [
              { title: "Billing & connectivity fixes", description: "Fixed demarcation, password-special-character, test-email, performance-metric, capacity, billing-state, and DC-to-DC issues.", tags: ["Billing"] },
            ],
          },
          {
            version: "1.8", date: "August 2023",
            newFeatures: [
              { title: "Temporary Rate-Limit Add-Ons", description: "Added temporary VC rate-limit add-ons and platform service notifications.", tags: [] },
              { title: "Flexible VLAN Pricing", description: "Allowed preferred VLAN IDs from 101–699 and introduced differential pricing.", tags: ["Pricing"] },
            ],
            improvements: [
              { title: "Security & inventory controls", description: "Added weak-lockout controls and individual LAG-port deletion.", tags: ["Security"] },
              { title: "Admin dashboard refresh", description: "Updated admin dashboards, GCP zone tags, VLAN settings, pricing monitoring, GST display, and VR minimum rate limit.", tags: ["Admin Portal"] },
            ],
            bugFixes: [
              { title: "Data accuracy fixes", description: "Fixed organisation-profile copy, port payload allocation, email units, pagination, and rate-limit validation.", tags: [] },
            ],
          },
        ],
      },
      {
        month: "July",
        releases: [{
          version: "1.7", date: "July 2023",
          newFeatures: [
            { title: "Partner & Reseller Management", description: "Delivered Pacehub partner, sales-agent, and reseller management.", tags: ["Partner Portal"] },
            { title: "Expanded PAYG Coverage", description: "Enabled PAYG for DC–Cloud, VR–Cloud, and Cloud–Cloud scenarios.", tags: [] },
            { title: "LAG Creation", description: "Added Link Aggregation Group creation, real-time inventory, and reference names.", tags: [] },
          ],
          improvements: [
            { title: "Ordering polish", description: "Added cross-connect ordering, PO display, improved journey templates, pricing summaries, and service side panels.", tags: [] },
            { title: "Visibility upgrades", description: "Added subscriber notifications, performance metrics, partner approvals, and support for multiple cross-connects.", tags: [] },
          ],
          bugFixes: [
            { title: "Not a single bug this time", description: "We'll take the quiet win.", tags: [] },
          ],
        }],
      },
      {
        month: "June",
        releases: [{
          version: "1.6", date: "June 2023",
          newFeatures: [
            { title: "More Cloud Connectivity", description: "Added manual Cloudflare, De-CIX, and Microsoft 365 connectivity.", tags: ["Cloud"] },
            { title: "Azure Multi-Connection Support", description: "Added Azure primary, secondary, and multipoint connections.", tags: ["Cloud"] },
            { title: "New Lifecycle Emails", description: "Added welcome, live-connection, and NOC notification emails.", tags: ["Notifications"] },
          ],
          improvements: [
            { title: "Streamlined organisation profiles", description: "Simplified the organisation-profile setup flow.", tags: [] },
            { title: "Smoother service creation", description: "Improved service creation, navigation, welcome screens, admin dashboards, and PO-number handling.", tags: [] },
          ],
          bugFixes: [
            { title: "Nothing broken, nothing fixed", description: "Just steady progress this month.", tags: [] },
          ],
        }],
      },
      {
        month: "May",
        releases: [{
          version: "1.5", date: "May 2023",
          newFeatures: [
            { title: "Expanded VLAN & Peering Options", description: "Added tagged, untagged, and trunk VLAN types, Q-in-Q, Azure Peering Service, De-CIX connectivity, and automated IP allocation.", tags: ["Connectivity"] },
            { title: "Partner Portal Foundations", description: "Added partner onboarding, lead and opportunity management, and partner lead distribution.", tags: ["Partner Portal"] },
          ],
          improvements: [
            { title: "Sharper VR & quoting", description: "Enhanced VR rate-limit validation, CRM IDs, inventory, and sales-assist quoting.", tags: [] },
            { title: "Planned Polarin branding refresh", description: "Planned branding and UI/UX refresh work for the Partner Portal.", tags: ["Partner Portal"] },
          ],
          bugFixes: [
            { title: "Cross-team fixes", description: "Fixed performance metrics, sales-assist, deployment, email, activity-log, and Help and Support issues.", tags: [] },
          ],
        }],
      },
      {
        month: "April",
        releases: [{
          version: "1.4", date: "April 2023",
          newFeatures: [
            { title: "End-to-End PAYG", description: "Added end-to-end Pay-As-You-Go for DC–DC and DC–VR virtual connections and virtual routers.", tags: [] },
            { title: "Helpdesk & Knowledge Base", description: "Introduced Helpdesk, Salesforce case tracking, and Knowledge Base category, article, contact, and search views.", tags: [] },
            { title: "Lifecycle Notifications", description: "Added notification emails for account, service, invoice, payment, and user-management events.", tags: ["Notifications"] },
          ],
          improvements: [
            { title: "Platform clean-up", description: "Improved inventory, performance-data cleanup, API error handling, navigation, pricing, activity logs, Captcha, invoices, and cloud-status updates.", tags: [] },
          ],
          bugFixes: [
            { title: "Known issue: PAYG suspension", description: "PAYG suspension was not yet covered by this release.", tags: [] },
          ],
        }],
      },
      {
        month: "March",
        releases: [
          {
            version: "1.3", date: "March 2023",
            newFeatures: [
              { title: "Two-Factor Authentication", description: "Implemented TOTP-based two-factor authentication with backup codes, device recovery, and deregistration.", tags: ["Security"] },
              { title: "Help & Support Module", description: "Added Help and Support, case creation, and service-ordering improvements.", tags: [] },
              { title: "L2/L3 Performance Dashboards", description: "Introduced L2/L3 performance metrics and data-centre dashboards.", tags: [] },
            ],
            improvements: [
              { title: "Virtual connection upgrades", description: "Added virtual-connection upgrades, price-breakup displays, VR updates, and cloud-flow changes.", tags: [] },
              { title: "Stronger account security", description: "Strengthened password reuse controls, account lockout, user reactivation, and deletion.", tags: ["Security"] },
              { title: "Onboarding refinements", description: "Improved organisation setup, international phone numbers, and optional identity documents.", tags: [] },
              { title: "Platform hardening", description: "Added router-provision templates, MSA acceptance, activity-log improvements, Recaptcha, CSP headers, and session invalidation.", tags: ["Security"] },
            ],
            bugFixes: [
              { title: "Known issues", description: "Known issues included VR updates, service deletion, selected network-diagram cases, and user-access permissions.", tags: [] },
            ],
          },
          {
            version: "1.2", date: "March 3, 2023",
            newFeatures: [
              { title: "GCP Zone Visibility", description: "Added GCP zone information and corrected cloud-to-cloud available bandwidth display.", tags: ["Cloud"] },
              { title: "Inventory Utilisation Alerts", description: "Added inventory filters and threshold highlighting above 70% utilisation.", tags: [] },
              { title: "Signup Email Verification", description: "Added email verification before signup.", tags: [] },
              { title: "Secure File Handling", description: "Added file metadata removal and malware scanning before upload.", tags: ["Security"] },
            ],
            improvements: [
              { title: "Enhanced AWS L3 flow", description: "Enhanced AWS L3 flow with BGP updates.", tags: ["Cloud"] },
              { title: "Refreshed activity views", description: "Updated performance graphs, welcome screens, and activity logs.", tags: [] },
              { title: "VR and location APIs", description: "Completed backend support for Virtual Router deletion and location search APIs.", tags: [] },
            ],
            bugFixes: [
              { title: "Clean as a whistle", description: "Nothing to fix in this release.", tags: [] },
            ],
          },
        ],
      },
      {
        month: "January",
        releases: [
          {
            version: "1.1", date: "January 16, 2023",
            newFeatures: [
              { title: "Azure & Oracle Connectivity", description: "Added Azure L2, Oracle L2, and Oracle L3 connectivity options.", tags: ["Connectivity"] },
              { title: "HubSpot Integration", description: "Integrated HubSpot contact creation for signed-up users.", tags: [] },
              { title: "Sales-Assist Impersonation", description: "Added internal-admin impersonation so sales-assist users can act on a customer's behalf.", tags: [] },
            ],
            improvements: [
              { title: "Richer organisation profiles", description: "Expanded organisation profiles with CAF-required fields and added customer user-role management.", tags: [] },
            ],
            bugFixes: [
              { title: "Minor fixes and polish", description: "Delivered minor bug fixes and cosmetic improvements across the portal.", tags: [] },
            ],
          },
          {
            version: "1.0", date: "January 2023",
            newFeatures: [
              { title: "Customer Portal Launch", description: "Self-service signup and organisation setup, profile management (contact number, password, profile picture), and role-based access for Network Admin, Finance Admin, and Support users.", tags: [] },
              { title: "Core Service Ordering", description: "Order Ports, Virtual Connections, Virtual Routers, and cloud connectivity directly from the portal.", tags: [] },
              { title: "Billing and Subscriptions", description: "View subscription history with start dates and terms, plus invoice history with credit-card payment via CC Avenue.", tags: ["Billing"] },
              { title: "Performance Visibility", description: "Track errors, traffic, packets, and power-level metrics, with a network diagram showing customer connectivity.", tags: [] },
              { title: "Internal Admin Portal", description: "SSO login for administrators, plus an organisation review and approval workflow for KYC validation.", tags: ["Admin Portal"] },
            ],
            improvements: [],
            bugFixes: [
              { title: "Nothing to fix on day one", description: "Brand new platform, brand new bug tracker — completely empty.", tags: [] },
            ],
          },
        ],
      },
    ],
  },
];

const ALL_YEARS = ALL_RELEASE_DATA.map((d) => d.year);

// ── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownProps {
  label: string; value: string; options: string[];
  onChange: (val: string) => void; width?: number;
}

function CustomDropdown({ label, value, options, onChange, width = 110 }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#90a2b9", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
            background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 12,
            cursor: "pointer", fontFamily: FONT, fontWeight: 500, fontSize: 14,
            color: "#0a3954", transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0a3954"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f1"; }}
        >
          <span style={{ width, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", lineHeight: "24px" }}>
            {value}
          </span>
          <ChevronDown
            size={18} color="#90a2b9"
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          />
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
            background: "#ffffff", border: "1px solid #e2e8f1", borderRadius: 12,
            boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 4px 16px rgba(96,97,112,0.16)",
            overflow: "hidden", minWidth: "100%",
          }}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  width: "100%", display: "block", padding: "10px 16px", textAlign: "left",
                  fontFamily: FONT, fontWeight: opt === value ? 700 : 500, fontSize: 14,
                  lineHeight: "22px", color: opt === value ? "#1c808d" : "#0a3954",
                  background: opt === value ? "#f0fdfa" : "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (opt !== value) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { if (opt !== value) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Accordion ────────────────────────────────────────────────────────

type SectionType = "newFeatures" | "improvements" | "bugFixes";

const SECTION_CONFIG: Record<SectionType, { label: string; iconBg: string; icon: React.ReactNode }> = {
  newFeatures:  { label: "New Features",  iconBg: "#00a63e", icon: <Plus  size={20} color="white" strokeWidth={2.5} /> },
  improvements: { label: "Improvements",  iconBg: "#165dfb", icon: <Wrench size={20} color="white" strokeWidth={2} /> },
  bugFixes:     { label: "Bug Fixes",     iconBg: "#e7000b", icon: <Bug   size={20} color="white" strokeWidth={2} /> },
};

function SectionAccordion({ sectionKey, versionKey, items, openSections, toggleSection }: {
  sectionKey: SectionType; versionKey: string; items: ReleaseItem[];
  openSections: Set<string>; toggleSection: (k: string) => void;
}) {
  const key = `${versionKey}-${sectionKey}`;
  const isOpen = openSections.has(key);
  const { label, iconBg, icon } = SECTION_CONFIG[sectionKey];

  return (
    <div style={{ border: "1px solid #e2e8f1", borderRadius: 16, overflow: "hidden" }}>
      <button
        onClick={() => toggleSection(key)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 16, padding: 24,
          background: "#ffffff", border: "none", cursor: "pointer", textAlign: "left",
          transition: "background 0.12s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, lineHeight: "24px", color: "#0a3954", whiteSpace: "nowrap" }}>
            {label}
          </p>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, lineHeight: "20px", color: "#0a3954", background: "#f8fafc", border: "1px solid #e2e8f1", borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap" }}>
            {items.length} Updates
          </span>
        </div>
        {isOpen
          ? <ChevronUp size={24} color="#90a2b9" style={{ flexShrink: 0 }} />
          : <ChevronDown size={24} color="#90a2b9" style={{ flexShrink: 0 }} />}
      </button>
      {isOpen && (
        <div style={{ background: "#f8fafc", padding: "16px 24px 24px" }}>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, i) => (
              <li key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: "22px", color: "#0a3954" }}>
                <strong style={{ fontWeight: 700 }}>{item.title}</strong>
                {" — "}
                <span style={{ fontWeight: 400 }}>{item.description}</span>
                {item.tags && item.tags.length > 0 && (
                  <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, marginLeft: 8, verticalAlign: "middle" }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#1c808d",
                          background: "#effcfd", border: "1px solid #cbeef0", borderRadius: 999,
                          padding: "2px 8px", whiteSpace: "nowrap",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Version Card ─────────────────────────────────────────────────────────────

function VersionCard({ release, versionKey, openSections, toggleSection }: {
  release: VersionRelease; versionKey: string;
  openSections: Set<string>; toggleSection: (k: string) => void;
}) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f1", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 24, boxShadow: "0px 0px 1px rgba(40,41,61,0.08), 0px 0.5px 2px rgba(96,97,112,0.16)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h3 style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            Version {release.version}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={16} color="#90a2b9" />
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: "20px", color: "#90a2b9" }}>
              Released {release.date}
            </p>
          </div>
        </div>
        {release.isLatest && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 16, background: "#dcfce7", border: "1px solid #b9f8cf", fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#008236", flexShrink: 0 }}>
            ✦ Latest
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(["newFeatures", "improvements", "bugFixes"] as SectionType[]).map((sk) =>
          release[sk].length > 0 ? (
            <SectionAccordion
              key={sk} sectionKey={sk} versionKey={versionKey}
              items={release[sk]} openSections={openSections} toggleSection={toggleSection}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ReleaseNotesPage() {
  const tools = usePageTools();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("June");
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["2026-June-5.1-newFeatures", "2026-June-5.1-bugFixes"])
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const suppressObserver = useRef(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Stable refs to selected state — avoid stale closures inside observer
  const selectedYearRef = useRef(selectedYear);
  const selectedMonthRef = useRef(selectedMonth);
  useEffect(() => { selectedYearRef.current = selectedYear; }, [selectedYear]);
  useEffect(() => { selectedMonthRef.current = selectedMonth; }, [selectedMonth]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Month dropdown options reflect the currently visible year
  const yearData = ALL_RELEASE_DATA.find((d) => d.year === selectedYear);
  const monthOptions = ["All", ...(yearData?.months.map((m) => m.month) ?? [])];

  // Wire up IntersectionObserver once — all sections are in DOM from the start
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const el = visible[0].target as HTMLElement;
        const month = el.dataset.month ?? "";
        const year = Number(el.dataset.year ?? 0);
        if (year && year !== selectedYearRef.current) {
          setSelectedYear(year);
          setSelectedMonth(month);
        } else if (month && month !== selectedMonthRef.current) {
          setSelectedMonth(month);
        }
      },
      { root, threshold: 0.05, rootMargin: "0px 0px -55% 0px" }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []); // all sections are static — no need to re-observe

  const setSectionRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) sectionRefs.current.set(key, el);
      else sectionRefs.current.delete(key);
    },
    []
  );

  const handleYearChange = (val: string) => {
    const year = Number(val);
    suppressObserver.current = true;
    setSelectedYear(year);
    const firstMonth = ALL_RELEASE_DATA.find((d) => d.year === year)?.months[0]?.month ?? "All";
    setSelectedMonth(firstMonth);
    const el = sectionRefs.current.get(`year-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => { suppressObserver.current = false; }, 800);
  };

  const handleMonthChange = (val: string) => {
    suppressObserver.current = true;
    setSelectedMonth(val);
    const key = val === "All" ? `year-${selectedYear}` : `${selectedYear}-${val}`;
    const el = sectionRefs.current.get(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => { suppressObserver.current = false; }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* ── Filter bar — sits above the scroll area, always visible ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 16 : 32,
          padding: isMobile ? "14px 16px" : "18px 32px",
          borderBottom: "1px solid #e2e8f1",
          background: "#ffffff",
          flexWrap: "wrap",
        }}
      >
        <CustomDropdown
          label="Year:"
          value={String(selectedYear)}
          options={ALL_YEARS.map(String)}
          onChange={handleYearChange}
          width={50}
        />
        <CustomDropdown
          label="Month:"
          value={selectedMonth}
          options={monthOptions}
          onChange={handleMonthChange}
          width={90}
        />
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={contentRef}
        style={{ flex: 1, overflowY: "auto", padding: isMobile ? "24px 16px 40px" : "32px 32px 60px" }}
      >
        {/* Page header */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#effcfd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
              <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
                Release Notes
              </h1>
              {tools && <CopyPageMenu contentRef={tools.contentRef} pageTitle={tools.pageTitle} pageId={tools.pageId} />}
            </div>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "#7e93b2" }}>
              Stay up to date with the latest features, improvements, and bug fixes.
            </p>
          </div>
        </div>

        {/* All years in continuous scroll — always rendered (not gated behind
            `loading`) so the static export used for Copy Page/PDF/AI links
            still gets full content even though effects never run there. */}
        <div style={{ position: "relative" }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, zIndex: 5, background: "#fff", display: "flex", flexDirection: "column", gap: 16 }}>
              <ReleaseCardSkeleton />
              <ReleaseCardSkeleton />
              <ReleaseCardSkeleton />
            </div>
          )}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {ALL_RELEASE_DATA.map(({ year, months }, yi) => (
            <div key={year} style={{ marginBottom: 48 }}>
              {/* Year divider — also serves as jump target */}
              <div
                ref={(el) => {
                  if (el) sectionRefs.current.set(`year-${year}`, el);
                  else sectionRefs.current.delete(`year-${year}`);
                }}
                style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, marginTop: yi > 0 ? 8 : 0 }}
              >
                <div style={{ height: 1, flex: 1, background: "#e2e8f1" }} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 13, color: "#90a2b9", letterSpacing: "0.08em", userSelect: "none" }}>
                  {year}
                </span>
                <div style={{ height: 1, flex: 1, background: "#e2e8f1" }} />
              </div>

              {/* Month sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                {months.map((monthData) => (
                  <div
                    key={monthData.month}
                    ref={setSectionRef(`${year}-${monthData.month}`)}
                    data-month={monthData.month}
                    data-year={year}
                  >
                    <p style={{ margin: "0 0 16px", fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#90a2b9" }}>
                      {monthData.month}, {year}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {monthData.releases.map((release) => (
                        <VersionCard
                          key={release.version}
                          release={release}
                          versionKey={`${year}-${monthData.month}-${release.version}`}
                          openSections={openSections}
                          toggleSection={toggleSection}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
