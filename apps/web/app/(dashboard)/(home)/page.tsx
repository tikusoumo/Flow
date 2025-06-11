import { GetPeriods } from "@/actions/analytics/GetPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_component/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardValues } from "@/actions/analytics/GetStatsCardValues";
import StatsCard from "./_component/StatsCard";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <Suspense
          fallback={<Skeleton className="w-[180px] h-[40px]"></Skeleton>}
        >
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <StatsCards selectedPeriod={period} />
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();

  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stats = await GetStatsCardValues(selectedPeriod);

  return <StatsCard  />;
}
