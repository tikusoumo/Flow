import Image from 'next/image'
import React from 'react'


export default function Logo() {
  return (
    <div className='flex items-center gap-2'>
        <Image
            src="/Flow.svg"
            alt="Logo"
            width={50}
            height={100}
            className="object-contain "
        />
        <span className='text-2xl font-bold'>Flow</span>
    </div>
  )
}
