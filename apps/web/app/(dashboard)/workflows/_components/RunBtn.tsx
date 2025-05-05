"use client"

import { RunWorkflow } from '@/actions/Workflows/RunWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function RunBtn({workflowId}:{workflowId:string}) {

    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success("Execution started, redirecting...", {    
                id: workflowId
            });
        },
        onError: (error) => {
            if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
              toast.success("Execution started, redirecting...", { id: "flow-execution" });
              return; // Don't show failure toast on successful redirect
            }
            toast.error("Execution failed: " + error.message, { id: "flow-execution" });
          },
    })

  return (
    <div>
        <Button variant={"outline"} size={"sm"}  className='flex items-center gap-2' disabled={mutation.isPending} onClick={() => {
          
            mutation.mutate({ workflowId });
        }}>
            <PlayIcon size={16} />
            Run
        </Button>
    </div>
  )
}
