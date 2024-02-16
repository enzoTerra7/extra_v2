"use client";
import { CalendarClock, LayoutDashboard, LucideIcon, InfoIcon } from "lucide-react";
import { Logo } from "./logo";
import { Icon, Text } from "@tremor/react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type Routes = {
  name: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const routes: Array<Routes> = [
  // {
  //   name: "Dashboard",
  //   path: "/dashboard",
  //   icon: LayoutDashboard,
  //   exact: true
  // },
  {
    name: "Meu Extras",
    path: "/dashboard/my-extras",
    icon: CalendarClock,
  },
  {
    name: "Informações e Novidades",
    path: "/dashboard/information",
    icon: InfoIcon,
  },
];

export function Aside() {
  const path = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 h-[100svh] fixed top-0 left-0 bottom-0 px-6 py-7 hidden xl:flex flex-col gap-2.5 bg-neutral-100 dark:bg-neutral-900 border-r dark:border-neutral-800 border-neutral-100">
      <div className="mb-4">
        <Logo />
      </div>
      {routes.map((route, index) => {
        const isCurrent = route.exact
          ? path === route.path
          : path?.includes(route.path);
        return (
          <div
            className={cn(
              "flex items-center gap-2.5 p-2 rounded transition-colors duration-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer",
              {
                "bg-sky-200 dark:bg-sky-800 dark:hover:bg-sky-800 hover:bg-sky-200 pointer-events-none":
                  isCurrent,
              }
            )}
            key={"route-" + index + route.name}
            onClick={() => router.push(route.path)}
          >
            <Icon icon={route.icon} size="lg" className="text-sky-600 " />
            <Text>{route.name}</Text>
          </div>
        );
      })}
    </aside>
  );
}
