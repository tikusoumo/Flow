"use client";
import { DeleteCredential } from "@/actions/credentials/DeleteCredential";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface Prop {
 name : string;
}

export default function DeleteCredentialDialog({
  name
}: Prop) {
  const [confirmName, setConfirmName] = useState("");
  const [open, setOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: name });
      setConfirmName("");
    },
    onError: () => {
      toast.error("Error deleting credential", { id: name });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full hover:bg-destructive font-bold hover:text-white transition-all duration-200  bg-destructive/50 " onClick={() => setOpen(true)}>

           {  "Delete"}
        </Button>
      </AlertDialogTrigger>

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
            <b className="text-destructive">{name}</b> to confirm
          </p>
        </div>
        <Input
          className="mt-2"
          placeholder={"Enter your credential name"}
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
            disabled={confirmName !== name || deleteMutation.isPending}
            onClick={() => {
             
              toast.loading("Deleting credential...", { id: name });
              deleteMutation.mutate(name);
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
