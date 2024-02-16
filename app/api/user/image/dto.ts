import { z } from "zod";

export const AttUserPhotoSchema = z.object({
  file: z.string({
    required_error: "Por favor, preencha esse campo!",
  }),
});

export type AttUserPhotoProps = z.infer<typeof AttUserPhotoSchema>;
