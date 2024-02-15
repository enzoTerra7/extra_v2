import { z } from "zod";

export const AttSalaryInfoSchema = z.object({
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

export type AttSalaryInfoProps = z.infer<typeof AttSalaryInfoSchema>;
