"use client";
import { ExtraPayloadPostAndPut } from "@/app/api/extra/route";
import { Loader } from "@/components/loadar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useExtra } from "@/context/hoursProvider";
import api, { AxiosError } from "@/lib/axios";
import { hourDifference } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Icon, Text, Title } from "@tremor/react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const { extra } = useExtra();
  const router = useRouter();
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: extra?.description,
      initHours: extra?.start_hour,
      finalHours: extra?.end_hour,
      date: extra?.date,
      discountHours: extra?.hasDiscounted,
      discountedHours: extra?.discounted_hours,
    },
  });

  const [editable, setEditable] = useState(false);

  const mutation = useMutation({
    mutationKey: ["extra"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put(`/extra/${extra?.id}`, {
        ...formData,
        discountedHours: formData.discountHours ? formData.discountedHours : "",
      });
      return data as ExtraPayloadPostAndPut;
    },
    onSuccess(data) {
      toast.success("Extra editado com sucesso");
      router.push("/dashboard/my-extras");
    },
    onError(error: AxiosError) {
      toast.error(
        typeof error.response.data === "string"
          ? error.response.data
          : "Verifique as informações",
      );
    },
  });

  const mutationDelete = useMutation({
    mutationKey: ["deleteExtra"],
    mutationFn: async () => {
      await api.delete(`/extra/${extra?.id}`);
    },
    onSuccess(data) {
      toast.success("Extra removido com sucesso");
      router.push("/dashboard/my-extras");
    },
    onError(error: AxiosError) {
      toast.error(
        typeof error.response.data === "string"
          ? error.response.data
          : "Verifique as informações",
      );
    },
  });

  if (!extra) {
    router.push("/dashboard/my-extras");
    return (
      <div
        className="h-full w-full"
        onLoad={() => toast.error("Extra não encontrado")}
      >
        <div className="flex w-full h-full items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  const { watch, setValue, reset } = methods;

  const initHours = watch("initHours");
  const finalHours = watch("finalHours");
  const showDiscountedHours = watch("discountHours");

  return (
    <>
      <Form
        handleSubmit={methods.handleSubmit}
        onSubmit={mutation.mutate}
        className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-center lg:justify-between">
          <div className="truncate">
            <Title className="text-center lg:text-start text-3xl lg:text-4xl font-bold tracking-tight">
              Seus Extras
            </Title>
            <Text className="text-center text-wrap lg:text-start lg:truncate">
              Verifique os dados do seu extra e edite-os
            </Text>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4">
            {editable ? (
              <>
                <Button
                  variant={"ghost"}
                  type="reset"
                  disabled={mutation.isLoading}
                  onClick={() => {
                    reset();
                    setEditable(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isLoading}
                  loading={mutation.isLoading}
                >
                  <Icon icon={Check} size="lg" />
                  Salvar alterações
                </Button>
              </>
            ) : (
              <>
                <Button variant={"ghost"} onClick={() => router.back()}>
                  Voltar
                </Button>
                <div
                  onClick={() => {
                    setEditable(true);
                    setValue(
                      "discountHours",
                      showDiscountedHours !== extra.hasDiscounted
                        ? showDiscountedHours
                        : extra.hasDiscounted,
                    );
                  }}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:pointer-events-none h-10 px-4 py-2 disabled:opacity-50 gap-1.5 transition-all duration-300 bg-sky-600 text-white hover:bg-sky-600/90 cursor-pointer"
                >
                  <Icon icon={Pencil} size="lg" />
                  Editar extra
                </div>
              </>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Icon icon={Trash2} size="lg" />
                  Excluir extra
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="outline-none border-border">
                <div className="relative w-full h-full flex flex-col gap-4">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deseja excluir o extra?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <hr className="w-full border-border border" />
                  <Text className="text-black dark:text-white">
                    Ao confirmar a exclusão, todos os dados interligados ao
                    extra serão deletados e/ou atualizados.
                  </Text>
                  <div className="flex flex-col gap-4 mt-6 lg:flex-row lg:items-center lg:justify-between">
                    <AlertDialogCancel asChild>
                      <Button
                        variant="outline"
                        disabled={mutationDelete.isLoading}
                      >
                        Cancelar
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      onClick={() => mutationDelete.mutate()}
                      variant="destructive"
                      loading={mutation.isLoading}
                      disabled={mutationDelete.isLoading}
                    >
                      <Icon icon={Trash2} size="lg" />
                      Sim, quero excluir!
                    </Button>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="w-full space-y-6 lg:px-4 py-6 rounded-xl">
          <Input
            {...methods}
            disabled={mutation.isLoading || !editable}
            name="date"
            label="Dia de atuação"
            type="date"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...methods}
              disabled={mutation.isLoading || !editable}
              name="initHours"
              label="Hora de Início"
              placeholder="Selecione uma data"
              type="time"
              required
            />
            <Input
              {...methods}
              disabled={mutation.isLoading || !editable}
              name="finalHours"
              label="Hora de Término"
              type="time"
              min={initHours}
              required
            />
          </div>
          <Textarea
            {...methods}
            disabled={mutation.isLoading || !editable}
            label="Descrição"
            placeholder="Descreva as atividades realizadas nesse dia"
            name="description"
            required
            className="resize-none min-h-[25svh] w-full flex-1"
          />
          <Switch
            {...methods}
            disabled={mutation.isLoading || !editable}
            id="discountHours"
            name="discountHours"
            text="Você descontou as horas?"
            // checked={showDiscountedHours}
            onCheckedChange={(e) => {
              if (!e) {
                methods.setValue("discountedHours", "");
              }
            }}
          />
          {showDiscountedHours && (
            <Input
              {...methods}
              disabled={mutation.isLoading || !editable}
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
