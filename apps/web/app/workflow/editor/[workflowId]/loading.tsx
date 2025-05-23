import { Loader2Icon } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Loader2Icon size={30} className='animate-spin stroke-primary' />
    </div>
  )
}
