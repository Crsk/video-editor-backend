import { Context } from 'hono'
import { StorageService } from './storage.service'
import { env } from 'hono/adapter'
import { withLogging } from '../../utils/with-logging'
import { ProjectService } from '../project/domain/project.service'
import { newMedia } from '../media/domain/new-media'
import { v7 as uuid } from 'uuid'
import { CreateProject } from '../project/domain/project.entity'

export class StorageController {
  constructor(private storageService: StorageService, private projectService: ProjectService) {}

  uploadMedia = async (c: Context) => {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return c.json({ success: false, message: 'Missing media files to upload' }, 400)
    const supportedFormats = ['.mp3', '.mp4']
    const isSupportedFormat = files.every(file => supportedFormats.some(format => file.name.endsWith(format)))
    if (!isSupportedFormat) return c.json({ success: false, message: 'Unsupported media format' }, 400)

    const userId = formData.get('userId') as string
    const projectId = formData.get('projectId') as string
    const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
    const path = `recordings/${userId}`
    const [uploadError, upload] = await withLogging(
      'Upload files',
      { userId, projectId, fileCount: files.length },
      () => this.storageService.upload(files, BUCKET_PUBLIC_URL, path)
    )

    const [project] = await withLogging('Get project', { projectId }, () =>
      this.projectService.getProjectById({ projectId })
    )

    if (!project) {
      const [projectError] = await withLogging('Create project', { projectId }, () =>
        this.projectService.upsertProject({
          projectId,
          userId,
          projectData: { id: projectId, name: 'Demo' } as CreateProject
        })
      )
      if (projectError) return c.json({ success: false, message: 'Failed to create project' }, projectError.code)
    }

    if (uploadError) return c.json({ success: false, message: 'Failed to upload media' }, uploadError.code)
    if (!upload) return c.json({ success: false, message: 'Failed to upload media' }, 500)

    for (const url of upload.urls) {
      const validMedia = newMedia({ id: uuid(), url })
      const [mediaError] = await withLogging('Create media entry', { projectId, mediaUrl: url }, () =>
        this.projectService.addMediaToProject({ projectId, mediaData: validMedia })
      )
      if (mediaError) return c.json({ success: false, message: 'Failed to create media' }, mediaError.code)
    }

    return c.json({ success: true, data: { urls: upload.urls } })
  }
}
