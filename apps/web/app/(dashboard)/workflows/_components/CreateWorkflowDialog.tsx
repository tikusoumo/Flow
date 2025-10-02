"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CreateWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { Dialog } from "@radix-ui/react-dialog";
import { Layers2Icon, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { CreateWorkflow } from "@/actions/workflows/CreateWorkflows";
export default function CreateWorkflowDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(CreateWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkflow,
    onSuccess: () => {
      toast.success("Workflow created successfully", { id: "create-workflow" });
    },
    onError: (error) => {
      // If error contains redirect info, it's actually successful
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        toast.success("Workflow created successfully", { id: "create-workflow" });
        return;
      }
      toast.error("Error creating workflow", { id: "create-workflow" });
    },
  });

  const onSubmit = 
    (values: CreateWorkflowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
      mutate(values);
    }
    

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          form.reset();
          setOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default">{triggerText ?? "Create Workflow"}</Button>
        </DialogTrigger>
        <DialogContent>
          <CustomDialogHeader
            icon={Layers2Icon}
            title="Create Workflow"
            subtitle="start building your workflow"
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
