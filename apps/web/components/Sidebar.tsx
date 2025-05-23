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
import { DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  
  // Find the best match based on path segments
  let activeRoute = routes[0]; // Default to Home
  // Find the active route by checking which route matches the current path
  const active = routes.find(
    (route) =>
      (route.href === "/" && pathname === "/") ||
      (route.href !== "/" && pathname.startsWith(route.href))
  );
  activeRoute = active || routes[0];
       
  return (
    <div className="hidden lg:flex flex-col w-[250px] bg-background shadow-lg h-screen p-4 border-r">
      <span className="text-2xl font-bold  mb-4">
        <Logo />
      </span>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col ">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                buttonVariants({
                  variant:
                    activeRoute.href === route.href
                      ? "sidebarItemActive"
                      : "sidebarItem",
                }),
                "mb-0.5 transition-all  duration-200 ease-in-out"
              )}
            >
              <Icon className="h-5 w-5 " />
              <span className="">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between ">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size={"icon"} >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[250px] sm:w-[540px] py-4 px-4"
          >
            <VisuallyHidden>
              <DialogTitle>Navigation Menu</DialogTitle>
            </VisuallyHidden>
            <Logo />
            <div className="p-2">
              <UserAvailableCreditsBadge />
            </div>

            <div className="flex flex-col gap-1">
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
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5 " />
                    <span className="">{route.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
