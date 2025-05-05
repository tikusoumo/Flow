import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../../task/userInteractions/FillInput";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
   
   const  selector = environment.getInput("Selector") as string;
   if (!selector) {
     environment.log.error("Selector is required");
    }
    const value = environment.getInput("Value") as string;
    if (!value) {
      environment.log.error("Value is required");
    }
    await environment.getPage()!.type(selector, value)
    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
