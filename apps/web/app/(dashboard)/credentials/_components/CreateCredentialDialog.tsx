"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Dialog } from "@radix-ui/react-dialog";
import {  Loader2, ShieldEllipsisIcon } from "lucide-react";
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
import { CreateCredentialSchema, CreateCredentialSchemaType } from "@/schema/credentials";
import { CreateCredentials } from "@/actions/credentials/CreateCredential";
export default function CreateCredentialDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCredentialSchemaType>({
    resolver: zodResolver(CreateCredentialSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredentials,
    onSuccess: () => {
      toast.success("Credential created successfully", { id: "create-credential" });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      // If error contains redirect info, it's actually successful
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        toast.success("Credential created successfully", { id: "create-credential" });
        return;
      }
      toast.error("Error creating credential", { id: "create-credential" });
    },
  });

  const onSubmit = 
    (values: CreateCredentialSchemaType) => {
      toast.loading("Creating credential...", { id: "create-credential" });
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
          <Button variant="default">{triggerText ?? "Create"}</Button>
        </DialogTrigger>
        <DialogContent>
          <CustomDialogHeader
            icon={ShieldEllipsisIcon}
            title="Create Credential"
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
                        Enter a name for the credential. It should be unique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Value
                        <p className="text-xs text-primary">
                          (required)
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className=" resize-none
                    "
                        />
                      </FormControl>
                      <FormDescription className="pb-10">
                        Enter the value for the credential. 
                        <br/> this value will be encrypted and stored securely. 
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending} >
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
