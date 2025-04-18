import { createLogCollector } from "@/lib/log";
import prisma from "@/lib/prisma";
import { AppNode } from "@/types/appNode";
import { Environment } from "@/types/executor";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "../task/registry";
import { decrementCredits } from "./DecrementCredits";
import { setupEnvironmentForPhase } from "./SetupEnvironmentForPhase";
import { finalizePhase } from "./FinalizePhase";
import { executePhase } from "./ExecutePhase";

export async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId: string
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment, edges);

  //Update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log(`Executing phase ${phase.id} with credits: ${creditsRequired}`);


  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    //we can execute the phase if we have enough credits
    success = await executePhase(phase, node, environment, logCollector);
  }

  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}
