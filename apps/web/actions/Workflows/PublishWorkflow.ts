"use server"

import prisma from '@/lib/prisma'
import { FlowToExecutionPlan } from '@/lib/workflow/executionPlan/ExecutionPlan'
import { CalculateWorkflowCost } from '@/lib/workflow/helpers'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function PublishWorkflow({
    id,
    flowDefinition
}:{
    id: string,
    flowDefinition: string
}) {
 
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
    if(workflow.status !== WorkflowStatus.DRAFT ){
        throw new Error("Workflow is not a draft")
    }
    const flow = JSON.parse(flowDefinition)
    if (!flow) {
        throw new Error("Invalid workflow definition")
    }
    const result = FlowToExecutionPlan(flow.nodes, flow.edges)
    console.log("Execution plan", result)
    if (result.error) {
        throw new Error("Invalid workflow definition: " + result.error)
    }
    if (!result.executionPlan) {
        throw new Error("Invalid workflow definition: " + result.error)
    }

    const creditsCost = CalculateWorkflowCost(flow.nodes);

    await prisma.workflow.update({
        where: {
            id,
            userId,
        },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            status: WorkflowStatus.PUBLISHED,
            creditsCost,
        },
    })
    revalidatePath(`/workflow/editor/${id}`)
}
