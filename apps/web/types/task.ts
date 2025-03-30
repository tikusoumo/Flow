export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    [key: string]: any;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
}

export interface StringParamProps {
    param: TaskParam
    value: string;
    updateNodeParamValue: (newValue: string) => void;
  }