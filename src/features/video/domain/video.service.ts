import { Video, CreateVideo, UpdateVideo } from './video.entity'
import { VideoRepository } from '../infrastructure/video.repository'
import { HttpError, Response } from '../../../utils/attempt/http'

export class VideoService {
  constructor(private videoRepository: VideoRepository) {}

  async getVideoById(id: string): Promise<Response<Video | undefined>> {
    return this.videoRepository.findById(id)
  }

  async getAllVideos(): Promise<Response<Video[]>> {
    return this.videoRepository.findAll()
  }

  async createVideo(data: CreateVideo): Promise<Response<Video>> {
    if (!data.userId) return [new HttpError('BAD_REQUEST', 'User ID is required'), null]

    return this.videoRepository.create(data)
  }

  async updateVideo(id: string, data: UpdateVideo): Promise<Response<Video | undefined>> {
    return this.videoRepository.update(id, data)
  }

  async deleteVideo(id: string): Promise<Response<boolean>> {
    return this.videoRepository.delete(id)
  }
}
