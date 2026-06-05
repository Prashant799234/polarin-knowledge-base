import { Task, Alert } from "../types";
import { getTeamMemberName, getAlertIcon } from "../utils";
import { AlertCircle, Clock, Users } from "lucide-react";

type DashboardProps = {
  tasks: Task[];
  alerts: Alert[];
  currentUser: string;
  onTaskClick: (task: Task) => void;
};

export function Dashboard({
  tasks,
  alerts,
  currentUser,
  onTaskClick,
}: DashboardProps) {
  const myTasks = tasks.filter(
    (t) => t.assignedTo === currentUser && t.status !== "Done"
  );

  const blockingOthers = tasks.filter((task) => {
    const blockedTasks = tasks.filter(
      (t) => t.dependencyId === task.id && t.status !== "Done"
    );
    return (
      task.assignedTo === currentUser &&
      task.status !== "Done" &&
      blockedTasks.length > 0
    );
  });

  const overdueTasks = tasks.filter(
    (t) =>
      t.assignedTo === currentUser &&
      t.dueDate < new Date() &&
      t.status !== "Done"
  );

  const myAlerts = alerts.filter((a) => {
    const task = tasks.find((t) => t.id === a.taskId);
    return task && task.assignedTo === currentUser;
  });

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">
          {greeting}, {getTeamMemberName(currentUser)}
        </h1>
        <p className="text-zinc-400">Here's what needs your attention today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users size={20} className="text-blue-400" />
            </div>
            <h3>My Open Tasks</h3>
          </div>
          <div className="text-4xl font-bold text-zinc-100">{myTasks.length}</div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertCircle size={20} className="text-orange-400" />
            </div>
            <h3>Blocking Others</h3>
          </div>
          <div className="text-4xl font-bold text-zinc-100">
            {blockingOthers.length}
          </div>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock size={20} className="text-red-400" />
            </div>
            <h3>Overdue</h3>
          </div>
          <div className="text-4xl font-bold text-zinc-100">
            {overdueTasks.length}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4">Active Alerts</h2>
        {myAlerts.length === 0 ? (
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-8 text-center">
            <p className="text-zinc-500">No active alerts. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myAlerts.map((alert) => {
              const task = tasks.find((t) => t.id === alert.taskId);
              if (!task) return null;

              return (
                <div
                  key={alert.id}
                  onClick={() => onTaskClick(task)}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 hover:border-zinc-600 cursor-pointer transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <p className="text-zinc-100">{alert.message}</p>
                    <p className="text-sm text-zinc-500 mt-1">{task.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4">Recent Tasks</h2>
        <div className="space-y-2">
          {myTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 hover:border-zinc-600 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-zinc-100 mb-1">{task.title}</h4>
                  <p className="text-sm text-zinc-500">{task.module}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">{task.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
