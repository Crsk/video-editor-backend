import { Context } from 'hono'
import { StorageService } from './storage.service'
import { VideoService } from '../video/domain/video.service'
import { newVideo } from '../video/domain/new-video'
import { env } from 'hono/adapter'
import { withLogging } from '../../utils/with-logging'

export class StorageController {
  constructor(private storageService: StorageService, private videoService: VideoService) {}

  upload = async (c: Context) => {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return c.json({ success: false, message: 'Missing media files to upload' }, 400)

    const userId = formData.get('userId') as string
    const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
    const path = `recordings/${userId}`
    const [uploadError, upload] = await withLogging('Upload files', { userId, fileCount: files.length }, () =>
      this.storageService.upload(files, BUCKET_PUBLIC_URL, path)
    )

    if (uploadError) return c.json({ success: false, message: 'Failed to upload video' }, uploadError.code)
    if (!upload) return c.json({ success: false, message: 'Failed to upload video' }, 500)

    for (const url of upload.urls) {
      const video = newVideo({ userId, props: { videoUrl: url } })
      const [videoError] = await withLogging('Create video entry', { userId, videoUrl: url }, () =>
        this.videoService.createVideo(video)
      )
      if (videoError) return c.json({ success: false, message: 'Failed to create video' }, videoError.code)
    }

    return c.json({ success: true, data: { urls: upload.urls } })
  }
}
