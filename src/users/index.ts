import { Hono } from 'hono'
import type { AppEnvironment } from '../types/environment'

export const usersRouter = new Hono<AppEnvironment>()

usersRouter.get('/:id', async c => {
  const { userController } = c.get('container')
  return userController.getUserById(c)
})

usersRouter.get('/', async c => {
  const { userController } = c.get('container')
  return userController.getAllUsers(c)
})

usersRouter.post('/', async c => {
  const { userController } = c.get('container')
  return userController.createUser(c)
})
