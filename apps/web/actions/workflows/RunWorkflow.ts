"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkFlow } from "@/lib/workflow/ExecuteWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkFlowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let excutionPlan: WorkFlowExecutionPlan;
  if (!flowDefinition) {
    throw new Error("Flow definition is required");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Error in flow definition: " + result.error);
  }
  if (!result.executionPlan) {
    throw new Error("Execution plan is empty");
  }
  excutionPlan = result.executionPlan;
  

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      phases: {
        create: excutionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.PENDING,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("Execution creation failed");
  }
  ExecuteWorkFlow(execution.id); //run this in background
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
