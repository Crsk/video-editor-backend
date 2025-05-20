import { UserRepository } from '../../features/user/infrastructure/user.repository'
import { UserService } from '../../features/user/domain/user.service'
import { UserController } from '../../features/user/api/user.controller'
import { AIService } from '../../features/ai/ai.service'
import { TranscriptService } from '../../features/transcript/domain/transcript.service'
import { TranscriptController } from '../../features/transcript/api/transcript.controller'
import { AppEnvironment } from '../../core/types/environment'
import { StorageService } from '../../features/storage/storage.service'
import { StorageController } from '../../features/storage/storage.controller'
import { WorkspaceController } from '../../features/workspace/api/workspace.controller'
import { WorkspaceService } from '../../features/workspace/domain/workspace.service'
import { WorkspaceRepository } from '../../features/workspace/infrastructure/workspace.repository'
import { TranscriptRepository } from '../../features/transcript/infrastructure/transcript.repository'

export type Container = {
  userController: UserController
  workspaceController: WorkspaceController
  transcriptController: TranscriptController
  storageController: StorageController
}

export const createContainer = (env: AppEnvironment['Bindings']): Container => {
  const db: D1Database = env.DB
  const ai: AI = env.AI

  const userRepository = new UserRepository(db)
  const userService = new UserService(userRepository)

  const userController = new UserController(userService)

  const aiService = new AIService(ai)

  const transcriptRepository = new TranscriptRepository(db)
  const transcriptService = new TranscriptService(aiService, transcriptRepository)
  const transcriptController = new TranscriptController(transcriptService)

  const storageService = new StorageService(env)

  const workspaceRepository = new WorkspaceRepository(db)
  const workspaceService = new WorkspaceService(workspaceRepository, storageService)
  const workspaceController = new WorkspaceController(workspaceService, transcriptService)

  const storageController = new StorageController(storageService, workspaceService, transcriptService)

  return {
    userController,
    transcriptController,
    storageController,
    workspaceController
  }
}
