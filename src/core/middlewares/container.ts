import { UserRepository } from '../../features/user/infrastructure/user.repository'
import { UserService } from '../../features/user/domain/user.service'
import { UserController } from '../../features/user/api/user.controller'
import { AIService } from '../../features/ai/ai.service'
import { TranscribeService } from '../../features/transcribe/domain/transcribe.service'
import { TranscribeController } from '../../features/transcribe/api/transcribe.controller'
import { AppEnvironment } from '../../core/types/environment'
import { StorageService } from '../../features/storage/storage.service'
import { StorageController } from '../../features/storage/storage.controller'
import { ProjectController } from '../../features/project/api/project.controller'
import { ProjectService } from '../../features/project/domain/project.service'
import { ProjectRepository } from '../../features/project/infrastructure/project.repository'

export type Container = {
  userController: UserController
  projectController: ProjectController
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

  const transcribeService = new TranscribeService(aiService)
  const transcribeController = new TranscribeController(transcribeService)

  const projectRepository = new ProjectRepository(db)
  const projectService = new ProjectService(projectRepository)
  const projectController = new ProjectController(projectService)

  const storageService = new StorageService(env)
  const storageController = new StorageController(storageService, projectService)

  return {
    userController,
    transcribeController,
    storageController,
    projectController
  }
}
