import { GetWorkflowExecutionWithPhases } from "@/actions/Workflows/GetWorkflowExecutionWithPhases";
import TopBar from "@/app/workflow/_components/topbar/TopBar";

import { LoaderCircle } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function ExecutionViewerPage({
  params,
}: {
  params: Promise<{ workflowid: string; executionid: string }>;
}) {
  const { workflowid, executionid } = await params;

  return (
    <div className="flex flex-col h-screen overflow-hidden w-full">
      <TopBar
        workflowId={workflowid}
        title="Execution Details"
        subtitle={`RunId: ${executionid}`}
        hideButtons
        initialDefinition={""}
      />
      <section className="flex flex-col h-full w-full overflow-hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full w-full">
              <LoaderCircle
                className="animate-spin stroke-primary "
                size={40}
              />
            </div>
          }
        >
          <ExecutionViewerWrapper executionid={executionid} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionid,
}: {
  executionid: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionid);
  if (!workflowExecution)
    return (
      <div className="flex items-center justify-center h-full w-full">
        No execution found
      </div>
    );

  return <ExecutionViewer initialData={workflowExecution} />;
}
