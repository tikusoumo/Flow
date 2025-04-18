import prisma from "@/lib/prisma";
import { LogCollector } from "@/types/log";
import { ExecutionPhaseStatus } from "@/types/workflow";

export async function finalizePhase(
  phaseId: string,
  success: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      finishedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            logLevel: log.level,
            message: log.message,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}
