
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import Editor from '../../_components/Editor';

type Params = Promise<{workflowId: string}>

export default async function page({params}: {params: Params}) {
    const { workflowId } = await params;
    const { userId } = await auth();
    if (!userId) {
        return <div>Unauthorized</div>;
    }
const workflow = await prisma.workflow.findUnique({
    where: {
        id: workflowId,
        userId: userId,
    },
})
if (!workflow) {
    return <div>Workflow not found</div>;
}

  return <Editor workflow={workflow} />;
}
