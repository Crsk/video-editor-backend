import 'dotenv/config'
import { Hono } from 'hono'
import { AppEnvironment } from './core/types/environment'
import { authHandler } from './features/auth/auth'
import { tryCatchMiddleware } from './core/middlewares/try-catch'
import { corsMiddleware } from './core/middlewares/cors'
import { authCorsMiddleware } from './core/middlewares/cors'
import { diContainerMiddleware } from './core/middlewares/di-container'

const app = new Hono<AppEnvironment>()

app.use('*', tryCatchMiddleware())
app.use('/api/*', corsMiddleware())
app.use('/api/auth/**', authCorsMiddleware())
app.use('/api/auth/**', authHandler)
app.use('*', diContainerMiddleware())

const apiRouter = new Hono<AppEnvironment>()
const userRouter = new Hono<AppEnvironment>()
const videoRouter = new Hono<AppEnvironment>()
const transcribeRouter = new Hono<AppEnvironment>()
const storageRouter = new Hono<AppEnvironment>()

// /api/users
userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.get('/:id', c => c.get('container').userController.getUserById(c))
userRouter.put('/:id', c => c.get('container').userController.updateUser(c))
userRouter.get('/:userId/videos', c => c.get('container').userController.getVideos(c))

// /api/videos
videoRouter.get('/', c => c.get('container').videoController.getAllVideos(c))
videoRouter.post('/', c => c.get('container').videoController.createVideo(c))
videoRouter.get('/:id', c => c.get('container').videoController.getVideoById(c))
videoRouter.put('/:id', c => c.get('container').videoController.updateVideo(c))
videoRouter.delete('/:id', c => c.get('container').videoController.deleteVideo(c))

// /api/transcribe
transcribeRouter.post('/', c => c.get('container').transcribeController.transcribeMedia(c))

// /api/storage
storageRouter.post('/', async c => await c.get('container').storageController.upload(c))

// /api
apiRouter.route('/users', userRouter)
apiRouter.route('/videos', videoRouter)
apiRouter.route('/transcribe', transcribeRouter)
apiRouter.route('/storage', storageRouter)

app.route('/api', apiRouter)

export default app
