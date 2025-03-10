"use client"
import { CoinsIcon, HomeIcon, Layers2Icon, ShieldCheckIcon } from 'lucide-react'
import React from 'react'

const routes = [
  {
    href: "",
    lable: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    lable: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    lable: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    lable: "Billing",
    icon: CoinsIcon,
  },
]

export default function DesktopSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-[250px] bg-white shadow-lg h-screen p-4">
        <span className='text-2xl font-bold  mb-4'>
        DesktopSidebar
        </span>
    </div>
  )
}
