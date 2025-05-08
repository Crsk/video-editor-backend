import { z } from 'zod'
import { insertVideoSchema, selectVideoSchema, updateVideoSchema } from '../infrastructure/video.schema'

export type Video = z.infer<typeof selectVideoSchema>
export type CreateVideo = z.infer<typeof insertVideoSchema>
export type UpdateVideo = z.infer<typeof updateVideoSchema>
