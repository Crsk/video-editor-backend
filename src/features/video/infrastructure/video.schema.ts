import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '../../user/infrastructure/user.schema'
import { z } from 'zod'

export const video = sqliteTable('video', {
  id: text('id').primaryKey(),
  transcript: text('text').notNull(),
  audioUrls: text('audio_urls').notNull(),
  videoUrl: text('video_url').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id)
})

export const insertVideoSchema = createInsertSchema(video).extend({
  videoUrl: z.string().url()
})
export const selectVideoSchema = createSelectSchema(video)
export const updateVideoSchema = createUpdateSchema(video).extend({
  videoUrl: z.string().url().optional()
})
