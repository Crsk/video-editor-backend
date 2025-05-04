import { z } from 'zod'
import { insertUserSchema } from './user-schema'

export const createUserSchema = insertUserSchema.omit({ id: true }).extend({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim()
})

export const updateUserSchema = insertUserSchema
  .omit({ id: true })
  .partial()
  .extend({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional()
  })

export const userParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10))
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export default {
  createUserSchema,
  updateUserSchema,
  userParamsSchema
}
