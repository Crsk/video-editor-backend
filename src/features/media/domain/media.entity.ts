import { z } from 'zod'
import { insertMediaSchema, selectMediaSchema, updateMediaSchema } from '../infrastructure/media.schema'

export type Media = z.infer<typeof selectMediaSchema>
export type CreateMedia = z.infer<typeof insertMediaSchema>
export type UpdateMedia = z.infer<typeof updateMediaSchema>
