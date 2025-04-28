import { TooltipProvider, TooltipTrigger, TooltipContent,Tooltip } from './ui/tooltip'
import React from 'react'


interface Props {
    children: React.ReactNode
    content: React.ReactNode
    position?: "top" | "bottom" | "left" | "right"
}


export default function TooltipWrapper(props: Props) {

  if(!props.content)
    return props.children
  return (
    <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger className="flex items-center justify-center ">
            {props.children}
            </TooltipTrigger>
            <TooltipContent side={props.position} className="w-fit">
            {props.content}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    
  )
}



