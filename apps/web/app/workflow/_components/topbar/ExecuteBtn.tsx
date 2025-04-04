"use client"

import { Button } from "@/components/ui/button"
import useExecutionPlan from "@/hooks/useExecutionPlan"
import { PlayIcon } from "lucide-react"

export default function ExecuteBtn({workflowId}: {workflowId: string}) {

  const generate = useExecutionPlan()
  return (
    <Button variant={'outline'} className="flex items-center gap-2" onClick={() => {
      const plan = generate()
      console.log("=======plan======")
      console.table(plan)
    }}>
        <PlayIcon size={20} className="stroke-yellow-400" />
        Execute
    </Button>
  )
}
