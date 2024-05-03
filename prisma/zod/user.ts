import * as z from "zod"

export const _UserModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  verified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
