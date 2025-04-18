import prisma from "@/lib/prisma";
import { LogCollector } from "@/types/log";

export async function decrementCredits(
    userId: string,
    amount: number,
    logCollector: LogCollector
  ) {
    try {
      await prisma.userBalance.update({
        where: { userId, credits: { gte: amount } },
        data: {
          credits: { decrement: amount },
        },
      });
      return true;
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      logCollector.error("insufficient balance");
      return false;
    }
  }