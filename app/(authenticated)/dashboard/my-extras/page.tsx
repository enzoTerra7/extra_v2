"use client";
import { ExtraPayloadGet } from "@/app/api/extra/route";
import { Button } from "@/components/ui/button";
import CustomTable, { ColumnDef } from "@/components/ui/custom-table";
import { useExtra } from "@/context/hoursProvider";
import api from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
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
    cell: (value) => (
      <p className="w-full text-left">
        <span className="text-lg font-bold uppercase lg:hidden">Dia: </span>
        {format(new Date(value.date), "dd/MM/yyyy")}
      </p>
    ),
  },
  {
    id: "hours",
    header: "Horas",
    cell: (value) => (
      <p className="w-full text-left">
        <span className="text-lg font-bold uppercase lg:hidden">
          HORAS FEITAS:{" "}
        </span>
        {value.hours_make}
      </p>
    ),
  },
  {
    id: "discountedHours",
    header: "Horas Descontadas",
    cell: (value) =>
      value.hasDiscounted ? (
        <p className="w-full text-left">
          <span className="text-lg font-bold uppercase lg:hidden">
            HORAS DESCONTADAS:{" "}
          </span>
          {value.discounted_hours}
        </p>
      ) : (
        "-"
      ),
  },
  {
    id: "description",
    header: "Descrição das atividades",
    cell: (value) => (
      <Text className="truncate">
        {value.description ? (
          <p className="w-full text-left">
            <span className="text-lg font-bold uppercase lg:hidden">
              Descrição:{" "}
            </span>
            {value.description}
          </p>
        ) : (
          "-"
        )}
      </Text>
    ),
    className: "lg:flex-[2]",
  },
  {
    id: "value",
    header: "Ganhos",
    cell: (value) => (
      <p className="w-full text-left">
        <span className="text-lg font-bold uppercase lg:hidden">
          Valor ganho:{" "}
        </span>

        <span className="text-emerald-500 font-semibold">
          {formatCurrency(value.gains)}
        </span>
      </p>
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
            <Text className="text-center text-wrap lg:text-start">
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
