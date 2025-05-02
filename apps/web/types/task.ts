export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
    FILL_INPUT = "FILL_INPUT",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
    DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
    EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECT = "SELECT",
    CREDENTIAL = "CREDENTIAL",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
}

export interface StringParamProps {
    param: TaskParam
    value: string;
    updateNodeParamValue: (newValue: string) => void;
    disabled?: boolean;
  }