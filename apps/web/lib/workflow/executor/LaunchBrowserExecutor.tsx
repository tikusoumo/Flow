import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    console.log(`Launching browser for URL: ${websiteUrl}`);
    
    const browser = await puppeteer.launch({
      headless: false,
    });
    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.error("Error launching browser: ", error);
    return false;
  }
}
