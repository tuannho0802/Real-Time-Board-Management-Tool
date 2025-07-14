import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({
  id,
  title,
  children,
  status,
  className = "",
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-3 min-h-[200px] ${className} ${status}`}
    >
      <h3 className="text-lg font-semibold mb-2 capitalize">
        {title}
      </h3>
      {children}
    </div>
  );
}
