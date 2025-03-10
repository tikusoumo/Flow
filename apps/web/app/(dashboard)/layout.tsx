
import DesktopSidebar from '@/components/Sidebar'
import { Separator } from '@/components/ui/separator'

import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
      
      <div className="flex h-screen ">
        <DesktopSidebar/>
      <div className="flex-1 min-h-screen flex flex-col bg-gray-100">
        <header className=" flex items-center justify-between px-6 py-4 h-[50px] container">
          <h1 className="text-2xl">S - Flow</h1>
        </header>
        <Separator/>
       
      </div>
      
  
    </div>
  )
}
