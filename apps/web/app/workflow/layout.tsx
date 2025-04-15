
import Logo from '@/components/Logo'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full h-screen ">
      {children}
      <Separator className="w-full h-1 bg-gray-600" />
      <footer className="flex items-center justify-between  w-full h-16 bg-gray-100 dark:bg-gray-800">
        <Logo/>
        <ModeToggle />
      </footer>

    </div>
  )
}