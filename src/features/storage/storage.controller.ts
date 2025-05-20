import { Context } from 'hono'
import { type StorageService } from './storage.service'
import { env } from 'hono/adapter'
import { withLogging } from '../../utils/with-logging'
import { type WorkspaceService } from '../workspace/domain/workspace.service'
import { newMedia } from '../media/domain/new-media'
import { CreateWorkspace } from '../workspace/domain/workspace.entity'
import { type TranscriptService } from '../transcript/domain/transcript.service'
import { HttpError } from '../../utils/attempt/http'

export class StorageController {
  constructor(
    private storageService: StorageService,
    private workspaceService: WorkspaceService,
    private transcriptService: TranscriptService
  ) {}

  uploadMedia = async (c: Context) => {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return c.json({ success: false, message: 'Missing media files to upload' }, 400)

    const supportedFormats = ['.mp3', '.mp4']
    const isSupportedFormat = files.every(file => supportedFormats.some(format => file.name.endsWith(format)))
    if (!isSupportedFormat) return c.json({ success: false, message: 'Unsupported media format' }, 400)

    for (const file of files) {
      if (!file || !(file instanceof Blob))
        return c.json({ success: false, message: 'Missing media blob to transcribe' }, 400)
    }

    const userId = c.get('userId')
    const workspaceId = formData.get('workspaceId') as string

    const [workspaceError] = await this.ensureWorkspaceExists(workspaceId, userId)
    if (workspaceError) return c.json({ success: false, message: workspaceError.message }, workspaceError.code)

    const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
    const path = `recordings/${userId}/${workspaceId}`
    const [uploadError, upload] = await withLogging(
      'Upload files',
      { userId, workspaceId, fileCount: files.length },
      () => this.storageService.upload(files, BUCKET_PUBLIC_URL, path)
    )

    if (uploadError) return c.json({ success: false, message: 'Failed to upload media' }, uploadError.code)
    if (!upload) return c.json({ success: false, message: 'Failed to upload media' }, 500)

    const [processError, processedFiles] = await this.processUploadedFiles(upload, workspaceId)
    if (processError) return c.json({ success: false, message: processError.message }, processError.code)

    return c.json({ success: true, data: processedFiles })
  }

  private async ensureWorkspaceExists(workspaceId: string, userId: string): Promise<[HttpError | null, boolean]> {
    const [getError, workspace] = await withLogging('Get workspace', { workspaceId }, () =>
      this.workspaceService.getWorkspaceById({ workspaceId })
    )

    if (getError) return [getError, false]
    if (workspace) return [null, true]

    const [createError, created] = await withLogging('Create workspace', { workspaceId }, () =>
      this.workspaceService.upsertWorkspace({
        workspaceId,
        userId,
        workspaceData: { id: workspaceId, name: 'Untitled' } as CreateWorkspace
      })
    )

    if (createError) return [createError, false]
    if (!created) return [new HttpError('INTERNAL_ERROR', 'Failed to create workspace'), false]

    return [null, true]
  }

  private async processUploadedFiles(
    upload: { url: string; id: string; type: 'audio' | 'video' }[],
    workspaceId: string
  ): Promise<[HttpError | null, { url: string; mediaId: string; type: 'audio' | 'video' }[] | null]> {
    const result: { url: string; mediaId: string; type: 'audio' | 'video' }[] = []

    for (const { url, id, type } of upload) {
      const validMedia = newMedia({ id, url, type })
      const [mediaError] = await withLogging('Create media entry', { workspaceId, mediaUrl: url }, () =>
        this.workspaceService.addMediaToWorkspace({ workspaceId, mediaData: validMedia })
      )

      if (mediaError) return [mediaError, null]

      const [transcribeError] = await withLogging('Transcribing media', { mediaUrl: url }, () =>
        this.transcriptService.transcribeMedia({ mediaId: id, url })
      )

      if (transcribeError) return [transcribeError, null]

      result.push({ url, mediaId: id, type })
    }

    return [null, result]
  }

  deleteMedia = async (c: Context) => {
    const body = await c.req.json<{ workspaceId: string; userId: string; mediaId: string }>()
    const { userId, workspaceId, mediaId } = body

    if (!userId || !workspaceId || !mediaId)
      return c.json({ success: false, message: 'Missing media ID, workspace ID, or user ID' }, 400)

    const [error, success] = await withLogging('Deleting media', { userId, workspaceId, mediaId }, () =>
      this.storageService.deleteMedia({ userId, workspaceId, mediaId })
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Media not found' }, 404)

    const [mediaError, mediaSuccess] = await withLogging('Delete media entry', { workspaceId, mediaId }, () =>
      this.workspaceService.deleteMedia({ workspaceId, mediaId })
    )

    if (mediaError) return c.json({ success: false, message: mediaError.message }, mediaError.code)
    if (!mediaSuccess) return c.json({ success: false, message: 'Media not found' }, 404)

    return c.json({ success: true })
  }
}
