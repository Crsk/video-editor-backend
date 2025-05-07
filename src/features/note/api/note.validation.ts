import { z } from 'zod'

export const createNoteSchema = z.object({
  audioUrls: z.string().min(1),
  text: z.string().min(1)
})

export const updateNoteSchema = z
  .object({
    audioUrls: z.string().min(1).optional(),
    text: z.string().min(1).optional()
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })

export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
