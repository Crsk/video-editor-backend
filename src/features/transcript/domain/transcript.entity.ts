import { z } from 'zod'
import {
  insertTranscriptSchema,
  selectTranscriptSchema,
  updateTranscriptSchema
} from '../infrastructure/transcript.schema'

type TranscriptWithJson = z.infer<typeof selectTranscriptSchema>
export type Transcript = Omit<TranscriptWithJson, 'words' & 'segments'> & { words: unknown; segments: unknown }
export type CreateTranscript = z.infer<typeof insertTranscriptSchema>
export type UpdateTranscript = z.infer<typeof updateTranscriptSchema>
export type DeleteTranscript = { mediaId: string }
