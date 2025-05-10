import { z } from 'zod'
import { insertProjectSchema, selectProjectSchema, updateProjectSchema } from '../infrastructure/project.schema'

export type Project = z.infer<typeof selectProjectSchema>
export type CreateProject = z.infer<typeof insertProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
