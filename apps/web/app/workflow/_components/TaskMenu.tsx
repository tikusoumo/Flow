"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import React from "react";

export default function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] px-4 h-full bg-white border-l border-gray-300 dark:bg-background p-2 overflow-auto">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="Extraction">
          <AccordionTrigger className="text-lg font-semibold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
  
  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant={"secondary"}
      className="flex items-center justify-between gap-2 border w-full cursor-pointer"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex items-center gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
}
