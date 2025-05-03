import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../../task/userInteractions/ClickElement";

export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
   
   const  selector = environment.getInput("Selector") as string;
   if (!selector) {
     environment.log.error("Selector is required");
    }
   
    await environment.getPage()!.click(selector);
    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
