import { Environment } from "@/types/executor";

export async function cleanupEnvironment(environment: Environment) {
    if (environment.browser) {
      await environment.browser.close().catch((err) => {
        console.error("Error closing browser: ", err);
      });
    }
  }
  