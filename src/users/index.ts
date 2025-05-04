import { Hono } from 'hono'
import type { AppEnvironment } from '../types/environment'

import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema, userParamsSchema } from './user-validation'

export const usersRouter = new Hono<AppEnvironment>()

usersRouter.get('/:id', async c => {
  const { userController } = c.get('container')
  return userController.getUserById(c)
})

usersRouter.get('/', async c => {
  const { userController } = c.get('container')
  return userController.getAllUsers(c)
})

usersRouter.post('/', zValidator('json', createUserSchema), async c => {
  const { userController } = c.get('container')
  return userController.createUser(c)
})

usersRouter.put('/:id', zValidator('json', updateUserSchema), async c => {
  const { userController } = c.get('container')
  const { id } = userParamsSchema.parse({ id: c.req.param('id') })
  const data = c.req.valid('json')
  const updatedUser = await userController.updateUser(id, data, c)

  if (!updatedUser) return c.json({ error: 'User not found' }, 404)

  return c.json(updatedUser)
})

usersRouter.delete('/:id', async c => {
  const { userController } = c.get('container')
  const { id } = userParamsSchema.parse({ id: c.req.param('id') })
  const success = await userController.deleteUser(id, c)

  if (!success) return c.json({ error: 'User not found' }, 404)

  return c.json({ success: true })
})
