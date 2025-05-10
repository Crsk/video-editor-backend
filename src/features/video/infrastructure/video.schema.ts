import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export const video = sqliteTable('video', {
  id: text('id').primaryKey(),
  transcript: text('transcript'),
  audioUrls: text('audio_urls'),
  videoUrl: text('video_url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertVideoSchema = createInsertSchema(video).extend({
  videoUrl: z.string().url()
})
export const selectVideoSchema = createSelectSchema(video)
export const updateVideoSchema = createUpdateSchema(video).extend({
  videoUrl: z.string().url().optional()
})
