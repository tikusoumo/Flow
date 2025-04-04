import { FlowToExecutionPlan } from '@/lib/workflow/ExecutionPlan'
import { AppNode } from '@/types/appNode'
import { useReactFlow } from '@xyflow/react'

const useExecutionPlan = () => {
  const {toObject} = useReactFlow()
  
  const generateExecutionPlan = () => {
    const {nodes,edges} = toObject()
    const {executionPlan} = FlowToExecutionPlan(nodes as AppNode[],edges)
    return executionPlan
  }
  return generateExecutionPlan
    
  
}

export default useExecutionPlan
