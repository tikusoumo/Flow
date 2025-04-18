import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";

export async function initializeWorkflowExecution(
    executionId: string,
    workflowId: string
  ) {
    await prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        startedAt: new Date(),
        status: WorkflowExecutionStatus.RUNNING,
      },
    });
  
    await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        lastRunAt: new Date(),
        lastRunStatus: WorkflowExecutionStatus.RUNNING,
        lastRunId: executionId,
      },
    });
  }