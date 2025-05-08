import { UserRepository } from '../features/user/infrastructure/user.repository'
import { UserService } from '../features/user/domain/user.service'
import { UserController } from '../features/user/api/user.controller'
import { NoteService } from '../features/note/domain/note.service'
import { NoteController } from '../features/note/api/note.controller'
import { NoteRepository } from '../features/note/infrastructure/note.repository'
import { AIService } from '../features/ai/ai.service'
import { TranscribeService } from '../features/transcribe/domain/transcribe.service'
import { TranscribeController } from '../features/transcribe/api/transcribe.controller'
import { AppEnvironment } from '../core/types/environment'
import { StorageService } from '../features/storage/storage.service'
import { StorageController } from '../features/storage/storage.controller'

export type Container = {
  userController: UserController
  noteController: NoteController
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

  const noteRepository = new NoteRepository(db)
  const noteService = new NoteService(noteRepository)
  const noteController = new NoteController(noteService)

  const transcribeService = new TranscribeService(aiService)
  const transcribeController = new TranscribeController(transcribeService)

  const storageService = new StorageService(env)
  const storageController = new StorageController(storageService, noteService)

  return {
    userController,
    noteController,
    transcribeController,
    storageController
  }
}
