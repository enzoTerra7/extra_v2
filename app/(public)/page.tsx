"use client";
import { Button } from "@/components/ui/button";
import Form from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api, { AxiosError } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon, Metric, Title, Subtitle } from "@tremor/react";
import { KeyRound, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";
import { LoginResponse } from "../api/auth/route";
import { useAuth } from "@/context/authProvider";
import { Loader } from "@/components/loadar";
import { UpdateCookiesAndHeader } from "@/lib/extras/utils";

const schema = z.object({
  email: z
    .string({
      required_error: "Por favor, preencha esse campo!",
    })
    .email("Por favor, insira um e-mail válido!"),
  password: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const router = useRouter();
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const { handleSubmit } = methods;
  const { status } = useAuth();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/auth", formData);
      return data as LoginResponse;
    },
    onSuccess(data) {
      UpdateCookiesAndHeader(data.user, data.session);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
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
      <div className="flex w-screen shadow dark:shadow-none border-none lg:flex-1 max-h-[95svh] lg:max-h-none min-h-[100svh] flex-col p-7 bg-neutral-50 dark:bg-neutral-800 justify-center gap-4 overflow-y-auto lg:overflow-hidden">
        {status !== "unauthorized" ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <Title className="text-4xl text-black dark:text-white font-bold">
              Meus Extras
            </Title>
            <Subtitle className="mb-2.5 text-neutral-600 dark:text-neutral-400">
              Faça login na plataforma
            </Subtitle>
            <Form
              onSubmit={(data) => mutation.mutate(data)}
              handleSubmit={handleSubmit}
            >
              <Input
                {...methods}
                label="E-mail"
                placeholder="Insira seu e-mail"
                icon={Mail}
                type="email"
                name="email"
                required
                disabled={mutation.isLoading}
              />
              <Input
                {...methods}
                label="Senha"
                placeholder="Insira sua senha"
                icon={KeyRound}
                type="password"
                name="password"
                required
                containerClass="mb-4"
                disabled={mutation.isLoading}
              />
              <Button
                loading={mutation.isLoading}
                type="submit"
                disabled={mutation.isLoading}
              >
                Entrar
                <Icon icon={Send} size="md" />
              </Button>
              <Link
                className="text-xs text-black dark:text-white group cursor-pointer text-center"
                href="/create-account"
              >
                Não possuí conta?{" "}
                <span className="text-sky-600 group-hover:underline">
                  Crie agora!
                </span>
              </Link>
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
