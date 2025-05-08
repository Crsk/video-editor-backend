import { Video, CreateVideo, UpdateVideo } from './video.entity'
import { VideoRepository } from '../infrastructure/video.repository'

export class VideoService {
  constructor(private videoRepository: VideoRepository) {}

  async getVideoById(id: string): Promise<Video | undefined> {
    return this.videoRepository.findById(id)
  }

  async getAllVideos(): Promise<Video[]> {
    return this.videoRepository.findAll()
  }

  async createVideo(userData: CreateVideo): Promise<Video> {
    return this.videoRepository.create(userData)
  }

  async updateVideo(id: string, data: UpdateVideo): Promise<Video | undefined> {
    return this.videoRepository.update(id, data)
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videoRepository.delete(id)
  }
}
