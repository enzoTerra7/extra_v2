import * as z from "zod"
import { CompleteSession, relatedSessionSchema, CompleteExtras, relatedExtrasSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string().nullish(),
  email: z.string(),
  phoneNumber: z.string().nullish(),
  salary: z.number(),
  days: z.number().int(),
  hours: z.number().int(),
  hashed_password: z.string(),
  hour_value: z.number(),
  extra_hour_value: z.number(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  sessions: CompleteSession[]
  Extras: CompleteExtras[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  sessions: relatedSessionSchema.array(),
  Extras: relatedExtrasSchema.array(),
}))
