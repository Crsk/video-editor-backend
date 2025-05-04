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

export default app
