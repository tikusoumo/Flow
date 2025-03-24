import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

interface Prop {
    open:boolean
    setOpen:(open:boolean)=>void
    workflowName:string
}

export default function DeleteWorkflowDialog({open,setOpen,workflowName}:Prop) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your workflow and all of its data.
            </AlertDialogDescription>
            <div className='flex'>
                <p>
                    If you are sure enter <b className='text-destructive'>{workflowName}</b>
                </p>
            </div>
            <Textarea className='resize-none'></Textarea>
            <div className='flex  justify-end mt-4'>
                <Button variant='destructive' className='mr-2'>
                    Confirm
                </Button>
                <Button className='' variant={'outline'} onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </div>
        </AlertDialogContent>
    </AlertDialog>
  )
}
