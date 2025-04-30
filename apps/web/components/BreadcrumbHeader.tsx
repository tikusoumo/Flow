"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { MobileSidebar } from "./Sidebar";
import { ArrowRight } from "lucide-react";


export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname.split("/");
  return (
    <div className="flex items-center ">
      <MobileSidebar/>
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                  {path === "" ? "Home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < paths.length - 1 && (
               <BreadcrumbSeparator/>
              )}
            </React.Fragment>
          ))}
          
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
