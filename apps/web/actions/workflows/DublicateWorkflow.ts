"use server"

import prisma from "@/lib/prisma";
import { DublicateWorkflowSchemaType,DublicateWorkflowSchema } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: DublicateWorkflowSchemaType){
    const {success,data } = DublicateWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }

    const { userId } = await auth();
      if (!userId) {
        throw new Error("User not authenticated");
      }


      const sourceworkflow = await prisma.workflow.findUnique({
        where: {
          id: data.workflowId,
          userId
        },
      })
        if (!sourceworkflow) {
            throw new Error("Workflow not found or not owned by user");
        }

        const result = await prisma.workflow.create({
            data:{
                userId,
                name: data.name,
                description: data.description,
                status: WorkflowStatus.DRAFT,
                definition: sourceworkflow.definition,
        
            }
        })

        if(!result) {
            throw new Error("Failed to duplicate workflow");
        }

        revalidatePath(`/workflows`);
 } 