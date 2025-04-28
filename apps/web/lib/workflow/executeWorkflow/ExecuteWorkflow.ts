import "server-only";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { waitFor } from "../../helper/waitFor";
import { Environment} from "@/types/executor";
import { initializeWorkflowExecution } from "./InitializeWorkflowExecution";
import { initializePhaseStatuses } from "./InitializePhaseStatuses";
import { cleanupEnvironment } from "./CleanupEnvionment";
import { finalizeWorkflowExecution } from "./FinalizeWorkflowExecution";
import { executeWorkflowPhase } from "./ExecuteWorkflowPhase";

export async function ExecuteWorkFlow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("Execution not found");
  }
  const edges = JSON.parse(execution.definition)?.edges || [];
  const environment: Environment = { phases: {} };
  await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);

  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;

  let executionFailed = false;
  for (const phase of execution.phases) {
    await waitFor(1000);

    const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);
    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }

  }
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  await cleanupEnvironment(environment);
  revalidatePath("/workflow/runs");
}















