"use client";
import DeleteWorkflow from "@/actions/Workflows/DeleteWorkflow";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface Prop {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Prop) {
  const [confirmName, setConfirmName] = useState("");
  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setConfirmName("");
    },
    onError: () => {
      toast.error("Error deleting workflow", { id: workflowId });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          workflow and all of its data.
        </AlertDialogDescription>
        <div className="flex">
          <p>
            If you are sure enter{" "}
            <b className="text-destructive">{workflowName}</b> to confirm
          </p>
        </div>
        <Input
          className="mt-2"
          placeholder={"Enter your workflow name"}
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
        />
        <div className="flex  justify-end mt-4">
          <Button
            className="mr-2"
            variant={"outline"}
            onClick={() =>{ setOpen(false)
              setConfirmName("")
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className=""
            disabled={confirmName !== workflowName || deleteMutation.isPending}
            onClick={() => {
             
              toast.loading("Deleting workflow...", { id: workflowId });
              deleteMutation.mutate(workflowId);
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
