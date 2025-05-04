import { Hono } from 'hono'
import { AppEnvironment } from './core/types/environment'
import { createContainer } from './di/container'
import { setupUserRoutes } from './features/user/api/user.routes'

const app = new Hono<AppEnvironment>()

app.use('*', async (c, next) => {
  const container = createContainer(c.env.DB)
  c.set('container', container)
  await next()
})

// Create API router
const apiRouter = new Hono<AppEnvironment>()

// Set up user routes
const userRouter = new Hono<AppEnvironment>()
userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.post('/', c => c.get('container').userController.createUser(c))
userRouter.get('/:id', c => c.get('container').userController.getUserById(c))
userRouter.put('/:id', c => c.get('container').userController.updateUser(c))
userRouter.delete('/:id', c => c.get('container').userController.deleteUser(c))

// Mount user routes to API
apiRouter.route('/users', userRouter)

// Mount API router to app
app.route('/api', apiRouter)

export default app
