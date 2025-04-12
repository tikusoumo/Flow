"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"


export async function GetWorkflowExecutionWithPhases(excutionId: string) {
  const {userId} = await auth()
    if(!userId) throw new Error("User not authenticated")
   

      return await prisma.workflowExecution.findUnique({
        where:{
          id: excutionId,
          userId
        },
        include:{
          phases:{
            orderBy:{
              number: "asc"
            }
          }
        }
      })
}
