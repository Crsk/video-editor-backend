import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { media } from './media.schema'

export const spoken = sqliteTable('spoken', {
  mediaId: text('media_id')
    .primaryKey()
    .references(() => media.id, { onDelete: 'cascade' }),
  transcript: text('transcript'),
  audioUrls: text('audio_urls')
})

export const insertSpokenSchema = createInsertSchema(spoken).extend({
  mediaId: z.string()
})
export const selectSpokenSchema = createSelectSchema(spoken)
export const updateSpokenSchema = createUpdateSchema(spoken).extend({
  mediaId: z.string().optional()
})
