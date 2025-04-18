import { AppNode } from "@/types/appNode";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LogCollector } from "@/types/log";
import { ExecutionPhase } from "@prisma/client";
import { ExecutorRegistry } from "../executor/registry";
import { createExecutionEnvironment } from "./CreateExecutionEnvironment";

export async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    throw new Error(`No executor found for type ${node.data.type}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}