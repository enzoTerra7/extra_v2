import { cn } from "@/lib/utils";
import { Icon } from "@tremor/react";
import { CircleOff } from "lucide-react";
import React from "react";
import { ClassNameValue } from "tailwind-merge";
import { Loader } from "../loadar";

export type ColumnDef<T> = {
  accessorKey?: keyof T;
  id?: string;
  header?: string;
  className?: ClassNameValue;
  cell?: (value: T) => React.ReactNode;
};

export type TableProps<T> = {
  data: T[];
  columns: Array<ColumnDef<T>>;
  containerClass?: ClassNameValue;
  cellRowClass?: ClassNameValue;
  headerRowClass?: ClassNameValue;
  rowClick?: (value: T) => void;
  loading?: boolean;
};

export default function CustomTable<T>({
  data,
  columns,
  containerClass,
  cellRowClass,
  headerRowClass,
  rowClick,
  loading,
}: TableProps<T>) {
  return (
    <div
      className={cn(
        "w-full flex flex-col lg:px-4 py-6 rounded-xl bg-neutral-100 dark:bg-neutral-900",
        containerClass,
      )}
    >
      <div
        className={cn(
          "w-full hidden lg:flex items-center gap-4 p-4 border-b border-border",
          headerRowClass,
        )}
      >
        {columns.map((column, index) => (
          <div
            key={"header" + index}
            className={cn(
              "flex flex-1 text-center text-lg font-bold text-neutral-900 dark:text-neutral-200 pointer-events-none",
              column.className,
            )}
          >
            {column.header || ""}
          </div>
        ))}
      </div>
      {loading ? (
        <div className="w-full items-center justify-center p-6 flex flex-col gap-3 text-neutral-600 dark:text-neutral-300 text-sm font-medium">
          <Loader />
          <p className="text-center">Buscando os dados</p>
        </div>
      ) : (
        data.map((row, index) => (
          <div
            className={cn(
              "w-full flex flex-col lg:flex-row lg:items-center gap-4 p-4 border-b border-border transition-colors duration-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 last:rounded-es-lg last:rounded-ee-lg last:border-none",
              {
                "rounded-ss-lg rounded-se-lg lg:rounded-none": index == 0,
              },
              cellRowClass,
            )}
            key={"row" + index}
            onClick={rowClick ? () => rowClick(row) : undefined}
          >
            {columns.map((column, idx) => (
              <div
                key={"content" + index + idx}
                className={cn(
                  "flex lg:flex-1 text-center pointer-events-none text-sm text-black dark:text-white",
                  column.className,
                )}
              >
                {column?.accessorKey
                  ? (row[column.accessorKey] as React.ReactNode)
                  : column?.cell
                    ? column.cell(row)
                    : ""}
              </div>
            ))}
          </div>
        ))
      )}
      {!!!data.length && !loading && (
        <div className="w-full items-center justify-center p-6 flex flex-col gap-3 text-neutral-600 dark:text-neutral-300 text-sm font-medium">
          <Icon icon={CircleOff} size="xl" />
          <p className="text-center">
            Não foi encontrado nenhuma dado na listagem
          </p>
        </div>
      )}
    </div>
  );
}
