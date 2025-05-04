import { Hono } from 'hono'
import { UserController } from './user.controller'
import { AppEnvironment } from '../../../core/types/environment'

export function setupUserRoutes(app: Hono<AppEnvironment>, userController: UserController) {
  const userRouter = new Hono<AppEnvironment>()

  userRouter.get('/', userController.getAllUsers)
  userRouter.get('/:id', userController.getUserById)
  userRouter.post('/', userController.createUser)
  userRouter.put('/:id', userController.updateUser)
  userRouter.delete('/:id', userController.deleteUser)

  app.route('/users', userRouter)

  return app
}
