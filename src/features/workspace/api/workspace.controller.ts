import { Context } from 'hono'
import { WorkspaceService } from '../domain/workspace.service'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'
import { insertWorkspaceSchema } from '../infrastructure/workspace.schema'
import { CreateWorkspace } from '../domain/workspace.entity'

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  getAllWorkspaces = async (c: Context<AppEnvironment>) => {
    const [error, allWorkspaces] = await withLogging('Fetching all workspaces', {}, () =>
      this.workspaceService.getAllWorkspaces()
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: allWorkspaces })
  }

  getWorkspaceById = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')

    const [error, workspace] = await withLogging('Fetching workspace by id', { workspaceId }, () =>
      this.workspaceService.getWorkspaceById({ workspaceId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!workspace) return c.json({ success: false, message: 'Workspace not found' }, 404)

    return c.json({ success: true, data: workspace })
  }

  getWorkspaceMedia = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')

    const [error, media] = await withLogging('Fetching media by workspace id', { workspaceId }, () =>
      this.workspaceService.getWorkspaceMedia({ workspaceId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!media) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true, data: media })
  }

  getWorkspaceSingleMedia = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')
    const mediaId = c.req.param('mediaId')

    const [error, media] = await withLogging('Fetching media by id', { workspaceId, mediaId }, () =>
      this.workspaceService.getWorkspaceSingleMedia({ workspaceId, mediaId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!media) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true, data: media })
  }

  upsertWorkspace = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')
    const userId = c.get('userId')
    const workspaceData = await c.req.json()
    const validData: CreateWorkspace = insertWorkspaceSchema.parse({ ...workspaceData, id: workspaceId })

    const [error, updatedWorkspace] = await withLogging('Inserting workspace', { workspaceId, workspaceData }, () =>
      this.workspaceService.upsertWorkspace({ workspaceId, userId, workspaceData: validData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!updatedWorkspace) return c.json({ success: false, message: 'Workspace not found' }, 404)

    return c.json({ success: true, data: updatedWorkspace })
  }

  deleteWorkspace = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')

    const [error, success] = await withLogging('Deleting workspace', { workspaceId }, () =>
      this.workspaceService.deleteWorkspace({ workspaceId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Workspace not found' }, 404)

    return c.json({ success: true })
  }

  addMediaToWorkspace = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')
    const mediaData = await c.req.json()

    const [error, success] = await withLogging('Adding media to workspace', { workspaceId, mediaData }, () =>
      this.workspaceService.addMediaToWorkspace({ workspaceId, mediaData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Workspace or media not found' }, 404)

    return c.json({ success: true })
  }
}
