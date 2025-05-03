import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./dataExtraction/ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./dataExtraction/PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { WaitForElementTask } from "./timingControl/WaitForElement";
import { DeliverViaWebhookTask } from "./resultDelivery/DeliverViaWebhook";
import { ExtractDataWithAITask } from "./dataExtraction/ExtractDataWithAI";
import { ReadPropertyFromJsonTask } from "./dataStorage/ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "./dataStorage/AddPropertyToJson";
import { FillInputTask } from "./userInteractions/FillInput";
import { ClickElementTask } from "./userInteractions/ClickElement";
import { NavigateToUrlTask } from "./userInteractions/NavigateToUrl";
import { ScrollToElementTask } from "./userInteractions/ScrollToElement";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_TO_URL: NavigateToUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask

}