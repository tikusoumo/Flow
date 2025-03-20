"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function getWorkflowsForUsers() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
//   return null;
  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
