import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Code, LucideProps } from "lucide-react";

export const PageToHtmlTask 
 = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from Page",
  icon: (props: LucideProps) => (
    <Code className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      
    },
  ] as const,
    outputs: [
        {
        name: "HTML",
        type: TaskParamType.STRING
        },
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ]as const,
} satisfies WorkflowTask;
