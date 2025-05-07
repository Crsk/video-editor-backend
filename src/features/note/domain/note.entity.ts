import { z } from 'zod'
import { createNoteSchema, updateNoteSchema } from '../api/note.validation'

export interface Note {
  id: number
  audioUrls: string
  text: string
}

export type NewNote = z.infer<typeof createNoteSchema>
export type UpdateNote = z.infer<typeof updateNoteSchema>
