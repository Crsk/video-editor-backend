import { Context } from 'hono'
import { UserService } from '../domain/user.service'
import { createUserSchema, updateUserSchema } from './user.validation'
import { AppEnvironment } from '../../../core/types/environment'

export class UserController {
  constructor(private userService: UserService) {}

  getUserById = async (c: Context<AppEnvironment>) => {
    try {
      const userId = c.req.param('id')
      const user = await this.userService.getUserById(Number(userId))

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

  createUser = async (c: Context<AppEnvironment>) => {
    try {
      const userData = await c.req.json()
      const validUser = createUserSchema.parse(userData)
      const newUser = await this.userService.createUser(validUser)

      return c.json(newUser, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  updateUser = async (c: Context<AppEnvironment>) => {
    try {
      const userId = c.req.param('id')
      const userData = await c.req.json()
      const validData = updateUserSchema.parse(userData)

      const updatedUser = await this.userService.updateUser(Number(userId), validData)
      if (!updatedUser) return c.json({ error: 'User not found' }, 404)

      return c.json(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  deleteUser = async (c: Context<AppEnvironment>) => {
    try {
      const userId = c.req.param('id')
      const success = await this.userService.deleteUser(Number(userId))

      if (!success) return c.json({ error: 'User not found' }, 404)
      return c.json({ success: true })
    } catch (error) {
      console.error('Error deleting user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
