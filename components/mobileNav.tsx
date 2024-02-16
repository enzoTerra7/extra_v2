"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { routes } from "./aside";
import { Icon, Text } from "@tremor/react";

export function MobileNav() {
  const path = usePathname();
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="outline-none border-border">
        <div className="relative w-full h-full flex flex-col gap-4">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <hr className="w-full border-border border" />
          <nav className={cn("flex flex-col gap-4")}>
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
                    },
                  )}
                  key={"route-" + index + route.name}
                  onClick={() => router.push(route.path)}
                >
                  <Icon icon={route.icon} size="lg" className="text-sky-600 " />
                  <Text>{route.name}</Text>
                </div>
              );
            })}
          </nav>
          <div className="absolute bottom-4 w-full flex flex-col gap-4">
            <hr className="w-full border-border border" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
