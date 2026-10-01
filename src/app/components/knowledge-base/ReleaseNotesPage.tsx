import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Wrench, Bug, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useWindowWidth } from "./useWindowWidth";
import { usePageTools } from "./ArticlePage";
import { CopyPageMenu } from "./CopyPageMenu";
import { ReleaseCardSkeleton } from "./Skeleton";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Data ────────────────────────────────────────────────────────────────────

interface ReleaseItem { title: string; description: string; isEmptyState?: boolean }
interface VersionRelease {
  version: string; date: string; isLatest?: boolean;
  newFeatures: ReleaseItem[]; improvements: ReleaseItem[]; bugFixes: ReleaseItem[];
}
interface MonthData { month: string; releases: VersionRelease[] }
interface YearData { year: number; months: MonthData[] }

// Historical data sourced from "Combined Platform Release Notes — Batch 1"
// (real release notes, Jan 2023 – Sep 2024). Two months in that range had no
// recorded release (Feb 2023, Apr 2024) and are simply omitted rather than
// invented. Oct 2024 – Dec 2025 has no source release notes yet (the batch
// itself flags v3.7–v6.1 as not gathered) and is left out entirely rather
// than filled with placeholder content. Jan–Jun 2026 comes from the
// Q1/Q2'26 feature tracker, spread across those six months in sequence under
// the real version numbers the source notes name for that range (v3.7–3.12).
// Months/releases with no recorded bug fixes get one light, positive line
// instead of an empty Bug Fixes card.
const ALL_RELEASE_DATA: YearData[] = [
  {
    year: 2026,
    months: [
      {
        month: "June",
        releases: [{
          version: "3.12", date: "June 2026", isLatest: true,
          newFeatures: [
            { title: "Full Order History with MACD Lineage View", description: "Every service now retains a complete order history with full MACD — Moves, Adds, Changes, and Deletes — lineage on a single timeline. Previously, an upgrade or renewal could effectively spin up what looked like a brand-new service with no visible record of what came before it, making billing or configuration disputes hard to untangle. Customers can now trace the full lifecycle of any service or product from the original order through every change that followed, directly from their own account." },
            { title: "New SPOG Performance Metrics for L1 Services", description: "Expanded Vista's single-pane-of-glass monitoring with three new L1 performance metrics — Forward Error Correction (FEC), Optical Power, and Major & Critical Alarms. Until now, L1 circuits carried far less visibility than L2/L3 services, so customers often had to raise a support ticket just to understand optical-layer health. These metrics now surface directly inside the existing Vista dashboard alongside other telemetry, with no separate tooling required. The result is deeper, real-time visibility into optical health across India and APAC, and an earlier warning sign of a degrading link before it becomes an outage." },
          ],
          improvements: [
            { title: "Better Identification of LAG Ports from Other Port Types", description: "Improved naming for ports within a Link Aggregation Group so each member port is uniquely and clearly identifiable, rather than sharing a generic label with standalone ports. Previously, telling a LAG member apart from an unrelated port meant opening its detail page, which slowed down troubleshooting during an active incident. The clearer naming now shows up directly in inventory and service listings. Multi-port configurations are far easier to manage, audit, and troubleshoot as a result." },
          ],
          bugFixes: [
            { title: "Wrapped up clean", description: "No bugs to report this release — the whole cycle went into the features and improvements above instead. We'll take a clean scoreboard wherever we can get one.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "May",
        releases: [{
          version: "3.11", date: "May 2026",
          newFeatures: [],
          improvements: [
            { title: "Standardising Terms — Port Speed, Bandwidth, Rate Limit", description: "Standardised the core metrics — Port Speed, Bandwidth, and Rate Limit — across every service type on the platform. Different teams and products had drifted into slightly different terminology over time, which meant the same underlying number could be labelled differently depending on where you looked. This creates one consistent vocabulary across quotes, orders, invoices, and dashboards, reducing confusion for customers comparing services. It also makes cross-product comparisons much more reliable." },
            { title: "Product Name Standardisation across All Touchpoints", description: "Unified product naming across every customer and internal touchpoint, so the same product is now referenced identically everywhere — in the portal, in quotes, in CRM records, and in support tickets. Previously, a product could appear under two or three slightly different names depending on the source system, which made search, reporting, and cross-team communication harder than it needed to be. This strengthens brand consistency and removes a recurring source of ambiguity for sales, support, and finance." },
            { title: "DC Names Update on Platform", description: "Standardised all data centre names on the platform using a single, defined naming convention, including disambiguation of centres that previously shared the same display name. This had been a quiet source of ordering mistakes, since two facilities with identical-looking names could easily be confused during provisioning. The cleaned-up names now appear consistently across ordering and inventory, so customers can identify the exact facility at a glance." },
          ],
          bugFixes: [
            { title: "Smooth as ever", description: "Zero bugs attached to this one. Standardisation work tends to be quiet by nature, and this release was no exception.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "April",
        releases: [{
          version: "3.10", date: "April 2026",
          newFeatures: [
            { title: "Reports for Polarin Products", description: "Launched self-service reporting for all KPIs and SLAs across every service, giving customers a single, unified view of their own performance on demand. Previously, pulling this kind of data meant raising a request and waiting for it to be compiled manually. Now the same report can be generated directly from the platform whenever it's needed, with no back-and-forth. This removes a recurring bottleneck for customers tracking their own SLAs." },
          ],
          improvements: [
            { title: "Change in KYC Document Collection", description: "Refreshed KYC onboarding for India and APAC with entity-type-specific document requirements, so customers are only ever asked for documents that are actually relevant to their organisation type. For India specifically, organisation details can now be auto-fetched using a GST number instead of being typed in manually. This reduces manual data entry, cuts down on mismatched or incomplete submissions, and meaningfully accelerates onboarding for new customers." },
            { title: "Improve Status for All Products", description: "Extended order-tracking that was previously available only for Wave to L2/L3 services as well, under one unified status framework surfaced in a dedicated new tab. Before this, customers with a mixed Wave and L2/L3 footprint had to check different places to understand where each order stood. Status visibility is now consistent and transparent across the entire product portfolio, in one place." },
          ],
          bugFixes: [
            { title: "No surprises here", description: "Nothing to fix this time. Both features above shipped without any follow-up issues reported.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "March",
        releases: [{
          version: "3.9", date: "March 2026",
          newFeatures: [
            { title: "Traffic Unit Display Toggle", description: "Added a flexible unit toggle to Vista traffic metrics — Kbps, Mbps, Gbps, or Tbps — so customers can view performance data at whatever scale makes sense for their circuit. A 100 Mbps port and a 100 Gbps wave don't read naturally on the same fixed scale, and this previously meant squinting at long strings of digits or doing mental unit conversion. Switching units is now a single click inside the existing Vista graphs, for faster, clearer interpretation of the same underlying data." },
            { title: "Enabling Vista Functionality & Costing for New Customers", description: "Vista is now packaged as a standardised add-on product with refreshed pricing and a clear Standard vs. Premium comparison presented directly on the platform. Previously, bringing a new customer onto Vista involved manual, case-by-case pricing conversations. The new packaging makes it easy for a new customer to see exactly what each tier includes and choose the right one during their own buying journey, without waiting on a custom quote." },
          ],
          improvements: [
            { title: "Service ID Standardisation — 20-Character Nomenclature", description: "Rolled out a standardised 20-character Service ID with a consistent naming logic applied across the whole platform. Service IDs had previously grown organically, with varying lengths and formats depending on when and where a service was created, which made searching and cross-referencing them error-prone. The new, consistent format makes services easier to identify, search for, and reference correctly when talking to support." },
          ],
          bugFixes: [
            { title: "Quiet on the issues front", description: "Nothing filed this release. The three new features above went out clean.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "February",
        releases: [{
          version: "3.8", date: "February 2026",
          newFeatures: [
            { title: "Self-Service X-Connect & Cross Connect Order Flow", description: "Customers can now add a cross connect inline while ordering a port, all within a single order journey for India locations. Previously, the cross connect had to be requested as a separate, manual, out-of-band step after the port order was placed, which added delay and extra coordination. Folding it into the same flow removes that gap entirely and delivers a true self-service ordering experience from start to finish." },
            { title: "Include DCI Wave in Network Diagram", description: "DCI Wave services now appear directly in the platform's network diagram alongside every other connectivity type a customer has. This had been a visibility gap: customers with a Wave circuit couldn't see it represented in the same topology view as their Ports, Virtual Routers, and Virtual Connections. They now get a complete, at-a-glance picture of their full connectivity footprint in one diagram, closing that gap in service management." },
          ],
          improvements: [
            { title: "DCI Wave Product Enhancement — India & APAC (100G & 400G)", description: "Enhanced the DCI Wave portfolio with higher-capacity options across India and APAC. 100G is now fully self-provisionable through the normal ordering flow, and 400G can be requested directly on-platform for L1, subject to inventory availability, instead of being handled entirely offline. This brings Wave's highest-capacity tiers in line with the rest of the self-service catalogue." },
          ],
          bugFixes: [
            { title: "A tidy little release", description: "No bugs to speak of this time around.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "January",
        releases: [{
          version: "3.7", date: "January 2026",
          newFeatures: [
            { title: "Short-Term Bandwidth Contract & Provisioning — Ports, VC, VR, Vista (India & APAC)", description: "Customers can now self-provision short-term bandwidth for flexible 1–11 month terms across India and APAC, spanning Ports, Virtual Connections, Virtual Routers, and Vista. Previously, anything shorter than a standard annual term required a manual, off-platform conversation with sales. This unlocks demand from seasonal spikes and project-based use cases that don't fit a long-term contract, and it's backed by dedicated short-term pricing built specifically for this use case rather than a prorated long-term rate." },
            { title: "Long-Term Contract & Provisioning — Virtual Router (India & APAC)", description: "Long-term contracting is now supported for Virtual Router across India and APAC, with a refreshed pricing model that rewards longer commitments. Customers who already knew they wanted a multi-year Virtual Router deployment previously had no self-service path to lock that in on favourable terms. They can now select a longer term directly during ordering and see the better pricing reflected immediately." },
            { title: "Enabling L2/3 Services for APAC Region with Pricing", description: "L2 and L3 services are now live and self-provisionable in APAC with region-specific pricing, rather than being limited to India as the only fully self-service region for these service types. This extends Polarin's addressable market on-platform and lets APAC customers order the same L2/L3 services India customers already could, at pricing calibrated for their region." },
            { title: "Password Expiry Feature on Platform", description: "Introduced scheduled password expiry to strengthen account security and support compliance requirements that many enterprise customers are held to. Users receive proactive reminders in the lead-up to their expiry date, so the change rarely comes as a surprise. If no action is taken in time, a self-service password reset link is issued directly to the customer, avoiding a support ticket just to regain access." },
          ],
          improvements: [],
          bugFixes: [
            { title: "Nothing to squash this month", description: "A clean start to the year, with the four features above shipping without any reported issues.", isEmptyState: true },
          ],
        }],
      },
    ],
  },
  {
    year: 2024,
    months: [
      {
        month: "September",
        releases: [
          {
            version: "3.6", date: "September 2024",
            newFeatures: [
              { title: "End-to-End Portal Ordering", description: "Added true end-to-end portal ordering for both Polarin and Wave. Previously, some steps in placing an order required manual handoffs behind the scenes, which could add delay between submitting a request and seeing it move forward. Customers can now complete the full ordering journey for either product directly through the portal, start to finish, without that extra wait." },
              { title: "SLA Visibility", description: "Added SLA visibility for Ports, Virtual Routers, and Virtual Connections, alongside support for multiple products in a single Price Calculator estimate. Customers previously had to check SLA terms separately from pricing, and couldn't price more than one product type in one pass. Both now live together, making it easier to understand commitments and costs side by side before committing to an order." },
            ],
            improvements: [
              { title: "Wave Dashboard Refresh", description: "Added Wave dashboard loading states along with new SLA widgets and side-panel summaries. The dashboard now feels responsive even while data is still loading, instead of showing a blank screen, and the new SLA widgets give customers a clearer at-a-glance read on how their Wave circuits are performing against commitment." },
            ],
            bugFixes: [
              { title: "Wave & platform fixes", description: "Fixed incomplete pricing validation, router status, duplicate activity logs, renewal-termination controls, inspection reports, cloud deployment, VA help details, CAF values, billing dates, invoice generation, and price summaries. This was a broad stability pass across Wave and the core platform." },
            ],
          },
          {
            version: "3.5", date: "September 2024",
            newFeatures: [
              { title: "Price Calculator Disclaimer", description: "Added a disclaimer to the Polarin Price Calculator clarifying that displayed figures are estimates. This reduces confusion for customers when a final quote differs slightly from the number the calculator originally showed." },
            ],
            improvements: [
              { title: "User Management Refresh", description: "Updated User Management with new designs, clearer filters, streamlined CRUD actions, and explicit confirmation flows before destructive actions, plus added Virtual Appliance connection details and permission-based deletion. The confirmation flows in particular reduce the risk of an admin accidentally removing a user or access grant without realising the consequence first." },
            ],
            bugFixes: [
              { title: "Order & billing fixes", description: "Fixed order creation, PAYG selection, Virtual Appliance deployment, router creation, logo updates, export columns, pricing, service states, subscription renewal, BGP details, billing profiles, user management, and Wave price-calculator defects. A wide-ranging cleanup touching nearly every major module, aimed at tightening up the ordering and billing experience ahead of further feature work." },
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
              { title: "VA Internet Rate-Limit Visibility", description: "Added Virtual Appliance internet-rate-limit visibility and validation, and the platform now disables locations when inventory is unavailable rather than letting a customer attempt to order into a dead end. Surfacing the rate limit up front lets customers see exactly what bandwidth they're provisioning before committing, and the inventory check prevents orders that would otherwise fail later in fulfilment." },
              { title: "Bandwidth on Demand (Polarin Wave)", description: "Polarin Wave added Bandwidth on Demand along with updated quotation pricing to match. Customers with a Wave circuit can now flex capacity up or down to match short-term traffic needs instead of being locked into a single fixed rate for the full contract term, with pricing that reflects the actual bandwidth used." },
            ],
            improvements: [
              { title: "Pricing & filter polish", description: "Improved pricing-summary presentation, port-status processing, Virtual Appliance filters, notification time formatting, billing-profile dropdowns, search behaviour, and service-logo sizing. A collection of smaller usability fixes across several screens, each individually minor but together making day-to-day navigation noticeably smoother." },
            ],
            bugFixes: [
              { title: "Stability fixes", description: "Fixed activity-log UI, LAG cross-connect locations, subscription actions, tab responsiveness, file uploads, Virtual Appliance connection details, pricing-calculator formats, cloud-flow pricing, pagination, invoice downloads, billing profiles, and VR validation. This release focused on tightening up stability across a broad set of everyday workflows rather than one specific area." },
            ],
          },
          {
            version: "3.3", date: "August 2024",
            newFeatures: [
              { title: "Virtual Appliance Cloud Coverage", description: "Added Virtual Appliance cloud scenarios for AWS, Oracle, and Azure, extending VA support beyond its initial launch footprint. Customers running infrastructure across any of these three major clouds can now deploy and manage Virtual Appliances against them directly from the platform." },
              { title: "Polarin Price Calculator", description: "Introduced the Polarin Price Calculator along with Virtual Router flat pricing. Before this, estimating the cost of a Virtual Router setup typically required a conversation with sales. Customers can now get an instant, self-service estimate using flat, predictable pricing rather than a custom-quoted figure." },
            ],
            improvements: [
              { title: "Platform standardisation", description: "Standardised input and dropdown states, billing warnings, latency stitching, VR host details, export ordering, activity-log product names, and regulatory reporting. These changes bring consistency to how similar UI elements and data behave across different parts of the platform, reducing the small inconsistencies that otherwise accumulate as a product grows." },
            ],
            bugFixes: [
              { title: "Support & billing fixes", description: "Fixed Help and Support attachments, billing profiles, logout, onboarding, email forwarding, case deletion, Virtual Appliance columns, cross-connect actions, billing-profile defaults, subscription visibility, phone validation, search, pricing, and notification issues. A large, cross-cutting fix list spanning support tooling, onboarding, and billing together." },
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
              { title: "New Billing Profile Design", description: "Introduced a redesigned Billing Profile layout with improved table search and filtering. Organisations managing several billing profiles at once previously had to scroll through a long, largely unfilterable list. The refreshed design makes it much faster to locate a specific profile, particularly for larger accounts with many entities." },
              { title: "Polarin Wave Data Versioning", description: "Added Polarin Wave data versioning along with new Virtual Appliance knowledge-base documentation. Versioning gives the team a reliable way to track how Wave data has changed over time, while the new VA documentation gives customers a self-serve reference instead of relying entirely on support for setup questions." },
            ],
            improvements: [
              { title: "Inventory & routing controls", description: "Added inventory filters, service-reservation controls, routing types, and export-column support, plus Virtual Appliance event notifications and subscription-end-date administration. Together these give customers finer-grained control over how their own inventory is reserved, routed, and reported on." },
            ],
            bugFixes: [
              { title: "Pricing & billing fixes", description: "Fixed pricing summaries, service-state messaging, VC rate-limit calculations, activity-log billing fields, exported billing values, LOA recipients, inventory details, pagination, and help-and-support service selection. A broad pricing- and billing-focused cleanup." },
            ],
          },
          {
            version: "3.1", date: "July 2024",
            newFeatures: [
              { title: "Automated Compliance Checks", description: "Added automated Bonafide Check inspection reports for customer signature. This replaces a previously manual verification step with an automatically generated report that customers can review and sign directly, reducing turnaround time on compliance-related approvals." },
            ],
            improvements: [
              { title: "Virtual Appliance expansion", description: "Expanded Virtual Appliance ordering, configuration, viewing, editing, subscriptions, pricing, and administration. This rounds out VA as a product, giving it the same depth of lifecycle management that other core service types already had." },
              { title: "Pricing & display polish", description: "Improved product locations, network-diagram status colours, payment pricing, service-page designs, VLAN selection, and billing controls. Several smaller refinements aimed at making customer-facing pricing and service details clearer and more consistent." },
            ],
            bugFixes: [
              { title: "Cross-module fixes", description: "Fixed case submission, VA pricing, PAYG logs, VR rate limits, subscription deletion and renewal, cloud-key validation, organisation defaults, checkout errors, port failures, billing invoices, help-and-support attachments, and VA editing. One of the larger fix batches of the year, touching nearly every major area of the platform." },
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
              { title: "Virtual Appliance Ordering (Beta)", description: "Introduced beta Virtual Appliance ordering, covering configuration, viewing, editing, subscriptions, and pricing. This is the first self-service entry point for VA as a product, released in beta so the team could gather real usage feedback before the full launch that followed in subsequent releases." },
            ],
            improvements: [
              { title: "Billing groundwork", description: "Added billing-related management capabilities and extensive platform integration work behind the scenes. Most of this release was foundational — not directly visible to customers, but necessary groundwork for the billing features that shipped in the months that followed." },
            ],
            bugFixes: [
              { title: "Smooth sailing", description: "No bugs, no drama this release. A quiet patch release focused entirely on the beta VA launch and billing groundwork above.", isEmptyState: true },
            ],
          },
          {
            version: "3.0", date: "June 20, 2024",
            newFeatures: [
              { title: "LOA Sharing UI", description: "Introduced a new Letter of Authorization sharing and download UI. Customers previously had to request LOAs through support; they can now generate, view, and download them directly from the platform, cutting out a manual request-and-wait step." },
              { title: "Live Performance Metrics", description: "Added performance metrics for live Ports, Virtual Routers, and Virtual Connections, along with new connection-details tabs to house them. Customers can now check how a service is actually performing in real time rather than relying solely on status indicators, directly from the same page where they manage the service." },
              { title: "Corrective Billing", description: "Added corrective billing support along with target single-invoice formats. When a billing error needed correcting, it previously required manual intervention outside the normal invoicing flow; corrections can now be issued in a way that produces a single, clean target invoice for the customer." },
            ],
            improvements: [
              { title: "Portal consistency", description: "Added consistent empty-state messaging across portal screens. Empty states previously varied screen to screen, some showing nothing at all; now every screen gives a clear, consistent message when there's no data to display yet." },
              { title: "Diagram & inventory polish", description: "Improved Internet Exchange network diagrams, inventory country filters, Console Connect logos, location APIs, bulk e-invoicing, and bill-number sequencing. A broad polish pass across visualisation, inventory, and billing-adjacent tooling." },
            ],
            bugFixes: [
              { title: "Billing & orchestration fixes", description: "Fixed billing-status consistency, Console Connect VC creation, PAYG termination images, duplicate subscription logs, service-card movement, port names, GST refresh, Oracle verification, Azure orders, and orchestration callbacks. This closed out a number of edge cases discovered as order volumes grew across cloud and Console Connect integrations." },
            ],
          },
        ],
      },
      {
        month: "May",
        releases: [{
          version: "2.10", date: "May 28, 2024",
          newFeatures: [
            { title: "Richer Billing Profiles", description: "Billing profiles now support phone numbers, country codes, auto-filled state, and preferred currency. These fields had previously been missing or required manual lookup, which slowed down billing-profile setup, particularly for international customers whose state/province and currency needed to be entered by hand." },
            { title: "New Components", description: "Introduced a new shared table component, a network diagram component, a refreshed activity-log design, and availability-metrics improvements. These are largely foundational UI building blocks, used across multiple pages, that set up more consistent presentation for the features that followed in later releases." },
          ],
          improvements: [
            { title: "Redesigned billing & services views", description: "Revamped the billing-profile list view and the Services page design, and improved VC notification formatting so emails are easier to scan. Both pages had grown cluttered as more fields and services were added over time; this release reorganised them around what customers actually look for most often." },
          ],
          bugFixes: [
            { title: "Wide-ranging fixes", description: "Fixed checkout split, GST-number errors, VR update controls, LAG popup cancellation, organisation-profile spelling, add-on exceptions, billing-profile display, activity-log search, knowledge-base routing, and Azure service-key validation. One of the broadest fix lists of the quarter, spanning checkout, billing, and search." },
          ],
        }],
      },
      {
        month: "March",
        releases: [
          {
            version: "2.9", date: "March 2024",
            newFeatures: [
              { title: "Azure Rate-Limit Upgrades", description: "Added Azure virtual-connection rate-limit upgrades, paid-plan POC upgrades, and DECIX peering by ASN. Customers running a proof-of-concept on a paid plan can now upgrade their rate limit without needing a brand-new order, and DECIX peering can be configured directly by ASN instead of requiring manual coordination." },
            ],
            improvements: [
              { title: "Navigation & filtering", description: "Improved connection-creation navigation, subscription filters, billing fields, and virtual-appliance toggles and forms, alongside clearer pricing display throughout the ordering flow. These changes reduce the number of steps and amount of back-and-forth needed to complete a typical order." },
            ],
            bugFixes: [
              { title: "Validation fixes", description: "Fixed wizard validation, activity-log filtering, Console Connect pricing, VC notifications, quotation links, and cloud/port pricing issues." },
            ],
          },
          {
            version: "2.8", date: "March 2024",
            newFeatures: [
              { title: "New India Data Centre", description: "Added Alphatum Noida as a new India data centre available for ordering. This extends the self-service catalogue of Indian facilities, giving customers in and around the National Capital Region another location option for Ports, interconnects, and related services." },
            ],
            improvements: [],
            bugFixes: [
              { title: "Quotation & transformation fixes", description: "Fixed BGP display, product-type emails, quotation links, recipient routing, and normal-VC-to-cloud transformation. These fixes targeted a cluster of issues in how quotations and their related notifications were generated and delivered." },
            ],
          },
        ],
      },
      {
        month: "February",
        releases: [{
          version: "2.7", date: "February 2024",
          newFeatures: [
            { title: "POC Ordering", description: "Added POC (proof-of-concept) ordering, expiration notifications, 24-hour sessions, and performance-metric availability changes. Customers evaluating the platform can now set up a time-boxed POC with automatic expiry and reminders, rather than needing a full commercial order just to trial a service." },
          ],
          improvements: [
            { title: "Service panel refinements", description: "Improved service side panels, packet-loss calculations, PO-number validation, upfront-payment display, OTC values, and service-price presentation. The side panel in particular saw several small layout fixes that made key service details easier to scan without opening the full detail page." },
          ],
          bugFixes: [
            { title: "Ordering & pricing fixes", description: "Fixed VR deletion, cross-connect ordering, add-on downgrade, port deletion, bandwidth capacity, Console Connect pricing, VR pricing, subscription details, and date display." },
          ],
        }],
      },
      {
        month: "January",
        releases: [
          {
            version: "2.6", date: "January 2024",
            newFeatures: [
              { title: "Half-Yearly Billing", description: "Added service visibility improvements, billing exceptions handling, organisation-profile export, and support for half-yearly billing cycles. Previously billing cycles were limited to monthly, quarterly, or annual; customers who preferred a six-month cadence now have that option available directly during setup." },
            ],
            improvements: [
              { title: "Clearer VLAN guidance", description: "Improved VLAN help text, post-creation navigation, organisation defaults, subscription terminology, and notification targeting. The updated help text in particular reduced a recurring category of support questions about how VLAN IDs should be chosen during ordering." },
            ],
            bugFixes: [
              { title: "VR & cross-connect fixes", description: "Fixed VR-to-DC payloads, VR capacity, and cross-connect availability." },
            ],
          },
          {
            version: "2.5", date: "January 2024",
            newFeatures: [
              { title: "VR-to-VR Ordering", description: "Added VR–VR ordering, reserved and PAYG VR updates, and Singapore-origin ordering. Customers can now connect two Virtual Routers directly to one another through self-service ordering, and PAYG Virtual Routers gained the same update capabilities that reserved VRs already had." },
              { title: "Console Connect–Polarin Link", description: "Added payment history, location and latency APIs, and direct Console Connect–Polarin connectivity. The new connectivity option lets customers reach Polarin's network directly through their existing Console Connect relationship, without needing a separate physical interconnect." },
            ],
            improvements: [
              { title: "Billing & pricing polish", description: "Improved billing dates, GCP zones, navigation, Polarin integrations, LOA data, NLD billing profiles, and pricing. A broad quality pass across billing and cloud-provider integration details that had accumulated small inconsistencies since launch." },
            ],
            bugFixes: [
              { title: "Metrics & integration fixes", description: "Fixed performance metrics, GST, Oracle location filtering, cross-connect status, circuit upgrades, VR payloads, Azure keys, pricing, network diagrams, user roles, and Console Connect inventory. One of the larger fix batches of the period, spanning metrics, tax handling, and several cloud integrations at once." },
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
            { title: "Subscription Lifecycle Management", description: "Added subscription renewal and termination, Console Connect connectivity, product visibility, and cross-connect pricing. Before this, ending or renewing a subscription required manual intervention from internal teams. Customers can now manage the full lifecycle of a subscription themselves, from initial order through renewal or termination, without raising a ticket." },
            { title: "New India Data Centres", description: "Added India data centres including IBM Mumbai, Infosys Bangalore and Pune, Adani Chennai, and three additional Bengaluru locations. This significantly expands the self-service India footprint in a single release, giving customers far more choice of facility across the country's key metro and tech-hub markets." },
          ],
          improvements: [
            { title: "Attribute & pricing depth", description: "Added cloud-location details, tagged/untagged/trunk compatibility, MRC/TCV fields, partner referrals, virtual-connection attributes, pricebook integration, renewal APIs, and history components. This release deepened the data model behind virtual connections and pricing, laying groundwork that later billing and reporting features would build on." },
          ],
          bugFixes: [
            { title: "Capacity & flow fixes", description: "Fixed LAG spacing, capacity, organisation mapping, LAG eligibility, service status, VR availability, access control, activity logs, pricing, cloud flows, subscription details, and checkout errors. A wide-ranging stability release closing out issues across inventory, access control, and checkout together." },
          ],
        }],
      },
      {
        month: "November",
        releases: [
          {
            version: "2.3", date: "November 2023",
            newFeatures: [
              { title: "Console Connect Locations", description: "Added Console Connect locations, port ordering, and services/product details. Customers with an existing Console Connect relationship can now browse and order into the same catalogue of locations directly from Polarin, rather than coordinating the connection separately." },
            ],
            improvements: [
              { title: "Partner & SLA expansion", description: "Expanded MDF, partner-portal, revenue-forecast, SLA, virtual-router, connection-type, and opportunity work. This release broadened partner-facing tooling and forecasting capability at the same time as extending SLA and Virtual Router functionality." },
            ],
            bugFixes: [
              { title: "Billing & display fixes", description: "Fixed BGP display, PAYG pricing, billing entities, duplicate states, cloud-flow failures, email delivery, VR status transitions, and billing fields. These fixes addressed a cluster of billing-accuracy and display issues reported shortly after the previous release." },
            ],
          },
          {
            version: "2.2", date: "November 2023",
            newFeatures: [
              { title: "In-Platform Quotations", description: "Added quotations directly in the platform, along with subscription filtering and sorting, subscription details, and new Test/Sales organisation types. Quotes previously lived outside the platform and were attached to an account manually; they can now be created, tracked, and referenced natively alongside the rest of an account's data." },
              { title: "Cloud Decommissioning", description: "Added cloud decommissioning, LOA email sharing, and channel-team notifications. Tearing down a cloud connection previously required manual coordination between teams; it can now be initiated and tracked through the platform, with the relevant channel team notified automatically." },
            ],
            improvements: [
              { title: "Invoicing & checkout", description: "Added BRM final invoices, invoice-guideline support, multi-country checkout, and multi-PO accounts. Customers operating across more than one country can now complete checkout and manage multiple purchase orders within a single account, rather than needing separate accounts per country." },
            ],
            bugFixes: [
              { title: "Data & access fixes", description: "Addressed performance metrics, cloud-zone flags, document visibility, email formatting, AWS keys, and NSP data issues. These fixes focused on data accuracy and access control shortly after the invoicing and checkout changes above." },
            ],
          },
        ],
      },
      {
        month: "October",
        releases: [{
          version: "2.1", date: "October 2023",
          newFeatures: [
            { title: "Faster PAYG Deletion", description: "Added PAYG deletion for DC–DC services along with AWS SES email delivery. Removing a Pay-As-You-Go DC–DC service previously required a manual back-end step; it can now be deleted directly, and the switch to AWS SES improved the reliability of outbound platform emails at the same time." },
          ],
          improvements: [
            { title: "Component library refresh", description: "Updated the shared component library, including input states, dropdowns, country selection, pagination, and create-wizard layouts. This refresh touched UI building blocks used across the whole platform, so the improvements carried through into nearly every ordering and setup flow." },
            { title: "Billing traceability", description: "Added connection type to order payloads, quarterly billing classification, and billing-start-date capture. These changes made it significantly easier for customers and support to trace exactly how a bill was calculated after the fact, rather than piecing it together from several different places." },
          ],
          bugFixes: [
            { title: "Ordering & security fixes", description: "Improved VR deletion, Oracle service IDs, cross-connect ordering, special-character emails, LAG capacity, notification formatting, SonarQube security findings, and port display errors. Several of these fixes resolved security findings surfaced by automated code-scanning tooling." },
          ],
        }],
      },
      {
        month: "September",
        releases: [{
          version: "2.0", date: "September 2023",
          newFeatures: [
            { title: "UAE Market Launch", description: "Prepared the platform for UAE expansion, including currency, KYC, organisation, billing, location, and country-specific flows, plus dedicated UAE billing and invoicing. This was a major release that extended nearly every core workflow to support a second country, rather than simply adding UAE as another dropdown option." },
            { title: "Custom VC Quotes", description: "Added custom virtual-connection quotes and a redesigned Partner Portal. Customers with non-standard virtual-connection requirements can now receive a tailored quote, rather than being limited to the fixed pricing tiers available through standard ordering." },
          ],
          improvements: [
            { title: "Notification & metrics polish", description: "Improved LOA branding, rate-limit notifications, test-account notifications, and performance metrics. A focused quality pass that followed closely on the heels of the UAE launch, tightening up notifications and reporting across both markets." },
          ],
          bugFixes: [
            { title: "Multi-region fixes", description: "Fixed email formatting, activity logs, phone validation, BGP editing, currency selection, LAG pricing, cross-connect emails, and PAYG deletion. Several of these issues were specific to handling more than one currency and region correctly, surfaced directly by the UAE expansion work." },
          ],
        }],
      },
      {
        month: "August",
        releases: [
          {
            version: "1.9", date: "August 2023",
            newFeatures: [
              { title: "Invoice Management", description: "Added invoice-management states and corresponding invoice views in the Customer Portal. Customers can now track an invoice through its lifecycle — issued, due, paid, or overdue — directly from their own account, in a clear, simplified view." },
              { title: "Bank-Transfer Receipts", description: "Enabled receipt uploads for bank transfers and expanded TTSL partnership support. Customers paying by bank transfer previously had no way to confirm payment within the platform itself; they can now upload a receipt directly, speeding up reconciliation." },
              { title: "Order Dashboards", description: "Added Polarin order and cross-connect dashboards, reseller licensing, and digital CAF signatures. The new dashboards give a consolidated view of order and cross-connect activity, while digital CAF signatures remove the need to print, sign, and re-upload a physical form." },
            ],
            improvements: [
              { title: "Reporting improvements", description: "Improved MSA capture, notifications, and DECIX quotations. These changes made the information customers and partners receive more accurate and consistent." },
            ],
            bugFixes: [
              { title: "Billing & connectivity fixes", description: "Fixed demarcation, password-special-character, test-email, performance-metric, capacity, billing-state, and DC-to-DC issues. A broad fix list spanning authentication edge cases through to DC-to-DC connectivity reporting." },
            ],
          },
          {
            version: "1.8", date: "August 2023",
            newFeatures: [
              { title: "Temporary Rate-Limit Add-Ons", description: "Added temporary VC rate-limit add-ons and platform service notifications. Customers who only need extra bandwidth for a short period can now add a temporary rate-limit boost rather than upgrading to a permanently higher tier." },
              { title: "Flexible VLAN Pricing", description: "Allowed preferred VLAN IDs from 101–699 and introduced differential pricing. Customers with a preference for a specific VLAN ID range now have far more choice than the previous, narrower allowed range, with pricing that reflects the different tiers available." },
            ],
            improvements: [
              { title: "Security & inventory controls", description: "Added weak-lockout controls and individual LAG-port deletion. The lockout controls reduce the risk of repeated failed login attempts going unnoticed, while individual LAG-port deletion means a single misconfigured port no longer requires rebuilding the whole LAG." },
              { title: "Pricing & display polish", description: "Updated GCP zone tags, VLAN settings, pricing monitoring, GST display, and VR minimum rate limit. This release tightened up a number of customer-facing details that had been flagged as inconsistent since the UAE and India rollouts." },
            ],
            bugFixes: [
              { title: "Data accuracy fixes", description: "Fixed organisation-profile copy, port payload allocation, email units, pagination, and rate-limit validation. These were largely data-accuracy issues that had been quietly affecting a small number of accounts since earlier releases." },
            ],
          },
        ],
      },
      {
        month: "July",
        releases: [{
          version: "1.7", date: "July 2023",
          newFeatures: [
            { title: "Partner & Reseller Management", description: "Delivered Pacehub partner, sales-agent, and reseller management. This gave the partner ecosystem its own dedicated management tooling for the first time, rather than tracking partner relationships through spreadsheets and email." },
            { title: "Expanded PAYG Coverage", description: "Enabled PAYG for DC–Cloud, VR–Cloud, and Cloud–Cloud scenarios. Pay-As-You-Go pricing had previously been limited to DC–DC and DC–VR connections; it now covers every major cloud-connectivity combination customers commonly need." },
            { title: "LAG Creation", description: "Added Link Aggregation Group creation, real-time inventory, and reference names. Customers can now combine multiple physical ports into a single logical LAG directly through self-service ordering, with real-time inventory reflecting exactly what's available." },
          ],
          improvements: [
            { title: "Ordering polish", description: "Added cross-connect ordering, PO display, improved journey templates, pricing summaries, and service side panels. Together these changes made the end-to-end ordering journey noticeably smoother, particularly for orders involving a cross-connect." },
            { title: "Visibility upgrades", description: "Added subscriber notifications, performance metrics, partner approvals, and support for multiple cross-connects on a single order. Customers ordering several cross-connects at once no longer need to submit separate orders for each one." },
          ],
          bugFixes: [
            { title: "Not a single bug this time", description: "We'll take the quiet win. A busy feature release for partner management and PAYG coverage went out without any issues reported.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "June",
        releases: [{
          version: "1.6", date: "June 2023",
          newFeatures: [
            { title: "More Cloud Connectivity", description: "Added manual Cloudflare, De-CIX, and Microsoft 365 connectivity. These three options extend the cloud and interconnect catalogue beyond the original hyperscaler-focused launch set, covering a CDN/security provider, an internet exchange, and a SaaS provider in one release." },
            { title: "Azure Multi-Connection Support", description: "Added Azure primary, secondary, and multipoint connections. Customers can now build redundant or multi-site Azure connectivity directly through self-service ordering, rather than being limited to a single primary connection per account." },
            { title: "New Lifecycle Emails", description: "Added welcome, live-connection, and service-event notification emails. These fill in gaps in customer lifecycle communication: a proper welcome message after signup, confirmation once a connection goes live, and alerts when an event affects one of their services." },
          ],
          improvements: [
            { title: "Streamlined organisation profiles", description: "Simplified the organisation-profile setup flow, removing steps that weren't adding value for most customers. New organisations now get through initial setup noticeably faster than before." },
            { title: "Smoother service creation", description: "Improved service creation, navigation, welcome screens, admin dashboards, and PO-number handling. A broad usability pass across the areas a new customer touches most in their first few sessions on the platform." },
          ],
          bugFixes: [
            { title: "Nothing broken, nothing fixed", description: "Just steady progress this month, with the team focused on the cloud connectivity and lifecycle email features above rather than bug fixes.", isEmptyState: true },
          ],
        }],
      },
      {
        month: "May",
        releases: [{
          version: "1.5", date: "May 2023",
          newFeatures: [
            { title: "Expanded VLAN & Peering Options", description: "Added tagged, untagged, and trunk VLAN types, Q-in-Q, Azure Peering Service, De-CIX connectivity, and automated IP allocation. This significantly broadened the networking options available during ordering, covering several VLAN configurations that enterprise customers had specifically been asking for." },
            { title: "Partner Portal Foundations", description: "Added partner onboarding, lead and opportunity management, and partner lead distribution. This laid the foundational tooling that the fuller Partner & Reseller Management feature, shipped two months later, would build directly on top of." },
          ],
          improvements: [
            { title: "Sharper VR validation", description: "Enhanced VR rate-limit validation against live inventory. This closed a class of ordering errors where a requested rate limit didn't actually match what was available." },
            { title: "Planned Polarin branding refresh", description: "Planned branding and UI/UX refresh work for the Partner Portal, ahead of the fuller partner-management capabilities due in upcoming releases. This was preparatory design and groundwork rather than a customer-facing change on its own." },
          ],
          bugFixes: [
            { title: "Cross-team fixes", description: "Fixed performance metrics, sales-assist, deployment, email, activity-log, and Help and Support issues. A broad fix list spanning nearly every team's area, cleaning up loose ends ahead of the Partner Portal work that followed." },
          ],
        }],
      },
      {
        month: "April",
        releases: [{
          version: "1.4", date: "April 2023",
          newFeatures: [
            { title: "End-to-End PAYG", description: "Added end-to-end Pay-As-You-Go for DC–DC and DC–VR virtual connections and virtual routers. This was the first release to offer true PAYG pricing rather than fixed-term contracts only, letting customers pay for exactly what they use on these connection types." },
            { title: "Helpdesk & Knowledge Base", description: "Introduced Helpdesk, support-case tracking, and Knowledge Base category, article, contact, and search views — in effect, the first version of the self-service support experience the platform still builds on today. Customers could now find answers and raise cases without needing a direct line to support." },
            { title: "Lifecycle Notifications", description: "Added notification emails for account, service, invoice, payment, and user-management events. Before this, many of these events happened silently from the customer's point of view; they now get a clear email trail for the things that matter most to their account." },
          ],
          improvements: [
            { title: "Platform clean-up", description: "Improved inventory, performance-data cleanup, API error handling, navigation, pricing, activity logs, Captcha, invoices, and cloud-status updates. A wide-reaching quality pass that touched nearly every corner of the platform ahead of the PAYG and Helpdesk launches in the same release." },
          ],
          bugFixes: [
            { title: "Known issue: PAYG suspension", description: "PAYG suspension was not yet covered by this release, meaning a Pay-As-You-Go service could not yet be temporarily suspended rather than fully terminated. This was flagged openly as a known gap to be addressed in a future release rather than fixed silently." },
          ],
        }],
      },
      {
        month: "March",
        releases: [
          {
            version: "1.3", date: "March 2023",
            newFeatures: [
              { title: "Two-Factor Authentication", description: "Implemented TOTP-based two-factor authentication with backup codes, device recovery, and deregistration. This was the platform's first major security feature beyond password login, giving customers a standard authenticator-app-based second factor along with a safety net of backup codes if they lose access to their device." },
              { title: "Help & Support Module", description: "Added Help and Support, case creation, and service-ordering improvements. This was an early version of the support experience that the fuller Helpdesk and Knowledge Base feature, shipped the following month, would significantly expand on." },
              { title: "L2/L3 Performance Dashboards", description: "Introduced L2/L3 performance metrics and data-centre dashboards. Customers could now see performance data for their Layer 2 and Layer 3 services directly on the platform instead of requesting it from support." },
            ],
            improvements: [
              { title: "Virtual connection upgrades", description: "Added virtual-connection upgrades, price-breakup displays, VR updates, and cloud-flow changes. Customers gained the ability to upgrade an existing virtual connection in place, rather than needing to order a new one and decommission the old." },
              { title: "Stronger account security", description: "Strengthened password reuse controls, account lockout, user reactivation, and deletion. These changes closed out a number of basic account-security gaps identified ahead of the two-factor authentication launch in the same release." },
              { title: "Onboarding refinements", description: "Improved organisation setup, international phone numbers, and optional identity documents. International customers in particular benefited from phone number formats that now worked correctly for their country." },
              { title: "Platform hardening", description: "Added router-provision templates, MSA acceptance, activity-log improvements, Recaptcha, CSP headers, and session invalidation. A broad security- and reliability-hardening pass, including bot protection via Recaptcha and stricter session handling." },
            ],
            bugFixes: [
              { title: "Known issues", description: "Known issues included VR updates, service deletion, selected network-diagram cases, and user-access permissions. These were disclosed openly alongside the release rather than silently deferred, so customers knew what to expect ahead of a fix." },
            ],
          },
          {
            version: "1.2", date: "March 3, 2023",
            newFeatures: [
              { title: "GCP Zone Visibility", description: "Added GCP zone information and corrected cloud-to-cloud available bandwidth display. Customers connecting to Google Cloud could now see exactly which zone they were provisioning into, rather than an ambiguous region-level label." },
              { title: "Inventory Utilisation Alerts", description: "Added inventory filters and threshold highlighting above 70% utilisation. Customers browsing locations can now see when a facility is approaching capacity at a glance, instead of only finding out when their order fails." },
              { title: "Signup Email Verification", description: "Added email verification before signup. This closed a gap where accounts could previously be created with an unverified or mistyped email address, which had been causing downstream delivery and account-recovery problems." },
              { title: "Secure File Handling", description: "Added file metadata removal and malware scanning before upload. Any file a customer uploads is now scanned and stripped of potentially sensitive metadata before it's stored, reducing both a security and a privacy risk." },
            ],
            improvements: [
              { title: "Enhanced AWS L3 flow", description: "Enhanced AWS L3 flow with BGP updates. These changes made it easier to update BGP configuration for an existing AWS Layer 3 connection without needing to recreate it from scratch." },
              { title: "Refreshed activity views", description: "Updated performance graphs, welcome screens, and activity logs. These were largely visual and usability refinements to screens customers see frequently in their day-to-day use of the platform." },
              { title: "VR and location APIs", description: "Completed backend support for Virtual Router deletion and location search APIs. This groundwork enabled cleaner VR deletion flows and faster, more accurate location search in subsequent releases." },
            ],
            bugFixes: [
              { title: "Clean as a whistle", description: "Nothing to fix in this release — a rare quiet patch between the bigger feature pushes either side of it.", isEmptyState: true },
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
              { title: "Azure & Oracle Connectivity", description: "Added Azure L2, Oracle L2, and Oracle L3 connectivity options. This was the first expansion of cloud connectivity beyond whatever the initial 1.0 launch supported, bringing two of the major hyperscalers into the self-service catalogue." },
            ],
            improvements: [
              { title: "Richer organisation profiles", description: "Expanded organisation profiles with CAF-required fields and added customer user-role management. Organisations could now capture the additional fields required for a Customer Application Form directly within their profile, rather than handling it as a separate document." },
            ],
            bugFixes: [
              { title: "Minor fixes and polish", description: "Delivered minor bug fixes and cosmetic improvements across the portal. A routine stabilisation release following shortly after the initial 1.0 launch, smoothing out early rough edges found in production." },
            ],
          },
          {
            version: "1.0", date: "January 2023",
            newFeatures: [
              { title: "Customer Portal Launch", description: "Self-service signup and organisation setup, profile management (contact number, password, profile picture), and role-based access for Network Admin, Finance Admin, and Support users. This was the platform's original launch release — the very first version of the Customer Portal that every subsequent feature in this changelog has been built on top of." },
              { title: "Core Service Ordering", description: "Order Ports, Virtual Connections, Virtual Routers, and cloud connectivity directly from the portal. From day one, the core self-service ordering experience covered all four of the platform's foundational service types." },
              { title: "Billing and Subscriptions", description: "View subscription history with start dates and terms, plus invoice history with credit-card payment via CC Avenue. This gave customers a single place to see what they'd ordered, when it started, and to pay their invoices online rather than through an offline process." },
              { title: "Performance Visibility", description: "Track errors, traffic, packets, and power-level metrics, with a network diagram showing customer connectivity. Even at launch, customers had direct visibility into how their services were performing, rather than relying entirely on support for that information." },
            ],
            improvements: [],
            bugFixes: [
              { title: "Nothing to fix on day one", description: "Brand new platform, brand new bug tracker — completely empty. Every bug fix in every release since this one started from this exact blank slate.", isEmptyState: true },
            ],
          },
        ],
      },
    ],
  },
];

const ALL_YEARS = ALL_RELEASE_DATA.map((d) => d.year);

// Data is authored newest-first at every level (years, months within a year,
// releases within a month), so the "latest" release is always the very first
// one reachable — computed here instead of hardcoded so it never needs manual
// sync when the data changes.
const LATEST_YEAR_DATA = ALL_RELEASE_DATA[0];
const LATEST_MONTH_DATA = LATEST_YEAR_DATA.months[0];
const LATEST_RELEASE = LATEST_MONTH_DATA.releases[0];

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
  const isEmpty = items.length === 1 && items[0].isEmptyState;

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
            {isEmpty ? "No updates" : `${items.length} Updates`}
          </span>
        </div>
        {isOpen
          ? <ChevronUp size={24} color="#90a2b9" style={{ flexShrink: 0 }} />
          : <ChevronDown size={24} color="#90a2b9" style={{ flexShrink: 0 }} />}
      </button>
      {isOpen && (
        <div style={{ background: "#f8fafc", padding: "16px 24px 24px" }}>
          {isEmpty ? (
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, lineHeight: "22px", color: "#90a2b9", fontStyle: "italic" }}>
              {items[0].description}
            </p>
          ) : (
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, i) => (
              <li key={i} style={{ fontFamily: FONT, fontSize: 14, lineHeight: "22px", color: "#0a3954" }}>
                <strong style={{ fontWeight: 700 }}>{item.title}</strong>
                {" — "}
                <span style={{ fontWeight: 400 }}>{item.description}</span>
              </li>
            ))}
          </ul>
          )}
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

  const [selectedYear, setSelectedYear] = useState<number>(LATEST_YEAR_DATA.year);
  const [selectedMonth, setSelectedMonth] = useState<string>(LATEST_MONTH_DATA.month);
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const key = `${LATEST_YEAR_DATA.year}-${LATEST_MONTH_DATA.month}-${LATEST_RELEASE.version}`;
    const s = new Set<string>();
    (["newFeatures", "improvements", "bugFixes"] as SectionType[]).forEach((sk) => {
      if (LATEST_RELEASE[sk].length > 0) s.add(`${key}-${sk}`);
    });
    return s;
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const suppressObserver = useRef(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);

  // Stable ref to selected month — avoids a stale closure inside the observer
  const selectedMonthRef = useRef(selectedMonth);
  useEffect(() => { selectedMonthRef.current = selectedMonth; }, [selectedMonth]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Only the selected year's months are ever rendered — the page shows one
  // year at a time, not a continuous multi-year scroll.
  const yearData = ALL_RELEASE_DATA.find((d) => d.year === selectedYear) ?? LATEST_YEAR_DATA;
  const monthOptions = yearData.months.map((m) => m.month);

  // Re-wired whenever the selected year changes, since that's when the set
  // of month sections in the DOM actually changes.
  //
  // root is intentionally `null` (the browser viewport), not contentRef:
  // contentRef carries `overflow-y: auto` but its content never actually
  // exceeds its own box — an ancestor further up the KB layout is the one
  // that really scrolls. Per spec, any element with overflow != visible
  // still counts as a scroll container even when nothing overflows it, so
  // using contentRef as `root` here (or as position:sticky's reference
  // frame) silently no-ops instead of erroring. The viewport is what
  // actually moves, so that's the correct root.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const month = (visible[0].target as HTMLElement).dataset.month ?? "";
        if (month && month !== selectedMonthRef.current) setSelectedMonth(month);
      },
      { root: null, threshold: 0.05, rootMargin: "0px 0px -55% 0px" }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selectedYear]);

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
    const firstMonth = ALL_RELEASE_DATA.find((d) => d.year === year)?.months[0]?.month ?? "";
    setSelectedMonth(firstMonth);
    setTimeout(() => { suppressObserver.current = false; }, 500);
  };

  // Switching years swaps out the whole list — land on the top of the new
  // year, which (months are authored newest-first) is always its most
  // recently updated month. Runs after render, once the new year's section
  // refs exist. scrollIntoView (not contentRef.scrollTo) because it finds
  // whichever ancestor actually scrolls without us needing to know which one
  // that is.
  //
  // Skipped on the very first run (initial mount/page load/refresh): the
  // page already renders at the top showing the latest year and month by
  // default, so there's nothing to scroll to yet — doing it anyway produced
  // a visible, unwanted scroll animation every time the page first loaded.
  const isFirstYearEffect = useRef(true);
  useEffect(() => {
    if (isFirstYearEffect.current) {
      isFirstYearEffect.current = false;
      return;
    }
    const firstMonth = yearData.months[0]?.month;
    if (!firstMonth) return;
    sectionRefs.current.get(`${selectedYear}-${firstMonth}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const handleMonthChange = (val: string) => {
    suppressObserver.current = true;
    setSelectedMonth(val);
    const el = sectionRefs.current.get(`${selectedYear}-${val}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { suppressObserver.current = false; }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* ── Scrollable content ── */}
      <div
        ref={contentRef}
        style={{ flex: 1, minHeight: 0, padding: isMobile ? "24px 16px 40px" : "32px 32px 60px" }}
      >
        {/* Page header */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 28 }}>
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

        {/* ── Filter bar — below the title, sticks to the top of the
            scroll area once you scroll past the header. Negative horizontal
            margins cancel the content area's own padding so it stays
            full-bleed while stuck. ── */}
        <div
          style={{
            position: "sticky",
            // The actual scrolling ancestor (outside this component, in the
            // shared KB layout) has a permanent 16px top padding that never
            // scrolls away — with `top: 0` the bar sticks just below it,
            // leaving a visible gap above it. Pulling up by that same amount
            // makes it sit flush instead.
            top: -16,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 16 : 32,
            margin: isMobile ? "0 -16px 24px" : "0 -32px 32px",
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

        {/* Selected year's months — always rendered (not gated behind
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
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {yearData.months.map((monthData) => (
              <div
                key={monthData.month}
                ref={setSectionRef(`${selectedYear}-${monthData.month}`)}
                data-month={monthData.month}
              >
                <p style={{ margin: "0 0 16px", fontFamily: FONT, fontWeight: 700, fontSize: 14, lineHeight: "22px", color: "#90a2b9" }}>
                  {monthData.month}, {selectedYear}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {monthData.releases.map((release) => (
                    <VersionCard
                      key={release.version}
                      release={release}
                      versionKey={`${selectedYear}-${monthData.month}-${release.version}`}
                      openSections={openSections}
                      toggleSection={toggleSection}
                    />
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
