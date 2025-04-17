"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import parser from "cron-parser"

export async function UpdateWorkflowCron({id, cron}: {id: string, cron: string}) {



    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }
    try {
        
        const interval = parser.parse(cron, { tz: 'UTC' })
        return await prisma.workflow.update({
            where: {
                id,
            },
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
                
            },
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.error("invalid cron",error.message)
        throw new Error("Invalid cron expression")
        
    }
    revalidatePath(`/workflow/editor/${id}`)

}