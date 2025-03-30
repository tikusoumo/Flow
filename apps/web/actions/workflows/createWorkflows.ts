"use server";

import prisma from "@/lib/prisma";
import { CreateWorkflowNode } from "@/lib/workflow/createWorkflowNode";
import {
  CreateWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: CreateWorkflowSchemaType) {
  const { success, data } = CreateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const initialFlow :{nodes:AppNode[],edges:Edge[]} = {
    nodes:[],
    edges:[]
  }

  initialFlow.nodes.push(CreateWorkflowNode(TaskType.LAUNCH_BROWSER))
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
