import { Task, Alert, STATUSES } from "../types";
import { TaskCard } from "./TaskCard";

type MyTasksViewProps = {
  tasks: Task[];
  alerts: Alert[];
  currentUser: string;
  onTaskClick: (task: Task) => void;
};

export function MyTasksView({
  tasks,
  alerts,
  currentUser,
  onTaskClick,
}: MyTasksViewProps) {
  const myTasks = tasks.filter((t) => t.assignedTo === currentUser);

  return (
    <div className="space-y-6">
      {STATUSES.map((status) => {
        const statusTasks = myTasks.filter((t) => t.status === status);
        if (statusTasks.length === 0) return null;

        return (
          <div key={status}>
            <div className="flex items-center gap-3 mb-4">
              <h3>{status}</h3>
              <span className="px-2 py-1 bg-zinc-800 rounded text-sm text-zinc-400">
                {statusTasks.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  alerts={alerts}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {myTasks.length === 0 && (
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-12 text-center">
          <p className="text-zinc-500">You have no tasks assigned</p>
        </div>
      )}
    </div>
  );
}
