import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique()
})

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export default users
