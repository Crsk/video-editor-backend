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

app.use(
  '/api/*',
  cors({
    origin: (origin, _) => {
      if (allowedOrigins?.includes(origin)) return origin
      return undefined
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'Access-Control-Allow-Origin'],
    maxAge: 86400,
    credentials: true
  })
)

app.on(['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], '/api/auth/**', c => {
  const auth = getAuth(c)

  return auth.handler(c.req.raw)
})

// app.use('*', authMiddleware())

app.use('*', async (c, next) => {
  const container = createContainer(c.env)
  c.set('container', container)
  await next()
})

const apiRouter = new Hono<AppEnvironment>()
const userRouter = new Hono<AppEnvironment>()
const videoRouter = new Hono<AppEnvironment>()
const transcribeRouter = new Hono<AppEnvironment>()
const storageRouter = new Hono<AppEnvironment>()

userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.get('/:id', c => c.get('container').userController.getUserById(c))
userRouter.put('/:id', c => c.get('container').userController.updateUser(c))

videoRouter.get('/', c => c.get('container').videoController.getAllVideos(c))
videoRouter.post('/', c => c.get('container').videoController.createVideo(c))
videoRouter.get('/:id', c => c.get('container').videoController.getVideoById(c))
videoRouter.put('/:id', c => c.get('container').videoController.updateVideo(c))
videoRouter.delete('/:id', c => c.get('container').videoController.deleteVideo(c))

transcribeRouter.post('/', c => c.get('container').transcribeController.transcribeMedia(c))

storageRouter.post('/', async c => await c.get('container').storageController.upload(c))

apiRouter.route('/users', userRouter)
apiRouter.route('/videos', videoRouter)
apiRouter.route('/transcribe', transcribeRouter)
apiRouter.route('/storage', storageRouter)

app.route('/api', apiRouter)

export default app
