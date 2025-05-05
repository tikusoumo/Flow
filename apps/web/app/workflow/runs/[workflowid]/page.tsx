import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions";
import TopBar from "../../_components/topbar/TopBar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

export default async function page(props: { params: Promise<{ workflowid: string }> }) {
  const params = await props.params;

  return (
    <div className="h-full w-full overflow-auto">
      <TopBar
        title="All Runs"
        subtitle="View all runs for this workflow"
        workflowId={params.workflowid}
        hideButtons
        initialDefinition={""}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            <Loader2Icon
              size={30}
              className="animate-spin stroke-primary "
              
            />
          </div>
        }
      >
        <ExecutionTableWrapper workflowId={params.workflowid} />
      </Suspense>
    </div>
  );
}

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No executions found</div>;
  }
  if (executions.length === 0) {
    return  (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No runs have been triggered for this workflow</p>
          <p className="text-sm text-muted-foreground">
            You can trigger a run in the editor.
          </p>
        </div>
      </div>
    );
  }
  return <div className=" px-50 py-6 w-full">
    <ExecutionsTable workflowId={workflowId} initialData={executions} />
  </div>
}
