"use client";
import { PersonalSalaryUserPut } from "@/app/api/user/attSalaryInfo/route";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api, { AxiosError } from "@/lib/axios";
import { UpdateCookiesAndHeader } from "@/lib/extras/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@tremor/react";
import {
  BadgeDollarSign,
  CalendarClock,
  Check,
  Clock4,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  hours: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  days: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
  value: z.number({
    required_error: "Por favor, preencha esse campo!",
  }),
});

type FormData = z.infer<typeof schema>;

interface ValueFormProps {
  userValues: FormData;
  getInformation: () => void;
}

export function ValueForm(props: ValueFormProps) {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: props.userValues,
  });
  const { handleSubmit, setValue, getValues, reset } = methods;

  const [editable, setEditable] = useState(false);

  const mutation = useMutation({
    mutationKey: ["updateSalaryInfoUser"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put("/user/attSalaryInfo", {
        ...formData,
      });
      return data as PersonalSalaryUserPut;
    },
    onSuccess(data) {
      toast.success("Informações salárias atualizadas com sucesso!");
      setEditable(false);
      UpdateCookiesAndHeader(data.user, data.session);
      props.getInformation();
    },
    onError(error: AxiosError) {
      toast.error(
        typeof error.response.data === "string"
          ? error.response.data
          : "Credenciais inválidas",
      );
    },
  });

  return (
    <>
      <Form onSubmit={mutation.mutate} handleSubmit={handleSubmit}>
        <div className="flex flex-col w-full lg:flex-row gap-y-2 gap-x-4">
          <Input
            {...methods}
            label="Salário"
            icon={BadgeDollarSign}
            placeholder="Insira seu salário"
            decimalScale={2}
            prefix="R$"
            value={getValues("value")}
            decimalSeparator=","
            thousandSeparator="."
            onValueChange={(value) => {
              setValue("value", value as number);
            }}
            name="value"
            required
            containerClass="w-full"
            disabled={!editable || mutation.isLoading}
          />
          <Input
            {...methods}
            label="Dias por semana"
            placeholder="Insira quantos dias você trabalha por semana"
            icon={CalendarClock}
            type="number"
            name="days"
            required
            min={1}
            max={7}
            containerClass="w-full"
            disabled={!editable || mutation.isLoading}
          />
          <Input
            {...methods}
            label="Horas por dia"
            placeholder="Insira quantas horas você trabalha"
            icon={Clock4}
            type="number"
            name="hours"
            required
            min={1}
            max={24}
            containerClass="w-full"
            disabled={!editable || mutation.isLoading}
          />
        </div>
        {(editable && (
          <div className="flex items-center gap-4 flex-start mt-2.5">
            <Button
              id="confirm"
              name="confirm"
              type="submit"
              disabled={mutation.isLoading}
              loading={mutation.isLoading}
              // onClick={() => setEditable(false)}
            >
              <Icon icon={Check} size="lg" />
              Salvar Alterações
            </Button>
            <Button
              id="cancel"
              name="cancel"
              type="reset"
              onClick={() => {
                setEditable(false);
                reset();
              }}
              variant={"ghost"}
              disabled={mutation.isLoading}
            >
              Cancelar
            </Button>
          </div>
        )) || <></>}
      </Form>

      {!editable && (
        <div className="flex items-center gap-4 flex-start mt-4">
          <Button
            id="edit"
            name="edit"
            type="reset"
            onClick={() => setEditable(true)}
          >
            <Icon icon={Pencil} size="lg" />
            Editar Informações
          </Button>
        </div>
      )}
    </>
  );
}
