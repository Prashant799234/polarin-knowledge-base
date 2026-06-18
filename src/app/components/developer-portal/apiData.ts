export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type Crud = "C" | "R" | "U" | "D";
export type UATStatus = "poc" | "build";

export interface EndpointParam {
  name: string;
  in: "header" | "query" | "path" | "body";
  required: boolean;
  type: string;
  description: string;
  example?: string;
}

export interface Endpoint {
  name: string;
  method: Method;
  crud: Crud;
  desc: string;
  status: UATStatus;
  path?: string;
  params?: EndpointParam[];
  responseExample?: string;
}

export interface SubModuleData {
  id: string;
  moduleId: string;
  label: string;
  endpoints: Endpoint[];
}

export const ALL_SUB_MODULES: SubModuleData[] = [
  {
    id: "auth-login",
    moduleId: "mod-authentication",
    label: "Login",
    endpoints: [
      { name: "User Login", method: "POST", crud: "C", desc: "Authenticate user credentials, return JWT + refresh token. Max 5 failed attempts before lockout.", status: "poc" },
      { name: "User Logout", method: "POST", crud: "D", desc: "Invalidate JWT, blacklist access token, delete refresh token.", status: "build" },
      { name: "Admin SSO Login", method: "POST", crud: "C", desc: "Authenticate admin via SSO (email domain whitelist).", status: "build" },
      { name: "SAML Authentication Callback", method: "GET", crud: "R", desc: "Handle SAML callback after SSO; redirect to home on success.", status: "build" },
    ],
  },
  {
    id: "auth-token",
    moduleId: "mod-authentication",
    label: "Token",
    endpoints: [
      { name: "Refresh Access Token", method: "POST", crud: "C", desc: "Exchange valid refresh token for new access token.", status: "build" },
      { name: "Check Password Expiry", method: "POST", crud: "R", desc: "Check if user password expired (older than 90 days).", status: "build" },
    ],
  },
  {
    id: "auth-password",
    moduleId: "mod-authentication",
    label: "Password",
    endpoints: [
      { name: "Forgot Password — Send Reset Link", method: "POST", crud: "C", desc: "Generate password reset link and email it to user.", status: "build" },
      { name: "Reset Password via Token", method: "POST", crud: "U", desc: "Reset password using token from email link.", status: "build" },
      { name: "Change Password (Logged In)", method: "POST", crud: "U", desc: "Change password using old password for verification.", status: "build" },
    ],
  },
  {
    id: "auth-registration",
    moduleId: "mod-authentication",
    label: "Registration",
    endpoints: [
      { name: "Register New User", method: "POST", crud: "C", desc: "Self-registration: validate email, encrypt password, add to LDAP, send activation email.", status: "build" },
      { name: "Verify Email via Token", method: "GET", crud: "U", desc: "Confirm email address using activation token from email link.", status: "build" },
      { name: "Get Verification Token by Email", method: "GET", crud: "R", desc: "Retrieve existing verification token for a user by email.", status: "build" },
      { name: "Resend Activation Email (Self)", method: "POST", crud: "C", desc: "Resend activation link to authenticated user (rate limited).", status: "build" },
    ],
  },
  {
    id: "mfa-totp-setup",
    moduleId: "mod-mfa",
    label: "TOTP Setup",
    endpoints: [
      { name: "Register MFA Device (Generate QR)", method: "POST", crud: "C", desc: "Generate TOTP secret + Base64 QR code for authenticator app setup.", status: "build" },
      { name: "Complete TOTP 2FA Setup", method: "POST", crud: "C", desc: "Validate TOTP code to enable MFA; generate new auth token.", status: "build" },
      { name: "Deregister (Disable) MFA", method: "POST", crud: "D", desc: "Disable TOTP MFA after validating current OTP or backup code.", status: "build" },
      { name: "Get Backup Codes", method: "POST", crud: "R", desc: "Retrieve backup codes for TOTP (requires valid TOTP to access).", status: "build" },
    ],
  },
  {
    id: "mfa-totp-login",
    moduleId: "mod-mfa",
    label: "TOTP Login",
    endpoints: [
      { name: "Validate TOTP During Login", method: "POST", crud: "R", desc: "Verify TOTP or backup code during login; issue auth token if valid.", status: "poc" },
      { name: "Validate 2FA OTP (Any Method)", method: "POST", crud: "R", desc: "Validate OTP for any 2FA method: TOTP, EMAIL, or BACKUP CODE.", status: "build" },
    ],
  },
  {
    id: "mfa-email",
    moduleId: "mod-mfa",
    label: "Email MFA",
    endpoints: [
      { name: "Setup Email MFA — Send OTP", method: "POST", crud: "C", desc: "Send OTP to user email to initiate Email MFA setup.", status: "build" },
      { name: "Complete Email MFA Setup", method: "POST", crud: "C", desc: "Verify OTP to complete Email MFA registration.", status: "build" },
      { name: "Send OTP to Deregister Email MFA", method: "POST", crud: "C", desc: "Send OTP to user's email to begin Email MFA deregistration.", status: "build" },
      { name: "Verify OTP for Email MFA Deregistration", method: "POST", crud: "D", desc: "Verify OTP to complete Email MFA deregistration.", status: "build" },
    ],
  },
  {
    id: "mfa-recovery",
    moduleId: "mod-mfa",
    label: "Recovery",
    endpoints: [
      { name: "Initiate MFA Lost Device Recovery", method: "GET", crud: "C", desc: "Send one-time access code to email for MFA recovery on lost device.", status: "build" },
      { name: "Reset MFA After Lost Device", method: "POST", crud: "U", desc: "Validate access code from email; disable MFA for user.", status: "build" },
    ],
  },
  {
    id: "mfa-status",
    moduleId: "mod-mfa",
    label: "Status",
    endpoints: [
      { name: "Get MFA Status for User", method: "GET", crud: "R", desc: "Return user's current MFA status, variant, and primary method.", status: "build" },
    ],
  },
  {
    id: "mfa-admin",
    moduleId: "mod-mfa",
    label: "Admin",
    endpoints: [
      { name: "List Users with TOTP 2FA", method: "POST", crud: "R", desc: "Paginated list of users with TOTP-based 2FA (admin view).", status: "build" },
    ],
  },
  {
    id: "users-profile",
    moduleId: "mod-users",
    label: "Profile",
    endpoints: [
      { name: "Get Authenticated User Profile", method: "GET", crud: "R", desc: "Return profile, org KYC status, role, module access for logged-in user.", status: "build" },
      { name: "Update Authenticated User Profile", method: "PUT", crud: "U", desc: "Update contact number, org name, name, role. Logs changes.", status: "build" },
      { name: "Get User Profile by ID (Admin)", method: "GET", crud: "R", desc: "Admin function: retrieve any user's profile by userId.", status: "build" },
      { name: "Get User Profile Image", method: "GET", crud: "R", desc: "Retrieve metadata for user's profile image.", status: "build" },
      { name: "Upload User Profile Image", method: "POST", crud: "C", desc: "Upload profile image to S3. Validates type and size (25MB max).", status: "build" },
      { name: "Delete User Profile Image", method: "DELETE", crud: "D", desc: "Remove user's profile image from S3 and database.", status: "build" },
    ],
  },
  {
    id: "users-admin",
    moduleId: "mod-users",
    label: "User Admin",
    endpoints: [
      { name: "Add New User (Invite)", method: "POST", crud: "C", desc: "Create user account, assign role, send activation email.", status: "build" },
      { name: "Update User Role by ID", method: "PUT", crud: "U", desc: "Assign new role to existing user by userId.", status: "build" },
      { name: "Deactivate User Account", method: "POST", crud: "U", desc: "Deactivate user: update status, delete tokens, send alert to admins.", status: "build" },
      { name: "Reactivate User Account", method: "POST", crud: "U", desc: "Reactivate user: update status, send alert to admins.", status: "build" },
      { name: "Resend Invitation Email", method: "POST", crud: "C", desc: "Resend account activation/invitation link to user.", status: "build" },
      { name: "Verify Invitation Token", method: "GET", crud: "R", desc: "Check if invitation token is valid and not expired.", status: "build" },
      { name: "Verify Invited User Email & Set Password", method: "POST", crud: "U", desc: "Confirm invited user account via token; allow setting password.", status: "build" },
      { name: "Delete User", method: "DELETE", crud: "D", desc: "Permanently delete a user account.", status: "build" },
      { name: "List All Users (Paginated)", method: "GET", crud: "R", desc: "Admin: paginated list of users with role/status filters.", status: "build" },
      { name: "Update Partner Customer Details", method: "PUT", crud: "U", desc: "Update email, name, password, phone for partner customer user.", status: "build" },
    ],
  },
  {
    id: "users-roles",
    moduleId: "mod-users",
    label: "Roles",
    endpoints: [
      { name: "Get All Roles List", method: "GET", crud: "R", desc: "Retrieve all defined user roles in the system.", status: "build" },
    ],
  },
  {
    id: "users-impersonation",
    moduleId: "mod-users",
    label: "Impersonation",
    endpoints: [
      { name: "Customer Impersonation Login", method: "POST", crud: "C", desc: "Admin logs in as a customer for support/troubleshooting.", status: "build" },
      { name: "Impersonation Logout", method: "GET", crud: "D", desc: "End impersonation session.", status: "build" },
    ],
  },
  {
    id: "activity-logs",
    moduleId: "mod-activity",
    label: "Logs",
    endpoints: [
      { name: "Get All Activity Logs (Paginated)", method: "GET", crud: "R", desc: "Paginated activity log with filters: service, event, initiatedBy, severity, date range.", status: "build" },
      { name: "Get Activity Log Detail by ID", method: "GET", crud: "R", desc: "Retrieve old and new values for a specific activity log entry.", status: "build" },
      { name: "Monthly Subscriber Notification (Scheduler)", method: "GET", crud: "C", desc: "Sends monthly notification emails to subscribers based on active circuits.", status: "build" },
    ],
  },
  {
    id: "org-profile",
    moduleId: "mod-org",
    label: "Profile",
    endpoints: [
      { name: "Get Organization Details", method: "GET", crud: "R", desc: "Return organization details for the authenticated user's org.", status: "build" },
      { name: "Update Organization Details", method: "PUT", crud: "U", desc: "Update org details; sync with CRM.", status: "build" },
      { name: "Create Organization", method: "POST", crud: "C", desc: "Create new organization record.", status: "build" },
      { name: "Get Organization by ID", method: "GET", crud: "R", desc: "Fetch specific organization by orgId.", status: "build" },
    ],
  },
  {
    id: "org-terms",
    moduleId: "mod-org",
    label: "Terms & Conditions",
    endpoints: [
      { name: "Accept Terms & Conditions via Email", method: "GET", crud: "U", desc: "Accept T&C via email link (token-validated).", status: "build" },
    ],
  },
  {
    id: "org-po",
    moduleId: "mod-org",
    label: "PO Settings",
    endpoints: [
      { name: "Update PO Required for Org", method: "PUT", crud: "U", desc: "Toggle PO requirement on/off for an organization.", status: "build" },
    ],
  },
  {
    id: "org-disable",
    moduleId: "mod-org",
    label: "Disable",
    endpoints: [
      { name: "Disable Customer Organization", method: "POST", crud: "U", desc: "Deactivate org and all associated users (admin function).", status: "build" },
    ],
  },
  {
    id: "billing-profiles",
    moduleId: "mod-billing",
    label: "Profiles",
    endpoints: [
      { name: "Get All Billing Profiles", method: "GET", crud: "R", desc: "Retrieve all billing profiles for the authenticated user's organization.", status: "build" },
      { name: "Create Billing Profile", method: "POST", crud: "C", desc: "Create new billing profile. Validates GST (India-specific), sets default if flagged.", status: "build" },
      { name: "Update Billing Profile", method: "PUT", crud: "U", desc: "Update billing profile. Cannot change country/state/city/GST. Updates Salesforce.", status: "build" },
      { name: "Delete Billing Profile", method: "DELETE", crud: "D", desc: "Delete billing profile. Blocked if active subscriptions are linked.", status: "build" },
      { name: "Set Default Billing Profile", method: "POST", crud: "U", desc: "Mark a billing profile as default; deactivates previous default.", status: "build" },
    ],
  },
  {
    id: "billing-requirements",
    moduleId: "mod-billing",
    label: "Requirements",
    endpoints: [
      { name: "Get Billing Requirements by Country", method: "GET", crud: "R", desc: "Return country-specific billing labels, required documents, GST rules.", status: "build" },
    ],
  },
  {
    id: "invoice-list",
    moduleId: "mod-invoice",
    label: "Invoice List",
    endpoints: [
      { name: "List Invoices (Paginated)", method: "GET", crud: "R", desc: "Paginated invoice list filterable by billing profile, date, status, search.", status: "build" },
    ],
  },
  {
    id: "invoice-detail",
    moduleId: "mod-invoice",
    label: "Invoice Detail",
    endpoints: [
      { name: "Get Invoice Details", method: "GET", crud: "R", desc: "Full invoice details including billing profile and org info.", status: "build" },
      { name: "Validate Invoice by ID", method: "GET", crud: "R", desc: "Check invoice exists and has a valid invoice number.", status: "build" },
    ],
  },
  {
    id: "invoice-actions",
    moduleId: "mod-invoice",
    label: "Invoice Actions",
    endpoints: [
      { name: "Download Invoice PDF", method: "POST", crud: "R", desc: "Download invoice as PDF from BRM/external service.", status: "build" },
      { name: "Upload Payment Receipt", method: "POST", crud: "C", desc: "Upload payment receipt for an invoice; sets status to 'Awaiting Approval'.", status: "build" },
      { name: "Download Payment Receipt", method: "GET", crud: "R", desc: "Stream payment receipt file by fileId.", status: "build" },
    ],
  },
  {
    id: "invoice-history",
    moduleId: "mod-invoice",
    label: "History",
    endpoints: [
      { name: "Get Invoice Status History", method: "GET", crud: "R", desc: "Chronological log of status changes for an invoice.", status: "build" },
    ],
  },
  {
    id: "pricing-estimate",
    moduleId: "mod-pricing",
    label: "Price Estimate",
    endpoints: [
      { name: "Get Price Estimate for Product", method: "GET", crud: "R", desc: "Calculate price for Port, VC, VR, Cloud, IX, M365, CloudFlare. Supports PAYG and term.", status: "build" },
      { name: "Fetch DC Price Estimate", method: "POST", crud: "R", desc: "Fetch price estimates for multiple DC services in one request.", status: "build" },
      { name: "Fetch GDCI Price Estimate", method: "POST", crud: "R", desc: "Fetch price estimates for GDCI (Global DC Interconnect) services.", status: "build" },
    ],
  },
  {
    id: "pricing-reporting",
    moduleId: "mod-pricing",
    label: "Reporting Price",
    endpoints: [
      { name: "Fetch Reporting Price", method: "GET", crud: "R", desc: "Get reporting-type pricing by reportingType and currency.", status: "build" },
    ],
  },
  {
    id: "pricing-coupons",
    moduleId: "mod-pricing",
    label: "Coupons",
    endpoints: [
      { name: "Get Available Coupons for Product", method: "GET", crud: "R", desc: "Fetch valid promotions for a product. Validates org eligibility and usage history.", status: "build" },
      { name: "Verify Coupon Code", method: "POST", crud: "R", desc: "Verify coupon validity, active status, dates, and associated products.", status: "build" },
    ],
  },
  {
    id: "loc-list",
    moduleId: "mod-locations",
    label: "List",
    endpoints: [
      { name: "List All Locations", method: "GET", crud: "R", desc: "Fetch all DC locations. Filterable by serviceType, countryId, partner, orgId.", status: "build" },
      { name: "List All Partner Locations", method: "GET", crud: "R", desc: "Fetch locations for Port, VC, VA. serviceTypes: DC, VA, VIRTUAL-ROUTER, AZURE.", status: "build" },
      { name: "Get Locations (Standardized DC Names)", method: "GET", crud: "R", desc: "Portal-facing locations API with standardized DC names.", status: "build" },
    ],
  },
  {
    id: "loc-detail",
    moduleId: "mod-locations",
    label: "Detail",
    endpoints: [
      { name: "Get Location by ID", method: "GET", crud: "R", desc: "Get a single location's details by locationId.", status: "build" },
    ],
  },
  {
    id: "loc-search",
    moduleId: "mod-locations",
    label: "Search",
    endpoints: [
      { name: "Search Locations", method: "GET", crud: "R", desc: "Find locations matching a search string. Returns standardized names.", status: "build" },
    ],
  },
  {
    id: "loc-filter",
    moduleId: "mod-locations",
    label: "Filter",
    endpoints: [
      { name: "Get Cities for Services", method: "GET", crud: "R", desc: "Get distinct cities where Port, VC, VR services exist (for dashboard filters).", status: "build" },
    ],
  },
  {
    id: "loc-special",
    moduleId: "mod-locations",
    label: "Special",
    endpoints: [
      { name: "Get On-Ramp Locations", method: "GET", crud: "R", desc: "Fetch partner on-ramp locations with service type codes.", status: "build" },
      { name: "Get Cloud Interconnect Locations", method: "GET", crud: "R", desc: "Validate cloud service key (Azure/Oracle) and return eligible interconnect locations.", status: "build" },
      { name: "Get Oracle OCID Locations", method: "GET", crud: "R", desc: "Validate Oracle OCID and return eligible Oracle interconnect locations.", status: "build" },
    ],
  },
  {
    id: "loc-public",
    moduleId: "mod-locations",
    label: "Public",
    endpoints: [
      { name: "Get Web Locations (Public, No Auth)", method: "GET", crud: "R", desc: "Public endpoint: location data for marketing/web (no authentication required).", status: "build" },
    ],
  },
  {
    id: "ports-order",
    moduleId: "mod-ports",
    label: "Order",
    endpoints: [
      { name: "Create Order (Port / VR / VC / Cloud / VA)", method: "POST", crud: "C", desc: "Main ordering endpoint. Supports Port, VR, VC, AWS, GCP, Azure, Oracle, VA. Handles draft and final orders.", status: "build" },
      { name: "Update Order (Bandwidth Change on VC)", method: "PUT", crud: "U", desc: "Modify bandwidth on live VC. Validates capacity, updates ports, triggers CRM modify order.", status: "build" },
      { name: "Create Cloud-to-Cloud Order", method: "POST", crud: "C", desc: "Create Cloud-to-Cloud virtual connection (primary + secondary VC legs).", status: "build" },
    ],
  },
  {
    id: "ports-qualification",
    moduleId: "mod-ports",
    label: "Qualification",
    endpoints: [
      { name: "Check Service Qualification / Feasibility", method: "POST", crud: "R", desc: "Check if Port, Cloud Router, or cloud service is feasible at a location.", status: "build" },
      { name: "Port Feasibility Check at Location", method: "GET", crud: "R", desc: "Check available ports at a location for requested bandwidth and LAG.", status: "build" },
      { name: "Validate Azure Service Key", method: "POST", crud: "R", desc: "Validate Azure service key and return eligible Azure locations.", status: "build" },
    ],
  },
  {
    id: "ports-poc",
    moduleId: "mod-ports",
    label: "POC Upgrade",
    endpoints: [
      { name: "Upgrade POC to Full Subscription", method: "POST", crud: "U", desc: "Convert POC Port/VR/VC to a standard billable subscription.", status: "build" },
    ],
  },
  {
    id: "ports-lag",
    moduleId: "mod-ports",
    label: "LAG",
    endpoints: [
      { name: "Add Ports to LAG", method: "POST", crud: "C", desc: "Add member ports to an existing LAG group. Validates eligibility and no duplicates.", status: "build" },
      { name: "De-link Port from LAG", method: "DELETE", crud: "D", desc: "Remove a member port from a LAG. Checks remaining bandwidth can support active VCs.", status: "build" },
    ],
  },
  {
    id: "ports-bgp",
    moduleId: "mod-ports",
    label: "BGP",
    endpoints: [
      { name: "Update BGP Config for VC", method: "POST", crud: "U", desc: "Update BGP configuration for a Virtual Connection (hosted connections only).", status: "build" },
    ],
  },
  {
    id: "ports-loa",
    moduleId: "mod-ports",
    label: "LOA",
    endpoints: [
      { name: "Download LOA for Port", method: "POST", crud: "R", desc: "Generate and download Letter of Authorization PDF for a port (valid 90 days).", status: "build" },
      { name: "Email LOA Document", method: "POST", crud: "C", desc: "Send LOA document via email to specified recipients.", status: "build" },
      { name: "Download Router Config Template", method: "POST", crud: "R", desc: "Download router config template (includes PE IP, BGP, VLAN info).", status: "build" },
    ],
  },
  {
    id: "ports-xconnect",
    moduleId: "mod-ports",
    label: "Cross Connect",
    endpoints: [
      { name: "Create Cross Connect", method: "POST", crud: "C", desc: "Create cross-connect between two ports. Validates availability, VLANs, bandwidth.", status: "build" },
    ],
  },
  {
    id: "ports-delete",
    moduleId: "mod-ports",
    label: "Delete",
    endpoints: [
      { name: "Delete Port / Circuit / Router", method: "DELETE", crud: "D", desc: "Decommission a port, virtual circuit, or virtual router.", status: "build" },
    ],
  },
  {
    id: "vr-macd",
    moduleId: "mod-vr",
    label: "Azure MACD",
    endpoints: [
      { name: "Check Azure Bandwidth Upgrade Availability", method: "GET", crud: "R", desc: "Check if bandwidth upgrade is available on Azure VC (compares Azure-side vs local).", status: "build" },
    ],
  },
  {
    id: "vr-order",
    moduleId: "mod-vr",
    label: "Order",
    endpoints: [
      { name: "Upgrade Virtual Router", method: "PUT", crud: "U", desc: "Upgrade VR bandwidth. Validates rate limit, fetches new pricing from CRM.", status: "build" },
    ],
  },
  {
    id: "vr-detail",
    moduleId: "mod-vr",
    label: "Detail",
    endpoints: [
      { name: "Get Virtual Router List (Paginated)", method: "GET", crud: "R", desc: "List VRs for the authenticated user with search, filter, sort, pagination.", status: "build" },
      { name: "Fetch Router Configuration", method: "GET", crud: "R", desc: "Retrieve VR details including DC, BGP config, and connected circuits.", status: "build" },
    ],
  },
  {
    id: "vr-filters",
    moduleId: "mod-vr",
    label: "Router Filters",
    endpoints: [
      { name: "Get All Router Filters", method: "GET", crud: "R", desc: "List all prefix filters configured for a Virtual Router (with VC apply status).", status: "build" },
      { name: "Create Router Filter", method: "POST", crud: "C", desc: "Create a new prefix filter for a VR with IP version, direction, and prefix rules.", status: "build" },
      { name: "Get Specific Router Filter", method: "GET", crud: "R", desc: "Retrieve a single filter's config including prefix rules.", status: "build" },
      { name: "Update Router Filter", method: "PUT", crud: "U", desc: "Modify existing prefix filter: direction and prefix rules (add/update/delete).", status: "build" },
      { name: "Delete Router Filter", method: "DELETE", crud: "D", desc: "Delete a single prefix filter by filterId.", status: "build" },
      { name: "Delete Multiple Router Filters", method: "DELETE", crud: "D", desc: "Delete multiple router filters by comma-separated filterIds.", status: "build" },
    ],
  },
  {
    id: "vr-apply",
    moduleId: "mod-vr",
    label: "Apply Filters",
    endpoints: [
      { name: "Get Applied Filters for VR", method: "GET", crud: "R", desc: "List filter applications on VCs linked to this VR with their enable/disable status.", status: "build" },
      { name: "Apply Router Filters to VC", method: "POST", crud: "C", desc: "Apply prefix filters to a Virtual Circuit. Triggers ActivePort API orchestration.", status: "build" },
      { name: "Enable / Disable Applied Filter", method: "PUT", crud: "U", desc: "Toggle an applied filter's status (Enabled/Disabled) via ActivePort API.", status: "build" },
    ],
  },
  {
    id: "vc-list",
    moduleId: "mod-vc",
    label: "List",
    endpoints: [
      { name: "List Virtual Connections (Paginated)", method: "GET", crud: "R", desc: "List VCs with search, filter, sort for authenticated user.", status: "build" },
    ],
  },
  {
    id: "vc-macd",
    moduleId: "mod-vc",
    label: "Bandwidth MACD",
    endpoints: [
      { name: "Modify VC Bandwidth (Temporary Add-On)", method: "POST", crud: "U", desc: "Add temporary bandwidth boost on top of base VC bandwidth.", status: "build" },
    ],
  },
  {
    id: "sk-keys",
    moduleId: "mod-service-keys",
    label: "Keys",
    endpoints: [
      { name: "Generate Service Key for Port", method: "POST", crud: "C", desc: "Create UUID-based service key for port. Defines bandwidth allocation and VLAN.", status: "build" },
      { name: "Update Service Key", method: "PUT", crud: "U", desc: "Modify reference name or bandwidth for an unused (Inactive) service key.", status: "build" },
      { name: "Validate Service Key", method: "GET", crud: "R", desc: "Verify service key exists and is Inactive (available for partner provisioning).", status: "build" },
      { name: "List All Service Keys for Port", method: "GET", crud: "R", desc: "Paginated list of all service keys for a given portId.", status: "build" },
    ],
  },
  {
    id: "sub-detail",
    moduleId: "mod-subscriptions",
    label: "Detail",
    endpoints: [
      { name: "List Subscriptions (Paginated)", method: "GET", crud: "R", desc: "Paginated subscriptions with filters: type, billing cycle, term, status, date range.", status: "build" },
      { name: "Get Subscription Details", method: "GET", crud: "R", desc: "Full details for a subscription including product-specific info.", status: "build" },
      { name: "Get Subscription Price Breakdown", method: "GET", crud: "R", desc: "Pricing details, status messages, and action button visibility for a subscription.", status: "build" },
      { name: "Get Subscription Action History", method: "GET", crud: "R", desc: "Log of all actions (upgrades, renewals, etc.) on a subscription.", status: "build" },
      { name: "Get Payment History for Subscription", method: "GET", crud: "R", desc: "Total paid/billed/pending amounts and payment history timeline.", status: "build" },
      { name: "Get PAYG Logs for Subscription", method: "GET", crud: "R", desc: "Pay-As-You-Go billing log history for a subscription.", status: "build" },
    ],
  },
  {
    id: "sub-lifecycle",
    moduleId: "mod-subscriptions",
    label: "Lifecycle",
    endpoints: [
      { name: "Initiate Subscription Termination", method: "POST", crud: "D", desc: "Begin termination process for a subscription.", status: "build" },
      { name: "Renew Subscription", method: "POST", crud: "U", desc: "Manually renew a subscription with new term and pricing.", status: "build" },
      { name: "Upgrade PAYG to Fixed Term", method: "PUT", crud: "U", desc: "Convert PAYG subscription to committed term. Supports dry run for price preview.", status: "build" },
      { name: "Get Details for Subscription Termination", method: "GET", crud: "R", desc: "Check if service is deletable (no active dependent connections).", status: "build" },
    ],
  },
  {
    id: "sub-po",
    moduleId: "mod-subscriptions",
    label: "PO Details",
    endpoints: [
      { name: "Update PO Details for Subscription", method: "POST", crud: "U", desc: "Attach or update Purchase Order number and documents for a service.", status: "build" },
    ],
  },
  {
    id: "sub-macd",
    moduleId: "mod-subscriptions",
    label: "MACD Pricing",
    endpoints: [
      { name: "Update MACD Price Revision Details", method: "POST", crud: "U", desc: "Update subscription pricing from CRM MACD orders (bandwidth changes, discounts).", status: "build" },
    ],
  },
  {
    id: "track-dashboard",
    moduleId: "mod-track-order",
    label: "Dashboard",
    endpoints: [
      { name: "Get All Project / Service Details (Dashboard)", method: "GET", crud: "R", desc: "Main service dashboard. Lists Ports, VRs, VCs, VAs with status, billing, filters.", status: "build" },
      { name: "Get POC Details for Service", method: "GET", crud: "R", desc: "Return POC status, message type, and upgrade eligibility for a service.", status: "build" },
    ],
  },
  {
    id: "track-timeline",
    moduleId: "mod-track-order",
    label: "Timeline",
    endpoints: [
      { name: "Get Service Status Timeline", method: "GET", crud: "R", desc: "Complete status change history with timestamps for timeline visualization.", status: "build" },
    ],
  },
  {
    id: "track-port",
    moduleId: "mod-track-order",
    label: "Port Detail",
    endpoints: [
      { name: "Get Port Info by ID", method: "GET", crud: "R", desc: "Retrieve port details: name, state, location, bandwidth, cross-connect.", status: "build" },
      { name: "List All Ports (Paginated)", method: "GET", crud: "R", desc: "Admin: paginated port list with search, filter, sort.", status: "build" },
      { name: "Get Available Ports at All Locations", method: "GET", crud: "R", desc: "Return list of available (unused) ports grouped by location.", status: "build" },
    ],
  },
  {
    id: "track-vc",
    moduleId: "mod-track-order",
    label: "VC Detail",
    endpoints: [
      { name: "Get Circuit Data by ID", method: "GET", crud: "R", desc: "Retrieve VC details: endpoints, bandwidth, BGP config, status.", status: "build" },
    ],
  },
  {
    id: "track-history",
    moduleId: "mod-track-order",
    label: "Service History",
    endpoints: [
      { name: "Get Service Modification History", method: "GET", crud: "R", desc: "Audit trail of MACD actions (upgrades, renewals) for a service.", status: "build" },
    ],
  },
  {
    id: "macd-bandwidth",
    moduleId: "mod-macd",
    label: "Bandwidth Change",
    endpoints: [
      { name: "Modify VC Bandwidth — Permanent Upgrade", method: "PUT", crud: "U", desc: "Permanent bandwidth upgrade on VC via CRM/Salesforce Modify order.", status: "build" },
      { name: "Modify VC Bandwidth — Temporary Add-On (Add)", method: "POST", crud: "C", desc: "Add temporary bandwidth boost on top of base VC bandwidth.", status: "build" },
      { name: "Upgrade Virtual Router Bandwidth", method: "PUT", crud: "U", desc: "Upgrade VR rate limit. Validates downgrade restrictions for non-PAYG.", status: "build" },
      { name: "Upgrade VA Internet Throughput", method: "PUT", crud: "U", desc: "Upgrade VA internet throughput. Supports dry run for price preview.", status: "build" },
    ],
  },
  {
    id: "macd-termination",
    moduleId: "mod-macd",
    label: "Termination",
    endpoints: [
      { name: "MACD Service Termination (from Salesforce)", method: "POST", crud: "D", desc: "Process service termination orders received from Salesforce/Vlocity.", status: "build" },
    ],
  },
  {
    id: "vista-port-metrics",
    moduleId: "mod-vista",
    label: "Port Metrics",
    endpoints: [
      {
        name: "Port Optical Power Level",
        method: "GET", crud: "R", status: "poc",
        path: "/api/power",
        desc: "Fetches optical power level details — Rx and Tx power with high/low alarm thresholds — for a specified circuit within a time range. All timestamps in the response are UTC.",
        params: [
          { name: "access-token", in: "header", required: true,  type: "string", description: "Authentication token for API access.",                                                                   example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true,  type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss. If only date provided, time defaults to 00:00:00.",       example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true,  type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss. If only date provided, time defaults to 00:00:00.",         example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true,  type: "string", description: "Unique identifier of the circuit.",                                                                      example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "100",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "minTxPower": "-5.0",\n    "maxTxPower": "-1.0",\n    "serviceName": "Sample Service",\n    "powerData": [\n      {\n        "timestamp": "2023-01-01 00:00:00",\n        "rxPower": "-7.5",\n        "rxPowerHighAlarm": "-2.0",\n        "rxPowerLowAlarm": "-10.0",\n        "txPower": "-3.0",\n        "txPowerHighAlarm": "-1.0",\n        "txPowerLowAlarm": "-5.0"\n      }\n    ]\n  }\n}`,
      },
      {
        name: "Port CRC Errors",
        method: "GET", crud: "R", status: "poc",
        path: "/api/errors",
        desc: "Retrieves CRC error details for a port within a date range. If dates are in yyyy-MM-dd format they are automatically appended with ' 00:00:00'. All timestamps are UTC.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Authentication token for API access.",                               example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss.",                      example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss.",                        example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",                                  example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "Success",\n  "_comment": "timestamps are in UTC",\n  "_size": "42",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "serviceName": "ExampleService",\n    "errors": [\n      {\n        "timestamp": "2023-01-01 10:00:00",\n        "inErrors": "10",\n        "outErrors": "5",\n        "crcAlignErrorsPeriodic": "2"\n      }\n    ]\n  }\n}`,
      },
    ],
  },
  {
    id: "vista-vc-metrics",
    moduleId: "mod-vista",
    label: "VC Metrics",
    endpoints: [
      {
        name: "Connection Traffic In/Out",
        method: "GET", crud: "R", status: "poc",
        path: "/api/traffic",
        desc: "Retrieves aggregated inbound/outbound traffic for a circuit within a date range. Returns average throughput, max/min inbound, service name, and a time-series list. Data unit is configurable (Kbps, Mbps, Gbps, Tbps).",
        params: [
          { name: "access-token", in: "header", required: true,  type: "string", description: "Authentication token for API access.",                                                 example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true,  type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss.",                                        example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true,  type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss.",                                          example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true,  type: "string", description: "Unique identifier of the circuit.",                                                    example: "CIRCUIT123" },
          { name: "type",         in: "query",  required: false, type: "string", description: "Unit for traffic data. Valid: Kbps, Mbps, Gbps, Tbps (case-insensitive). Default: Mbps.", example: "Mbps" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "100",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "avgThroughput": "500 Mbps",\n    "maxTrafficIn": "800 Mbps",\n    "minTrafficIn": "100 Mbps",\n    "serviceName": "Internet Service",\n    "trafficData": [\n      { "inbound": "450", "outbound": "300" },\n      { "inbound": "550", "outbound": "350" }\n    ]\n  }\n}`,
      },
      {
        name: "Connection Packet Data",
        method: "GET", crud: "R", status: "poc",
        path: "/api/packets",
        desc: "Provides detailed ingress and egress packet metrics for a circuit. Returns average, max, and min packet stats plus a time-series list. If no data is found, data may be null.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Authentication token for API access.",        example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss.", example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss.",   example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",             example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "100",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "avgPacketsIn": "1200",\n    "maxPacketsIn": "2400",\n    "minPacketsIn": "600",\n    "serviceName": "Internet Service",\n    "packetData": [\n      { "timestamp": "2023-01-01 00:00:00", "packetsIn": "1100", "packetsOut": "900" }\n    ]\n  }\n}`,
      },
      {
        name: "Connection Packet Loss",
        method: "GET", crud: "R", status: "poc",
        path: "/api/packet-loss",
        desc: "Provides historical packet loss measurements including average, maximum, and minimum values plus a detailed time-series. All timestamps are UTC.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Authentication token for API access.",        example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss.", example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss.",   example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",             example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "100",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "avgPacketLoss": "0.02",\n    "maxPacketLoss": "0.15",\n    "minPacketLoss": "0.00",\n    "serviceName": "Internet Service",\n    "measurements": [\n      { "timestamp": "2023-01-01 00:00:00", "packetLoss": "0.01" }\n    ]\n  }\n}`,
      },
    ],
  },
  {
    id: "vista-sla",
    moduleId: "mod-vista",
    label: "SLA",
    endpoints: [
      {
        name: "Circuit SLA Availability",
        method: "GET", crud: "R", status: "build",
        path: "/api/availability",
        desc: "Retrieves monthly SLA availability for a circuit within a date range. Committed SLA is 99.99% for NLD/ILD network types and 100% for METRO. If endDate is before live time, returns an earliest-available-date message. Current-month availability is calculated up to yesterday.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Authentication token for API access.",                    example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date. Format: yyyy-MM-dd.",                         example: "2023-01-01" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date. Format: yyyy-MM-dd.",                           example: "2023-03-31" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",                       example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "success",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "committedSla": "99.99%",\n    "serviceName": "Service_A",\n    "sla": [\n      {\n        "month": "2023-01",\n        "availability": "99.98%",\n        "startDateTime": "2023-01-01 00:00:00",\n        "endDateTime": "2023-01-31 23:59:59"\n      }\n    ]\n  }\n}`,
      },
      {
        name: "Circuit Status",
        method: "GET", crud: "R", status: "build",
        path: "/api/status",
        desc: "Retrieves current operational status for one or more circuits. Pass a comma-separated list of circuit IDs. The lastCheck timestamp always reflects yesterday's date. Wave users get status from SubServiceDetails; Polarin users use PolarinCircuitDao (orgId will be null).",
        params: [
          { name: "access-token", in: "header", required: true,  type: "string", description: "Authentication token for API access.",                             example: "YOUR_AUTH_TOKEN" },
          { name: "circuitIds",   in: "query",  required: true,  type: "string", description: "Comma-separated list of circuit IDs.",                             example: "CIRCUIT_001,CIRCUIT_002" },
          { name: "startDate",    in: "query",  required: false, type: "string", description: "Optional start date. Format: yyyy-MM-dd. Not used in filtering.",  example: "2023-01-01" },
          { name: "endDate",      in: "query",  required: false, type: "string", description: "Optional end date. Format: yyyy-MM-dd. Not used in filtering.",    example: "2023-01-31" },
        ],
        responseExample: `{\n  "status": "success",\n  "data": [\n    {\n      "circuitId": "CIRCUIT_001",\n      "status": "UP",\n      "lastCheck": "2025-06-16 00:00:00",\n      "orgId": "ORG_WAVE"\n    },\n    {\n      "circuitId": "CIRCUIT_002",\n      "status": "DOWN",\n      "lastCheck": "2025-06-16 00:00:00",\n      "orgId": null\n    }\n  ]\n}`,
      },
    ],
  },
  {
    id: "vista-latency",
    moduleId: "mod-vista",
    label: "Latency",
    endpoints: [
      {
        name: "Get Latency Data",
        method: "GET", crud: "R", status: "build",
        path: "/api/latency",
        desc: "Retrieves merged latency data for a circuit within a date range. Aggregates measurements and provides min/max values for the period. All timestamps are UTC.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Authentication token for API access.",        example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss.", example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss.",   example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",             example: "CIRCUIT123" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "288",\n  "data": {\n    "circuitId": "CIRCUIT123",\n    "serviceName": "Service_A",\n    "minLatency": "12.5",\n    "maxLatency": "48.3",\n    "measurements": [\n      {\n        "timestamp": "2023-01-01 00:00:00",\n        "maxLatency": "22.1",\n        "minLatency": "14.0"\n      }\n    ]\n  }\n}`,
      },
      {
        name: "All Latency Reports (Admin)",
        method: "GET", crud: "R", status: "build",
        path: "/admin/api/get/latency",
        desc: "Admin-only. Fetches KPI latency reports for all services across all organisations within a date range. Returns an empty list if no data is found. Intended for platform administrators.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "Admin JWT access token.",                           example: "YOUR_AUTH_TOKEN" },
          { name: "from",         in: "query",  required: true, type: "string", description: "Start date/time. Format: yyyy-MM-dd HH:mm:ss (UTC).", example: "2023-01-01 00:00:00" },
          { name: "to",           in: "query",  required: true, type: "string", description: "End date/time. Format: yyyy-MM-dd HH:mm:ss (UTC).",   example: "2023-01-01 23:59:59" },
        ],
        responseExample: `[\n  {\n    "serviceName": "Global Service A",\n    "locationAEnd": "Location R",\n    "locationBEnd": "Location S",\n    "orgId": "ORG-ABC",\n    "latencyDataList": [\n      {\n        "timestamp": "2023-01-01 10:05:00",\n        "avgLatency": 40,\n        "maxLatency": 45,\n        "minLatency": 38,\n        "alertRequired": false\n      }\n    ]\n  }\n]`,
      },
    ],
  },
  {
    id: "vista-flap",
    moduleId: "mod-vista",
    label: "Flap Events",
    endpoints: [
      {
        name: "Minute-wise Health Details",
        method: "GET", crud: "R", status: "build",
        path: "/api/flaps",
        desc: "Retrieves minute-by-minute health status for a circuit. Each record indicates whether a SwitchOver (1), Flap (2), or Outage (3) event occurred in that minute. Value 0 = normal.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "JWT access token for authentication.",           example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.", example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.",   example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",                   example: "C12345" },
        ],
        responseExample: `{\n  "status": "success",\n  "_comment": "timestamps are in UTC",\n  "_size": "1440",\n  "data": {\n    "circuitId": "C12345",\n    "serviceName": "Service_A",\n    "flapEvents": [\n      {\n        "timestamp": "2023-01-01 10:00:00",\n        "value": 2,\n        "pktsLost": 150\n      }\n    ]\n  }\n}`,
      },
      {
        name: "Events by Type",
        method: "GET", crud: "R", status: "build",
        path: "/api/flaps/events",
        desc: "Fetches a list of events (SwitchOver, Flap, Outage) for a circuit filtered by event type. Returns detailed event records and a summary breakdown. eventType values: 1=SwitchOver, 2=Flap, 3=Outage.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "JWT access token for authentication.",                                example: "YOUR_AUTH_TOKEN" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",                                   example: "C12345" },
          { name: "eventType",    in: "query",  required: true, type: "byte",   description: "Event type filter. 1 = SwitchOver, 2 = Flap, 3 = Outage.",            example: "2" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.",                 example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.",                   example: "2023-01-01 23:59:59" },
        ],
        responseExample: `{\n  "status": "success",\n  "data": {\n    "circuitId": "C12345",\n    "serviceName": "Service_A",\n    "eventType": "flap",\n    "events": [\n      { "eventTime": "2023-01-01 10:00:00", "pktsLost": 150 }\n    ],\n    "summary": [\n      {\n        "eventType": "Flap",\n        "startTime": "2023-01-01 09:55:00",\n        "endTime": "2023-01-01 10:05:00"\n      }\n    ]\n  }\n}`,
      },
      {
        name: "Event Summary",
        method: "GET", crud: "R", status: "build",
        path: "/api/flaps/events/summary",
        desc: "Provides a consolidated summary of all event types (SwitchOver, Flap, Outage) for a circuit within a time window. Returns total event count and a breakdown by type with start/end times.",
        params: [
          { name: "access-token", in: "header", required: true, type: "string", description: "JWT access token for authentication.",            example: "YOUR_AUTH_TOKEN" },
          { name: "startDate",    in: "query",  required: true, type: "string", description: "Start date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.", example: "2023-01-01 00:00:00" },
          { name: "endDate",      in: "query",  required: true, type: "string", description: "End date/time (UTC). Format: yyyy-MM-dd HH:mm:ss.",   example: "2023-01-01 23:59:59" },
          { name: "circuitId",    in: "query",  required: true, type: "string", description: "Unique identifier of the circuit.",                   example: "C12345" },
        ],
        responseExample: `{\n  "status": "success",\n  "data": {\n    "circuitId": "C12345",\n    "serviceName": "Service_A",\n    "totalEvents": 5,\n    "summary": [\n      {\n        "eventType": "Flap",\n        "startTime": "2023-01-01 09:00:00",\n        "endTime": "2023-01-01 10:00:00"\n      }\n    ]\n  }\n}`,
      },
    ],
  },
  {
    id: "vista-snmp",
    moduleId: "mod-vista",
    label: "SNMP",
    endpoints: [
      { name: "SNMP Port Performance Data", method: "POST", crud: "R", desc: "Suspended — SNMP polling endpoints are currently unavailable. See API Alerts for status and timeline.", status: "poc" },
    ],
  },
  {
    id: "notif-reports",
    moduleId: "mod-notifications",
    label: "Scheduled Reports",
    endpoints: [
      { name: "Create Scheduled Report", method: "POST", crud: "C", desc: "Schedule a recurring performance report (daily/weekly/monthly).", status: "build" },
      { name: "Update Scheduled Report", method: "PUT", crud: "U", desc: "Modify an existing scheduled report configuration.", status: "build" },
      { name: "Delete Scheduled Report", method: "DELETE", crud: "D", desc: "Remove a scheduled report job.", status: "build" },
      { name: "Get All Scheduled Reports", method: "GET", crud: "R", desc: "List all scheduled reports for the user (filterable by type).", status: "build" },
    ],
  },
  {
    id: "support-tickets",
    moduleId: "mod-support",
    label: "Tickets",
    endpoints: [
      { name: "Create Trouble Ticket", method: "POST", crud: "C", desc: "Submit new support ticket via Salesforce/FreshService integration.", status: "build" },
      { name: "List All Tickets (Paginated)", method: "GET", crud: "R", desc: "Paginated list of support tickets with sort, filter, search.", status: "build" },
      { name: "Get Ticket by ID", method: "GET", crud: "R", desc: "Full details for a specific trouble ticket.", status: "build" },
      { name: "Update Ticket", method: "PUT", crud: "U", desc: "Modify an existing trouble ticket.", status: "build" },
      { name: "Delete Ticket", method: "DELETE", crud: "D", desc: "Remove a trouble ticket.", status: "build" },
      { name: "Reopen Ticket", method: "POST", crud: "U", desc: "Re-open a closed ticket.", status: "build" },
      { name: "Get Issue Types", method: "GET", crud: "R", desc: "List all predefined issue/category types for ticket creation.", status: "build" },
    ],
  },
  {
    id: "support-comms",
    moduleId: "mod-support",
    label: "Ticket Comms",
    endpoints: [
      { name: "Add Note to Ticket", method: "POST", crud: "C", desc: "Add a text note/update to an existing trouble ticket.", status: "build" },
      { name: "Update Ticket Note", method: "PUT", crud: "U", desc: "Modify content of an existing ticket note.", status: "build" },
      { name: "Upload File to Ticket", method: "POST", crud: "C", desc: "Attach a file to a trouble ticket.", status: "build" },
      { name: "Delete Ticket File", method: "DELETE", crud: "D", desc: "Remove a file attachment from a ticket.", status: "build" },
      { name: "Add Chatter Post to Ticket", method: "POST", crud: "C", desc: "Post a comment/activity update to a ticket.", status: "build" },
      { name: "Get Chat / Chatter for Case", method: "GET", crud: "R", desc: "Retrieve all communication posts for a specific case.", status: "build" },
      { name: "Send Message in Ticket", method: "POST", crud: "C", desc: "Send a message in a FreshService ticket conversation.", status: "build" },
      { name: "Get All Messages in Ticket", method: "GET", crud: "R", desc: "Retrieve all messages in a FreshService ticket conversation.", status: "build" },
    ],
  },
  {
    id: "support-feedback",
    moduleId: "mod-support",
    label: "Ticket Feedback",
    endpoints: [
      { name: "Submit Ticket Feedback", method: "POST", crud: "C", desc: "Submit star rating and comments as feedback for a closed ticket.", status: "build" },
    ],
  },
  {
    id: "support-mttr",
    moduleId: "mod-support",
    label: "MTTR",
    endpoints: [
      { name: "Get MTTR by Service ID", method: "GET", crud: "R", desc: "Mean Time to Repair data for a service within date range.", status: "build" },
    ],
  },
  {
    id: "va-list",
    moduleId: "mod-appliance",
    label: "List",
    endpoints: [
      { name: "List All Virtual Appliances (Paginated)", method: "GET", crud: "R", desc: "Admin: paginated list of all VAs with search, sort, filter.", status: "build" },
    ],
  },
  {
    id: "va-detail",
    moduleId: "mod-appliance",
    label: "Detail",
    endpoints: [
      { name: "Get VA Details", method: "GET", crud: "R", desc: "VA info: status, machine type, public IP, SSH key, SKU details.", status: "build" },
      { name: "Get VA Subscription Details", method: "GET", crud: "R", desc: "Billing profile and subscription term for a VA.", status: "build" },
    ],
  },
  {
    id: "va-images",
    moduleId: "mod-appliance",
    label: "Images",
    endpoints: [
      { name: "Get VA Images", method: "GET", crud: "R", desc: "List available VA images (from DB).", status: "build" },
      { name: "Get All Images and SKU Details", method: "GET", crud: "R", desc: "Full catalog of VA images with supported SKUs (CPU, RAM, storage, throughput).", status: "build" },
      { name: "Get Instance Types by Image ID", method: "GET", crud: "R", desc: "Map of available instance sizes compatible with a specific image.", status: "build" },
      { name: "Sync VA Images from Ansible", method: "GET", crud: "C", desc: "Background job: fetch and sync VA images from orchestrator to DB.", status: "build" },
      { name: "Sync VA Locations from Ansible", method: "GET", crud: "C", desc: "Background job: fetch and sync VA deployment locations from orchestrator.", status: "build" },
      { name: "Sync VA Instance Types from Ansible", method: "GET", crud: "C", desc: "Background job: sync available instance SKUs from orchestrator.", status: "build" },
    ],
  },
  {
    id: "va-config",
    moduleId: "mod-appliance",
    label: "Image Config",
    endpoints: [
      { name: "Get Image Config Form Fields", method: "GET", crud: "R", desc: "Dynamic config form fields for a VA image (used in ordering UI).", status: "build" },
      { name: "Create Image Config Attribute", method: "POST", crud: "C", desc: "Admin: define new configurable attribute for a VA image.", status: "build" },
      { name: "Update Image Config Attribute", method: "PUT", crud: "U", desc: "Admin: modify an existing image config attribute.", status: "build" },
      { name: "Create Image Config Option", method: "POST", crud: "C", desc: "Admin: add selectable option for an image config attribute.", status: "build" },
      { name: "Update Image Config Option", method: "PUT", crud: "U", desc: "Admin: modify an existing image config attribute option.", status: "build" },
    ],
  },
  {
    id: "va-sku",
    moduleId: "mod-appliance",
    label: "SKU",
    endpoints: [
      { name: "Create SKU", method: "POST", crud: "C", desc: "Register a new SKU. SKU name must be unique.", status: "build" },
      { name: "Update SKU", method: "PUT", crud: "U", desc: "Update an existing SKU's details.", status: "build" },
    ],
  },
  {
    id: "va-macd",
    moduleId: "mod-appliance",
    label: "Bandwidth MACD",
    endpoints: [
      { name: "Update VA Internet Throughput", method: "PUT", crud: "U", desc: "Upgrade or modify VA internet throughput. Supports dry run.", status: "build" },
    ],
  },
  {
    id: "addr-geography",
    moduleId: "mod-address",
    label: "Geography",
    endpoints: [
      { name: "Get All Countries", method: "GET", crud: "R", desc: "Return all countries available in the system.", status: "build" },
      { name: "Get Countries by Filter", method: "GET", crud: "R", desc: "Filter countries by provider (e.g. 'polarin') and service type.", status: "build" },
      { name: "Get States by Country ID", method: "GET", crud: "R", desc: "List all states for a given country.", status: "build" },
      { name: "Get Cities by Country and State", method: "GET", crud: "R", desc: "List all cities for a given country and state.", status: "build" },
      { name: "Get City Details by Name", method: "GET", crud: "R", desc: "Find city details by city name (used by partner APIs).", status: "build" },
    ],
  },
  {
    id: "addr-tax",
    moduleId: "mod-address",
    label: "Tax",
    endpoints: [
      { name: "Get GST Details by GST Number", method: "GET", crud: "R", desc: "Validate and fetch GST registration details from government API.", status: "build" },
    ],
  },
  {
    id: "addr-entity",
    moduleId: "mod-address",
    label: "Entity Types",
    endpoints: [
      { name: "Get Entity Types by Country ID", method: "GET", crud: "R", desc: "Return legal entity types and required KYC documents per country.", status: "build" },
    ],
  },
];

export function findSubModule(id: string): SubModuleData | undefined {
  return ALL_SUB_MODULES.find((s) => s.id === id);
}
