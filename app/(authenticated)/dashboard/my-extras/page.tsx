"use client";
import { ExtraPayloadGet } from "@/app/api/extra/route";
import { Button } from "@/components/ui/button";
import CustomTable, { ColumnDef } from "@/components/ui/custom-table";
import { useExtra } from "@/context/hoursProvider";
import api from "@/lib/axios";
import {
  formatCurrency,
} from "@/lib/utils";
import { Extras } from "@prisma/client";
import { Icon, Text, Title } from "@tremor/react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

const column: ColumnDef<Extras>[] = [
  {
    id: "date",
    header: "Data",
    cell: (value) => <>{format(new Date(value.date), "dd/MM/yyyy")}</>,
  },
  {
    id: "hours",
    header: "Horas",
    cell: (value) => value.hours_make,
  },
  {
    id: "discountedHours",
    header: "Horas Descontadas",
    cell: (value) => value.hasDiscounted ? value.discounted_hours : "-",
  },
  {
    id: "description",
    header: "Descrição das atividades",
    cell: (value) => (
      <Text className="truncate">{value.description || "-"}</Text>
    ),
    className: "lg:flex-[2]",
  },
  {
    id: "value",
    header: "Ganhos",
    cell: (value) => (
      <span className="text-emerald-500 font-semibold">
        {formatCurrency(value.gains)}
      </span>
    ),
  },
];

export default function MyExtras() {
  const router = useRouter();
  const { setExtra } = useExtra();

  const query = useQuery({
    queryKey: ["GetExtras"],
    queryFn: async () => {
      const { data } = await api.get<ExtraPayloadGet>("/extra");
      return data.extras;
    },
  });

  return (
    <>
      <div className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-center lg:justify-between">
          <div className="truncate">
            <Title className="text-center lg:text-start text-4xl font-bold tracking-tight">
              Seus Extras
            </Title>
            <Text className="text-center lg:text-start truncate">
              Verifique todos os seus registros de horas extras
            </Text>
          </div>
          <Button onClick={() => router.push("/dashboard/my-extras/create")}>
            <Icon icon={Plus} size="lg" />
            Adicionar hora
          </Button>
        </div>
        <CustomTable
          columns={column}
          data={query.data || []}
          loading={query.isLoading}
          rowClick={(e) => {
            setExtra(e);
            router.push(`/dashboard/my-extras/${e.id}`);
          }}
          cellRowClass="cursor-pointer"
        />
      </div>
    </>
  );
}
