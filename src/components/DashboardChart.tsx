"use client";

import * as React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  calculateAngle,
  calculatePercentage,
  convertFileSize,
} from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

export function DashboardChart({ used = 0 }: { used: number }) {
  const chartData = [
    { storage: `Used ${calculatePercentage(used)}`, 10: used, fill: "white" },
  ];

  return (
    <Card className="flex flex-col items-center rounded-[20px] bg-brand p-5 py-12 text-white xl:flex-row">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-[180px] text-white xl:w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={Number(calculateAngle(used)) + 90}
            innerRadius={80}
            outerRadius={110}
            barSize={40}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-white/20 last:fill-brand"
              polarRadius={[86, 72]}
            />

            <RadialBar dataKey="storage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="h2 fill-white"
                        >
                          {used && calculatePercentage(used)
                            ? calculatePercentage(used)
                                .toString()
                                .replace(/^0+/, "")
                            : "0"}
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="subtitle-1 fill-white/70"
                        >
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="flex-1 items-start px-3 py-0 sm:px-5 lg:p-3 xl:pr-5">
        <CardTitle className="h3">Available Storage</CardTitle>
        <CardDescription className="subtitle-1 text-white/70">
          {used ? convertFileSize(used) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
