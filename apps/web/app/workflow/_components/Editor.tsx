"use client"
import { ReactFlowProvider} from "@xyflow/react"

import { Workflow } from "@prisma/client"
import FlowEditor from "./FlowEditor"
import TopBar from "./topbar/TopBar"
import TaskMenu from "./TaskMenu"
import { FlowValidationContextProvider } from "@/components/Contexts/FlowValidationContext"

export default function Editor({workflow}: {workflow: Workflow}) {
  return (
    <FlowValidationContextProvider>
    <ReactFlowProvider>
        <div className="flex flex-col w-full h-full overflow-hidden">
          <TopBar title="Workflow Editor" subtitle={workflow.name} workflowId={workflow.id}/>
        <section className="flex h-full overflow-auto">
        <FlowEditor workflow={workflow} />
          <TaskMenu />
        </section>
        </div>
    </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}
