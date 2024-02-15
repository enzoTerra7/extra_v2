"use client";
import { ExtraPayloadPostAndPut } from "@/app/api/extra/route";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import api, { AxiosError } from "@/lib/axios";
import { hourDifference } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon, Text, Title } from "@tremor/react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  description: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  initHours: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  finalHours: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  date: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  discountHours: z.boolean().default(false),
  discountedHours: z.string().default(""),
});

type FormData = z.infer<typeof schema>;

export default function MyExtras() {
  const router = useRouter();
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  const { watch } = methods;

  const initHours = watch("initHours");
  const finalHours = watch("finalHours");
  const showDiscountedHours = watch("discountHours");

  const mutation = useMutation({
    mutationKey: ["extra"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/extra", {
        ...formData,
        discountedHours: formData.discountHours ? formData.discountedHours : "",
      });
      return data as ExtraPayloadPostAndPut;
    },
    onSuccess(data) {
      console.log("returned extra payload", data);
      toast.success("Extra criado com sucesso");
      router.push("/dashboard/my-extras");
    },
    onError(error: AxiosError) {
      toast.error(
        typeof error.response.data === "string"
          ? error.response.data
          : "Verifique as informações"
      );
    },
  });

  return (
    <>
      <Form
        handleSubmit={methods.handleSubmit}
        onSubmit={mutation.mutate}
        className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-center lg:justify-between">
          <div className="truncate">
            <Title className="text-center lg:text-start text-4xl font-bold tracking-tight">
              Adicionar Extras
            </Title>
            <Text className="text-center lg:text-start truncate">
              Faça o registro das suas horas extras
            </Text>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-4">
            <Button
              disabled={mutation.isLoading}
              variant={"ghost"}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isLoading}
              loading={mutation.isLoading}
            >
              <Icon icon={Check} size="lg" />
              Salvar extra
            </Button>
          </div>
        </div>
        <div className="w-full space-y-6 lg:px-4 py-6 rounded-xl">
          <Input
            {...methods}
            disabled={mutation.isLoading}
            name="date"
            label="Dia de atuação"
            type="date"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...methods}
              disabled={mutation.isLoading}
              name="initHours"
              label="Hora de Início"
              placeholder="Selecione uma data"
              type="time"
              required
            />
            <Input
              {...methods}
              disabled={mutation.isLoading}
              name="finalHours"
              label="Hora de Término"
              type="time"
              min={initHours}
              required
            />
          </div>
          <Textarea
            {...methods}
            disabled={mutation.isLoading}
            label="Descrição"
            placeholder="Descreva as atividades realizadas nesse dia"
            name="description"
            required
            className="resize-none min-h-[25svh] w-full flex-1"
          />
          <Switch
            {...methods}
            disabled={mutation.isLoading}
            id="discountHours"
            name="discountHours"
            text="Você descontou as horas?"
            onCheckedChange={(e) => {
              if (!e) {
                methods.setValue("discountedHours", "");
              }
            }}
          />
          {showDiscountedHours && (
            <Input
              {...methods}
              disabled={mutation.isLoading}
              name="discountedHours"
              label="Horas descontadas"
              placeholder="Selecione uma data"
              type="time"
              required
              max={hourDifference(initHours, finalHours)}
            />
          )}
        </div>
      </Form>
    </>
  );
}
