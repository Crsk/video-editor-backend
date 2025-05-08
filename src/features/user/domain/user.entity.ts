import { z } from 'zod'
import { selectUserSchema, updateUserSchema } from '../infrastructure/user.schema'

export type User = z.infer<typeof selectUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
