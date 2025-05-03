import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  ArrowUp } from "lucide-react";

export const ScrollToElementTask 
 = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to Element",
  icon: (props) => (
    <ArrowUp className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
      
    },
  ] as const,
    outputs: [
        
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ]as const,
} satisfies WorkflowTask;
