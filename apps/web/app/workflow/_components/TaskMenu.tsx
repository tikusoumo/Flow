"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { CoinsIcon, PlusIcon } from "lucide-react";
import React from "react";

export default function TaskMenu() {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="default" className="absolute right-4 mt-4 border- " size="sm">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent >
        <div className="w-[340px] min-w-[340px] max-w-[340px] px-4 h-full bg-white dark:bg-background p-2 overflow-auto mt-6 ">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={[
              "interaction",
              "extraction",
              "timing",
              "result",
              "storage",
            ]}
          >
            <AccordionItem value="interaction">
              <AccordionTrigger className="text-lg font-semibold">
                User Interactions
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
                <TaskMenuBtn taskType={TaskType.NAVIGATE_TO_URL} />
                <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="extraction">
              <AccordionTrigger className="text-lg font-semibold">
                Data Extraction
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="storage">
              <AccordionTrigger className="text-lg font-semibold">
                Data Storage
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="timing">
              <AccordionTrigger className="text-lg font-semibold">
                Timing controls
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="result">
              <AccordionTrigger className="text-lg font-semibold">
                Result Delivery
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
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
      <div className="flex items-center gap-2 justify-between">
        <task.icon size={20} />
        {task.label}
      </div>
      <Badge variant="outline" className="text-xs font-normal">
        <CoinsIcon className="w-4 h-4" />
        {task.credits}
      </Badge>
    </Button>
  );
}
