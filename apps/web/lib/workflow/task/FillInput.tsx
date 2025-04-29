import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {  Edit3Icon  } from "lucide-react";

export const FillInputTask 
 = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  icon: (props) => (
    <Edit3Icon className="stroke-orange-400" {...props} />
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
    {
      name: "Value",
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
