import { z } from "zod";

export const registeredExtraSchema = z.object({
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

export type registeredExtraType = z.infer<typeof registeredExtraSchema>;
