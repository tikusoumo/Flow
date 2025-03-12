
import React from 'react'
import FlowLogo from './svgs/Flowlogo'


export default function Logo() {
  return (
    <div className='flex items-center gap-2'>
        <FlowLogo className='text-violet-500' width={40} height={40} />
        <span className='text-2xl font-bold'>Flow</span>
    </div>
  )
}
