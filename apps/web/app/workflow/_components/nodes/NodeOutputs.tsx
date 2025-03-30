"use client"

import { TaskParam } from "@/types/task"

export function NodeOutputs({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col gap-2 p-2 divide-y ' >
      {children}
    </div>
  )
}

export function NodeOutput({output}:{output:TaskParam}){
    return <div>{output.name}</div>
}