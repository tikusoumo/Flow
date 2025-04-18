import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const  now = new Date();
    const workflows = await prisma.workflow.findMany({
        select: {
            id: true

        },
        where:{
            status: WorkflowStatus.PUBLISHED,
            cron: { not: null },
            nextRunAt: {
                lte: now
            }
        }
    })

    console.log("Cron job triggered", workflows.length, "workflows to run");
    for (const workflow of workflows) {
        triggerWorkflow(workflow.id);
    }

    return  Response.json({ workflowToRun: workflows.length, status: 200 });
}

function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);
    
    fetch(triggerApiUrl, {
        headers:{
            Authorization: `Bearer ${process.env.API_SECRET!}`,
            "Content-Type": "application/json"
        },
        cache: "no-store",
    }).catch((error) => {
        console.error("Error triggering workflow:", error.message);
    });
}