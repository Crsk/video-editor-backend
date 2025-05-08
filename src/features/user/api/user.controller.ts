import { Context } from 'hono'
import { UserService } from '../domain/user.service'
import { updateUserSchema } from '../infrastructure/user.schema'
import { AppEnvironment } from '../../../core/types/environment'

export class UserController {
  constructor(private userService: UserService) {}

  getUserById = async (c: Context<AppEnvironment>) => {
    try {
      const userId = c.req.param('id')
      const user = await this.userService.getUserById(userId)

      if (!user) return c.json({ error: 'User not found' }, 404)

      return c.json(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  getAllUsers = async (c: Context<AppEnvironment>) => {
    try {
      const allUsers = await this.userService.getAllUsers()
      return c.json(allUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  updateUser = async (c: Context<AppEnvironment>) => {
    try {
      const userId = c.req.param('id')
      const userData = await c.req.json()
      const validData = updateUserSchema.parse(userData)

      const updatedUser = await this.userService.updateUser(userId, validData)
      if (!updatedUser) return c.json({ error: 'User not found' }, 404)

      return c.json(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
