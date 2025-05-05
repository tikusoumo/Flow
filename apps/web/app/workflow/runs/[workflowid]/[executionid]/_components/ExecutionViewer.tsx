"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/Workflows/GetWorkflowExecutionWithPhases";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
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
import React, { ReactNode, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhaseTotalCost } from "@/lib/helper/phases";
import { GetWorkflowPhaseDetails } from "@/actions/Workflows/GetWorkflowPhaseDetails.";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountupWrapper from "@/components/ReactCountupWrapper";

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
  useEffect(() => {
    //While running we auto select the phase in the sidebar
    const phases = query.data?.phases || [];
    if(isRunning ) {
      //Select last executed phase
     
       const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0];
       setSelectedPhase(phaseToSelect.id);
       return
     
    }
    const phaseToSelect = phases.toSorted((a, b) => a.finishedAt! > b.finishedAt! ? -1 : 1)[0];
    setSelectedPhase(phaseToSelect.id);

  },[ isRunning,  query.data?.phases,setSelectedPhase]);

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
            value={
              <div className="flex items-center gap-2">
                <PhaseStatusBadge
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span className="text-sm font-semibold">
                  {query.data?.status}
                </span>
              </div>
            }
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
            value={<ReactCountupWrapper value={creditsComsumed}/>}
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
              <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
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
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant="outline" className="space-x-4">
                <div className="flex  gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.finishedAt,
                    phaseDetails.data.startedAt
                  ) || "-"}
                </span>
              </Badge>
            </div>

            <ParameterViewer
              title="Input Parameters"
              subtitle="Input parameters for the phase"
              paramsJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title="Output Parameters"
              subtitle="Output parameters for the phase"
              paramsJSON={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
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

function ParameterViewer({
  title,
  subtitle,
  paramsJSON,
}: {
  title: string;
  subtitle: string;
  paramsJSON: string | null;
}) {
  const params = paramsJSON ? JSON.parse(paramsJSON) : null;

  return (
    <Card>
      <CardHeader className="rounded-xl rounded-b-none bg-gray-50 dark:bg-secondary py-4 ">
        <CardTitle className="text-base"> {title} </CardTitle>
        <CardDescription className="text-muted-foreground text-sm ">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 justify-center my-4">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm ">No parameters available</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-2 items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>

                <Input className="flex-1 basis-2/3" value={value as string} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || logs.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader className="rounded-xl rounded-b-none bg-gray-50 dark:bg-secondary py-4 ">
        <CardTitle className="text-base"> Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm ">
          Logs for the phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell
                  width={190}
                  className="text-muted-foreground text-xs p-[3px] pl-2"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-2",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-2">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
