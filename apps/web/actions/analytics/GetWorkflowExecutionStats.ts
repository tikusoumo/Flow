"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

export default async function GetWorkflowExecutionStats(period: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED],
      },
    },
    select: {
      startedAt: true,
      status: true,
    },
  });

  const dateFormat = "yyyy-MM-dd";

  // Initialize stats object with all dates in the range
  const stats: Record<string, { success: number; failed: number }> = {};

  // Pre-populate all dates in the range with default values
  const allDatesInRange = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  });

  allDatesInRange.forEach((date) => {
    const formattedDate = format(date, dateFormat);
    stats[formattedDate] = { success: 0, failed: 0 };
  });

  // Now populate with actual execution data
  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);

    // Initialize the date entry if it doesn't exist (extra safety)
    if (!stats[date]) {
      stats[date] = { success: 0, failed: 0 };
    }

    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    } else if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

 const  result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }));

  return result;
}
