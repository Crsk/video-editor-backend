import { UserRepository } from '../features/user/infrastructure/user.repository'
import { UserService } from '../features/user/domain/user.service'
import { UserController } from '../features/user/api/user.controller'
import { VideoService } from '../features/video/domain/video.service'
import { VideoController } from '../features/video/api/video.controller'
import { VideoRepository } from '../features/video/infrastructure/video.repository'
import { AIService } from '../features/ai/ai.service'
import { TranscribeService } from '../features/transcribe/domain/transcribe.service'
import { TranscribeController } from '../features/transcribe/api/transcribe.controller'
import { AppEnvironment } from '../core/types/environment'
import { StorageService } from '../features/storage/storage.service'
import { StorageController } from '../features/storage/storage.controller'

export type Container = {
  userController: UserController
  videoController: VideoController
  transcribeController: TranscribeController
  storageController: StorageController
}

export const createContainer = (env: AppEnvironment['Bindings']): Container => {
  const db: D1Database = env.DB
  const ai: AI = env.AI

  const userRepository = new UserRepository(db)
  const userService = new UserService(userRepository)
  const userController = new UserController(userService)

  const aiService = new AIService(ai)

  const videoRepository = new VideoRepository(db)
  const videoService = new VideoService(videoRepository)
  const videoController = new VideoController(videoService)

  const transcribeService = new TranscribeService(aiService)
  const transcribeController = new TranscribeController(transcribeService)

  const storageService = new StorageService(env)
  const storageController = new StorageController(storageService, videoService)

  return {
    userController,
    videoController,
    transcribeController,
    storageController
  }
}
