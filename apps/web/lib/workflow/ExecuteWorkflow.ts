/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export async function ExecuteWorkFlow(executionId: string) {
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
  const edge = JSON.parse(execution.definition).edges as Edge[];
  //TODO: setup execution environment
  const environment: Environment = { phases: {} };
  //TODO: initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);
  //TODO: initialize phase status

  await initializePhaseStatuses(execution);

  const creditsConsumed = 0;

  let executionFailed = false;
  for (const phase of execution.phases) {
    await waitFor(1000);
    //TODO: consumed credits
    //TODO: execute phase
    const phaseExecution = await executeWorkflowPhase(phase, environment, edge);
    if (!phaseExecution) {
      executionFailed = true;
      break;
    }

    //TODO: finalize execution
    await finalizeWorkflowExecution(
      executionId,
      execution.workflowId,
      executionFailed,
      creditsConsumed
    );
    //TODO: clean up resources
  }
  await cleanupEnvironment(environment);
  revalidatePath("/workflow/runs");
}
async function initializeWorkflowExecution(
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

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executioFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executioFailed
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
      //this means thaat we have triggered other run for this workflow
      //while an execution was running
      console.error("Error updating workflow status:", e);
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edge: Edge[]
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment, edge);

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

  //TODO: decrement credits from user balance (with required credits)
  //execute phase simulation

  const success = await executePhase(phase, node, environment, logCollector);

  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs, logCollector);
  return { success };
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edge: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    //Get inputs from the output in the environment
    const connectedEdge = edge.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "for node", node.id);
      continue;
    }
    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      finishedAt: new Date(),
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            logLevel: log.level,
            message: log.message,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    throw new Error(`No executor found for type ${node.data.type}`);
  }
  waitFor(3000)
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  //In this object we are creating a closure for the environment
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],

    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((err) => {
      console.error("Error closing browser: ", err);
    });
  }
}
