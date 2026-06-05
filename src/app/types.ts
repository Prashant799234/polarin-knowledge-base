export type TeamMember = {
  id: string;
  name: string;
  initials: string;
};

export type Module =
  | "Onboarding / KYC"
  | "Ordering Flow"
  | "Billing"
  | "Service Management"
  | "Dashboard"
  | "Design System"
  | "Admin Portal";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type TaskStatus = "To Do" | "In Progress" | "Blocked" | "In Review" | "Done";

export type AlertType = "BLOCKER" | "DEPENDENCY" | "OVERDUE";

export type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  module: Module;
  severity: Severity;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  status: TaskStatus;
  dependencyId?: string;
  comments: Comment[];
};

export type Alert = {
  id: string;
  taskId: string;
  type: AlertType;
  message: string;
  acknowledged: boolean;
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "anjana", name: "Anjana Aray", initials: "AA" },
  { id: "prashant", name: "Prashant Kumar", initials: "PK" },
  { id: "harshit", name: "Harshit Chopra", initials: "HC" },
];

export const MODULES: Module[] = [
  "Onboarding / KYC",
  "Ordering Flow",
  "Billing",
  "Service Management",
  "Dashboard",
  "Design System",
  "Admin Portal",
];

export const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

export const STATUSES: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Blocked",
  "In Review",
  "Done",
];
