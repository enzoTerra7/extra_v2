"use client";
import { PersonalInfoUserPut } from "@/app/api/user/attPersonalInfo/route";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateCookiesAndHeader } from "@/lib/extras/utils";
import api, { AxiosError } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@tremor/react";
import { Check, Contact2, Mail, Pencil, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    email: z.string().optional(),
    name: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (data) => (data.phone ? data.phone.replace(/\D/g, "").length >= 10 : true),
    {
      message: "Por favor, insira um telefone válido ou remova o campo!",
      path: ["phone"],
    },
  );

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  user: FormData;
  getInformation: () => void;
}

export function ContactForm(props: ContactFormProps) {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: props.user,
  });
  const { handleSubmit, reset } = methods;
  const [editable, setEditable] = useState(false);

  const mutation = useMutation({
    mutationKey: ["updatePersonalInfoUser"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put("/user/attPersonalInfo", {
        ...formData,
      });
      return data as PersonalInfoUserPut;
    },
    onSuccess(data) {
      toast.success("Informações pessoais atualizadas com sucesso!");
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
            label="Nome"
            placeholder="Insira seu nome"
            icon={User}
            type="text"
            name="name"
            required
            containerClass="w-full"
            disabled={!editable || mutation.isLoading}
          />
          <Input
            {...methods}
            label="Sobrenome"
            placeholder="Insira seu sobrenome"
            icon={Contact2}
            type="text"
            name="lastName"
            containerClass="w-full"
            disabled={!editable || mutation.isLoading}
          />
        </div>
        <Input
          {...methods}
          label="E-mail"
          placeholder="Insira seu e-mail"
          icon={Mail}
          type="email"
          name="email"
          disabled
        />
        <Input
          {...methods}
          label="Telefone"
          placeholder="Insira seu telefone"
          icon={Phone}
          name="phone"
          mask={["(99) 9999-9999", "(99) 99999-9999"]}
          disabled={!editable || mutation.isLoading}
        />
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
