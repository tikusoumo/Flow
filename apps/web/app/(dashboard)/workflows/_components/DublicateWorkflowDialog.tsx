"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CreateWorkflowSchemaType,
  DublicateWorkflowSchema,
  DublicateWorkflowSchemaType,
} from "@/schema/workflow";
import { Loader2, CopyIcon } from "lucide-react"; // Use CopyIcon
import { useState} from "react"; // Import useEffect
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DuplicateWorkflow } from "@/actions/workflows/DublicateWorkflow";
import { cn } from "@/lib/utils";

export default function DuplicateWorkflowDialog({
  workflowId, // Pass the original workflow object
}: {
  workflowId?: string;
 // Allow custom trigger
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<DublicateWorkflowSchemaType>({
    resolver: zodResolver(DublicateWorkflowSchema),
    // Fix: Provide default values
    defaultValues: {
      name: "",
      description: "",
    },
  });



  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow, // Use the DuplicateWorkflow action
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", { id: "duplicate-workflow" });
      setOpen(prev => !prev); // Close dialog on success
      // Optionally invalidate queries to refresh workflow list
      // queryClient.invalidateQueries(['workflows']);
    },
    onError: (error) => {
      // Handle potential redirects if the action uses them (though less likely for duplicate)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        toast.success("Workflow duplicated successfully", { id: "duplicate-workflow" });
        setOpen(false);
        return;
      }
      toast.error(`Error duplicating workflow: ${error.message}`, { id: "duplicate-workflow" });
    },
  });

  const onSubmit = (values: CreateWorkflowSchemaType) => {
    if (!workflowId) {
      toast.error("Workflow ID is required", { id: "duplicate-workflow" });
      return;
    }
    
    toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
    // Pass original workflow ID along with new name/description
    mutate({
      workflowId,
      name: values.name,
      description: values.description,
    });
  };

  return (
    <>
    

    <Dialog
      open={open}
      onOpenChange={(open) => {
        // Don't reset here if using useEffect
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
      <Button variant="ghost" size="icon" className={cn("transition-opacity  duration-200 opacity-0 group-hover/card:opacity-100")}> 
           <CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" /> 
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={CopyIcon} // Use CopyIcon
          title="Duplicate Workflow" // Update title
        />
        <Separator className="my-2" />
        <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Name
                        <p className="text-xs text-primary">(required)</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Workflow Name" />
                      </FormControl>
                      <FormDescription className="pb-4">
                        This is the name of your workflow. It should be unique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Description
                        <p className="text-xs text-foreground-muted">
                          (optional)
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Workflow description"
                          className=" resize-none
                    "
                        />
                      </FormControl>
                      <FormDescription className="pb-10">
                        Provide a short description of your workflow. This will
                        help you remember what this workflow does. It should be
                        less than 80 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {!isPending && "Proceed"}
                  {isPending && <Loader2 className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
