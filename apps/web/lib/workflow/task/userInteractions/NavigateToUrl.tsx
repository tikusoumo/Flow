import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon } from "lucide-react";

export const NavigateToUrlTask 
 = {
  type: TaskType.NAVIGATE_TO_URL,
  label: "Navigate to URL",
  icon: (props) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      
    },
    {
      name: "URL",
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
