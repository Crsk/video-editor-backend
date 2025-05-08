import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '../../user/infrastructure/user.schema'
import { z } from 'zod'

export const note = sqliteTable('note', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  audioUrls: text('audio_urls').notNull(),
  videoUrl: text('video_url').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id)
})

export const insertNoteSchema = createInsertSchema(note).extend({
  videoUrl: z.string().url()
})
export const selectNoteSchema = createSelectSchema(note)
export const updateNoteSchema = createUpdateSchema(note).extend({
  videoUrl: z.string().url().optional()
})
