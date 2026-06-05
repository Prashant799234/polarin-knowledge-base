import { Task, Alert } from "../types";
import {
  getTeamMemberInitials,
  getSeverityColor,
  getModuleColor,
  formatDate,
  getAlertIcon,
} from "../utils";

type TaskCardProps = {
  task: Task;
  alerts: Alert[];
  onClick: () => void;
  isDragging?: boolean;
};

export function TaskCard({ task, alerts, onClick, isDragging }: TaskCardProps) {
  const taskAlerts = alerts.filter((a) => a.taskId === task.id);
  const hasOverdue = taskAlerts.some((a) => a.type === "OVERDUE");
  const hasCritical = task.severity === "Critical";

  return (
    <div
      onClick={onClick}
      className={`bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all ${
        isDragging ? "opacity-50" : ""
      } ${hasCritical && !hasOverdue ? "animate-pulse-subtle" : ""}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-zinc-100 mb-2 line-clamp-2">{task.title}</h4>
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs px-2 py-1 rounded border ${getModuleColor(
                task.module
              )}`}
            >
              {task.module}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded text-white ${getSeverityColor(
                task.severity
              )}`}
            >
              {task.severity}
            </span>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
          title={task.assignedTo}
        >
          <span className="text-xs text-white">
            {getTeamMemberInitials(task.assignedTo)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span
          className={`text-zinc-400 ${
            hasOverdue ? "text-red-400 font-medium" : ""
          }`}
        >
          {formatDate(task.dueDate)}
        </span>
        {taskAlerts.length > 0 && (
          <div className="flex gap-1">
            {taskAlerts.map((alert) => (
              <span key={alert.id} title={alert.message}>
                {getAlertIcon(alert.type)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
