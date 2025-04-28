import { FlowToExecutionPlan, FlowToExecutionPlanValidationError } from '@/lib/workflow/executionPlan/ExecutionPlan'
import { AppNode } from '@/types/appNode'
import { useReactFlow } from '@xyflow/react'
import useFlowValidation from './useFlowValidation'
import { toast } from 'sonner'

const useExecutionPlan = () => {
  const {toObject} = useReactFlow()
  const {setInvalidInputs,clearErrors} = useFlowValidation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    switch(error.type){
      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error("No entry point found in the workflow")
        break
      
      case FlowToExecutionPlanValidationError.INVALID_INPUTS:
        toast.error("Invalid inputs found in the workflow")
        setInvalidInputs(error.invalidElements)
        break
      default:
        toast.error("something went wrong")
        break
    }
  }

  
  const generateExecutionPlan = () => {
    const {nodes,edges} = toObject()
    const {executionPlan,error} = FlowToExecutionPlan(nodes as AppNode[],edges)

    if(error) {
     handleError(error)
     return null
    }
    clearErrors()
    return executionPlan
  }
  return generateExecutionPlan
    
  
}

export default useExecutionPlan
