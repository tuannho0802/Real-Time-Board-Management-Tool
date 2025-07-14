import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";

export default function TaskList({
  title,
  tasks,
  assignedMembers,
  onEdit,
  onDelete,
  onUnassign,
  onOpenAssignModal,
}) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <SortableContext
      id={title}
      items={tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <ul
        ref={setNodeRef}
        className="space-y-4"
      >
        {tasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            assignedMembers={
              assignedMembers[task.id] || []
            }
            onEdit={onEdit}
            onDelete={onDelete}
            onUnassign={onUnassign}
            onOpenAssignModal={
              onOpenAssignModal
            }
          />
        ))}
      </ul>
    </SortableContext>
  );
}
