"use client";
import ExecutionStatusIndicator, { ExecutionStatusLable } from "@/app/workflow/runs/[workflowid]/_components/ExecutionStatusIndicator";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const  isDraft = workflow.status === WorkflowStatus.DRAFT;

  const { lastRunAt, lastRunStatus, lastRunId } = workflow;
  const formatedStartedAt = lastRunAt
    ? formatDistanceToNow(lastRunAt, { addSuffix: true })
    : null;

    if (isDraft) {
      return null;
    }

  return (
   
      <div className="flex gap-2 items-center ">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex gap-2 items-center group"
          >
            <span>Last run</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLable
            status={lastRunStatus as WorkflowExecutionStatus}/>
            <span>{formatedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )}
        {!lastRunAt && (
          <span className="text-muted-foreground">No runs yet</span>
        )}
        
      </div>
    
  );
}
