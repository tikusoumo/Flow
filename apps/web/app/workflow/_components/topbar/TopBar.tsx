"use client"
import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'
import SaveBtn from './SaveBtn'

interface TopBarProps {
  title: string
  subtitle?: string
  workflowId: string
}

export default function TopBar({title,subtitle,workflowId}: TopBarProps) {
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
      <div className='flex items-center gap-2'>
        <SaveBtn workflowId={workflowId}/>
      </div>
    </header>
  )
}
