"use client";

import { GetAvailableCredits } from "@/actions/billing/GetAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import ReactCountupWrapper from "./ReactCountupWrapper";
import { buttonVariants } from "./ui/button";

export default function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return (
    <Link href={"/billing"} className={cn("w-full  items-center", buttonVariants({ variant: "outline" }))}>
      <CoinsIcon className="h-4 w-4 text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="animate-spin" />}
        {!query.isLoading && query.data && <ReactCountupWrapper value={query.data} />}
        {!query.isLoading && query.data === undefined && "-"}
      </span>
    </Link>
  );
}
