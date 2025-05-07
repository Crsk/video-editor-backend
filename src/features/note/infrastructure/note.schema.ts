import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const notes = sqliteTable('notes', {
  id: int('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  audioUrls: text('audio_urls').notNull()
})

export const insertNoteSchema = createInsertSchema(notes)
export const selectNoteSchema = createSelectSchema(notes)

export default notes
