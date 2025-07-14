import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { statusColors } from "./taskStatusColors";

export default function TaskItem({
  task,
  assignedMembers,
  onEdit,
  onDelete,
  onUnassign,
  onOpenAssignModal,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };

  const statusClass =
    statusColors[task.status] ||
    "bg-white border-gray-200";

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-4 rounded shadow-sm border ${statusClass} relative`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="text-md font-semibold">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Drag Handle */}
        <button
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-black"
          title="Drag"
        >
          <img
            src="/bar4.svg"
            alt="Drag handle"
            className="w-4 h-4"
          />
        </button>
      </div>

      <div className="mt-2">
        <strong className="text-sm">
          Members:
        </strong>
        {assignedMembers?.length > 0 ? (
          <ul className="list-disc ml-5 text-sm">
            {assignedMembers.map((member) => (
              <li key={member.memberId}>
                {member.memberId}
                <button
                  onClick={() =>
                    onUnassign(
                      task.id,
                      member.memberId
                    )
                  }
                  className="text-red-500 hover:underline text-xs ml-2"
                >
                  Unassign
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 ml-2">
            No members assigned
          </p>
        )}

        <button
          onClick={() =>
            onOpenAssignModal(task.id)
          }
          className="mt-1 text-blue-600 text-xs hover:underline"
        >
          + Assign Member
        </button>
      </div>

      <div className="flex gap-3 text-sm text-blue-600 mt-2">
        <button
          onClick={() => onEdit(task)}
          className="hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
