import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Web Page");
    console.log(`Launching browser for URL: ${websiteUrl}`);
    
   
    return true;
  } catch (error) {
    console.error("Error launching browser: ", error);
    return false;
  }
}
