"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";

import {
  Clock,
  CoinsIcon,
  CornerDownRightIcon,
  // Delete,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunBtn from "./RunBtn";
import SchedulerDialog from "./SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import LastRunDetails from "./LastRunDetails";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "./DublicateWorkflowDialog";

const statusColor = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};


export default function WorkFlowCard({ workflow }: { workflow: Workflow }) {
  const { nextRunAt } = workflow;
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
    const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
    const nextRunUTC = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");
  
  return (
    <Card
      className="border border-separate shadow-sm hover:shadow-md rounded-lg
  overflow-hidden dark:shadow-primary/30 transition-all duration-200 ease-in-out group/card"
    >
      <CardContent className="p-4 flex justify-between items-center h-[100px]">
        <div className="flex items-center justify-end space-x-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary",
              statusColor[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <TooltipWrapper content={workflow.description}>

                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors duration-200 ease-in-out"
                  >
                  {workflow.name}
                </Link>
                    </TooltipWrapper>
              {isDraft && (
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost!}
              workflowId={workflow.id}
              cron={workflow.cron}
            />

          </div>
        </div>
        <div className="flex items-center justify-end gap-2 ">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              " flex items-center gap-2"
            )}
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <div className="bg-primary/5 flex gap-2 text-sm px-4 py-1 justify-between items-center text-muted-foreground">
      <LastRunDetails
        workflow={workflow}/>
        {nextRunAt && (
                  <div className="flex items-center text-sm gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Next run at:</span>
                    <span>{nextSchedule}</span>
        
                    <span>({nextRunUTC} UTC)</span>
                  </div>
                )}
      </div>        
    </Card>
  );
}

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content={"More options"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} className="h-4 w-4" />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 text-destructive"
            onSelect={() => setDeleteDialogOpen((prev) => !prev)}
          >
            <TrashIcon size={18} className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron
}: {
  isDraft?: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;

}) {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-2 ">
      <div className="flex items-center gap-2">
        <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
        <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
        <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-1">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="h-4 w-4 " />
            <span className="text-xs">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}
