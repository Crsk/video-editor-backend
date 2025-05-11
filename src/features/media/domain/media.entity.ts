import { z } from 'zod'
import { insertMediaSchema, selectMediaSchema, updateMediaSchema } from '../infrastructure/media.schema'
import { insertSpokenSchema, selectSpokenSchema, updateSpokenSchema } from '../infrastructure/spoken.schema'

export type Media = z.infer<typeof selectMediaSchema>
export type CreateMedia = z.infer<typeof insertMediaSchema>
export type UpdateMedia = z.infer<typeof updateMediaSchema>

export type Spoken = z.infer<typeof selectSpokenSchema>
export type CreateSpoken = z.infer<typeof insertSpokenSchema>
export type UpdateSpoken = z.infer<typeof updateSpokenSchema>
