"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar1Icon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhaseTotalCost } from "@/lib/helper/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/GetWorkflowPhaseDetails.";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });
  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const duration = DatesToDurationString(
    query.data?.finishedAt,
    query.data?.startedAt
  );

  const creditsComsumed = GetPhaseTotalCost(query.data?.phases || []);
  return (
    <div className="flex h-full w-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] h-full overflow-hidden border-r-2  flex flex-grow flex-col">
        <div className="py-4 px-2">
          {/*Status label */}
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          {/*Started At  label*/}
          <ExecutionLabel
            icon={Calendar1Icon}
            label="Started At"
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          {/*Duration label */}
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits Used"
            value={creditsComsumed}
          />
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-center px-4 py-2 ">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <WorkflowIcon className="stroke-muted-foreground/80" size={20} />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="overflow-auto h-full px- py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={index}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full px-4">
        {isRunning && (
          <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
            <div className="font-bold"></div>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
            <div className="font-bold">No phase selected</div>
            <div className="text-sm text-muted-foreground">
              Select a phase to see the details
            </div>
          </div>
        )}
       
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="space-x-4">
                <div className="flex  gap-1 items-center">
                <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                  <span>TODO</span>
              </Badge>
              <Badge variant="outline" className="space-x-4">
                <div className="flex  gap-1 items-center">
                <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                  <span>{DatesToDurationString(phaseDetails.data.finishedAt,phaseDetails.data.startedAt) || "-"}</span>
                  
              </Badge>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm ">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon className="stroke-muted-foreground/80  " size={20} />
        <span>{label}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
