import { Context } from 'hono'
import { type WorkspaceService } from '../domain/workspace.service'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'
import { insertWorkspaceSchema } from '../infrastructure/workspace.schema'
import { CreateWorkspace } from '../domain/workspace.entity'
import { type TranscriptService } from '../../../features/transcript/domain/transcript.service'
import { insertMediaSchema } from '../../media/infrastructure/media.schema'
import { CreateMedia } from '../../media/domain/media.entity'

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService, private transcriptService: TranscriptService) {}

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
    const includeTranscript = c.req.query('include') === 'transcript'

    const [error, media] = await withLogging('Fetching media by workspace id', { workspaceId, includeTranscript }, () =>
      this.workspaceService.getWorkspaceMedia({ workspaceId, includeTranscript })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!media) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true, data: media })
  }

  getWorkspaceSingleMedia = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')
    const mediaId = c.req.param('mediaId')
    const includeTranscript = c.req.query('include') === 'transcript'

    const [error, media] = await withLogging('Fetching media by id', { workspaceId, mediaId, includeTranscript }, () =>
      this.workspaceService.getWorkspaceSingleMedia({ workspaceId, mediaId, includeTranscript })
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
    const userId = c.get('userId')

    const [error, success] = await withLogging('Deleting workspace', { workspaceId, userId }, () =>
      this.workspaceService.deleteWorkspace({ workspaceId, userId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Workspace not found' }, 404)

    return c.json({ success: true })
  }

  addMediaToWorkspace = async (c: Context<AppEnvironment>) => {
    const workspaceId = c.req.param('workspaceId')
    const mediaData = await c.req.json()

    const validData: CreateMedia = insertMediaSchema.parse({
      ...mediaData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const [error, success] = await withLogging('Adding media to workspace', { workspaceId, mediaData }, () =>
      this.workspaceService.addMediaToWorkspace({ workspaceId, mediaData: validData })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Workspace or media not found' }, 404)

    if (mediaData.url && mediaData.id) {
      const [transcribeError] = await withLogging('Transcribing media', { workspaceId, mediaData }, () =>
        this.transcriptService.transcribeMedia({ mediaId: mediaData.id, url: mediaData.url })
      )

      if (transcribeError) console.error('Transcription failed:', transcribeError)
    }

    return c.json({ success: true, data: mediaData })
  }
}
