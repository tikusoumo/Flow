import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "../task/registry";

export function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
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
