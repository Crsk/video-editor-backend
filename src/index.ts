import 'dotenv/config'
import { Hono } from 'hono'
import { AppEnvironment } from './core/types/environment'
import { authHandler } from './core/auth'
import { tryCatchMiddleware } from './core/middlewares/try-catch'
import { corsMiddleware } from './core/middlewares/cors'
import { authCorsMiddleware } from './core/middlewares/cors'
import { diContainerMiddleware } from './core/middlewares/di-container'
import { authMiddleware } from './core/auth'

const app = new Hono<AppEnvironment>()

app.use('*', tryCatchMiddleware())
app.use('/api/*', corsMiddleware())
app.use('/api/auth/**', authCorsMiddleware())
app.use('/api/auth/**', authHandler)
app.use('/api/*', authMiddleware())
app.use('*', diContainerMiddleware())

const apiRouter = new Hono<AppEnvironment>()
const userRouter = new Hono<AppEnvironment>()
const workspaceRouter = new Hono<AppEnvironment>()
const transcribeRouter = new Hono<AppEnvironment>()
const storageRouter = new Hono<AppEnvironment>()

userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.get('/:userId', c => c.get('container').userController.getUserById(c))
userRouter.put('/:userId', c => c.get('container').userController.updateUser(c))
userRouter.get('/:userId/workspaces', c => c.get('container').userController.getUserWorkspaces(c))

workspaceRouter.get('/', c => c.get('container').workspaceController.getAllWorkspaces(c))
workspaceRouter.get('/:workspaceId', c => c.get('container').workspaceController.getWorkspaceById(c))
workspaceRouter.get('/:workspaceId/media', c => c.get('container').workspaceController.getWorkspaceMedia(c))
workspaceRouter.get('/:workspaceId/media/:mediaId', c =>
  c.get('container').workspaceController.getWorkspaceSingleMedia(c)
)
workspaceRouter.put('/:workspaceId', c => c.get('container').workspaceController.upsertWorkspace(c))
workspaceRouter.delete('/:workspaceId', c => c.get('container').workspaceController.deleteWorkspace(c))
workspaceRouter.put('/:workspaceId/media/:mediaId', c => c.get('container').workspaceController.addMediaToWorkspace(c))

transcribeRouter.post('/', c => c.get('container').transcribeController.transcribeMedia(c))

storageRouter.post('/', async c => await c.get('container').storageController.uploadMedia(c))
storageRouter.delete('/', c => c.get('container').storageController.deleteMedia(c))

apiRouter.route('/users', userRouter)
apiRouter.route('/workspaces', workspaceRouter)
apiRouter.route('/transcribe', transcribeRouter)
apiRouter.route('/storage', storageRouter)

app.route('/api', apiRouter)

export default app
