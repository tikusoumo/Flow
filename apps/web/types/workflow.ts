import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode } from "./appNode";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
}

export type WorkFlowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
}

export type WorkFlowExecutionPlan = WorkFlowExecutionPlanPhase[]


export enum workflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}
export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  
}