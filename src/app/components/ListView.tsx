import { useState } from "react";
import { Task, Alert, Module, Severity, TaskStatus } from "../types";
import {
  getTeamMemberName,
  getTeamMemberInitials,
  getSeverityColor,
  formatDate,
  getAlertIcon,
} from "../utils";
import { MODULES, SEVERITIES, STATUSES, TEAM_MEMBERS } from "../types";

type ListViewProps = {
  tasks: Task[];
  alerts: Alert[];
  onTaskClick: (task: Task) => void;
};

type FilterState = {
  modules: Set<Module>;
  severities: Set<Severity>;
  statuses: Set<TaskStatus>;
  assignees: Set<string>;
};

export function ListView({ tasks, alerts, onTaskClick }: ListViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    modules: new Set(),
    severities: new Set(),
    statuses: new Set(),
    assignees: new Set(),
  });

  const toggleFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends Set<infer T> ? T : never
  ) => {
    setFilters((prev) => {
      const newSet = new Set(prev[key]);
      if (newSet.has(value as any)) {
        newSet.delete(value as any);
      } else {
        newSet.add(value as any);
      }
      return { ...prev, [key]: newSet };
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.modules.size > 0 && !filters.modules.has(task.module))
      return false;
    if (filters.severities.size > 0 && !filters.severities.has(task.severity))
      return false;
    if (filters.statuses.size > 0 && !filters.statuses.has(task.status))
      return false;
    if (filters.assignees.size > 0 && !filters.assignees.has(task.assignedTo))
      return false;
    return true;
  });

  const hasActiveFilters =
    filters.modules.size > 0 ||
    filters.severities.size > 0 ||
    filters.statuses.size > 0 ||
    filters.assignees.size > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Modules</label>
          <div className="flex flex-wrap gap-2">
            {MODULES.map((module) => (
              <button
                key={module}
                onClick={() => toggleFilter("modules", module)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filters.modules.has(module)
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {module}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Severity</label>
          <div className="flex flex-wrap gap-2">
            {SEVERITIES.map((severity) => (
              <button
                key={severity}
                onClick={() => toggleFilter("severities", severity)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filters.severities.has(severity)
                    ? `${getSeverityColor(severity)} text-white`
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => toggleFilter("statuses", status)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filters.statuses.has(status)
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Assignee</label>
          <div className="flex flex-wrap gap-2">
            {TEAM_MEMBERS.map((member) => (
              <button
                key={member.id}
                onClick={() => toggleFilter("assignees", member.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filters.assignees.has(member.id)
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() =>
              setFilters({
                modules: new Set(),
                severities: new Set(),
                statuses: new Set(),
                assignees: new Set(),
              })
            }
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Module
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Severity
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Assigned
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Due Date
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">
                  Alerts
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => {
                const taskAlerts = alerts.filter((a) => a.taskId === task.id);
                return (
                  <tr
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className={`cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                      index !== filteredTasks.length - 1
                        ? "border-b border-zinc-700/50"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-zinc-100">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded">
                        {task.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded text-white ${getSeverityColor(
                          task.severity
                        )}`}
                      >
                        {task.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <span className="text-xs text-white">
                            {getTeamMemberInitials(task.assignedTo)}
                          </span>
                        </div>
                        <span className="text-sm text-zinc-300">
                          {getTeamMemberName(task.assignedTo).split(" ")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{task.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {taskAlerts.map((alert) => (
                          <span key={alert.id} title={alert.message}>
                            {getAlertIcon(alert.type)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No tasks match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
