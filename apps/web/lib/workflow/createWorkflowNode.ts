import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";

export function CreateWorkflowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "FlowNode",
    position: position ?? { x: 0, y: 0 },
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
  };
}
