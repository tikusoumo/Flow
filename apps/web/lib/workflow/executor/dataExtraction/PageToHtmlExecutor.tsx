import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../../task/dataExtraction/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
   
    const html = await environment.getPage()!.content()
    
    
    environment.setOutput("HTML", html);
    
   
    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
