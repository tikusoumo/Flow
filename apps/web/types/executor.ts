import { Browser } from "puppeteer";
import { WorkflowTask } from "./workflow";

export type Environment = {
    browser?: Browser;
  //Phases with nodeId as key
  phases: Record<
    string,
    {
      input: Record<string, string>;
      output: Record<string, string>;
    }
  >;
};

export type ExecutionEnvironment<T extends WorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
};