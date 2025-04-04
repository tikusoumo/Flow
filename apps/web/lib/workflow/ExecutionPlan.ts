import { AppNode } from "@/types/appNode";
import {
  WorkFlowExecutionPlan,
  WorkFlowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

interface FlowToExecutionPlanType {
  executionPlan?: WorkFlowExecutionPlan;
}

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (currentNode) => TaskRegistry[currentNode.data.type].isEntryPoint
  );
  if (!entryPoint) {
    throw new Error("TODO: Error handling");
  }
  const planned = new Set<string>();
  const executionPlan: WorkFlowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkFlowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //If all incoming incomers/edges are planned and there are still invalid inputs,
          //this means that this particular node has invalid inputs
          //which means the workflow is in valid
          console.error(
            "Invalid inputs for node",
            currentNode.id,
            invalidInputs
          );
          throw new Error("TODO: Error handling");
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
     
    }
    for(const node of nextPhase.nodes){
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }
  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const inputs = TaskRegistry[node.data.type].inputs;
  const invalidInputs = [];
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      continue;
    }
    //If value is  not provided by the user then we need to check if there is an output linked to current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const requiredInputProvidedVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedVisitedOutput) {
      //The input is required and we have a valid value for it
      //provided by a task that is already planned
      continue;
    } else if (!input.required) {
      //If the input is not required but there is an output linked to it
      //then we need to be sure that the output is already planned
      if (!inputLinkedToOutput) continue;

      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        //The output is providing a value for the input : input is valid
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}
