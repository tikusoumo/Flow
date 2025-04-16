"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutions(workflowId: string) {

    const {userId} = await auth();
    if(!userId) {
        throw new Error("User not authenticated");
    }

    return prisma.workflowExecution.findMany({
        where: {
            workflowId: workflowId,
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        },
       
    })
}