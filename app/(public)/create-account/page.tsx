"use client";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { removeFormatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon, Metric, Title, Subtitle } from "@tremor/react";
import {
  BadgeDollarSign,
  CalendarClock,
  Clock4,
  Contact2,
  KeyRound,
  Mail,
  Phone,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    email: z
      .string({
        required_error: "Por favor, preencha esse campo!",
      })
      .email("Por favor, insira um e-mail válido!"),
    password: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    confirmPassword: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    name: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    lastName: z.string().optional(),
    hours: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    days: z.string({
      required_error: "Por favor, preencha esse campo!",
    }),
    value: z.number({
      required_error: "Por favor, preencha esse campo!",
    }),
    phone: z.string().optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "As senhas não coincidem!",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => (data.phone ? data.phone.replace(/\D/g, "").length >= 10 : true),
    {
      message: "Por favor, insira um telefone válido ou remova o campo!",
      path: ["phone"],
    }
  );

type FormData = z.infer<typeof schema>;

export default function Home() {
  const router = useRouter()
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const { handleSubmit, setValue } = methods;

  const mutation = useMutation({
    mutationKey: ["CreateAccount"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/auth/register", formData);
      return data;
    },
    onSuccess(data) {
      toast.success("Conta criada com sucesso!");
      router.push("/")
    },
    onError(error) {
      toast.error("Credenciais inválidas");
    },
  });

  return (
    <main className="flex bg-white dark:bg-black lg:bg-transparent min-h-[100svh] w-full items-center justify-center lg:justify-between">
      <div className="hidden relative bg-login_hero bg-no-repeat bg-cover bg-center lg:block flex-1 min-h-[100svh]">
        <div className="w-full h-[100svh] bg-blue-500 bg-opacity-80">
          <div className="flex flex-col gap-1.5 w-2/3 h-full justify-center mx-auto">
            <Metric className="text-5xl text-white font-bold text-left">
              Gerencie suas horas extras de forma fácil!
            </Metric>
            <Subtitle className="text-justify text-white text-lg">
              Na plataforma extras, você consegue ter todo o controle das suas
              horas e de quanto irá receber de forma fácil e rápida. Com poucos
              clicks você tem todo o gerenciamento que precisa!
            </Subtitle>
          </div>
        </div>
      </div>
      <div className="flex w-[95vw] rounded-xl lg:rounded-none shadow dark:shadow-none dark:border dark:border-neutral-600 lg:border-none lg:flex-1 max-h-[95svh] lg:max-h-none lg:min-h-[100svh] flex-col p-7 bg-neutral-50 dark:bg-neutral-800 lg:justify-center gap-4 overflow-y-auto lg:overflow-hidden">
        <Title className="text-4xl text-black dark:text-white font-bold">
          Meus Extras
        </Title>
        <Subtitle className="mb-2.5 text-neutral-600 dark:text-neutral-400">
          Crie sua conta!
        </Subtitle>
        <Form
          onSubmit={(data) => mutation.mutate(data)}
          handleSubmit={handleSubmit}
        >
          <div className="flex flex-col w-full lg:flex-row lg:gap-4">
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Nome"
              placeholder="Insira seu nome"
              icon={User}
              type="text"
              name="name"
              required
              containerClass="w-full"
            />
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Sobrenome"
              placeholder="Insira seu sobrenome"
              icon={Contact2}
              type="text"
              name="lastName"
              containerClass="w-full"
            />
          </div>
          <Input
            {...methods}
            disabled={mutation.isLoading}
            label="E-mail"
            placeholder="Insira seu e-mail"
            icon={Mail}
            type="email"
            name="email"
            required
          />
          <div className="flex flex-col w-full lg:flex-row lg:gap-4">
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Senha"
              placeholder="Insira sua senha"
              icon={KeyRound}
              type="password"
              name="password"
              required
              containerClass="w-full"
            />
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Confirmar senha"
              placeholder="Repita sua senha"
              icon={KeyRound}
              type="password"
              name="confirmPassword"
              required
              containerClass="w-full"
            />
          </div>
          <div className="flex flex-col w-full lg:flex-row lg:gap-4">
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Salário"
              icon={BadgeDollarSign}
              placeholder="Insira seu salário"
              decimalScale={2}
              prefix="R$"
              decimalSeparator=","
              thousandSeparator="."
              onValueChange={(value) => {
                setValue("value", value as number);
              }}
              name="value"
              required
              containerClass="w-full"
            />
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Dias por semana"
              placeholder="Insira quantos dias você trabalha por semana"
              icon={CalendarClock}
              type="number"
              name="days"
              required
              min={1}
              max={7}
              containerClass="w-full"
            />
            <Input
              {...methods}
              disabled={mutation.isLoading}
              label="Horas por dia"
              placeholder="Insira quantas horas você trabalha"
              icon={Clock4}
              type="number"
              name="hours"
              required
              min={1}
              max={24}
              containerClass="w-full"
            />
          </div>
          <Input
            {...methods}
            disabled={mutation.isLoading}
            label="Telefone"
            placeholder="Insira seu telefone"
            icon={Phone}
            name="phone"
            mask={["(99) 9999-9999", "(99) 99999-9999"]}
          />
          <Button type="submit" disabled={mutation.isLoading}>
            Criar conta
            <Icon icon={Send} size="md" />
          </Button>
          <Link
            className="text-xs text-black dark:text-white group cursor-pointer text-center"
            href="/"
          >
            Já possui conta?{" "}
            <span className="text-sky-600 group-hover:underline">
              Volte ao login!
            </span>
          </Link>
        </Form>
      </div>
    </main>
  );
}
