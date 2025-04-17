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
  WorkflowStatus,
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

  let executionPlan: WorkFlowExecutionPlan;
  let workflowDefinition = flowDefinition
  if(workflow.status === WorkflowStatus.PUBLISHED ){
    if(!workflow.executionPlan){
      throw new Error("Workflow is not published and execution plan is not set")
    }
    executionPlan = JSON.parse(workflow.executionPlan)
    workflowDefinition = workflow.definition
  }else {
    //workflow is a draft
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
    executionPlan = result.executionPlan;
    
  }
  
  

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
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
