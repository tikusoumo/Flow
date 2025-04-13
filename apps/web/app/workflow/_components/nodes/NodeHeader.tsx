"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateWorkflowNode } from "@/lib/workflow/CreateWorkflowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";

export default function NodeHeader({ taskType,nodeId }: { taskType: TaskType ; nodeId: string }) {
  const task = TaskRegistry[taskType];
  const {deleteElements,getNode,addNodes} = useReactFlow();
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={20} className="text-primary" />
      <div className="flex justify-between w-full items-center">
        <p className="test-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Trigger</Badge>}
          <Badge className="flex items-center text-xs gap-2">
            <CoinsIcon size={12} className="text-white" />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && <>
          <Button variant={'ghost'} size={'icon'}
          onClick={() => {
            deleteElements({
              nodes: [{id: nodeId}]
            });
          }}
          >
            <TrashIcon size={12} className="text-red-500" />
          </Button>
          <Button variant={'ghost'} size={'icon'}
          onClick={() => {
            const node = getNode(nodeId) as AppNode;
            const newX = node.position.x ;
            const newY = node.position.y + (node.measured?.height || 100) + 20;
            const newNode = CreateWorkflowNode(node?.data.type,{
              x: newX,
              y: newY,
            })
            addNodes([newNode]);
          }}
          >
            <CopyIcon size={12} className="text-black" />
          </Button>
          </>}
          <Button
          variant={"ghost"}
          size={"icon"}
          className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={12}  />
          </Button>
        </div>
      </div>
    </div>
  );
}
