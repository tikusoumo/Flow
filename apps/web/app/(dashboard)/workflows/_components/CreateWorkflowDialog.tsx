"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@radix-ui/react-dialog";
import { Layers2Icon } from "lucide-react";
import { useState } from "react";

export default function CreateWorkflowDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent >
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create Workflow"
          subtitle="start building your workflow"
          />
    <Separator className="my-4" />
      </DialogContent>
    </Dialog>
    </>
  );
}
