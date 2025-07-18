import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  Link,
} from "react-router-dom";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";

import DashboardLayout from "../../components/boards/DashboardLayout";
import FancyLoader from "../../components/FancyLoader/FancyLoader";
import TaskModal from "../../components/tasks/TaskModal";
import AssignMemberModal from "../../components/tasks/AssignMemberModal";
import DraggableTask from "../../components/tasks/DraggableTask";
import DroppableColumn from "../../components/tasks/DroppableColumn";
import TaskList from "../../components/tasks/TaskList";

import { getCardById } from "../../api/card";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAssignedMembers,
  assignMember,
  unassignMember,
} from "../../api/task";
import { statusColors } from "../tasks/taskStatusColors";
import { socket } from "../../socket";

const DEFAULT_STATUSES = [
  "icebox",
  "backlog",
  "ongoing",
  "review",
  "done",
];

export default function CardDetailPage() {
  const { boardId, id: cardId } = useParams();

  const [card, setCard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assignedMembers, setAssignedMembers] =
    useState({});
  const [loading, setLoading] = useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);
  const [modalMode, setModalMode] =
    useState("create");
  const [selectedTask, setSelectedTask] =
    useState(null);
  const [
    defaultTaskStatus,
    setDefaultTaskStatus,
  ] = useState("icebox");

  const [activeTask, setActiveTask] =
    useState(null);
  const [
    isAssignModalOpen,
    setIsAssignModalOpen,
  ] = useState(false);
  const [taskIdToAssign, setTaskIdToAssign] =
    useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const cardRes = await getCardById(
        boardId,
        cardId
      );
      setCard(cardRes.data);

      const tasksRes = await getTasks(
        boardId,
        cardId
      );
      setTasks(tasksRes.data);

      const memberMap = {};
      for (const task of tasksRes.data) {
        const res = await getAssignedMembers(
          boardId,
          cardId,
          task.id
        );
        memberMap[task.id] = res.data;
      }
      setAssignedMembers(memberMap);
    } catch (err) {
      console.error(
        "Failed to fetch card or tasks:",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [boardId, cardId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  //socket
  useEffect(() => {
    socket.emit("joinCardRoom", cardId);

    socket.on("task:created", (newTask) => {
      setTasks((prev) => {
        const exists = prev.find(
          (t) => t.id === newTask.id
        );
        if (exists) return prev;
        return [...prev, newTask];
      });
    });

    socket.on("task:updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updatedTask.id
            ? updatedTask
            : t
        )
      );
    });

    socket.on(
      "task:deleted",
      (deletedTaskId) => {
        setTasks((prev) =>
          prev.filter(
            (t) => t.id !== deletedTaskId
          )
        );
      }
    );

    return () => {
      socket.emit("leaveCardRoom", cardId);
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, [cardId]);

  const handleTaskSave = async (data) => {
    try {
      const payload = {
        ...data,
        status:
          data.status || defaultTaskStatus,
      };

      if (
        modalMode === "edit" &&
        selectedTask
      ) {
        const res = await updateTask(
          boardId,
          cardId,
          selectedTask.id,
          payload
        );

        // Optimistically update task in list
        setTasks((prev) =>
          prev.map((t) =>
            t.id === selectedTask.id
              ? res.data
              : t
          )
        );
      } else {
        // Optimistically add the task immediately
        const res = await createTask(
          boardId,
          cardId,
          payload
        );
        setTasks((prev) => [...prev, res.data]);
      }

      setIsTaskModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error(
        "Failed to save task:",
        err
      );
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setIsTaskModalOpen(true);
  };

  const handleTaskDelete = async (taskId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    )
      return;

    // Optimistically remove the task
    setTasks((prev) =>
      prev.filter((t) => t.id !== taskId)
    );

    try {
      await deleteTask(boardId, cardId, taskId);
    } catch (err) {
      console.error(
        "Failed to delete task:",
        err
      );

      fetchAllData(); // fallback in case of error
    }
  };

  const handleUnassignMember = async (
    taskId,
    memberId
  ) => {
    if (
      !window.confirm("Unassign this member?")
    )
      return;

    try {
      await unassignMember(
        boardId,
        cardId,
        taskId,
        memberId
      );

      const res = await getAssignedMembers(
        boardId,
        cardId,
        taskId
      );
      setAssignedMembers((prev) => ({
        ...prev,
        [taskId]: res.data,
      }));
    } catch (err) {
      console.error(
        "Failed to unassign member:",
        err
      );
    }
  };

  const handleAssignMember = async (email) => {
    try {
      await assignMember(
        boardId,
        cardId,
        taskIdToAssign,
        { email }
      );

      const res = await getAssignedMembers(
        boardId,
        cardId,
        taskIdToAssign
      );
      setAssignedMembers((prev) => ({
        ...prev,
        [taskIdToAssign]: res.data,
      }));
    } catch (err) {
      console.error(
        "Failed to assign member:",
        err
      );
    } finally {
      setIsAssignModalOpen(false);
      setTaskIdToAssign(null);
    }
  };

  const handleDragEnd = async ({
    active,
    over,
  }) => {
    if (
      !active ||
      !over ||
      active.id === over.id
    )
      return;

    const movedTask = tasks.find(
      (t) => t.id === active.id
    );
    if (!movedTask) return;

    let newStatus = null;

    if (over.id.startsWith("column-")) {
      newStatus = over.id.replace(
        "column-",
        ""
      );
    } else {
      const targetTask = tasks.find(
        (t) => t.id === over.id
      );
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    if (
      newStatus &&
      movedTask.status !== newStatus
    ) {
      try {
        const updated = await updateTask(
          boardId,
          cardId,
          movedTask.id,
          {
            ...movedTask,
            status: newStatus,
          }
        );

        setTasks((prev) =>
          prev.map((t) =>
            t.id === movedTask.id
              ? updated.data
              : t
          )
        );
      } catch (err) {
        console.error(
          "Failed to update task status:",
          err
        );
      }
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : (
        <div className="p-4 bg-white dark:bg-gray-800">
          <Link
            to={`/boards/${boardId}`}
            className="text-blue-500 underline text-sm mb-4 inline-block"
          >
            ← Back to Board
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-1">
            {card?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 break-words">
            {card?.description}
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            Tasks
          </h2>

          <DndContext
            onDragStart={({ active }) => {
              const found = tasks.find(
                (t) => t.id === active.id
              );
              if (found) setActiveTask(found);
            }}
            onDragEnd={(event) => {
              handleDragEnd(event);
              setActiveTask(null);
            }}
            onDragCancel={() =>
              setActiveTask(null)
            }
          >
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                <p className="text-lg">
                  There are no tasks yet.
                </p>
                <p className="text-sm mt-1">
                  Click{" "}
                  <button
                    type="button"
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mb-2"
                    onClick={() => {
                      setDefaultTaskStatus(
                        status
                      );
                      setModalMode("create");
                      setSelectedTask(null);
                      setIsTaskModalOpen(true);
                    }}
                  >
                    + Add
                  </button>{" "}
                  to create your first task!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {DEFAULT_STATUSES.map(
                  (status) => (
                    <DroppableColumn
                      key={status}
                      id={`column-${status}`}
                      status={status}
                      className={
                        statusColors[status]
                      }
                      title={status}
                    >
                      <button
                        type="button"
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mb-2"
                        onClick={() => {
                          setDefaultTaskStatus(
                            status
                          );
                          setModalMode(
                            "create"
                          );
                          setSelectedTask(null);
                          setIsTaskModalOpen(
                            true
                          );
                        }}
                      >
                        + Add
                      </button>

                      <TaskList
                        tasks={tasks.filter(
                          (task) =>
                            task.status ===
                              status &&
                            task.id !==
                              activeTask?.id
                        )}
                        assignedMembers={
                          assignedMembers
                        }
                        onEdit={handleTaskEdit}
                        onDelete={
                          handleTaskDelete
                        }
                        onUnassign={
                          handleUnassignMember
                        }
                        onOpenAssignModal={(
                          taskId
                        ) => {
                          setTaskIdToAssign(
                            taskId
                          );
                          setIsAssignModalOpen(
                            true
                          );
                        }}
                      />
                    </DroppableColumn>
                  )
                )}
              </div>
            )}

            <DragOverlay>
              {activeTask && (
                <DraggableTask
                  task={activeTask}
                  assignedMembers={
                    assignedMembers[
                      activeTask.id
                    ] || []
                  }
                  isOverlay
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        initialData={selectedTask}
        mode={modalMode}
        defaultStatus={defaultTaskStatus}
      />

      <AssignMemberModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setTaskIdToAssign(null);
        }}
        onAssign={handleAssignMember}
      />
    </DashboardLayout>
  );
}
