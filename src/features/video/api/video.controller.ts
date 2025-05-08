import { Context } from 'hono'
import { VideoService } from '../domain/video.service'
import { insertVideoSchema, updateVideoSchema } from '../infrastructure/video.schema'
import { AppEnvironment } from '../../../core/types/environment'

export class VideoController {
  constructor(private videoService: VideoService) {}

  getVideoById = async (c: Context<AppEnvironment>) => {
    try {
      const videoId = c.req.param('id')
      const video = await this.videoService.getVideoById(videoId)

      if (!video) return c.json({ error: 'Video not found' }, 404)

      return c.json(video)
    } catch (error) {
      console.error('Error fetching video:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  getAllVideos = async (c: Context<AppEnvironment>) => {
    try {
      const allVideos = await this.videoService.getAllVideos()

      return c.json(allVideos)
    } catch (error) {
      console.error('Error fetching videos:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  createVideo = async (c: Context<AppEnvironment>) => {
    try {
      const videoData = await c.req.json()
      const validVideo = insertVideoSchema.parse(videoData)
      const newVideo = await this.videoService.createVideo(validVideo)

      return c.json(newVideo, 201)
    } catch (error) {
      console.error('Error creating video:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  updateVideo = async (c: Context<AppEnvironment>) => {
    try {
      const videoId = c.req.param('id')
      const videoData = await c.req.json()
      const validData = updateVideoSchema.parse(videoData)
      const updatedVideo = await this.videoService.updateVideo(videoId, validData)
      if (!updatedVideo) return c.json({ error: 'Video not found' }, 404)

      return c.json(updatedVideo)
    } catch (error) {
      console.error('Error updating video:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  deleteVideo = async (c: Context<AppEnvironment>) => {
    try {
      const videoId = c.req.param('id')
      const success = await this.videoService.deleteVideo(videoId)

      if (!success) return c.json({ error: 'Video not found' }, 404)

      return c.json({ success: true })
    } catch (error) {
      console.error('Error deleting video:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
