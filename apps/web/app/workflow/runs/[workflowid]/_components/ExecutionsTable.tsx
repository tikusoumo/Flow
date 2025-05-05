"use client";
import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export default function ExecutionsTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) {


   const router = useRouter();

  const query = useQuery({
    queryKey: ["workflow-executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });

  return (
    <div className="border rounded-lg shadow-md overflow-auto ">
      <Table className="h-full">
        <TableHeader className="bg-muted ">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At(desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full gap-2 overflow-hidden">
          {query.data?.map((execution) => {
            const duration = DatesToDurationString(
              execution.finishedAt,
              execution.startedAt
            );
            const formatedstartedAt = execution.startedAt && formatDistanceToNow(
              
              execution.startedAt, {
                addSuffix: true,
                
              }
            )
            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer hover:bg-accent"
                onClick={() => {
                  router.push(`/workflow/runs/${execution.workflowId}/${execution.id}`);
                }}
              >
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs ">
                        <span>Triggered via </span>
                        <Badge variant="outline" className="text-xs">{execution.trigger}</Badge>
                     </div>
                    
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <ExecutionStatusIndicator status={execution.status as WorkflowExecutionStatus} />
                        <span className="font-bold ml-2 text-sm">{execution.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mx-5" >{duration}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <CoinsIcon size={15} className="text-primary" />
                        <span className="font-bold ml-2 text-sm">{execution.creditsConsumed}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mx-5" >Credits</div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatedstartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
