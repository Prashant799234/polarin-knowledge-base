import { useState } from "react";
import { Task, MODULES, SEVERITIES, STATUSES, TEAM_MEMBERS } from "../types";
import { X } from "lucide-react";
import { getTeamMemberName, formatDate } from "../utils";

type TaskDetailPanelProps = {
  task: Task;
  allTasks: Task[];
  onClose: () => void;
  onUpdate: (task: Task) => void;
};

export function TaskDetailPanel({
  task,
  allTasks,
  onClose,
  onUpdate,
}: TaskDetailPanelProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedTask = {
      ...editedTask,
      comments: [
        ...editedTask.comments,
        {
          id: `c${Date.now()}`,
          author: getTeamMemberName(editedTask.assignedTo),
          text: newNote,
          timestamp: new Date(),
        },
      ],
    };
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
    setNewNote("");
  };

  const handleUpdate = () => {
    onUpdate(editedTask);
  };

  const dependencyTask = editedTask.dependencyId
    ? allTasks.find((t) => t.id === editedTask.dependencyId)
    : null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-zinc-900 border-l border-zinc-800 z-40 overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
        <h2>Task Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X size={20} className="text-zinc-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Title</label>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            onBlur={handleUpdate}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Description
          </label>
          <textarea
            value={editedTask.description || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            onBlur={handleUpdate}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Add a description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Module</label>
            <select
              value={editedTask.module}
              onChange={(e) => {
                setEditedTask({
                  ...editedTask,
                  module: e.target.value as typeof editedTask.module,
                });
                handleUpdate();
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Severity</label>
            <select
              value={editedTask.severity}
              onChange={(e) => {
                setEditedTask({
                  ...editedTask,
                  severity: e.target.value as typeof editedTask.severity,
                });
                handleUpdate();
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Assigned To
            </label>
            <select
              value={editedTask.assignedTo}
              onChange={(e) => {
                setEditedTask({ ...editedTask, assignedTo: e.target.value });
                handleUpdate();
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select
              value={editedTask.status}
              onChange={(e) => {
                setEditedTask({
                  ...editedTask,
                  status: e.target.value as typeof editedTask.status,
                });
                handleUpdate();
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Due Date</label>
          <input
            type="date"
            value={
              editedTask.dueDate instanceof Date && !isNaN(editedTask.dueDate.getTime())
                ? editedTask.dueDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              setEditedTask({
                ...editedTask,
                dueDate: new Date(e.target.value),
              });
              handleUpdate();
            }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Blocked By (Dependency)
          </label>
          <select
            value={editedTask.dependencyId || ""}
            onChange={(e) => {
              setEditedTask({
                ...editedTask,
                dependencyId: e.target.value || undefined,
              });
              handleUpdate();
            }}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            {allTasks
              .filter((t) => t.id !== task.id)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.status})
                </option>
              ))}
          </select>
          {dependencyTask && (
            <div className="mt-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <div className="text-sm text-zinc-300">
                {dependencyTask.title}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Status: {dependencyTask.status}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="mb-4">Notes & Comments</h3>
          <div className="space-y-3 mb-4">
            {editedTask.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-300">{comment.author}</span>
                  <span className="text-xs text-zinc-500">
                    {comment.timestamp instanceof Date && !isNaN(comment.timestamp.getTime())
                      ? comment.timestamp.toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              placeholder="Add a note..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
