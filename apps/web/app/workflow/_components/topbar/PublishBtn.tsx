"use client";

import { PublishWorkflow } from "@/actions/workflows/PublishWorkflow";
import { UpdateWorkflow } from "@/actions/workflows/UpdateWorkflows"; // Import the UpdateWorkflow action
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Loader2Icon, UploadIcon } from "lucide-react"; // Import Loader2Icon
import { toast } from "sonner";

export default function PublishBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  // --- Save Mutation ---
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    // onSuccess/onError handled inline during the execution flow
  });

  // --- Execute Mutation ---
  const publishMutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      // The redirect logic is handled by the server action itself
      // We just show a pending state toast here, the redirect error handler confirms success
      toast.success("Published Successfully.", {
        id: "flow-execution",
      });
    },
    onError: (error) => {
      // Check if the error is the special redirect error
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // This confirms the execution started successfully and redirect is happening.
        // The loading toast from onSuccess can be updated or dismissed here if needed,
        // but often just letting the redirect happen is fine.
        return; // Don't show the failure toast
      }
      // Otherwise, it's a real error
      toast.error("Publish failed: " + error.message, { id: "flow-execution" });
    },
  });

  const handleExecute = async () => {
    const saveToastId = "save-before-execute";

    // 1. Validate execution plan (optional, but good practice)
    const plan = generate();
    if (!plan) {
      // Assuming generate() shows its own toast/error
      return;
    }

    // 2. Start Saving
    toast.loading("Saving workflow...", { id: saveToastId });
    const workflowDefinition = JSON.stringify(toObject());

    try {
      // 3. Attempt to save using mutateAsync
      await saveMutation.mutateAsync({
        id: workflowId,
        definition: workflowDefinition,
      });

      toast.success("Workflow saved.", { id: saveToastId });

      // 4. If save is successful, start execution
      publishMutation.mutate({
        id: workflowId,
        flowDefinition: workflowDefinition,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (saveError: any) {
      // 5. Handle save error
      toast.error(`Save failed: ${saveError.message}`, { id: saveToastId });
      // Do not proceed to execution
    }
  };

  const isProcessing = saveMutation.isPending || publishMutation.isPending;

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 min-w-[110px]" // Added min-width
      disabled={isProcessing}
      onClick={handleExecute} // Use the new async handler
    >
      {isProcessing ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        <UploadIcon size={16} className="stroke-blue-400" /> // Keep original icon size/color
      )}
      {saveMutation.isPending
        ? "Saving..."
        : publishMutation.isPending
          ? "Publishing..."
          : "Publish"}
    </Button>
  );
}
