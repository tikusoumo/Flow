"use client";

import { RunWorkflow } from "@/actions/workflows/RunWorkflow";
import { UpdateWorkflow } from "@/actions/workflows/UpdateWorkflows"; // Import the UpdateWorkflow action
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, Loader2Icon } from "lucide-react"; // Import Loader2Icon
import { toast } from "sonner";

export default function ExecuteBtn({
  workflowId,
  initialDefinition,
  isPublished // Prop is still here, needed for logic below
}: {
  workflowId: string;
  initialDefinition: string;
  isPublished: boolean;
}) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  // --- Save Mutation ---
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    // onSuccess/onError handled inline
  });

  // --- Execute Mutation ---
  const executeMutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.loading("Execution started, redirecting...", { id: "flow-execution" });
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        toast.success("Execution started, redirecting...", { id: "flow-execution" });
        return; // Don't show failure toast on successful redirect
      }
      toast.error("Execution failed: " + error.message, { id: "flow-execution" });
    },
  });

  const handleExecute = async () => {
    const saveToastId = "save-before-execute";
    const executeToastId = "flow-execution";

    // 1. Validate execution plan (optional)
    const plan = generate();
    if (!plan) {
      return;
    }

    // 2. Get current definition
    const currentDefinitionString = JSON.stringify(toObject());
    let saveSuccessful = true; // Assume save isn't needed or will succeed

    // 3. Check if save is needed (changes detected AND workflow is NOT published)
    if (currentDefinitionString !== initialDefinition && !isPublished) {
      toast.loading("Saving changes...", { id: saveToastId });
      try {
        // Attempt to save using mutateAsync
        await saveMutation.mutateAsync({
          id: workflowId,
          definition: currentDefinitionString,
        });
        toast.success("Workflow saved.", { id: saveToastId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (saveError: any) {
        saveSuccessful = false;
        toast.error(`Save failed: ${saveError.message}`, { id: saveToastId });
      }
    } else {
       // Log why save was skipped (optional)
       if (currentDefinitionString === initialDefinition) {
         console.log("No changes detected, skipping save before execution.");
       } else if (isPublished) {
         console.log("Workflow is published, skipping save before execution.");
       }
    }

    // 4. Proceed to execution only if save was not needed or was successful
    if (saveSuccessful) {
      toast.loading("Starting execution...", { id: executeToastId });

      // Pass BOTH workflowId and the currentDefinitionString
      // RunWorkflow action will decide whether to use the definition (if draft)
      // or ignore it and use the stored plan (if published)
      executeMutation.mutate({ workflowId, flowDefinition: currentDefinitionString });
    }
  };

  const isProcessing = saveMutation.isPending || executeMutation.isPending;

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 min-w-[110px]"
      disabled={isProcessing}
      onClick={handleExecute}
    >
      {isProcessing ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        <PlayIcon size={16} className="stroke-yellow-400" />
      )}
      {saveMutation.isPending ? "Saving..." : executeMutation.isPending ? "Executing..." : "Execute"}
    </Button>
  );
}
