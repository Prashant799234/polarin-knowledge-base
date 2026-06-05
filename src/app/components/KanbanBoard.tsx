import { Task, Alert, TaskStatus, STATUSES } from "../types";
import { TaskCard } from "./TaskCard";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type KanbanBoardProps = {
  tasks: Task[];
  alerts: Alert[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
};

type DraggableTaskProps = {
  task: Task;
  alerts: Alert[];
  onTaskClick: (task: Task) => void;
};

type ColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  alerts: Alert[];
  onTaskClick: (task: Task) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
};

function DraggableTask({ task, alerts, onTaskClick }: DraggableTaskProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag}>
      <TaskCard
        task={task}
        alerts={alerts}
        onClick={onTaskClick}
        isDragging={isDragging}
      />
    </div>
  );
}

function Column({ status, tasks, alerts, onTaskClick, onDrop }: ColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] ${isOver ? "bg-zinc-800/50" : ""}`}
    >
      <div className="bg-zinc-900 sticky top-0 z-10 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h3>{status}</h3>
          <span className="px-2 py-1 bg-zinc-800 rounded text-sm text-zinc-400">
            {columnTasks.length}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {columnTasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            alerts={alerts}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  alerts,
  onTaskClick,
  onTaskUpdate,
}: KanbanBoardProps) {
  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskUpdate({ ...task, status: newStatus });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-6 min-w-max pb-6">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks}
              alerts={alerts}
              onTaskClick={onTaskClick}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
