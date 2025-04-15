import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { cn } from "@/lib/utils";
import { ColorForHandle } from "./Common";
import useFlowValidation from "@/hooks/useFlowValidation";

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 p-2 divide-y ">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {

  const edges = useEdges();
  const isConnected = edges.some((edge) => edge.target === nodeId && edge.targetHandle === input.name);
  const {invalidInputs} = useFlowValidation()
  const hasErrors = invalidInputs.find((node) => node.nodeId === nodeId)?.inputs.find((invalidInput) => invalidInput === input.name)

  return (
    <div className={cn("flex justify-start relative p-3 bg-secondary dark:bg-secondary w-full", hasErrors && "bg-destructive/30")}>
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected}/>

      {!input.hideHandle && (
        <Handle
        isConnectable={!isConnected}
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background  !-left-2 !w-4 !h-4 ",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
