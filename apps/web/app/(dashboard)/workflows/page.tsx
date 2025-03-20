import getWorkflowsForUsers from "@/actions/getWorkflowsForUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import React, { Suspense } from "react";

import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";

export default function page() {
  return (
    <div>
      <div className="flex h-full flex-col flex-1 px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Workflows</h1>
            <p className="text-muted-foreground">Manage your workflows</p>
          </div>
          <CreateWorkflowDialog triggerText="Create Workflow" />
        </div>
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-4 px-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-md" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await getWorkflowsForUsers();

  if (!workflows) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Alert variant={"destructive"}>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching your workflows. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first Workflow" />
      </div>
    );
  }
  return <div></div>;
}
