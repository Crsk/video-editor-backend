import { createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { user } from '../../auth/infrastructure/auth.schema'

export const selectUserSchema = createSelectSchema(user)
export const updateUserSchema = createUpdateSchema(user)

export { user }
