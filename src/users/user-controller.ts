import { Context } from 'hono'
import { IUserService } from './user-service'
import { AppEnvironment } from '../types/environment'
import { createUserSchema, UpdateUserInput } from './user-validation'

export class UserController {
  constructor(private userService: IUserService) {}

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

  updateUser = async (id: number, data: UpdateUserInput, c: Context<AppEnvironment>) => {
    try {
      const updatedUser = await this.userService.updateUser(id, data)
      if (!updatedUser) return c.json({ error: 'User not found' }, 404)

      return c.json(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  deleteUser = async (id: number, c: Context<AppEnvironment>) => {
    try {
      const success = await this.userService.deleteUser(id)
      if (!success) return c.json({ error: 'User not found' }, 404)

      return c.json({ success: true })
    } catch (error) {
      console.error('Error deleting user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
