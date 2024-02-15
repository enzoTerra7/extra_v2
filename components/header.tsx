"use client";
import { ThemeToggler } from "./themeToggler";
import { MobileNav } from "./mobileNav";
import Image from "next/image";
import { Bold, Icon, Text } from "@tremor/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown, CircleUserRound, LogOut } from "lucide-react";
import { Divider } from "./ui/divisor";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authProvider";

export function Header() {
  const router = useRouter();
  const { userSignOut, data } = useAuth();
  const user = data!.user!;

  return (
    <header className="bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-800 border-neutral-100">
      <div className="flex h-24 px-8 p-4 items-center gap-x-6 justify-between">
        {/* Mobile Nav */}
        <div className="flex-[0.6] xl:hidden">
          <MobileNav />
        </div>
        <div className="flex-1 flex justify-between xl:justify-end gap-x-6 items-center">
          <div className="flex-1 justify-between xl:justify-end flex items-center gap-x-6">
            {/* User actions */}
            <Popover>
              <PopoverTrigger>
                <div className="flex gap-2.5 items-center p-1.5 rounded-sm transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                  {/* <Image
                    priority
                    alt="Imagem do usuário"
                    src="/images/defaultUser.jpg"
                    width={48}
                    height={48}
                    className="w-16 h-16 border border-border rounded-full object-cover"
                  /> */}
                  <div className="hidden sm:flex flex-col justify-center gap-1">
                    <Text className="text-start text-lg">
                      Olá,{" "}
                      <Bold>
                        {user.name} {user.lastName}
                      </Bold>
                    </Text>
                    <Text className="text-start text-xs">{user.email}</Text>
                  </div>
                  <Icon
                    icon={ChevronDown}
                    size="lg"
                    className="hidden sm:flex"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="mt-2.5 outline-none shadow dark:border dark:border-neutral-800 p-6 flex flex-col gap-4"
              >
                {/* <Image
                  priority
                  alt="Imagem do usuário"
                  src="/images/defaultUser.jpg"
                  width={48}
                  height={48}
                  className="w-16 mx-auto h-16 border border-border rounded-full object-cover"
                />
                <Divider /> */}
                <div className="flex flex-col gap-2.5">
                  <div
                    className="flex cursor-pointer items-center p-2.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300"
                    onClick={() => router.push("/dashboard/my-profile")}
                  >
                    <Icon
                      icon={CircleUserRound}
                      size="md"
                      className="text-sky-600"
                    />
                    <Text>Meu perfil</Text>
                  </div>
                  <div
                    className="flex cursor-pointer items-center p-2.5 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300"
                    onClick={userSignOut}
                  >
                    <Icon icon={LogOut} size="md" className="text-sky-600" />
                    <Text>Sair</Text>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
}
