"use client";

import { RunWorkflow } from "@/actions/workflows/RunWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: (error) => {
       // Check if the error is the special redirect error
       if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // It's a redirect, which means the action was successful.
        // We can optionally show the success toast here or just let the redirect happen.
        toast.success("Execution started, redirecting...", { id: "flow-execution" });
        return; // Don't show the failure toast
      }
      // Otherwise, it's a real error
      toast.error("Execution failed: " + error.message, { id: "flow-execution" });
    },
  });

  const {toObject} = useReactFlow()

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          
          return;
        }
        console.log("=======plan======");
        console.table(plan);
        mutation.mutate({ workflowId, flowDefinition: JSON.stringify(toObject()) });
      }}
    >
      <PlayIcon size={20} className="stroke-yellow-400" />
      Execute
    </Button>
  );
}
