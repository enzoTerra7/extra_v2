"use client";
import { Card, Icon, Metric, Text, Title } from "@tremor/react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { ContactForm } from "./components/contactForm";
import { ValueForm } from "./components/valuesForm";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/authProvider";
import { Divider } from "@/components/ui/divisor";
import { formatCurrency } from "@/lib/utils";
import api, { AxiosError } from "@/lib/axios";
import { useMutation } from "react-query";
import { UpdateUserPhoto } from "@/app/api/user/image/route";
import { toast } from "sonner";
import { Loader } from "@/components/loadar";
import { UpdateCookiesAndHeader } from "@/lib/extras/utils";

export default function MyExtras() {
  const { data, getUser } = useAuth();
  const user = data!.user!;

  const [newImage, setNewImage] = useState<File | null>(null);

  const mutation = useMutation({
    mutationKey: ["updateUserImage"],
    mutationFn: async (e: { file: string }) => {
      const { data } = await api.post("/user/image", e);
      return data as UpdateUserPhoto;
    },
    onSuccess(data) {
      toast.success("Imagem atualizada com sucesso");
      UpdateCookiesAndHeader(data.user, data.session);
      setNewImage(null);
      getUser();
    },
    onError(err: AxiosError) {
      toast.error(
        typeof err.response.data === "string"
          ? err.response.data
          : "Verifique as informações"
      );
    },
  });

  const updateImage = useCallback((e: { file: string }) => mutation.mutate(e), []);

  useEffect(() => {
    if (newImage instanceof File) {
      const reader = new FileReader();

      reader.onload = function (e) {
        updateImage({
          file: e.target!.result as string,
        });
      };

      reader.readAsDataURL(newImage);
    }
  }, [newImage, updateImage]);

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:last:col-span-2 xl:last:col-span-1 p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
          <div className="truncate">
            <Text className="opacity-80">Valor da sua hora</Text>
            <Title className="truncate text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              Veja quanto vale sua hora
            </Title>
          </div>
          <Divider />
          <Metric className="text-emerald-600 dark:text-emerald-400 text-xl xl:text-2xl font-bold">
            {formatCurrency(user.hour_value)}
          </Metric>
        </Card>
        <Card className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
          <div className="truncate">
            <Text className="opacity-80">Valor da sua hora EXTRA</Text>
            <Title className="truncate text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              Veja quanto vale sua hora extra
            </Title>
          </div>
          <Divider />
          <Metric className="text-emerald-600 dark:text-emerald-400 text-xl xl:text-2xl font-bold">
            {formatCurrency(user.extra_hour_value)}
          </Metric>
        </Card>
      </div>
      <div className="relative w-44 h-44 rounded-full mx-auto overflow-hidden border border-border group">
        {mutation.isLoading ? (
          <div className="flex items-center justify-center w-full h-full object-cover pointer-events-none">
            <Loader />
          </div>
        ) : (
          <Image
            priority
            alt="Imagem do usuário"
            src={user.image ?? "/images/defaultUser.jpg"}
            width={382}
            height={382}
            className="w-full h-full object-cover pointer-events-none"
          />
        )}
        <label
          className="h-0 overflow-hidden group-hover:w-full flex absolute bottom-0 bg-neutral-100/70 dark:bg-neutral-950/70 hover:opacity-80 left-0 right-0 group-hover:h-12 items-center justify-center transition-all duration-300 cursor-pointer"
          htmlFor="editImage"
        >
          <Icon icon={Pencil} size="md" />
        </label>
        <input
          type="file"
          id="editImage"
          name="editImage"
          className="absolute w-0 h-0 opacity-0"
          accept="image/*"
          min={1}
          max={1}
          onChange={(e) => {
            if (!!e.target.files?.length) {
              setNewImage(e.target.files[0]);
              return;
            }
            setNewImage(null);
          }}
        />
      </div>
      <div className="w-full flex flex-col p-6 gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="truncate mb-4">
          <Title className="text-center lg:text-start text-xl lg:text-2xl font-bold tracking-tight">
            Informações de Contato
          </Title>
        </div>
        <ContactForm
          user={{
            name: user.name,
            email: user.email,
            lastName: user.lastName || undefined,
            phone: user.phoneNumber || undefined,
          }}
          getInformation={() => getUser()}
        />
      </div>
      <div className="w-full flex flex-col p-6 gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="truncate mb-4">
          <Title className="text-center lg:text-start text-xl lg:text-2xl font-bold tracking-tight">
            Informações de Salário
          </Title>
        </div>
        <ValueForm
          userValues={{
            value: user.salary,
            days: String(user.days),
            hours: String(user.hours),
          }}
          getInformation={() => getUser()}
        />
      </div>
    </>
  );
}
