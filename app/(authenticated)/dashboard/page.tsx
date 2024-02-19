"use client";
import { DashboardPayloadGet } from "@/app/api/dashboard/route";
import { Loader } from "@/components/loadar";
import { Divider } from "@/components/ui/divisor";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { minutesFormatter } from "@/lib/utils";
import {
  BadgeDelta,
  Card,
  Text,
  Title,
  AreaChart,
  CustomTooltipProps,
} from "@tremor/react";
import { useQuery } from "react-query";

const cardsData = [
  {
    title: "Horas Feitas no Mês",
    metric: "2.5h",
    deltaType: "increase",
    delta: "55%",
    total: 600,
    progress: 180,
  },
  {
    title: "Horas Totais",
    metric: "10h",
    deltaType: "unchanged",
    delta: "0%",
    total: 600,
    progress: 600,
  },
  {
    title: "Lucro no Mês",
    metric: "R$ 120,00",
    deltaType: "increase",
    delta: "55%",
    total: 600,
    progress: 180,
  },
];

const tooltip = (props: CustomTooltipProps) => {
  const { payload, active } = props;
  if (!active || !payload) return null;
  return (
    <div className="w-fit rounded-tremor-default text-tremor-default bg-neutral-50 dark:bg-neutral-950 p-2 shadow-tremor-dropdown border border-border">
      {payload.map((category, idx) => (
        <div key={idx} className="w-full flex flex-1 space-x-2.5">
          <div className="space-y-1">
            <p className="text-sky-500">{category.payload.date}</p>
            <Divider />
            <Text className="font-medium">
              {minutesFormatter(Number(category.value))}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const query = useQuery({
    queryKey: ["GetDashboardData"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard");
      return data as DashboardPayloadGet;
    },
  });

  return (
    <>
      {query.isLoading ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="md:last:col-span-2 xl:last:col-span-1 p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <div className="gap-4 flex w-full justify-between">
              <div className="truncate">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
            <Divider />
            <Skeleton className="w-full h-4" />
          </Card>
          <Card className="md:last:col-span-2 xl:last:col-span-1 p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <div className="gap-4 flex w-full justify-between">
              <div className="truncate">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
            <Divider />
            <Skeleton className="w-full h-4" />
          </Card>
          <Card className="md:last:col-span-2 xl:last:col-span-1 p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <div className="gap-4 flex w-full justify-between">
              <div className="truncate">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
            <Divider />
            <Skeleton className="w-full h-4" />
          </Card>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {query.data?.cardsData.map((item) => (
            <Card
              className="md:last:col-span-2 xl:last:col-span-1 p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900"
              key={item.title}
            >
              <div className="gap-4 flex w-full justify-between">
                <div className="truncate">
                  <Text>{item.title}</Text>
                  <Title className="truncate text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
                    {item.metric}
                  </Title>
                </div>
                <BadgeDelta
                  className="rounded-xl text-foreground"
                  deltaType={item.deltaType}
                >
                  {item.delta}
                </BadgeDelta>
              </div>
              <Divider />
              <ProgressBar progress={(item.progress * 100) / item.total} />
            </Card>
          ))}
        </div>
      )}
      <Card className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <>
          <div className="md:flex justify-between">
            <div>
              <Title> Horas Feitas </Title>
              <Text> Veja as horas feitas por você no decorrer do mês </Text>
            </div>
          </div>
          {query.isLoading ? (
            <div className="flex items-center justify-center w-full">
              <Loader />
            </div>
          ) : (
            <>
              <div className="mt-8 hidden sm:block !fill-black dark:!fill-white">
                <AreaChart
                  className="mt-5 h-72"
                  data={query.data!.graphData}
                  index="date"
                  categories={["hours"]}
                  colors={["sky"]}
                  showLegend={false}
                  valueFormatter={minutesFormatter}
                  yAxisWidth={60}
                  animationDuration={300}
                  showAnimation={true}
                  customTooltip={tooltip}
                />
              </div>
              <div className="mt-8 sm:hidden !fill-black dark:!fill-white">
                <AreaChart
                  className="mt-5 h-72"
                  data={query.data!.graphData}
                  index="date"
                  categories={["hours"]}
                  colors={["sky"]}
                  showLegend={false}
                  valueFormatter={minutesFormatter}
                  yAxisWidth={60}
                  animationDuration={300}
                  showAnimation={true}
                  customTooltip={tooltip}
                  startEndOnly={true}
                  showGradient={false}
                  showYAxis={false}
                />
              </div>
            </>
          )}
        </>
      </Card>
    </>
  );
}
