import { User } from './user-model'
import { IUserRepository } from './user-repository'

export interface IUserService {
  getUserById(id: number): Promise<User | undefined>
  getAllUsers(): Promise<User[]>
  createUser(userData: Omit<User, 'id'>): Promise<User>
  seedDatabase(): Promise<void>
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(userData)
  }

  async seedDatabase(): Promise<void> {
    await this.userRepository.deleteAll()

    const users = [
      { name: 'John Doe', email: 'john@example.com', test: 'test1' },
      { name: 'Jane Smith', email: 'jane@example.com', test: 'test2' },
      { name: 'Bob Johnson', email: 'bob@example.com', test: 'test3' }
    ]

    await this.userRepository.createMany(users)
  }
}
