import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { media } from '../../media/infrastructure/media.schema'

export const transcript = sqliteTable('transcript', {
  mediaId: text('media_id')
    .primaryKey()
    .references(() => media.id, { onDelete: 'cascade' }),
  text: text('text'),
  wordCount: integer('word_count'),
  vtt: text('vtt'),
  words: text('words', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const insertTranscriptSchema = createInsertSchema(transcript).extend({
  mediaId: z.string()
})
export const selectTranscriptSchema = createSelectSchema(transcript)
export const updateTranscriptSchema = createUpdateSchema(transcript).extend({
  mediaId: z.string().optional()
})
