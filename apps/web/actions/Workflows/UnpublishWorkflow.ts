"use server"

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function UnpublishWorkflow(id:string){
      const { userId } = await auth()
             if (!userId) {
                 throw new Error("User not authenticated")
             }
             
             const workflow = await prisma.workflow.findUnique({
                where: {
                    id,
                    userId,
                },
            })
            if (!workflow) {
                throw new Error("Workflow not found")
            }
            if(workflow.status !== WorkflowStatus.PUBLISHED ){
                    throw new Error("Workflow is not published")
                }

                await prisma.workflow.update({
                    where: {
                        id,
                        userId,
                    },
                    data: {
                        executionPlan:  null,
                        status: WorkflowStatus.DRAFT,
                        creditsCost:0
                    },
                })
                    revalidatePath(`/workflow/editor/${id}`)
                
}