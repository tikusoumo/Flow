"use client";

import { Workflow } from "@prisma/client";
import {
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Background,
  BackgroundVariant,
  useReactFlow,
  Connection,
  addEdge,
  Edge,
  getOutgoers,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { useEffect } from "react";
import { CreateWorkflowNode } from "@/lib/workflow/CreateWorkflowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/appNode";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { useTheme } from "next-themes";

const nodeTypes = {
  FlowNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [15, 15];
const fitViewOptions = { padding: 1 };

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      // if (!flow.viewport) return;
      // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      // setViewport({ x, y, zoom });
    } catch (err) {
      console.error("Error parsing workflow definition", err);
    }
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (!taskType || typeof taskType === undefined) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = CreateWorkflowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    if (!connection.targetHandle) return;
    //remove input value from target node
    const node = nodes.find((nd) => nd.id === connection.target);
    if (!nodes || !node) return;
    const nodeInputs = node?.data.inputs;
    updateNodeData(node?.id, {
      inputs: { ...nodeInputs, [connection.targetHandle]: "" },
    });
  };

  const isValidConnection = (connection: Connection | Edge) => {
    // Prevent connecting nodes to themselves
    if (connection.source === connection.target) {
      return false;
    }
    // Same taskParam type connections
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);
    if (!source || !target) {
      console.error("Invalid connection: source or target node not found");

      return false;
    }
    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];

    const output = sourceTask.outputs.find(
      (output) => output.name === connection.sourceHandle
    );
    const input = targetTask.inputs.find(
      (input) => input.name === connection.targetHandle
    );

    if (input?.type !== output?.type) {
      console.error("Invalid connection: type mismatch", { input, output });
      return false;
    }
    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };
    // Prevent creating cycles
    const detectedCycle = hasCycle(target);
    return !detectedCycle;
  }
  const { theme } = useTheme();

  return (
    <main className="flex h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Cross} gap={10} size={1} lineWidth={theme === 'dark' ? 0.1 : 5} />
      </ReactFlow>
    </main>
  );
}
