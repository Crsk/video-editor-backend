import { Context } from 'hono'
import { UserService } from '../domain/user.service'
import { updateUserSchema } from '../infrastructure/user.schema'
import { AppEnvironment } from '../../../core/types/environment'
import { withLogging } from '../../../utils/with-logging'

export class UserController {
  constructor(private userService: UserService) {}

  getUserById = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('userId')
    const [error, user] = await withLogging('Get user by id', { userId }, () =>
      this.userService.getUserById({ userId })
    )

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

  getUserWorkspaces = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('userId')
    const [error, workspaces] = await withLogging('Get user workspaces', { userId }, () =>
      this.userService.getUserWorkspaces({ userId })
    )

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: workspaces }, 200)
  }

  getUserTeams = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('userId')
    const [error, teams] = await withLogging('Get user teams', { userId }, () =>
      this.userService.getUserTeams({ userId })
    )

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: teams }, 200)
  }

  getUserTeam = async (c: Context<AppEnvironment>) => {
    const userId = c.req.param('userId')
    const teamId = c.req.param('teamId')
    const [error, team] = await withLogging('Get user team', { userId, teamId }, () =>
      this.userService.getUserTeam({ userId, teamId })
    )

    if (error) return c.json({ success: false }, error.code)

    return c.json({ success: true, data: team }, 200)
  }
}
