import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const project = sqliteTable('project', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertProjectSchema = createInsertSchema(project).extend({
  id: z.string().uuid(),
  createdAt: z.undefined(),
  updatedAt: z.undefined()
})
export const selectProjectSchema = createSelectSchema(project)
export const updateProjectSchema = createUpdateSchema(project)
