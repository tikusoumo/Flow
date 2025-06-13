import ReactCountupWrapper from '@/components/ReactCountupWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface Props {
  title: string
  value: number
  icons: LucideIcon   
}

export default function StatsCard(props: Props) {
  return (
    <Card className='relative h-full overflow-hidden py-4 mb-2 bg-gradient-to-t from-background   to-primary/10 hover:to-primary/5 hover:-translate-y-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer  '>
      <CardHeader className='flex pb-2'>
        <CardTitle className='text-2xl font-bold '>
          {props.title}    
           <props.icons size={120} className='text-muted-foreground absolute -bottom-4 -right-8  stroke-primary opacity-20' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-primary '>
          <ReactCountupWrapper
            value={props.value}
          />      
        </div>
      </CardContent>
    </Card>
  )
}
