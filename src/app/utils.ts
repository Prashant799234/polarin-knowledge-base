import { Task, Alert, AlertType, TEAM_MEMBERS } from "./types";

export function getAlerts(tasks: Task[], currentUserId?: string): Alert[] {
  const alerts: Alert[] = [];

  tasks.forEach((task) => {
    if (task.status === "Done") return;

    const isOverdue =
      task.dueDate instanceof Date &&
      !isNaN(task.dueDate.getTime()) &&
      task.dueDate < new Date() &&
      task.status !== "Done";
    if (isOverdue) {
      alerts.push({
        id: `overdue-${task.id}`,
        taskId: task.id,
        type: "OVERDUE",
        message: `Task "${task.title}" is overdue`,
        acknowledged: false,
      });
    }

    if (task.dependencyId) {
      const dependency = tasks.find((t) => t.id === task.dependencyId);
      if (dependency && dependency.status !== "Done") {
        alerts.push({
          id: `dependency-${task.id}`,
          taskId: task.id,
          type: "DEPENDENCY",
          message: `Task "${task.title}" is blocked by "${dependency.title}"`,
          acknowledged: false,
        });
      }
    }

    const blockedTasks = tasks.filter(
      (t) => t.dependencyId === task.id && t.status !== "Done"
    );
    if (blockedTasks.length > 0 && task.status !== "Done") {
      blockedTasks.forEach((blockedTask) => {
        alerts.push({
          id: `blocker-${task.id}-${blockedTask.id}`,
          taskId: task.id,
          type: "BLOCKER",
          message: `${getTeamMemberName(blockedTask.assignedTo)} is waiting on you for "${task.title}"`,
          acknowledged: false,
        });
      });
    }
  });

  return alerts;
}

export function getTeamMemberName(id: string): string {
  return TEAM_MEMBERS.find((m) => m.id === id)?.name || id;
}

export function getTeamMemberInitials(id: string): string {
  return TEAM_MEMBERS.find((m) => m.id === id)?.initials || "??";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "Critical":
      return "bg-red-500";
    case "High":
      return "bg-orange-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

export function getModuleColor(module: string): string {
  const colors: Record<string, string> = {
    "Onboarding / KYC": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "Ordering Flow": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Billing: "bg-green-500/20 text-green-300 border-green-500/30",
    "Service Management": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Dashboard: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "Design System": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    "Admin Portal": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };
  return colors[module] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
}

export function getAlertIcon(type: AlertType): string {
  switch (type) {
    case "BLOCKER":
      return "🔴";
    case "DEPENDENCY":
      return "🟡";
    case "OVERDUE":
      return "⏰";
  }
}

export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "No date";
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}
