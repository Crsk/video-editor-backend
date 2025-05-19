import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  type: text('type').notNull(), // TODO support more types
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertMediaSchema = createInsertSchema(media).extend({
  url: z.string().url(),
  type: z.enum(['audio', 'video'])
})
export const selectMediaSchema = createSelectSchema(media)
export const updateMediaSchema = createUpdateSchema(media).extend({
  url: z.string().url().optional(),
  type: z.enum(['audio', 'video']).optional()
})
