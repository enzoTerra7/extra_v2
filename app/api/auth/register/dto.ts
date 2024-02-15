import { z } from "zod";

export const registerUserSchema = z
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

export type RegisterUserType = z.infer<typeof registerUserSchema>;
