import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    
    const browser = await puppeteer.launch({
      headless: false,
    });
    environment.log.info("Browser launched successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Navigated to ${websiteUrl}`);

    return true;
  } catch (error) {
    environment.log.error(`Error occurred while launching browser: ${error}`);
    return false;
  }
}
