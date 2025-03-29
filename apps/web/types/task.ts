export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER"
}

export enum TaskParamType {
    STRING = "STRING",
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