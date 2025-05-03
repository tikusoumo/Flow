import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "./userInteractions/FillInputExecutor";
import { ClickElementExecutor } from "./userInteractions/ClickElementExecutor";
import { AddPropertToJsonExecutor } from "./dataStorage/AddPropertyToJsonExecutor";
import { NavigateToUrlExecutor } from "./userInteractions/NavigateToUrl";
import { ScrollToElementExecutor } from "./userInteractions/ScrollToElementExecutor";
import { PageToHtmlExecutor } from "./dataExtraction/PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./dataExtraction/ExtractTextFromElementExecutor";
import { WaitForElementExecutor } from "./timingControl/WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./resultDelivery/DeliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./dataExtraction/ExtractDatawithAIExecutor";
import { ReadPropertFromJsonExecutor } from "./dataStorage/ReadPropertyFromJsonExecutor";

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertToJsonExecutor,
  NAVIGATE_TO_URL: NavigateToUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor
};
