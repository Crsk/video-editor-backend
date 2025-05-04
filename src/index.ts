import { Hono } from 'hono'
import { AppEnvironment } from './types/environment'
import { createContainer } from './di/container'
import { usersRouter } from './users'

const app = new Hono<AppEnvironment>()

app.use('*', async (c, next) => {
  const container = createContainer(c.env.DB)
  c.set('container', container)
  await next()
})

app.route('/api/users', usersRouter)

app.get('/api/seed', async c => {
  const { userController } = c.get('container')
  return userController.seedDatabase(c)
})

export default app
