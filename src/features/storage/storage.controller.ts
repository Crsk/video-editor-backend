import { AppEnvironment } from '../../core/types/environment'
import { Context } from 'hono'
import { StorageService } from './storage.service'
import { VideoService } from '../video/domain/video.service'
import { env } from 'hono/adapter'
import { newVideo } from '../video/domain/new-video'

export class StorageController {
  constructor(private storageService: StorageService, private videoService: VideoService) {}

  upload = async (c: Context<AppEnvironment>) => {
    try {
      const formData = await c.req.formData()
      const files = formData.getAll('files') as File[]

      if (!files || files.length === 0) return c.json({ error: 'Missing media files to upload' }, 400)

      const result = await this.storageService.upload(files)
      const uploaded = result && result.urls && result.urls.length > 0

      if (uploaded) {
        const { BUCKET_PUBLIC_URL } = env<{ BUCKET_PUBLIC_URL: string }>(c)
        const videoUrl = `${BUCKET_PUBLIC_URL}/${result.keys[0]}`
        const userId = formData.get('userId') as string
        const video = newVideo({ userId: userId, props: { videoUrl } })

        await this.videoService.createVideo(video)

        return c.json({ urls: result.urls })
      } else return c.json({ error: 'Failed to upload media. No files were uploaded.' }, 400)
    } catch (error) {
      console.error('Error uploading media:', error)
      return c.json({ error: 'Failed to upload media. Please try again.' }, 500)
    }
  }
}
