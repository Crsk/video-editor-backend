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
const projectRouter = new Hono<AppEnvironment>()
const transcribeRouter = new Hono<AppEnvironment>()
const storageRouter = new Hono<AppEnvironment>()

userRouter.get('/', c => c.get('container').userController.getAllUsers(c))
userRouter.get('/:userId', c => c.get('container').userController.getUserById(c))
userRouter.put('/:userId', c => c.get('container').userController.updateUser(c))
userRouter.get('/:userId/projects', c => c.get('container').userController.getUserProjects(c))

projectRouter.get('/', c => c.get('container').projectController.getAllProjects(c))
projectRouter.get('/:projectId', c => c.get('container').projectController.getProjectById(c))
projectRouter.get('/:projectId/media', c => c.get('container').projectController.getProjectMedia(c))
projectRouter.get('/:projectId/media/:mediaId', c => c.get('container').projectController.getProjectSingleMedia(c))
projectRouter.put('/:projectId', c => c.get('container').projectController.upsertProject(c))
projectRouter.delete('/:projectId', c => c.get('container').projectController.deleteProject(c))
projectRouter.put('/:projectId/media/:mediaId', c => c.get('container').projectController.addMediaToProject(c))

transcribeRouter.post('/', c => c.get('container').transcribeController.transcribeMedia(c))

storageRouter.post('/', async c => await c.get('container').storageController.uploadMedia(c))

apiRouter.route('/users', userRouter)
apiRouter.route('/projects', projectRouter)
apiRouter.route('/transcribe', transcribeRouter)
apiRouter.route('/storage', storageRouter)

app.route('/api', apiRouter)

export default app
