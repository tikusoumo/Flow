import prisma from "@/lib/prisma";
import { ExecuteWorkFlow } from "@/lib/workflow/executeWorkflow/ExecuteWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkFlowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];

  if (!isValidSecret(secret)) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;
  if (!workflowId) {
    return Response.json({ error: "Workflow ID is required" }, { status: 400 });
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkFlowExecutionPlan;

  if (!executionPlan) {
    return Response.json(
      { error: "Execution plan not found" },
      { status: 404 }
    );
  }
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: workflow.userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.CRON,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: workflow.userId,
              status: ExecutionPhaseStatus.PENDING,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
  });

  await ExecuteWorkFlow(execution.id);
  return new Response(JSON.stringify(execution), { status: 200 });
}

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    return false;
  }
  try {
    const timingSafeEqual = Buffer.from(secret).equals(Buffer.from(API_SECRET));
    return timingSafeEqual;
  } catch (error) {
    console.error("Error comparing secrets:", error);
    return false;
  }
}
