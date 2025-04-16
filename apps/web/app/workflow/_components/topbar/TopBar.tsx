"use client"
import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'
import SaveBtn from './SaveBtn'
import ExecuteBtn from './ExecuteBtn'
import NavigationTabs from './NavigationTabs'

interface TopBarProps {
  title: string
  subtitle?: string
  workflowId: string
  hideButtons?: boolean
}

export default function TopBar({title,subtitle,workflowId,hideButtons=false}: TopBarProps) {
    const router = useRouter()
  return (
    <header className='flex justify-between   w-full h-[60px] p-1 bg-background border-p-2 border-separate shadow-sm sticky top-0 z-10'>
      <div className="flex gap-1" >
        <TooltipWrapper content="Back">
            <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
                <ChevronLeftIcon size={20} />
            </Button>
        </TooltipWrapper>
        <div >
            <p className='font-bold  text-ellipsis truncate'>{title}</p>
            {subtitle && <span className="text-muted-foreground text-xs  truncate text-ellipsis">{subtitle}</span>}
        </div>
      </div>
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center '>
        <NavigationTabs workflowId={workflowId}/>
      </div>
      <div className='flex items-center gap-2'>
        {!hideButtons && <>
        <ExecuteBtn workflowId={workflowId}/>
        <SaveBtn workflowId={workflowId}/>
        </>} 
      </div>
    </header>
  )
}
