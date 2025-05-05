import 'dotenv/config'
import { Hono } from 'hono'
import { AppEnvironment } from './core/types/environment'
import { createContainer } from './di/container'
import { cors } from 'hono/cors'
import { getAuth, authMiddleware } from './features/auth/auth'

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
const app = new Hono<AppEnvironment>()

app.use(
  '/api/auth/**',
  cors({
    origin: (origin, _) => {
      if (allowedOrigins?.includes(origin)) return origin
      return undefined
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
  })
)

app.on(['POST', 'GET'], '/api/auth/**', c => {
  const auth = getAuth(c)

  return auth.handler(c.req.raw)
})

app.use('*', authMiddleware())

app.use('*', async (c, next) => {
  const container = createContainer(c.env.DB)
  c.set('container', container)
  await next()
})

const apiRouter = new Hono<AppEnvironment>()
const userRouter = new Hono<AppEnvironment>()

userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.post('/', c => c.get('container').userController.createUser(c))
userRouter.get('/:id', c => c.get('container').userController.getUserById(c))
userRouter.put('/:id', c => c.get('container').userController.updateUser(c))
userRouter.delete('/:id', c => c.get('container').userController.deleteUser(c))

apiRouter.route('/users', userRouter)
app.route('/api', apiRouter)

export default app
