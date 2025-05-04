import { Hono } from 'hono'
import { AppEnvironment } from './types/environment'
import { createContainer } from './di/container'

const app = new Hono<AppEnvironment>()

app.use('*', async (c, next) => {
  const container = createContainer(c.env.DB)
  c.set('container', container)
  await next()
})

app.get('/api/users/:id', async c => {
  const { userController } = c.get('container')
  return userController.getUserById(c)
})

app.get('/api/users', async c => {
  const { userController } = c.get('container')
  return userController.getAllUsers(c)
})

app.post('/api/users', async c => {
  const { userController } = c.get('container')
  return userController.createUser(c)
})

app.get('/api/seed', async c => {
  const { userController } = c.get('container')
  return userController.seedDatabase(c)
})

export default app
