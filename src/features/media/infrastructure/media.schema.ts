import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  transcript: text('transcript'),
  audioUrls: text('audio_urls'),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertMediaSchema = createInsertSchema(media).extend({
  url: z.string().url()
})
export const selectMediaSchema = createSelectSchema(media)
export const updateMediaSchema = createUpdateSchema(media).extend({
  url: z.string().url().optional()
})
