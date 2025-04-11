import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkFlowExecutionPlan,
  WorkFlowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
  INVALID_INPUTS = "INVALID_INPUTS",
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
}


type FlowToExecutionPlanType =  {
  executionPlan?: WorkFlowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  }
}

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (currentNode) => TaskRegistry[currentNode.data.type].isEntryPoint
  );
  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }
  const inputsWithErrors : AppNodeMissingInputs[] = []
  const planned = new Set<string>();

const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

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
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
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
  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
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

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
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