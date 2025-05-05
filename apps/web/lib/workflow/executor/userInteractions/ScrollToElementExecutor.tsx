import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../../task/userInteractions/ScrollToElement";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector") as string;
    if (!selector) {
      environment.log.error("Selector is required");
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if(!element){
        throw new Error(`Element not found for selector: ${selector}`);
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top , behavior: "smooth" });
    }, selector);
    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
