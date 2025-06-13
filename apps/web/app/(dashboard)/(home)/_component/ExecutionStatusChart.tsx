"use client";

import GetWorkflowExecutionStats from "@/actions/analytics/GetWorkflowExecutionStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2 } from "lucide-react";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;
const chartConfig = {
  success: {
    color: "hsl(var(--chart-2))",
    label: "Success",
  },
  failed: {
    color: "hsl(var(--chart-1))",
    label: "Failed",
  },
};

export default function ExecutionStatusChart({ stats }: { stats: ChartData }) {
  return (
    <Card className="py-4 bg-gradient-to-t from-background to-primary/5 hover:to-primary/0 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Layers2 className="mr-2" size={20} />
          Workflow Execution Status
        </CardTitle>
        <CardDescription>
          This chart displays the execution status of workflows over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            data={stats}
            height={200}
            margin={{ top: 20 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Area
              min={0}
              type={"bump"}
              fill="var(--chart-2)"
              fillOpacity={0.6}
              stroke="var(--chart-2)"
              dataKey={"success"}
              stackId={"a"}
            />
            <Area
              min={0}
              type={"bump"}
              fill="var(--chart-1)"
              fillOpacity={0.6}
              stroke="var(--chart-1)"
              dataKey={"failed"}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
