import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/timingControl/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
   
    const  selector = environment.getInput('Selector') as string;
    if (!selector) {
      environment.log.error("Selector is required");
      return false;
     }
    const  visibility = environment.getInput('Visibility') as string;
    if (!selector) {
      environment.log.error("Visibility is required");
      return false;
     }
    
    await environment.getPage()!.waitForSelector(selector,{visible: visibility === 'visible', hidden: visibility === 'hidden'});

     environment.log.info(`Waiting for element with selector: ${selector} to be ${visibility}`);

    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
