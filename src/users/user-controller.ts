import { Context } from 'hono'
import { IUserService } from './user-service'
import { AppEnvironment } from '../types/environment'

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
      const newUser = await this.userService.createUser(userData)
      return c.json(newUser, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }

  seedDatabase = async (c: Context<AppEnvironment>) => {
    try {
      await this.userService.seedDatabase()
      return c.json({ message: 'Database seeded successfully' })
    } catch (error) {
      console.error('Error seeding database:', error)
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  }
}
