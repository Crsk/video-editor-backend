import { Context } from 'hono'
import { StorageService } from './storage.service'
import { env } from 'hono/adapter'
import { withLogging } from '../../utils/with-logging'
import { WorkspaceService } from '../workspace/domain/workspace.service'
import { newMedia } from '../media/domain/new-media'
import { v7 as uuid } from 'uuid'
import { CreateWorkspace } from '../workspace/domain/workspace.entity'

export class StorageController {
  constructor(private storageService: StorageService, private workspaceService: WorkspaceService) {}

  uploadMedia = async (c: Context) => {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return c.json({ success: false, message: 'Missing media files to upload' }, 400)
    const supportedFormats = ['.mp3', '.mp4']
    const isSupportedFormat = files.every(file => supportedFormats.some(format => file.name.endsWith(format)))
    if (!isSupportedFormat) return c.json({ success: false, message: 'Unsupported media format' }, 400)

    const userId = c.get('userId')
    const workspaceId = formData.get('workspaceId') as string

    const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
    const path = `recordings/${userId}/${workspaceId}`
    const [uploadError, upload] = await withLogging(
      'Upload files',
      { userId, workspaceId, fileCount: files.length },
      () => this.storageService.upload(files, BUCKET_PUBLIC_URL, path)
    )

    const [workspace] = await withLogging('Get workspace', { workspaceId }, () =>
      this.workspaceService.getWorkspaceById({ workspaceId })
    )

    if (!workspace) {
      const [workspaceError] = await withLogging('Create workspace', { workspaceId }, () =>
        this.workspaceService.upsertWorkspace({
          workspaceId,
          userId,
          workspaceData: { id: workspaceId, name: 'Untitled' } as CreateWorkspace
        })
      )
      if (workspaceError) return c.json({ success: false, message: 'Failed to create workspace' }, workspaceError.code)
    }

    if (uploadError) return c.json({ success: false, message: 'Failed to upload media' }, uploadError.code)
    if (!upload) return c.json({ success: false, message: 'Failed to upload media' }, 500)

    for (const url of upload.urls) {
      const validMedia = newMedia({ id: uuid(), url })
      const [mediaError] = await withLogging('Create media entry', { workspaceId, mediaUrl: url }, () =>
        this.workspaceService.addMediaToWorkspace({ workspaceId, mediaData: validMedia })
      )
      if (mediaError) return c.json({ success: false, message: 'Failed to create media' }, mediaError.code)
    }

    return c.json({ success: true, data: { urls: upload.urls } })
  }
}
