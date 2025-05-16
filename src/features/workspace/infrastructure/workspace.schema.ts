import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const workspace = sqliteTable('workspace', {
  id: text('id').primaryKey(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertWorkspaceSchema = createInsertSchema(workspace).extend({
  id: z.string().uuid(),
  name: z.string().optional(),
  createdAt: z.undefined(),
  updatedAt: z.undefined()
})
export const selectWorkspaceSchema = createSelectSchema(workspace)
export const updateWorkspaceSchema = createUpdateSchema(workspace)
