"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function GetStatsCardValues(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const { COMPLETED, FAILED } = WorkflowExecutionStatus;
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: { creditsConsumed: { not: null } },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });
  const stats = { 
    workflowExecutions: executions.length,
    creditsComsumed: 0,
    phaseExecutions: 0,
  };
  stats.creditsComsumed = executions.reduce((acc, execution) => acc + (execution.creditsConsumed ?? 0), 0);

  stats.phaseExecutions = executions.reduce((acc, execution) => acc + (execution.phases.length ?? 0), 0);



  return stats;
}
