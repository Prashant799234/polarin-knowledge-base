import { Task } from "./types";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const twoDaysFromNow = new Date(today);
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

const threeDaysFromNow = new Date(today);
threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Billing Profile Card — GST Pre-fill logic",
    description: "Implement auto-fill logic for GST numbers in billing profile",
    module: "Billing",
    severity: "High",
    assignedTo: "prashant",
    createdBy: "anjana",
    dueDate: threeDaysFromNow,
    status: "In Progress",
    comments: [
      {
        id: "c1",
        author: "Prashant Kumar",
        text: "Started work on the GST validation API integration",
        timestamp: new Date(today.getTime() - 3600000),
      },
    ],
  },
  {
    id: "2",
    title: "Invoice PDF download — IRN stamp placement",
    description: "Fix the IRN stamp positioning on generated invoice PDFs",
    module: "Billing",
    severity: "Critical",
    assignedTo: "harshit",
    createdBy: "prashant",
    dueDate: twoDaysFromNow,
    status: "Blocked",
    dependencyId: "3",
    comments: [],
  },
  {
    id: "3",
    title: "Confirm IRN format with finance team",
    description: "Get final approval on IRN stamp format and positioning requirements",
    module: "Billing",
    severity: "High",
    assignedTo: "anjana",
    createdBy: "anjana",
    dueDate: tomorrow,
    status: "To Do",
    comments: [
      {
        id: "c2",
        author: "Anjana Aray",
        text: "Meeting scheduled with finance for tomorrow morning",
        timestamp: new Date(today.getTime() - 7200000),
      },
    ],
  },
  {
    id: "4",
    title: "DCI Wave L1 — Service Detail Page PRD review",
    description: "Review and finalize PRD for service detail page redesign",
    module: "Service Management",
    severity: "Medium",
    assignedTo: "anjana",
    createdBy: "prashant",
    dueDate: threeDaysFromNow,
    status: "In Review",
    comments: [],
  },
  {
    id: "5",
    title: "Term Slider component — Figma to dev handoff",
    description: "Finalize design specs and hand off term slider component to dev",
    module: "Design System",
    severity: "Medium",
    assignedTo: "harshit",
    createdBy: "prashant",
    dueDate: yesterday,
    status: "To Do",
    comments: [
      {
        id: "c3",
        author: "Harshit Chopra",
        text: "Waiting for final design review",
        timestamp: new Date(today.getTime() - 86400000),
      },
    ],
  },
];
