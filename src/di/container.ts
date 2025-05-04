import { UserRepository } from '../features/user/infrastructure/user.repository'
import { UserService } from '../features/user/domain/user.service'
import { UserController } from '../features/user/api/user.controller'

export interface Container {
  userController: UserController
}

export const createContainer = (db: D1Database): Container => {
  const userRepository = new UserRepository(db)
  const userService = new UserService(userRepository)
  const userController = new UserController(userService)

  return {
    userController
  }
}
