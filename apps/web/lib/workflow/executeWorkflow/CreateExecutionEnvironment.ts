import { AppNode } from "@/types/appNode";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LogCollector } from "@/types/log";
import { Browser, Page } from "puppeteer";

export function createExecutionEnvironment(
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ExecutionEnvironment<any> {
    //In this object we are creating a closure for the environment
    return {
      getInput: (name: string) => environment.phases[node.id]?.inputs[name],
  
      setOutput: (name: string, value: string) => {
        environment.phases[node.id].outputs[name] = value;
      },
  
      getBrowser: () => environment.browser,
      setBrowser: (browser: Browser) => (environment.browser = browser),
  
      getPage: () => environment.page,
      setPage: (page: Page) => (environment.page = page),
  
      log: logCollector,
    };
  }