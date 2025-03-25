"use client"
import { ReactFlowProvider} from "@xyflow/react"

import { Workflow } from "@prisma/client"
import FlowEditor from "./FlowEditor"

export default function Editor({workflow}: {workflow: Workflow}) {
  return (
    <ReactFlowProvider>
        <div className="flex flex-col w-full h-full overflow-hidden">
        <section className="flex h-full overflow-auto">
        <FlowEditor workflow={workflow} />
        </section>
        </div>
    </ReactFlowProvider>
  )
}
