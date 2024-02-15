import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export function Divider({
  vertical,
  className,
}: {
  vertical?: boolean;
  className?: ClassNameValue;
}) {
  return (
    <div
      className={cn("border-neutral-200 dark:border-neutral-800", {
        "h-full w-[1px] border-r": vertical,
        "w-full h-[1px] border-b": !vertical,
        className,
      })}
    />
  );
}
