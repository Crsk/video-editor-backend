import { Context } from 'hono'
import { VideoService } from '../domain/video.service'
import { insertVideoSchema, updateVideoSchema } from '../infrastructure/video.schema'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'

export class VideoController {
  constructor(private videoService: VideoService) {}

  getVideoById = async (c: Context<AppEnvironment>) => {
    const videoId = c.req.param('id')
    const [error, video] = await withLogging('Fetching video', { videoId }, () =>
      this.videoService.getVideoById(videoId)
    )

    if (!video) return c.json({ success: false, message: 'Video not found' }, 404)
    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: video })
  }

  getAllVideos = async (c: Context<AppEnvironment>) => {
    const [error, allVideos] = await withLogging('Fetching all videos', {}, () => this.videoService.getAllVideos())

    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: allVideos })
  }

  createVideo = async (c: Context<AppEnvironment>) => {
    const videoData = await c.req.json()
    const validVideo = insertVideoSchema.parse(videoData)
    const [error, data] = await withLogging('Creating video', { videoData }, () =>
      this.videoService.createVideo(validVideo)
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (data) return c.json({ success: true, data: { url: data.videoUrl } }, 201)

    return c.json({ success: false, message: 'Internal Server Error' }, 500)
  }

  updateVideo = async (c: Context<AppEnvironment>) => {
    const videoId = c.req.param('id')
    const videoData = await c.req.json()
    const validData = updateVideoSchema.parse(videoData)
    const [error, updatedVideo] = await withLogging('Updating video', { videoId, videoData }, () =>
      this.videoService.updateVideo(videoId, validData)
    )
    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!updatedVideo) return c.json({ success: false, message: 'Video not found' }, 404)

    return c.json({ success: true, data: updatedVideo })
  }

  deleteVideo = async (c: Context<AppEnvironment>) => {
    const videoId = c.req.param('id')
    const [error, success] = await withLogging('Deleting video', { videoId }, () =>
      this.videoService.deleteVideo(videoId)
    )
    if (error) return c.json({ success: false, message: error.message }, error.code)
    if (!success) return c.json({ success: false, message: 'Video not found' }, 404)

    return c.json({ success: true })
  }
}
