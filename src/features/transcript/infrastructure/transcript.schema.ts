import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { media } from '../../media/infrastructure/media.schema'

export const transcript = sqliteTable('transcript', {
  mediaId: text('media_id')
    .primaryKey()
    .references(() => media.id, { onDelete: 'cascade' }),
  content: text('content'),
  audioUrls: text('audio_urls')
})

export const insertTranscriptSchema = createInsertSchema(transcript).extend({
  mediaId: z.string()
})
export const selectTranscriptSchema = createSelectSchema(transcript)
export const updateTranscriptSchema = createUpdateSchema(transcript).extend({
  mediaId: z.string().optional()
})
