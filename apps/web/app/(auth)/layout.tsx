import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background'>
      {children}
    </div>
  )
}
