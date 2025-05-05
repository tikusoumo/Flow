"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar1Icon, Clock10Icon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/Workflows/UpdateWorkflowCron";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import cronstrue from "cronstrue";
import { DeleteWorkflowSchedule } from "@/actions/Workflows/DeleteWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

export default function SchedulerDialog(props: {
  workflowId: string;
  cron: string | null;
}) {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,

    onSuccess: () => {
      toast.success("Workflow schedule updated successfully", { id: "cron" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong", { id: "cron" });
    },
  });
  const removeScheduleMutation = useMutation({
    mutationFn: DeleteWorkflowSchedule,

    onSuccess: () => {
      toast.success("Workflow schedule removed successfully", { id: "cron" });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setValidCron(false);
      return;
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <Clock10Icon size={20}/>
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 ">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={Calendar1Icon}
          titleClassName="text-lg font-bold text-primary"
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Specify a cron expression to schedule the workflow execution. all
            time are UTC.
          </p>
          <Input
            placeholder="E.g - * * * * * "
            className="w-full"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border-destructive text-destructive text-sm",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : " Invalid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className={""}>
                <Button
                  variant={"outline"}
                  size="sm"
                  className="w-full mb-2 border border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeScheduleMutation.mutate({ id: props.workflowId });
                  }}
                >
                  Remove schedule
                </Button>
                <Separator className="my-2" />
              </div>
            </DialogClose>
          )}

          </div>
          <DialogFooter className=" flex px-6 items-center justify-between">
            <DialogClose asChild>
              <Button  size={'sm'} variant={"secondary"} className="flex-1 ">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                size="sm"
                disabled={mutation.isPending || !validCron}
                className="flex-1 "
                onClick={() => {
                  toast.loading("Saving...", { id: "cron" });
                  mutation.mutate({ id: props.workflowId, cron });
                }}
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
