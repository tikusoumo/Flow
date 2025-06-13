import { GetPeriods } from "@/actions/analytics/GetPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_component/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardValues } from "@/actions/analytics/GetStatsCardValues";
import StatsCard from "./_component/StatsCard";
import { CirclePlay, Coins, LucideWaypoints } from "lucide-react";
import GetWorkflowExecutionStats from "@/actions/analytics/GetWorkflowExecutionStats";
import ExecutionStatusChart from "./_component/ExecutionStatusChart";

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
      <div className="py-6 h-full flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <StatsExecutionStatus
            selectedPeriod={period}
          />
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

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stats = await GetStatsCardValues(selectedPeriod);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={stats.workflowExecutions}
        icons={CirclePlay}
      />
      <StatsCard
        title="Phase Executions"
        value={stats.phaseExecutions}
        icons={LucideWaypoints}
      />
      <StatsCard
        title="Credit Consumed"
        value={stats.creditsComsumed}
        icons={Coins}
      />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
   
      
    </div>
  );
}
async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {

  const stats = await GetWorkflowExecutionStats(selectedPeriod);

  return <ExecutionStatusChart stats={stats} selectedPeriod={selectedPeriod} />;
}