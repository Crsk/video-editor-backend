import { z } from 'zod'
import { insertNoteSchema, selectNoteSchema, updateNoteSchema } from '../infrastructure/note.schema'

export type Note = z.infer<typeof selectNoteSchema>
export type CreateNote = z.infer<typeof insertNoteSchema>
export type UpdateNote = z.infer<typeof updateNoteSchema>
