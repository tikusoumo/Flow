"use client"

import { cn } from "@/lib/utils"
import { TaskParam } from "@/types/task"
import { Handle, Position } from "@xyflow/react"
import { ColorForHandle } from "./Common"

export function NodeOutputs({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col gap-2 p-2 divide-y ' >
      {children}
    </div>
  )
}

export function NodeOutput({output}:{output:TaskParam}){
    return <div className="flex justify-end relative p-3 bg-secondary rounded-lg  " >
      <p className="text-xs text-muted-foreground font-semibold bg-secondary rounded-full px-2 py-1 ">

      {output.name}
      </p>
      <Handle id={output.name} type="source" position={Position.Right} 
      className={cn("!bg-muted-foreground !border-2 !border-background !w-4 !h-4 !-right-2 ",ColorForHandle[output.type])}/>
      </div>
}