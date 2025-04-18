import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";

export function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
    if(!node.id){
     return  [];
   
    }
    const incomersIds = new Set();
    edges.forEach((edge) => {
      if (edge.target === node.id) {
        incomersIds.add(edge.source);
      }
    })
    return nodes.filter((node) => incomersIds.has(node.id));
   
   }