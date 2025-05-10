import { Context } from 'hono'
import { UserService } from '../domain/user.service'
import { updateUserSchema } from '../infrastructure/user.schema'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'
import { VideoService } from '../../video/domain/video.service'

export class UserController {
  constructor(private userService: UserService, private videoService: VideoService) {}

  getUserById = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('id')
    const [error, user] = await withLogging('Get user by id', { userId }, () => this.userService.getUserById(userId))

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: user }, 200)
  }

  getAllUsers = async (c: Context<AppEnvironment>) => {
    const [error, allUsers] = await withLogging('Get all users', {}, () => this.userService.getAllUsers())
    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: allUsers }, 200)
  }

  updateUser = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('id')
    const userData = await c.req.json()
    if (!userId) return c.json({ success: false }, 400)

    const validData = updateUserSchema.parse(userData)

    const [error, updatedUser] = await withLogging('Update user', { userId }, () =>
      this.userService.updateUser(userId, validData)
    )

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: updatedUser }, 200)
  }

  getVideos = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('userId')
    if (!userId) return c.json({ success: false, message: 'User ID is required' }, 400)

    const [error, videos] = await withLogging('Get user videos', { userId }, () =>
      this.videoService.getVideosByUserId(userId)
    )

    if (error) return c.json({ success: false, message: error.message }, error.code)

    return c.json({ success: true, data: videos }, 200)
  }
}
