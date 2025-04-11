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
    onError: () => {
      toast.error("Execution failed", { id: "flow-execution" });
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
