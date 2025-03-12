"use client";
import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

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
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="hidden lg:flex flex-col w-[250px] bg-background shadow-lg h-screen p-4">
      <span className="text-2xl font-bold  mb-4">
        <Logo />
      </span>
      <div>Todo credits</div>
      <div className="flex flex-col ">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={buttonVariants({
                variant:
                  activeRoute.href === route.href
                    ? "sidebarItemActive"
                    : "sidebarItem",
              })}
            >
              <Icon className="h-5 w-5 " />
              <span className="">{route.lable}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-4">
        <Sheet open={isOpen} onOpenChange={setOpen} >
          <SheetTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MenuIcon/>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px space-y-4">
            <div className="flex items-center justify-between px-4 py-2"> 

          <Logo/>
            </div>
          <div className="flex flex-col gap-4">
          {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={buttonVariants({
                variant:
                  activeRoute.href === route.href
                    ? "sidebarItemActive"
                    : "sidebarItem",
              })}
            >
              <Icon className="h-5 w-5 " />
              <span className="">{route.lable}</span>
            </Link>
          );
        })}
          </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}