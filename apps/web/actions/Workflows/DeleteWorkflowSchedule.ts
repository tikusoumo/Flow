"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflowSchedule({ id }: { id: string }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  await prisma.workflow.update({
    where: {
      id,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });
  revalidatePath(`/workflow`);
}
