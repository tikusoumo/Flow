import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper/waitFor";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <div className="flex h-full flex-col flex-1 px-4">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Workflows</h1>
            <p className="text-muted-foreground">Manage your workflows</p>
          </div>
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
                <Skeleton
                    key={index}
                    className="h-32 w-full rounded-md"
                    
                />
            ))}
        </div>
    )
}

async function UserWorkflows() {
    await waitFor(3000);
  return (
    <div >
     
    </div>
  );
}