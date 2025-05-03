import { ExecutionEnvironment } from "@/types/executor";
import { NavigateToUrlTask } from "../task/NavigateToUrl";

export async function NavigateToUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateToUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL") as string;
    if (!url) {
      environment.log.error("URL is required");
    }

    await environment.getPage()!.goto(url);

    environment.log.info(`Navigated to URL: ${url}`);

    return true;
  } catch (error) {
    environment.log.error(`Error occurred while extracting HTML: ${error}`);
    return false;
  }
}
