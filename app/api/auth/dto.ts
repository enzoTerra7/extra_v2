import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Por favor, preencha esse campo!",
    })
    .email("Por favor, insira um e-mail válido!"),
  password: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
