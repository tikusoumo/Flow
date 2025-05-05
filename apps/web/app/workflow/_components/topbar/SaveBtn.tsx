"use client";
import { UpdateWorkflow } from "@/actions/Workflows/UpdateWorkflows";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow updated successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error(`Error updating workflow: ${error}`, { id: "save-workflow" });
    },
  });
  const handleSave = () => {
    const workflowDefinition = JSON.stringify(toObject());
    toast.loading("Saving workflow...", { id: "save-workflow" });
    saveMutation.mutate({
      id: workflowId,
      definition: workflowDefinition,
    });
  };
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      onClick={handleSave}
    >
      <CheckIcon size={16} className="text-green-500" />
      Save
    </Button>
  );
}
