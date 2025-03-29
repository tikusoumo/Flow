"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";

export default function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
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
            TODO
          </Badge>
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
