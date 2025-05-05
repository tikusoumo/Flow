"use client";

import { UnpublishWorkflow } from "@/actions/Workflows/UnpublishWorkflow";
// Removed UpdateWorkflow import
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
// Removed useReactFlow import
import { Loader2Icon, UploadIcon } from "lucide-react"; // Use a more appropriate icon like DownloadIcon or XCircleIcon
import { toast } from "sonner";

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  // Removed generate and toObject if plan validation is removed
  // const generate = useExecutionPlan();
  // const { toObject } = useReactFlow();

  // --- Removed Save Mutation ---

  // --- Unpublish Mutation ---
  const unpublishMutation = useMutation({ // Renamed for clarity
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Unpublished Successfully.", {
        id: "flow-unpublish", // Use a specific ID
      });
      // Consider revalidating paths or using queryClient.invalidateQueries if needed
    },
    onError: (error) => {
      // Removed redirect check as UnpublishWorkflow likely doesn't redirect
      toast.error("Unpublish failed: " + error.message, { id: "flow-unpublish" });
    },
  });

  const handleUnpublish = async () => { // Renamed handler
    // Removed saveToastId
    const unpublishToastId = "flow-unpublish"; // Use the same ID as the mutation

    // 1. Optional: Validate execution plan if needed before unpublishing
    // const plan = generate();
    // if (!plan) {
    //   return;
    // }

    // 2. Removed Saving logic

    // 3. Directly trigger unpublish
    toast.loading("Unpublishing workflow...", { id: unpublishToastId });
    unpublishMutation.mutate(workflowId);
  };

  // Updated isProcessing to only check unpublishMutation
  const isProcessing = unpublishMutation.isPending;

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 min-w-[110px]" // Added min-width
      disabled={isProcessing}
      onClick={handleUnpublish} // Use the renamed handler
    >
      {isProcessing ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        // Consider a different icon for Unpublish, e.g., DownloadIcon or XCircleIcon
        <UploadIcon size={16} className="stroke-destructive" />
      )}
      {/* Updated button text logic */}
      {isProcessing
          ? "Unpublishing..."
          : "Unpublish"}
    </Button>
  );
}
