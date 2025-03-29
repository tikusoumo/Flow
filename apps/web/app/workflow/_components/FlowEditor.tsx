
"use client"

import { CreateWorkflowNode} from "@/lib/workflow/createWorkflowNode"
import { TaskType } from "@/types/task"
import { Workflow } from "@prisma/client"
import { Controls, ReactFlow, useEdgesState, useNodesState,Background,BackgroundVariant } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import NodeComponent from "./nodes/NodeComponent"

const nodeTypes = {
  FlowNode: NodeComponent,
}

  const snapGrid: [number, number] = [15,15]
  const fitViewOptions = {padding: 1} 

export default function FlowEditor({workflow}: {workflow: Workflow}) {
    const [nodes,setNodes,onNodeChange] = useNodesState([
      CreateWorkflowNode(TaskType.LAUNCH_BROWSER)
    ])
    const [edges,setEdges,onEdgeChange] = useEdgesState([])

  return (
    <main className="flex h-full w-full">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        >
            <Controls position='top-left' fitViewOptions={fitViewOptions} />
            <Background  variant={BackgroundVariant.Dots} gap={10} size={1}/>
        </ReactFlow>
    </main>
  )
}
