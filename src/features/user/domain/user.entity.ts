import { z } from 'zod'
import { createUserSchema, updateUserSchema } from '../api/user.validation'

export interface User {
  id: number
  name: string
  email: string
}

export type NewUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
