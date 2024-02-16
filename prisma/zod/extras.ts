import * as z from "zod";
import { CompleteUser, relatedUserSchema } from "./index";

export const extrasSchema = z.object({
  id: z.string(),
  date: z.string(),
  start_hour: z.string(),
  end_hour: z.string(),
  description: z.string(),
  hasDiscounted: z.boolean(),
  discounted_hours: z.string(),
  hours_make: z.string(),
  gains: z.number(),
  userId: z.string(),
});

export interface CompleteExtras extends z.infer<typeof extrasSchema> {
  user: CompleteUser;
}

/**
 * relatedExtrasSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedExtrasSchema: z.ZodSchema<CompleteExtras> = z.lazy(() =>
  extrasSchema.extend({
    user: relatedUserSchema,
  }),
);
