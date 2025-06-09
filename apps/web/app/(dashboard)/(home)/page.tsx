import { GetPeriods } from "@/actions/analytics/GetPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_component/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";

export default async function page({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
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
