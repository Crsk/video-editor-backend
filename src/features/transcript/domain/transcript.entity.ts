import { z } from 'zod'
import {
  insertTranscriptSchema,
  selectTranscriptSchema,
  updateTranscriptSchema
} from '../infrastructure/transcript.schema'

export type Transcript = z.infer<typeof selectTranscriptSchema>
export type CreateTranscript = z.infer<typeof insertTranscriptSchema>
export type UpdateTranscript = z.infer<typeof updateTranscriptSchema>
export type DeleteTranscript = { mediaId: string }
