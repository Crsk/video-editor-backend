import { UserRepository } from '../users/user-repository'
import { UserService } from '../users/user-service'
import { UserController } from '../users/user-controller'

export interface Container {
  userController: UserController
}

export function createContainer(db: D1Database): Container {
  const userRepository = new UserRepository(db)
  const userService = new UserService(userRepository)
  const userController = new UserController(userService)

  return {
    userController
  }
}
