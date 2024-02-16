import { z } from "zod";

export const AttPersonalInfoSchema = z
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

export type AttPersonalInfoProps = z.infer<typeof AttPersonalInfoSchema>;
