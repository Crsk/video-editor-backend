import { z } from 'zod'
import { insertWorkspaceSchema, selectWorkspaceSchema, updateWorkspaceSchema } from '../infrastructure/workspace.schema'

export type Workspace = z.infer<typeof selectWorkspaceSchema>
export type CreateWorkspace = z.infer<typeof insertWorkspaceSchema>
export type UpdateWorkspace = z.infer<typeof updateWorkspaceSchema>
export type DeleteWorkspace = { workspaceId: string }
