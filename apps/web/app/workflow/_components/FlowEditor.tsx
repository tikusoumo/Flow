"use client"

import { Workflow } from "@prisma/client"
import { Controls, ReactFlow, useEdgesState, useNodesState,Background,BackgroundVariant } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

export default function FlowEditor({workflow}: {workflow: Workflow}) {
    const [nodes,setNodes,onNodeChange] = useNodesState([])
    const [edges,setEdges,onEdgeChange] = useEdgesState([])

  return (
    <main className="flex h-full w-full">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        >
            <Controls position='top-left' />
            <Background  variant={BackgroundVariant.Dots} gap={10} size={1}/>
        </ReactFlow>
    </main>
  )
}
