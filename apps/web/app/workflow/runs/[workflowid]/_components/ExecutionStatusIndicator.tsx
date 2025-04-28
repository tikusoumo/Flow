import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus } from '@/types/workflow'
import React from 'react'



const indicatorColors : Record<WorkflowExecutionStatus, string> = { 
    PENDING: "bg-yellow-500",
    RUNNING: "bg-blue-500",
    COMPLETED: "bg-green-500",
    FAILED: "bg-red-500",
    CANCELLED: "bg-gray-500",
}
const lableColors : Record<WorkflowExecutionStatus, string> = { 
    PENDING: "text-yellow-500",
    RUNNING: "text-blue-500",
    COMPLETED: "text-green-500",
    FAILED: "text-red-500",
    CANCELLED: "text-gray-500",
}

export default function ExecutionStatusIndicator({ status }: { status: WorkflowExecutionStatus }) {
  return (
    <div className={cn("w-2 h-2 rounded-full",indicatorColors[status])} />
      
    
  )
}

export function ExecutionStatusLable({ status }: { status: WorkflowExecutionStatus }) {
  return (
    <span className={cn("lowercase font-semibold",lableColors[status] )}>
      {status.toLowerCase()}
    </span>
  )
}
