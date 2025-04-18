import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";

export async function finalizeWorkflowExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number
  ) {
    const finalStatus = executionFailed
      ? WorkflowExecutionStatus.FAILED
      : WorkflowExecutionStatus.COMPLETED;
  
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        finishedAt: new Date(),
        status: finalStatus,
        creditsConsumed,
      },
    });
  
    await prisma.workflow
      .update({
        where: { id: workflowId, lastRunId: executionId },
        data: {
          lastRunStatus: finalStatus,
        },
      })
      .catch((e) => {
        //ignore
        //this means that we have triggered other run for this workflow
        //while an execution was running
        console.error("Error updating workflow status:", e);
      });
  }
  