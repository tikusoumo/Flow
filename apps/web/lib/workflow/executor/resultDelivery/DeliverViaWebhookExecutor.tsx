import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../../task/resultDelivery/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
   
   const  targetUrl = environment.getInput("Target Url") as string;
   if (!targetUrl) {
     environment.log.error(" Target Url is required");
    }
   const  body = environment.getInput("Body") as string;
   if (!body) {
     environment.log.error(" Body is required");
    }
   
    const response = await fetch(targetUrl,{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const statuscode = response.status;
    if (statuscode !== 200) {
      environment.log.error(`Error occurred while delivering via webhook. Status code: ${statuscode}`);
      return false;
    }
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody,null,4))
   
    return true;
  }catch (error) {
   environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}