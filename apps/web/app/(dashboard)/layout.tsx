import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";

import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";


import React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen ">
      <DesktopSidebar />
      <div className="flex-1 min-h-screen flex flex-col bg-background">
        <header className=" flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton/>
          </div>
      
        </header>
        <Separator />
      </div>
    </div>
  );
}
