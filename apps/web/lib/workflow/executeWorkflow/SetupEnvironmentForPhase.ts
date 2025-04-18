import { AppNode } from "@/types/appNode";
import { Environment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "../task/registry";

export function setupEnvironmentForPhase(
    node: AppNode,
    environment: Environment,
    edges: Edge[]
  ) {
    environment.phases[node.id] = {
      inputs: {},
      outputs: {},
    };
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
      if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
      const inputValue = node.data.inputs[input.name];
      if (inputValue) {
        environment.phases[node.id].inputs[input.name] = inputValue;
        continue;
      }
  
      //Get inputs from the output in the environment
      const connectedEdge = edges.find(
        (edge) => edge.target === node.id && edge.targetHandle === input.name
      );
      if (!connectedEdge) {
        console.error("Missing edge for input", input.name, "for node", node.id);
        continue;
      }
      const outputValue =
        environment.phases[connectedEdge.source].outputs[
          connectedEdge.sourceHandle!
        ];
      environment.phases[node.id].inputs[input.name] = outputValue;
    }
  }