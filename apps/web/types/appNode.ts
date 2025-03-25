import { Node } from "@xyflow/react";
export interface AppNodeData {
    [key: string]: any;
    type: Tasktype
}


export interface AppNode extends Node {
    data : AppNodeData;
}