import { Context } from 'hono'
import { StorageService } from './storage.service'
import { env } from 'hono/adapter'
import { withLogging } from '../../utils/with-logging'
import { ProjectService } from '../project/domain/project.service'
import { newVideo } from '../video/domain/new-video'

export class StorageController {
  constructor(private storageService: StorageService, private projectService: ProjectService) {}

  uploadVideos = async (c: Context) => {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return c.json({ success: false, message: 'Missing media files to upload' }, 400)

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
        this.projectService.upsertProject({ projectId, userId, projectData: { name: 'My Project' } })
      )
      if (projectError) return c.json({ success: false, message: 'Failed to create project' }, projectError.code)
    }

    if (uploadError) return c.json({ success: false, message: 'Failed to upload video' }, uploadError.code)
    if (!upload) return c.json({ success: false, message: 'Failed to upload video' }, 500)

    for (const [key, url] of Object.entries(upload)) {
      const validVideo = newVideo({ id: key, videoUrl: url })
      const [videoError] = await withLogging('Create video entry', { projectId, videoUrl: url }, () =>
        this.projectService.addVideoToProject({ projectId, videoData: validVideo })
      )
      if (videoError) return c.json({ success: false, message: 'Failed to create video' }, videoError.code)
    }

    return c.json({ success: true, data: { urls: Object.values(upload) } })
  }
}
